import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { SearchHistoryItemRowProps } from '../../types/history';
import { formatHistoryTime } from '../../utils/historyStorage';
import styles from './SearchHistoryCard.module.css';

export default function SearchHistoryItemRow({
  item,
  isActive,
  disabled,
  onSelect,
  onRemove,
}: SearchHistoryItemRowProps) {
  const handleItemClick = () => {
    if (!disabled) {
      onSelect(item.query);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
      event.preventDefault();
      onSelect(item.query);
    }
  };

  const handleRemoveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onRemove(item.id);
  };

  const itemClassName = [
    styles.historyItem,
    isActive ? styles.itemActive : '',
    disabled ? styles.itemDisabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      className={itemClassName}
      onClick={handleItemClick}
      onKeyDown={handleKeyDown}
      title={`Buka ${item.surahName} ayat ${item.ayahNumber}`}
    >
      <div className={styles.itemTopRow}>
        <div className={styles.surahBadge}>
          <span>{item.surahName}</span>
          <span className={styles.ayahPill}>:{item.ayahNumber}</span>
        </div>

        <div className={styles.itemTopActions}>
          <span className={styles.timeLabel}>
            {formatHistoryTime(item.timestamp)}
          </span>
          <button
            type="button"
            className={styles.btnRemoveItem}
            onClick={handleRemoveClick}
            title="Hapus dari riwayat"
            aria-label={`Hapus ${item.surahName} ayat ${item.ayahNumber} dari riwayat`}
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {item.arabicSnippet && (
        <div className={styles.arabicPreview} dir="rtl">
          {item.arabicSnippet}
        </div>
      )}

      {item.translationSnippet && (
        <div className={styles.translationPreview}>
          {item.translationSnippet}
        </div>
      )}

      {isActive && (
        <div className={styles.activeIndicator}>
          <CheckCircle2 size={12} />
          <span>Sedang Dibuka</span>
        </div>
      )}
    </div>
  );
}
