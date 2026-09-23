import { SearchHistoryItem } from '../types/history';

const STORAGE_KEY = 'nahwu_quran_search_history_v1';
export const MAX_HISTORY_ITEMS = 5;

/**
 * Mengambil riwayat pencarian dari localStorage
 */
export function getStoredSearchHistory(): SearchHistoryItem[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.slice(0, MAX_HISTORY_ITEMS);
    }
    return [];
  } catch (err) {
    console.warn('Gagal membaca riwayat pencarian dari localStorage:', err);
    return [];
  }
}

/**
 * Menyimpan riwayat pencarian ke localStorage
 */
export function saveSearchHistory(items: SearchHistoryItem[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const limited = items.slice(0, MAX_HISTORY_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
  } catch (err) {
    console.warn('Gagal menyimpan riwayat pencarian ke localStorage:', err);
  }
}

/**
 * Menambahkan item pencarian baru ke riwayat (maksimal 5 item, unik per surah & ayat)
 */
export function addSearchHistoryItem(
  newItem: Omit<SearchHistoryItem, 'id' | 'timestamp'>
): SearchHistoryItem[] {
  const currentHistory = getStoredSearchHistory();

  // Filter jika ayat yang sama sudah pernah dicari sebelumnya (agar dipindah ke paling atas)
  const filtered = currentHistory.filter(
    (item) => !(item.surahNumber === newItem.surahNumber && item.ayahNumber === newItem.ayahNumber)
  );

  const entry: SearchHistoryItem = {
    ...newItem,
    id: `${newItem.surahNumber}_${newItem.ayahNumber}_${Date.now()}`,
    timestamp: Date.now(),
  };

  const updatedHistory = [entry, ...filtered].slice(0, MAX_HISTORY_ITEMS);
  saveSearchHistory(updatedHistory);
  return updatedHistory;
}

/**
 * Menghapus satu item dari riwayat berdasarkan ID
 */
export function removeSearchHistoryItem(id: string): SearchHistoryItem[] {
  const currentHistory = getStoredSearchHistory();
  const updatedHistory = currentHistory.filter((item) => item.id !== id);
  saveSearchHistory(updatedHistory);
  return updatedHistory;
}

/**
 * Menghapus seluruh riwayat pencarian
 */
export function clearSearchHistory(): SearchHistoryItem[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('Gagal menghapus riwayat pencarian:', err);
    }
  }
  return [];
}

/**
 * Format timestamp menjadi teks waktu relatif dalam bahasa Indonesia
 */
export function formatHistoryTime(timestamp: number): string {
  if (!timestamp) return '';

  const now = Date.now();
  const diffSeconds = Math.max(0, Math.floor((now - timestamp) / 1000));

  if (diffSeconds < 60) {
    return 'Baru saja';
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} mnt lalu`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} jam lalu`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return 'Kemarin';
  }
  if (diffDays < 7) {
    return `${diffDays} hari lalu`;
  }

  const date = new Date(timestamp);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
}
