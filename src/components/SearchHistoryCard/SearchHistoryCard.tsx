import React from 'react';
import { History, Trash2, BookOpen } from 'lucide-react';
import { SearchHistoryCardProps } from '../../types/history';
import SearchHistoryItemRow from './SearchHistoryItemRow';
import styles from './SearchHistoryCard.module.css';

export default function SearchHistoryCard({
  historyItems,
  currentSurahNumber,
  currentAyahNumber,
  onSelectHistoryItem,
  onClearHistory,
  onRemoveHistoryItem,
  isLoading = false,
}: SearchHistoryCardProps) {
  const hasHistory = historyItems && historyItems.length > 0;

  return (
    <section className={styles.historyContainer} aria-label="Riwayat Pencarian Terakhir">
      <div className={styles.historyCard}>
        {/* Card Header */}
        <div className={styles.cardHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIconWrapper}>
              <History size={18} />
            </div>
            <div className={styles.titleGroup}>
              <h3 className={styles.title}>Riwayat Pencarian</h3>
              <span className={styles.badgeCount}>
                {hasHistory ? `${historyItems.length} / 5 Terakhir` : '0 / 5'}
              </span>
            </div>
          </div>

          {hasHistory && (
            <button
              type="button"
              className={styles.btnClearAll}
              onClick={onClearHistory}
              disabled={isLoading}
              title="Hapus semua riwayat pencarian"
            >
              <Trash2 size={13} />
              <span>Hapus Semua</span>
            </button>
          )}
        </div>

        {/* Content: List or Empty State */}
        {hasHistory ? (
          <div className={styles.itemsGrid}>
            {historyItems.map((item) => {
              const isActive =
                item.surahNumber === currentSurahNumber &&
                item.ayahNumber === currentAyahNumber;

              return (
                <SearchHistoryItemRow
                  key={item.id}
                  item={item}
                  isActive={Boolean(isActive)}
                  disabled={Boolean(isLoading)}
                  onSelect={onSelectHistoryItem}
                  onRemove={onRemoveHistoryItem}
                />
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <BookOpen size={28} className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>Belum Ada Riwayat Pencarian</p>
            <p className={styles.emptySubtitle}>
              Pencarian ayat Al-Qur'an dan analisis I'rab Nahwu Anda akan otomatis tersimpan di sini (hingga 5 ayat terakhir).
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
