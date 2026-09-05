import { SURAH_LIST } from '../data/surahData';

/**
 * Membersihkan string dari karakter spesial untuk perbandingan fleksibel
 */
function normalizeString(str) {
  return str
    .toLowerCase()
    .replace(/['’`\-_\.]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Mencari objek surah berdasarkan nama, alias, atau nomor
 */
export function findSurah(query) {
  if (!query) return null;
  const cleaned = normalizeString(query);

  // Cek jika query adalah angka langsung (1 - 114)
  const num = parseInt(query, 10);
  if (!isNaN(num) && num >= 1 && num <= 114 && String(num) === query.trim()) {
    return SURAH_LIST.find((s) => s.number === num) || null;
  }

  // Cek pencocokan eksak nama latin atau alias
  for (const surah of SURAH_LIST) {
    if (normalizeString(surah.nameLatin) === cleaned) return surah;
    if (surah.aliases.some((alias) => normalizeString(alias) === cleaned)) return surah;
  }

  // Cek pencocokan parsial (starts with atau includes)
  const partial = SURAH_LIST.find((s) => {
    const norm = normalizeString(s.nameLatin);
    return norm.startsWith(cleaned) || cleaned.startsWith(norm) || s.aliases.some((a) => normalizeString(a).startsWith(cleaned));
  });

  return partial || null;
}

/**
 * Mengurai masukan tunggal pengguna menjadi nomor surah dan nomor ayat
 * Contoh format yang didukung:
 * - "Al-Baqarah: 255"
 * - "Al Baqarah 255"
 * - "2:255"
 * - "Surah Yasin ayat 1"
 * - "Ali Imran 18"
 * - "112:1"
 */
export function parseSearchInput(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      success: false,
      error: "Silakan masukkan nama surah dan nomor ayat (contoh: 'Al-Baqarah: 255' atau '2:255')."
    };
  }

  let text = rawInput.trim();

  // Bersihkan kata awalan umum seperti "surat", "surah", "ayat", "qs"
  text = text.replace(/^qs\.?\s*/i, '');
  text = text.replace(/^surat\s+/i, '');
  text = text.replace(/^surah\s+/i, '');
  text = text.replace(/\bayat\s+/i, ':');

  let surahQuery = '';
  let ayahNumber = null;

  // Kasus 1: Terdapat pemisah titik dua (contoh: "Al-Baqarah: 255" atau "2:255")
  if (text.includes(':')) {
    const parts = text.split(':');
    surahQuery = parts[0].trim();
    ayahNumber = parseInt(parts[1].trim(), 10);
  } else {
    // Kasus 2: Nomor ayat di akhir string dipisahkan spasi (contoh: "Al Baqarah 255" atau "2 255")
    const match = text.match(/^(.*?)[,\s]+(\d+)$/);
    if (match) {
      surahQuery = match[1].trim();
      ayahNumber = parseInt(match[2].trim(), 10);
    } else {
      // Kasus jika pengguna hanya mengetik nama surah tanpa ayat
      const potentialSurah = findSurah(text);
      if (potentialSurah) {
        return {
          success: false,
          error: `Surah ${potentialSurah.nameLatin} ditemukan! Mohon tambahkan nomor ayat (1 - ${potentialSurah.ayahCount}), contoh: "${potentialSurah.nameLatin}: 1".`
        };
      }
      return {
        success: false,
        error: "Format tidak dikenali. Gunakan pola 'Nama Surah: Ayat' (contoh: 'Al-Fatihah: 1' atau '36:1')."
      };
    }
  }

  if (isNaN(ayahNumber) || ayahNumber <= 0) {
    return {
      success: false,
      error: "Nomor ayat harus berupa angka positif yang valid (contoh: 1, 2, 3...)."
    };
  }

  // Cari surah
  const surah = findSurah(surahQuery);
  if (!surah) {
    return {
      success: false,
      error: `Surah "${surahQuery}" tidak ditemukan dalam daftar 114 Surah Al-Qur'an.`
    };
  }

  // Validasi batas ayat
  if (ayahNumber > surah.ayahCount) {
    return {
      success: false,
      error: `Surah ${surah.nameLatin} (${surah.nameArabic}) hanya memiliki ${surah.ayahCount} ayat. Ayat ke-${ayahNumber} tidak ditemukan.`
    };
  }

  return {
    success: true,
    surah,
    ayahNumber,
    key: `${surah.number}:${ayahNumber}`
  };
}

/**
 * Memberikan daftar saran surah saat mengetik
 */
export function getSurahSuggestions(query, limit = 5) {
  if (!query || query.trim().length < 1) return [];
  const cleaned = normalizeString(query);

  const matched = SURAH_LIST.filter((s) => {
    return (
      String(s.number).startsWith(cleaned) ||
      normalizeString(s.nameLatin).includes(cleaned) ||
      s.aliases.some((a) => normalizeString(a).includes(cleaned))
    );
  });

  return matched.slice(0, limit);
}
