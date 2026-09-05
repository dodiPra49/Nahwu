import React, { useState } from 'react';
import { Key, X, Check, ExternalLink, ShieldCheck, AlertCircle, RefreshCw, Zap } from 'lucide-react';
import { getStoredApiKey, saveApiKey, clearNahwuCache, fetchSupportedGeminiModels } from '../services/geminiService';

export default function ApiKeyModal({ isOpen, onClose, onApiKeySaved }) {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { success: boolean, message: string, models?: string[] }

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!apiKey || !apiKey.trim()) {
      setTestResult({
        success: false,
        message: 'Masukkan API Key terlebih dahulu untuk menguji koneksi.'
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const models = await fetchSupportedGeminiModels(apiKey.trim());
      if (models.length > 0) {
        setTestResult({
          success: true,
          message: `Koneksi berhasil! Model aktif ditemukan: ${models.slice(0, 3).join(', ')}${models.length > 3 ? ` (+${models.length - 3} lainnya)` : ''}`,
          models
        });
      } else {
        setTestResult({
          success: false,
          message: 'API Key terhubung, tetapi tidak menemukan model generateContent yang aktif.'
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: `Koneksi gagal: ${err.message || 'API Key tidak valid atau dinonaktifkan di Google Cloud'}`
      });
    } finally {
      setIsTesting(false);
    }
  };

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
        style={{ maxWidth: '540px' }}
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
            Aplikasi menggunakan model <strong>Gemini Flash</strong> (auto-detect versi aktif: <code>gemini-2.0-flash</code> / <code>gemini-1.5-flash-latest</code>) untuk analisis per kata, I'rab Nahwu, dan Sharaf.
          </p>

          <div className="info-box-alert">
            <ShieldCheck size={18} color="#10b981" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.82rem' }}>
              API Key Anda disimpan secara aman di <code>localStorage</code> peramban Anda. Tidak pernah dikirim ke pihak ketiga selain endpoint resmi Google Generative Language.
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
              onChange={(e) => {
                setApiKey(e.target.value);
                setTestResult(null);
              }}
            />
          </div>

          {/* Tombol Uji Koneksi & Link Google AI Studio */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || !apiKey.trim()}
              className="btn-nav"
              style={{ fontSize: '0.82rem', padding: '6px 12px', border: '1px solid var(--border-emerald)' }}
            >
              {isTesting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Menguji Koneksi...
                </>
              ) : (
                <>
                  <Zap size={14} color="#10b981" /> Tes Koneksi API
                </>
              )}
            </button>

            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--gold-400)', fontSize: '0.85rem' }}
            >
              <span>Dapatkan API Key Gratis di Google AI Studio</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Feedback Hasil Tes Koneksi */}
          {testResult && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: testResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${testResult.success ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                color: testResult.success ? '#34d399' : '#fca5a5'
              }}
            >
              {testResult.success ? <Check size={18} /> : <AlertCircle size={18} />}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Action Footer */}
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
