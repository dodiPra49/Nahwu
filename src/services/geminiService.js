import { GoogleGenerativeAI } from '@google/generative-ai';
import { PRESET_ANALYSIS } from '../data/presetSamples';

const STORAGE_KEY_API = 'gemini_api_key';
const STORAGE_KEY_MODEL = 'gemini_working_model';
const CACHE_PREFIX = 'nahwu_cache_';

// Daftar urutan prioritas model default
const DEFAULT_MODEL_CANDIDATES = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-exp',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash-002',
  'gemini-1.5-flash',
  'gemini-2.5-flash',
  'gemini-2.0-pro-exp-02-05',
  'gemini-1.5-pro-latest',
  'gemini-1.5-pro-002',
  'gemini-1.5-pro'
];

/**
 * Mengambil API key dari localStorage atau environment variable Vite
 */
export function getStoredApiKey() {
  const localKey = localStorage.getItem(STORAGE_KEY_API);
  if (localKey && localKey.trim()) {
    return localKey.trim();
  }
  return (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
}

/**
 * Menyimpan API key ke localStorage
 */
export function saveApiKey(key) {
  if (!key) {
    localStorage.removeItem(STORAGE_KEY_API);
    localStorage.removeItem(STORAGE_KEY_MODEL);
  } else {
    localStorage.setItem(STORAGE_KEY_API, key.trim());
    // Reset model yang tersimpan agar dideteksi ulang dengan key baru
    localStorage.removeItem(STORAGE_KEY_MODEL);
  }
}

/**
 * Membersihkan cache analisis
 */
export function clearNahwuCache() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(CACHE_PREFIX)) {
      keysToRemove.push(k);
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
}

/**
 * Mendapatkan daftar model Gemini yang aktif dan didukung oleh API key pengguna
 * Memanggil endpoint resmi Google ListModels
 */
