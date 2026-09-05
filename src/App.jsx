import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import VerseHeaderCard from './components/VerseHeaderCard';
import WordGrid from './components/WordGrid';
import WordDetailModal from './components/WordDetailModal';
import GrammarSummary from './components/GrammarSummary';
import ApiKeyModal from './components/ApiKeyModal';
import InfoModal from './components/InfoModal';

import { parseSearchInput } from './utils/inputParser';
import { fetchOfficialVerse } from './services/quranApiService';
import { analyzeVerse, getStoredApiKey } from './services/geminiService';
import { PRESET_ANALYSIS } from './data/presetSamples';
import { AlertCircle, RefreshCw } from 'lucide-react';
import './App.css';

export default function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [surahMeta, setSurahMeta] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal States
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);

  // Periksa status API key saat komponen dimuat
  useEffect(() => {
    const key = getStoredApiKey();
    setApiKeyConfigured(Boolean(key));

    // Muat data awal default: Al-Fatihah: 1 dari preset instan
    const defaultData = PRESET_ANALYSIS['1:1'];
    if (defaultData) {
      setAnalysisData(defaultData);
      setSurahMeta({
        number: 1,
        nameLatin: 'Al-Fatihah',
        nameArabic: 'الفاتحة',
        translation: 'Pembukaan',
        ayahCount: 7,
        revelation: 'Makkiyah'
      });
    }
  }, []);

  const handleSearch = async (rawQuery) => {
    setError(null);
    const parsed = parseSearchInput(rawQuery);

    if (!parsed.success) {
      setError(parsed.error);
      return;
    }

    setIsLoading(true);
    setSurahMeta(parsed.surah);

    try {
      let officialVerse = null;
      // Coba ambil teks resmi dari API Al-Qur'an (hanya jika online)
      try {
        officialVerse = await fetchOfficialVerse(parsed.surah.number, parsed.ayahNumber);
      } catch (apiErr) {
        console.warn('Menggunakan fallback data ayat lokal:', apiErr);
      }

      // Analisis menggunakan Gemini AI (atau preset instan / cache lokal)
      const result = await analyzeVerse(parsed.surah, parsed.ayahNumber, officialVerse);
      setAnalysisData(result);
      setSelectedWord(null);
    } catch (err) {
      console.error('Error saat analisis:', err);
      setError(err.message || 'Terjadi kesalahan saat memproses analisis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWordSelect = (word) => {
    setSelectedWord(word);
  };

  const handlePrevWord = () => {
    if (!selectedWord || !analysisData?.words) return;
    const prevIdx = selectedWord.index - 1;
    if (prevIdx >= 1) {
      const prevWord = analysisData.words.find((w) => w.index === prevIdx);
      if (prevWord) setSelectedWord(prevWord);
    }
  };

  const handleNextWord = () => {
    if (!selectedWord || !analysisData?.words) return;
    const nextIdx = selectedWord.index + 1;
    if (nextIdx <= analysisData.words.length) {
      const nextWord = analysisData.words.find((w) => w.index === nextIdx);
      if (nextWord) setSelectedWord(nextWord);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Navbar Navigasi */}
      <Navbar
        onOpenApiKey={() => setIsApiKeyModalOpen(true)}
        onOpenGuide={() => setIsInfoModalOpen(true)}
        apiKeyConfigured={apiKeyConfigured}
      />

      {/* Konten Utama */}
      <main className="main-content">
        {/* Form Input Pencarian */}
        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          initialQuery="Al-Fatihah: 1"
        />

        {/* Pesan Error */}
        {error && (
          <div className="error-card animate-fade-in">
            <AlertCircle size={24} style={{ flexShrink: 0 }} />
            <div>
              <div className="error-title">Gagal Memproses Permintaan</div>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{error}</p>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
            <div className="spinner-dots" style={{ width: '32px', height: '32px', margin: '0 auto 16px', borderColor: 'rgba(16, 185, 129, 0.2)', borderTopColor: 'var(--emerald-400)' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '6px' }}>
              Memproses Analisis Nahwu & Sharaf...
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Google Gemini sedang mengurai struktur gramatikal, kedudukan I'rab, dan morfologi wazan kata demi kata.
            </p>
          </div>
        )}

        {/* Hasil Analisis Ayat */}
        {!isLoading && analysisData && (
          <>
            {/* Header Ayat & Teks Lengkap */}
            <VerseHeaderCard
              data={analysisData}
              surahMeta={surahMeta}
            />

            {/* Grid Analisis Kata per Kata */}
            <WordGrid
              words={analysisData.words}
              onSelectWord={handleWordSelect}
              selectedWordIndex={selectedWord?.index}
            />

            {/* Ringkasan Kaidah Tata Bahasa */}
            <GrammarSummary
              notes={analysisData.grammarNotes}
              surahName={analysisData.surahName}
              ayahNumber={analysisData.ayahNumber}
            />
          </>
        )}
      </main>

      {/* Modal Detail Kata (Nahwu & Sharaf) */}
      <WordDetailModal
        word={selectedWord}
        totalWords={analysisData?.words?.length || 0}
        onClose={() => setSelectedWord(null)}
        onPrevWord={handlePrevWord}
        onNextWord={handleNextWord}
      />

      {/* Modal Pengaturan API Key */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onApiKeySaved={(key) => setApiKeyConfigured(Boolean(key))}
      />

      {/* Modal Edukasi Kaidah & Legenda I'rab */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <p className="footer-quote">
            إِنَّآ أَنزَلْنَٰهُ قُرْءَٰنًا عَرَبِيًّا لَّعَلَّكُمْ تَعْقِلُونَ
          </p>
          <p>
            Quran Nahwu & Sharaf AI — Dibangun dengan React.js & Google Gemini. Dioptimalkan untuk Netlify.
          </p>
        </div>
      </footer>
    </div>
  );
}
