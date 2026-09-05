import React from 'react';
import { X, BookOpen, Compass, Layers, Palette } from 'lucide-react';

export default function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        style={{ maxWidth: '620px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mobile-sheet-handle-bar">
          <div className="mobile-drawer-handle" />
        </div>

        <div className="modal-header">
          <div className="modal-header-left">
            <BookOpen size={20} color="#10b981" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Panduan Kaidah Nahwu, Sharaf & I'rab</h3>
          </div>
          <button onClick={onClose} className="btn-modal-close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Bagian Nahwu */}
          <div className="detail-item-card">
            <div className="detail-label" style={{ color: 'var(--emerald-400)' }}>
              <Compass size={16} /> Apa itu Ilmu Nahwu? (علم النحو)
            </div>
            <p className="detail-narrative">
              <strong>Ilmu Nahwu</strong> adalah ilmu yang mempelajari kaidah penyusunan kata dalam kalimat bahasa Arab serta hukum harakat huruf akhir kata (<strong>I'rab</strong> dan <strong>Bina'</strong>). Nahwu menentukan kedudukan gramatikal kata seperti <em>Fa'il</em> (subjek/pelaku), <em>Maf'ul bih</em> (objek), <em>Mubtada' & Khabar</em> (pokok dan predikat kalimat), serta susunan <em>Jar-Majrur</em>.
            </p>
          </div>

          {/* Bagian Sharaf */}
          <div className="detail-item-card">
            <div className="detail-label" style={{ color: 'var(--gold-400)' }}>
              <Layers size={16} /> Apa itu Ilmu Sharaf? (علم الصرف)
            </div>
            <p className="detail-narrative">
              <strong>Ilmu Sharaf</strong> adalah ilmu morfologi yang mempelajari struktur internal bentuk kata, akar kata 3 huruf (<em>al-jidzr</em>), dan perubahannya (<em>tashrif</em>) menjadi berbagai macam bentuk (seperti fi'il madhi, fi'il mudhari', isim fa'il, isim maf'ul, mashdar) berdasarkan pola timbangan (<strong>Wazan</strong>).
            </p>
          </div>

          {/* Legenda Warna I'rab */}
          <div className="detail-item-card">
            <div className="detail-label">
              <Palette size={16} /> Kode Warna Status I'rab Kata
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-marfu">Marfu' (مرفوع)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-manshub">Manshub (منصوب)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-majrur">Majrur (مجرور)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-majzum">Majzum (مجزوم)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-mabni">Mabni (مبني)</span>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '10px' }}>
              * Tanda I'rab pokok: Dhammah (Marfu'), Fathah (Manshub), Kasrah (Majrur), Sukun (Majzum). Kata Mabni memiliki harakat akhir yang tetap tidak terpengaruh amil.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
