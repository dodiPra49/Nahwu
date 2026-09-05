import { GoogleGenerativeAI } from '@google/generative-ai';
import { PRESET_ANALYSIS } from '../data/presetSamples';

const STORAGE_KEY_API = 'gemini_api_key';
const CACHE_PREFIX = 'nahwu_cache_';

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
  } else {
    localStorage.setItem(STORAGE_KEY_API, key.trim());
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
 * 3. Jika ada API key -> panggil Gemini AI
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
      `API Key Gemini belum disetel. Anda dapat memasukkan API Key di tombol 'Pengaturan API' di sudut kanan atas, atau gunakan contoh ayat preset (Al-Fatihah 1-2, Al-Baqarah 255, Al-Ikhlas 1, An-Nas 1).`
    );
  }

  // 4. Inisialisasi Google Gen AI
  const genAI = new GoogleGenerativeAI(apiKey);

  // Coba model terbaru gemini-2.5-flash, fallback ke gemini-1.5-flash
  const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
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
      console.warn(`Gagal memanggil model ${modelName}:`, err);
      lastError = err;
    }
  }

  throw new Error(`Gagal menganalisis ayat dengan Gemini AI: ${lastError?.message || 'Koneksi bermasalah'}`);
}
