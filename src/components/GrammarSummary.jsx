import React from 'react';
import { BookOpenCheck, Lightbulb } from 'lucide-react';

export default function GrammarSummary({ notes, surahName, ayahNumber }) {
  if (!notes) return null;

  return (
    <div className="grammar-summary-card glass-panel animate-fade-in">
      <div className="grammar-summary-header">
        <div className="grammar-icon-box">
          <Lightbulb size={20} className="gold-icon" />
        </div>
        <div>
          <h4 className="grammar-summary-title">
            Catatan Kaidah & Keindahan Balaghah Ayat
          </h4>
          <span className="grammar-summary-sub">
            QS. {surahName}: Ayat {ayahNumber}
          </span>
        </div>
      </div>
      <div className="grammar-summary-body">
        <p className="grammar-notes-text">{notes}</p>
      </div>
    </div>
  );
}
