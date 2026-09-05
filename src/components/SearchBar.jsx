import React, { useState, useEffect, useRef } from 'react';
import { Search, X, CornerDownLeft, Sparkles, BookOpen } from 'lucide-react';
import { getSurahSuggestions } from '../utils/inputParser';

const QUICK_PRESETS = [
  { label: 'Al-Fatihah: 1', query: 'Al-Fatihah: 1' },
  { label: 'Al-Fatihah: 2', query: 'Al-Fatihah: 2' },
  { label: 'Ayat Kursi (2:255)', query: 'Al-Baqarah: 255' },
  { label: 'Al-Ikhlas: 1', query: 'Al-Ikhlas: 1' },
  { label: 'An-Nas: 1', query: 'An-Nas: 1' },
];

export default function SearchBar({ onSearch, isLoading, initialQuery = 'Al-Fatihah: 1' }) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchWrapperRef = useRef(null);

  // Perbarui auto-suggest saat mengetik
  useEffect(() => {
    if (query.trim().length >= 2 && !query.includes(':')) {
      const results = getSurahSuggestions(query, 5);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleSelectSuggestion = (surah) => {
    const updatedQuery = `${surah.nameLatin}: 1`;
    setQuery(updatedQuery);
    setShowSuggestions(false);
    onSearch(updatedQuery);
  };

  const handleSelectPreset = (presetQuery) => {
    setQuery(presetQuery);
    setShowSuggestions(false);
    onSearch(presetQuery);
  };

  return (
    <div className="search-section">
      <div className="search-intro">
        <h2 className="search-heading">
          Eksplorasi <span className="highlight-gold">Nahwu</span>, <span className="highlight-emerald">Sharaf</span> & Terjemahan Ayat
        </h2>
        <p className="search-description">
          Ketik nama surah dan nomor ayat (contoh: <code>Al-Baqarah: 255</code> atau <code>112:1</code>) untuk mengurai kaidah gramatika dan kedudukan I'rab secara otomatis.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="search-form" ref={searchWrapperRef}>
        <div className="search-input-box">
          <Search className="search-icon" size={22} />
          
          <input
            id="quran-search-input"
            type="text"
            className="search-input"
            placeholder="Masukkan surah dan ayat... (contoh: Al-Baqarah: 255 atau 2:255)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            autoComplete="off"
          />

          {query && !isLoading && (
            <button
              type="button"
              className="btn-clear-input"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
              }}
              title="Bersihkan input"
            >
              <X size={18} />
            </button>
          )}

          <button
            type="submit"
            className="btn-search-submit"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? (
              <span className="btn-loading-flex">
                <span className="spinner-dots" /> Memproses AI...
              </span>
            ) : (
              <span className="btn-normal-flex">
                <span>Cari & Analisis</span>
                <CornerDownLeft size={16} />
              </span>
            )}
          </button>
        </div>

        {/* Dropdown Auto-Suggest Surah */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-dropdown">
            {suggestions.map((surah) => (
              <li
                key={surah.number}
                className="suggestion-item"
                onClick={() => handleSelectSuggestion(surah)}
              >
                <div className="suggestion-left">
                  <span className="suggestion-num">{surah.number}</span>
                  <div>
                    <span className="suggestion-name">{surah.nameLatin}</span>
                    <span className="suggestion-sub">({surah.translation} • {surah.ayahCount} ayat)</span>
                  </div>
                </div>
                <span className="suggestion-arabic">{surah.nameArabic}</span>
              </li>
            ))}
          </ul>
        )}
      </form>

      {/* Preset Cepat */}
      <div className="quick-presets-container">
        <span className="presets-label">
          <BookOpen size={14} /> Contoh Preset:
        </span>
        <div className="presets-list">
          {QUICK_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              className="preset-chip"
              onClick={() => handleSelectPreset(preset.query)}
              disabled={isLoading}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
