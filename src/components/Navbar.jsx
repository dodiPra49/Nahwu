import React from 'react';
import { Sparkles, Key, HelpCircle, BookOpen } from 'lucide-react';

export default function Navbar({ onOpenApiKey, onOpenGuide, apiKeyConfigured }) {
  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo & Name */}
        <div className="brand-wrapper">
          <div className="brand-icon">
            <span className="brand-arabic-char">ن</span>
          </div>
          <div>
            <div className="brand-title-group">
              <h1 className="brand-title">Nahwu & Sharaf AI</h1>
              <span className="badge badge-emerald badge-ai">
                <Sparkles size={13} /> Gemini 2.5
              </span>
            </div>
            <p className="brand-subtitle">I'rab & Morfologi Al-Qur'an BY ABI ULYA [[ MANDI LAI]] </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="navbar-actions">
          <button
            onClick={onOpenGuide}
            className="btn-nav"
            title="Panduan Kaidah I'rab & Warna Status"
          >
            <HelpCircle size={17} />
            <span className="btn-label">Panduan I'rab</span>
          </button>

          <button
            onClick={onOpenApiKey}
            className={`btn-nav ${apiKeyConfigured ? 'btn-nav-active' : 'btn-nav-warning'}`}
            title="Konfigurasi Google Gemini API Key"
          >
            <Key size={17} />
            <span className="btn-label">
              {apiKeyConfigured ? 'API Key Terhubung' : 'Set API Key'}
            </span>
            {apiKeyConfigured && <span className="status-dot-active" />}
          </button>

          <a
            href="https://github.com/dodiPra49/Nahwu"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-icon-nav"
            title="Lihat Repository GitHub"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
