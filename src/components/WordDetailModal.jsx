import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, BookMarked, Layers, Compass, GitCommit } from 'lucide-react';

export default function WordDetailModal({
  word,
  totalWords,
  onClose,
  onPrevWord,
  onNextWord
}) {
  const [activeTab, setActiveTab] = useState('nahwu'); // 'nahwu' | 'sharaf'

  if (!word) return null;

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
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <span className="modal-word-index">Kata #{word.index} dari {totalWords}</span>
            <span className={`badge ${getStatusBadgeClass(word.irabStatus)}`}>
              {word.irabLabel || word.irabStatus}
            </span>
          </div>
          <button onClick={onClose} className="btn-modal-close" title="Tutup Modal">
            <X size={20} />
          </button>
        </div>

        {/* Word Display in Modal */}
        <div className="modal-word-showcase">
          <div className="modal-arabic-word text-arabic">{word.arabic}</div>
          <div className="modal-word-meta">
            <h4 className="modal-transliteration">{word.transliteration}</h4>
            <p className="modal-translation">“{word.translation}”</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="modal-tab-bar">
          <button
            className={`modal-tab-btn ${activeTab === 'nahwu' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('nahwu')}
          >
            <BookMarked size={16} />
            <span>Kaidah Nahwu & I'rab</span>
          </button>
          <button
            className={`modal-tab-btn ${activeTab === 'sharaf' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('sharaf')}
          >
            <Layers size={16} />
            <span>Kaidah Sharaf & Wazan</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="modal-body-scroll">
          {activeTab === 'nahwu' && (
            <div className="tab-pane animate-fade-in">
              <div className="detail-item-card">
                <div className="detail-label">
                  <Compass size={15} /> Kedudukan Kalimat (الموقع الإعرابي)
                </div>
                <div className="detail-value-highlight">
                  {word.nahwu?.kedudukan || 'Belum diisi'}
                </div>
              </div>

              <div className="detail-grid-two">
                <div className="detail-item-card">
                  <div className="detail-label">Status & Tanda I'rab (علامة الإعراب)</div>
                  <div className="detail-value">{word.nahwu?.tandaIrab || '-'}</div>
                </div>

                <div className="detail-item-card">
                  <div className="detail-label">Keterkaitan (التعلق)</div>
                  <div className="detail-value">{word.nahwu?.taalluq || '-'}</div>
                </div>
              </div>

              <div className="detail-item-card">
                <div className="detail-label">Penjelasan I'rab Mendalam (التفصيل الإعرابي)</div>
                <p className="detail-narrative">{word.nahwu?.rincian || 'Tidak ada penjelasan rincian.'}</p>
              </div>
            </div>
          )}

          {activeTab === 'sharaf' && (
            <div className="tab-pane animate-fade-in">
              <div className="detail-grid-two">
                <div className="detail-item-card">
                  <div className="detail-label">Bentuk Kata (نوع الكلمة)</div>
                  <div className="detail-value-highlight">{word.sharaf?.bentukKata || 'Isim / Fi\'il / Harf'}</div>
                  {word.sharaf?.subTipe && (
                    <span className="subtipe-tag">{word.sharaf.subTipe}</span>
                  )}
                </div>

                <div className="detail-item-card">
                  <div className="detail-label">Akar Kata (الجذر الثلاثي)</div>
                  <div className="detail-value-arabic text-arabic">{word.sharaf?.akarKata || '-'}</div>
                </div>
              </div>

              <div className="detail-item-card">
                <div className="detail-label">
                  <GitCommit size={15} /> Wazan / Timbangan (الوزن الصرفي)
                </div>
                <div className="detail-value-arabic text-arabic wazan-highlight">
                  {word.sharaf?.wazan || '-'}
                </div>
              </div>

              <div className="detail-item-card">
                <div className="detail-label">Pola Perubahan & Kaidah Tashrif (الصيغة والاشتقاق)</div>
                <p className="detail-narrative">
                  {word.sharaf?.polaPerubahan || 'Tidak ada keterangan perubahan bentuk.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        <div className="modal-footer">
          <button
            onClick={onPrevWord}
            disabled={word.index <= 1}
            className="btn-modal-nav"
          >
            <ChevronLeft size={18} /> Kata Sebelumnya
          </button>
          <button
            onClick={onNextWord}
            disabled={word.index >= totalWords}
            className="btn-modal-nav"
          >
            Kata Selanjutnya <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
