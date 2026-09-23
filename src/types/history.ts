export interface SearchHistoryItem {
  id: string;
  query: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  arabicSnippet: string;
  translationSnippet: string;
  timestamp: number;
}

export interface SearchHistoryCardProps {
  historyItems: SearchHistoryItem[];
  currentSurahNumber?: number;
  currentAyahNumber?: number;
  onSelectHistoryItem: (query: string) => void;
  onClearHistory: () => void;
  onRemoveHistoryItem: (id: string) => void;
  isLoading?: boolean;
}

export interface SearchHistoryItemRowProps {
  item: SearchHistoryItem;
  isActive: boolean;
  disabled: boolean;
  onSelect: (query: string) => void;
  onRemove: (id: string) => void;
}
