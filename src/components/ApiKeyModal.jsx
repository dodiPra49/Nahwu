import React, { useState } from 'react';
import { Key, X, Check, ExternalLink, ShieldCheck, AlertCircle, RefreshCw, Zap, PlusCircle } from 'lucide-react';
import { getStoredApiKeys, saveApiKey, clearNahwuCache, fetchSupportedGeminiModels } from '../services/geminiService';

export default function ApiKeyModal({ isOpen, onClose, onApiKeySaved }) {
  const [keysInput, setKeysInput] = useState(() => {
    const existing = getStoredApiKeys();
    return existing.join('\n');
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    const rawKeys = keysInput
      .split(/[\n,;]+/)
      .map((k) => k.trim())
      .filter((k) => k.length > 5);

    if (rawKeys.length === 0) {
      setTestResult({
        success: false,
        message: 'Masukkan minimal satu API Key terlebih dahulu untuk diuji.'
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    let activeCount = 0;
    let sampleModels = [];
    let failureReasons = [];

    for (let i = 0; i < rawKeys.length; i++) {
      const k = rawKeys[i];
      try {
        const models = await fetchSupportedGeminiModels(k);
        if (models.length > 0) {
          activeCount++;
          if (sampleModels.length === 0) sampleModels = models;
        }
      } catch (err) {
        failureReasons.push(`Key #${i + 1}: ${err.message}`);
      }
    }

    setIsTesting(false);

    if (activeCount > 0) {
      setTestResult({
        success: true,
        message: `Koneksi berhasil! ${activeCount} dari ${rawKeys.length} API Key aktif. Model terdeteksi: ${sampleModels.slice(0, 2).join(', ')}.`
      });
    } else {
      setTestResult({
        success: false,
        message: `Koneksi gagal: ${failureReasons.join('; ') || 'Periksa kembali API Key Anda'}`
      });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveApiKey(keysInput);
    setSaveSuccess(true);
    if (onApiKeySaved) onApiKeySaved(keysInput.trim());
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
        style={{ maxWidth: '580px' }}
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
          <div className="info-box-alert" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', color: 'var(--gold-100)' }}>
            <Zap size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>
              <strong>Solusi Kuota Gratis (15 RPM / Rate Limit):</strong>
              <p style={{ marginTop: '3px' }}>
                Google AI Studio membatasi 15 request per menit untuk tier gratis. Anda dapat memasukkan <strong>lebih dari 1 API Key</strong> (pisahkan dengan baris baru/koma). Aplikasi akan otomatis melakukan rotasi ke key cadangan jika salah satu key mencapai batas kuota!
              </p>
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
              <span>Gemini API Key (Bisa Multi-Key)</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Satu per baris</span>
            </label>
            <textarea
              className="search-input"
              rows={3}
              style={{
                width: '100%',
                fontSize: '0.9rem',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                resize: 'vertical',
                minHeight: '80px',
                fontFamily: 'monospace'
              }}
              placeholder={`AIzaSyKeyPertama...\nAIzaSyKeyKeduaCadangan...`}
              value={keysInput}
              onChange={(e) => {
                setKeysInput(e.target.value);
                setTestResult(null);
              }}
            />
          </div>

          {/* Tombol Uji Koneksi & Link Google AI Studio */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || !keysInput.trim()}
              className="btn-nav"
              style={{ fontSize: '0.82rem', padding: '6px 14px', border: '1px solid var(--border-emerald)' }}
            >
              {isTesting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Menguji Koneksi...
                </>
              ) : (
                <>
                  <Zap size={14} color="#10b981" /> Tes Semua API Key
                </>
              )}
            </button>

            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--gold-400)', fontSize: '0.85rem' }}
            >
              <span>Buat Key Baru Gratis di Google AI Studio</span>
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