export async function fetchSupportedGeminiModels(apiKey) {
  if (!apiKey) return [];
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${response.status}`);
    }
    const data = await response.json();
    if (data.models && Array.isArray(data.models)) {
      // Filter model yang mendukung generateContent
      const generateModels = data.models
        .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
        .map((m) => m.name.replace(/^models\//, ''));

      // Urutkan berdasarkan prioritas performa & kecepatan
      const sorted = [...generateModels].sort((a, b) => {
        const getScore = (name) => {
          if (name.includes('2.0-flash')) return 100;
          if (name.includes('2.5-flash')) return 90;
          if (name.includes('flash-latest')) return 80;
          if (name.includes('1.5-flash')) return 70;
          if (name.includes('flash')) return 60;
          if (name.includes('2.0-pro')) return 50;
          if (name.includes('1.5-pro')) return 40;
          return 10;
        };
        return getScore(b) - getScore(a);
      });

      return sorted;
    }
    return [];
  } catch (err) {
    console.warn('Gagal memuat list models dari API:', err);
    throw err;
  }
}

/**
 * Menghasilkan prompt terstruktur untuk analisis Nahwu dan Sharaf Al-Qur'an
 */
function buildAnalysisPrompt(surahName, ayahNumber, arabicText, translationText) {
  return `Anda adalah seorang pakar bahasa Arab Al-Qur'an, ahli ilmu Nahwu (Sintaksis), I'rab, dan Sharaf (Morfologi).
Tugas Anda adalah menganalisis ayat Al-Qur'an berikut ini secara terperinci kata-demi-kata dalam Bahasa Indonesia yang ilmiah, akurat, dan mudah dipahami santri/penuntut ilmu.

DATA AYAT:
- Surah: ${surahName}
- Nomor Ayat: ${ayahNumber}
- Teks Arab (Rasm Utsmani): "${arabicText}"
- Terjemahan Kemenag: "${translationText}"

INSTRUKSI WAJIB:
1. Uraikan ayat menjadi token/kata-per-kata secara berurutan dari kata pertama hingga akhir.
2. Setiap kata harus memiliki:
   - arabic: Teks kata berharakat lengkap.
   - transliteration: Transliterasi latin sesuai kaidah tajwid/standar Kemenag.
   - translation: Terjemahan arti perkata dalam Bahasa Indonesia.
   - irabStatus: Pilih salah satu dari: "marfu", "manshub", "majrur", "majzum", "mabni".
   - irabLabel: Label ringkas, contoh: "Marfu'", "Manshub", "Majrur", "Majzum", atau "Mabni".
   - nahwu: Objek berisi:
     * kedudukan: Kedudukan gramatikal (contoh: "Fa'il (فاعل)", "Mubtada' (مبتدأ)", "Khabar", "Maf'ul bih", "Jar wa Majrur", dll).
     * tandaIrab: Tanda i'rab kata tersebut (contoh: "Dhammah zhahirah", "Kasrah", "Ya'", dll).
     * rincian: Penjelasan lengkap kaidah nahwunya.
     * taalluq: Keterkaitan syibhul jumlah jika ada, atau "-" jika tidak ada.
   - sharaf: Objek berisi:
     * bentukKata: Jenis kata ("Isim", "Fi'il", atau "Harf").
     * subTipe: Subtipe kata (contoh: "Fi'il Madhi Tsulatsi", "Isim Fa'il", "Shifat Musyabbahah", "Harf Jarr", dll).
     * akarKata: Huruf akar 3 huruf (al-jidzr), contoh: "ك - ت - ب" atau "-" jika harf/isim jamid.
     * wazan: Pola wazan timbangan sharaf, contoh: "فَعَلَ" atau "فَاعِل" atau "-".
     * polaPerubahan: Penjelasan asal kata, tashrif, atau perubahan bentuknya.
3. Berikan grammarNotes: Penjelasan ringkas kaidah uslub balaghah dan struktur gramatikal penting yang terdapat dalam ayat ini.

FORMAT OUTPUT WAJIB:
Berikan HANYA format JSON valid murni tanpa pembuka/penutup markdown lain:
{
  "surahNumber": ${ayahNumber},
  "surahName": "${surahName}",
  "ayahNumber": ${ayahNumber},
  "arabicFull": "${arabicText}",
  "translationId": "${translationText}",
  "words": [
    {
      "index": 1,
      "arabic": "...",
      "transliteration": "...",
      "translation": "...",
      "irabStatus": "marfu",
      "irabLabel": "Marfu'",
      "nahwu": {
        "kedudukan": "...",
        "tandaIrab": "...",
        "rincian": "...",
        "taalluq": "..."
      },
      "sharaf": {
        "bentukKata": "...",
        "subTipe": "...",
        "akarKata": "...",
        "wazan": "...",
        "polaPerubahan": "..."
      }
    }
  ],
  "grammarNotes": "..."
}`;
}

/**
 * Membersihkan format teks dari kemungkinan balutan backticks ```json ... ```
 */
function extractJsonString(rawText) {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

/**
 * Melakukan analisis Nahwu & Sharaf
 * 1. Mengecek preset data offline
 * 2. Mengecek cache localStorage
 * 3. Jika ada API key -> deteksi model yang valid & panggil Gemini AI
 * 4. Simpan ke cache jika sukses
 */
export async function analyzeVerse(surah, ayahNumber, officialVerseData = null) {
  const key = `${surah.number}:${ayahNumber}`;

  // 1. Cek apakah ada di preset data offline instan
  if (PRESET_ANALYSIS[key]) {
    return {
      ...PRESET_ANALYSIS[key],
      source: 'preset'
    };
  }

  // 2. Cek apakah ada di localStorage cache
  const cacheKey = `${CACHE_PREFIX}${key}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsedCache = JSON.parse(cached);
      return {
        ...parsedCache,
        source: 'cache'
      };
    } catch (e) {
      localStorage.removeItem(cacheKey);
    }
  }

  // Siapkan teks ayat resmi
  const arabicText = officialVerseData?.arabicFull || '';
  const translationText = officialVerseData?.translationId || '';
  const audioUrl = officialVerseData?.audioUrl || '';

  // 3. Ambil API key
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error(
      `API Key Gemini belum disetel. Silakan klik tombol 'Set API Key' di navbar atas untuk memasukkan API Key Google Gemini Anda (gratis di aistudio.google.com), atau gunakan contoh preset bawaan (Al-Fatihah 1-2, Ayat Kursi 2:255, Al-Ikhlas 1, An-Nas 1).`
    );
  }

  // 4. Tentukan daftar model yang akan dicoba
  // Prioritaskan model yang sebelumnya sudah terbukti berhasil
  const knownWorkingModel = localStorage.getItem(STORAGE_KEY_MODEL);
  let modelsToTry = [];

  if (knownWorkingModel) {
    modelsToTry.push(knownWorkingModel);
  }

  // Coba ambil model yang aktif secara dinamis dari API
  try {
    const liveModels = await fetchSupportedGeminiModels(apiKey);
    if (liveModels.length > 0) {
      liveModels.forEach((m) => {
        if (!modelsToTry.includes(m)) modelsToTry.push(m);
      });
    }
  } catch (listErr) {
    console.warn('Gagal fetch live models, menggunakan daftar kandidat default:', listErr);
  }

  // Tambahkan kandidat default jika belum ada
  DEFAULT_MODEL_CANDIDATES.forEach((m) => {
    if (!modelsToTry.includes(m)) modelsToTry.push(m);
  });

  // 5. Inisialisasi Google Gen AI
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const prompt = buildAnalysisPrompt(surah.nameLatin, ayahNumber, arabicText, translationText);
      const result = await model.generateContent(prompt);
      const textResponse = result.response.text();
      const cleanedJson = extractJsonString(textResponse);
      const analysisData = JSON.parse(cleanedJson);

      // Simpan model yang sukses ini sebagai preferred model untuk panggilan berikutnya
      localStorage.setItem(STORAGE_KEY_MODEL, modelName);

      // Lengkapi field jika belum ada
      const completeData = {
        surahNumber: surah.number,
        surahName: surah.nameLatin,
        ayahNumber: ayahNumber,
        arabicFull: analysisData.arabicFull || arabicText,
        translationId: analysisData.translationId || translationText,
        audioUrl: audioUrl,
        words: analysisData.words || [],
        grammarNotes: analysisData.grammarNotes || '',
        source: 'gemini',
        modelUsed: modelName,
        analyzedAt: new Date().toISOString()
      };

      // Simpan ke cache
      try {
        localStorage.setItem(cacheKey, JSON.stringify(completeData));
      } catch (storageErr) {
        console.warn('Gagal menyimpan cache ke localStorage:', storageErr);
      }

      return completeData;
    } catch (err) {
      console.warn(`Gagal memanggil model ${modelName}:`, err?.message);
      lastError = err;
      // Jika error bukan 404 (misal invalid API key / quota exceeded), jangan paksa coba 10 model
      if (err?.message?.includes('API_KEY_INVALID') || err?.message?.includes('API key not valid')) {
        throw new Error('API Key Google Gemini yang dimasukkan tidak valid. Mohon periksa kembali API Key Anda di aistudio.google.com/app/apikey.');
      }
      if (err?.message?.includes('Quota exceeded') || err?.message?.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('Batas kuota gratis API Gemini harian/menit telah tercapai (Quota Exceeded). Silakan coba lagi beberapa saat.');
      }
    }
  }

  throw new Error(
    `Gagal memproses dengan model Gemini yang tersedia (${modelsToTry.slice(0, 3).join(', ')}...). Error: ${lastError?.message || 'Koneksi gagal'}`
  );
}
