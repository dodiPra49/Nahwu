import React, { useState } from 'react';
import { Key, X, Check, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { getStoredApiKey, saveApiKey, clearNahwuCache } from '../services/geminiService';

export default function ApiKeyModal({ isOpen, onClose, onApiKeySaved }) {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveApiKey(apiKey);
    setSaveSuccess(true);
    if (onApiKeySaved) onApiKeySaved(apiKey);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClearCache = () => {
    clearNahwuCache();
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        style={{ maxWidth: '520px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-header-left">
            <Key size={18} color="#f59e0b" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Pengaturan Google Gemini API Key</h3>
          </div>
          <button onClick={onClose} className="btn-modal-close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="modal-body-scroll" style={{ gap: '16px', display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Aplikasi menggunakan model <strong>Gemini 2.5 Flash</strong> untuk menganalisis terjemahan per kata serta kaidah Nahwu & Sharaf secara mendalam.
          </p>

          <div className="info-box-alert">
            <ShieldCheck size={18} color="#10b981" />
            <p style={{ fontSize: '0.82rem' }}>
              API Key Anda disimpan secara aman di <code>localStorage</code> peramban lokal Anda dan tidak dikirim ke server pihak ketiga manapun selain langsung ke endpoint resmi Google AI.
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
              Gemini API Key
            </label>
            <input
              type="password"
              className="search-input"
              style={{ width: '100%', fontSize: '0.95rem', padding: '12px 14px' }}
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--gold-400)' }}
            >
              <span>Dapatkan API Key Gratis di Google AI Studio</span>
              <ExternalLink size={14} />
            </a>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="submit"
              className="btn-search-submit"
              style={{ flex: 1, padding: '12px' }}
            >
              {saveSuccess ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} /> Tersimpan!
                </span>
              ) : (
                'Simpan API Key'
              )}
            </button>
            <button
              type="button"
              onClick={handleClearCache}
              className="btn-nav"
              style={{ padding: '12px', fontSize: '0.85rem' }}
              title="Hapus cache analisis ayat yang tersimpan di browser"
            >
              {cacheCleared ? 'Cache Dihapus!' : 'Bersihkan Cache'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
