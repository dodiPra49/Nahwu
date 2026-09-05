import React from 'react';
import { Sparkles, Info } from 'lucide-react';

export default function WordGrid({ words, onSelectWord, selectedWordIndex }) {
  if (!words || words.length === 0) return null;

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'marfu':
        return 'badge-marfu';
      case 'manshub':
        return 'badge-manshub';
      case 'majrur':
        return 'badge-majrur';
      case 'majzum':
        return 'badge-majzum';
      case 'mabni':
      default:
        return 'badge-mabni';
    }
  };

  return (
    <div className="word-analysis-section">
      <div className="section-title-bar">
        <div>
          <h3 className="section-title">
            <span className="title-arabic-sub">التحليل اللفظي والإعرابي</span> Terjemahan & I'rab Kata per Kata
          </h3>
          <p className="section-subtitle">
            Klik pada salah satu kartu kata untuk menelaah detail kaidah <strong>Nahwu (Sintaksis)</strong> dan <strong>Sharaf (Morfologi/Wazan)</strong>.
          </p>
        </div>
        <span className="words-count-badge">
          {words.length} Kata / Token
        </span>
      </div>

      <div className="word-cards-grid">
        {words.map((word) => {
          const isSelected = selectedWordIndex === word.index;
          return (
            <div
              key={word.index}
              className={`word-card glass-panel ${isSelected ? 'word-card-selected' : ''}`}
              onClick={() => onSelectWord(word)}
              tabIndex={0}
              role="button"
              aria-label={`Analisis kata ${word.arabic}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectWord(word);
                }
              }}
            >
              <div className="word-card-top">
                <span className="word-index-badge">#{word.index}</span>
                <span className={`badge ${getStatusBadgeClass(word.irabStatus)}`}>
                  {word.irabLabel || word.irabStatus}
                </span>
              </div>

              {/* Arabic Word */}
              <div className="word-arabic-box">
                <span className="word-arabic text-arabic">{word.arabic}</span>
              </div>

              {/* Transliteration */}
              <div className="word-transliteration">{word.transliteration}</div>

              {/* Literal Translation */}
              <div className="word-translation">{word.translation}</div>

              {/* Nahwu Quick Pill */}
              <div className="word-card-footer">
                <span className="word-kedudukan" title={word.nahwu?.kedudukan}>
                  {word.nahwu?.kedudukan || '-'}
                </span>
                <span className="click-detail-hint">
                  <Info size={13} /> Rincian
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
