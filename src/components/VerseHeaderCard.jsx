import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Copy, Check, Sparkles, Database, Clock } from 'lucide-react';

export default function VerseHeaderCard({ data, surahMeta }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef(null);

  // Stop audio jika ganti ayat
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [data?.arabicFull]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Gagal memutar audio:', err);
        setIsPlaying(false);
      });
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleCopy = () => {
    const textToCopy = `${data.arabicFull}\n\n"${data.translationId}"\n(QS. ${data.surahName}: ${data.ayahNumber})`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getSourceBadge = () => {
    if (data.source === 'preset') {
      return (
        <span className="badge badge-gold" title="Data dari database kurasi preset instan">
          <Database size={13} /> Preset Validated
        </span>
      );
    }
    if (data.source === 'cache') {
      return (
        <span className="badge badge-emerald" title="Dimuat seketika dari cache browser">
          <Clock size={13} /> Cache Lokal
        </span>
      );
    }
    return (
      <span className="badge badge-emerald" title="Dianalisis secara langsung oleh Google Gemini">
        <Sparkles size={13} /> Gemini AI Live
      </span>
    );
  };

  return (
    <div className="verse-header-card glass-panel animate-fade-in">
      {/* Top Meta Bar */}
      <div className="verse-top-bar">
        <div className="verse-meta-info">
          <span className="surah-badge-number">{surahMeta?.number || data.surahNumber}</span>
          <div className="surah-title-meta">
            <h3 className="surah-latin-name">
              Surah {data.surahName} <span className="ayah-number-tag">Ayat {data.ayahNumber}</span>
            </h3>
            <p className="surah-desc-meta">
              {surahMeta?.translation || 'Al-Qur\'an'} • {surahMeta?.revelation || 'Wahyu'} • {surahMeta?.ayahCount || '-'} Ayat
            </p>
          </div>
        </div>

        <div className="verse-card-actions">
          {getSourceBadge()}

          {data.audioUrl && (
            <>
              <audio
                ref={audioRef}
                src={data.audioUrl}
                onEnded={handleAudioEnded}
                preload="none"
              />
              <button
                onClick={toggleAudio}
                className={`btn-action-icon ${isPlaying ? 'btn-audio-playing' : ''}`}
                title={isPlaying ? 'Hentikan Tilawah' : 'Putar Tilawah (Misyari Rasyid)'}
              >
                {isPlaying ? <VolumeX size={18} /> : <Volume2 size={18} />}
                <span className="btn-audio-text">{isPlaying ? 'Jeda' : 'Tilawah'}</span>
              </button>
            </>
          )}

          <button
            onClick={handleCopy}
            className="btn-action-icon"
            title="Salin Ayat dan Terjemahan"
          >
            {copied ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
            <span className="btn-audio-text">{copied ? 'Tersalin' : 'Salin'}</span>
          </button>
        </div>
      </div>

      {/* Full Arabic Text */}
      <div className="verse-arabic-display">
        <p className="verse-arabic-text text-arabic">
          {data.arabicFull}
          <span className="ayah-end-symbol">
            ۝<span className="ayah-end-num">{data.ayahNumber}</span>
          </span>
        </p>
      </div>

      {/* Full Indonesian Translation */}
      <div className="verse-translation-box">
        <div className="translation-quote-mark">“</div>
        <p className="verse-translation-text">{data.translationId}</p>
      </div>
    </div>
  );
}
