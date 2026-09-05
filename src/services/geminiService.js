import { GoogleGenerativeAI } from '@google/generative-ai';
import { PRESET_ANALYSIS } from '../data/presetSamples';

const STORAGE_KEY_API = 'gemini_api_key';
const STORAGE_KEY_MODEL = 'gemini_working_model';
const CACHE_PREFIX = 'nahwu_cache_';

// Daftar urutan prioritas model default
const DEFAULT_MODEL_CANDIDATES = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-exp',
  'gemini-2.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash-002',
  'gemini-1.5-flash',
  'gemini-2.0-pro-exp-02-05',
  'gemini-1.5-pro-latest'
];

/**
 * Mengambil daftar API key (bisa lebih dari satu, dipisahkan koma atau baris baru)
 */
export function getStoredApiKeys() {
  const rawKey = localStorage.getItem(STORAGE_KEY_API) || import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!rawKey) return [];
  return rawKey
    .split(/[\n,;]+/)
    .map((k) => k.trim())
    .filter((k) => k.length > 5);
}

/**
 * Mengambil satu API key pertama yang tersimpan
 */
export function getStoredApiKey() {
  const keys = getStoredApiKeys();
  return keys.length > 0 ? keys[0] : '';
}

/**
 * Menyimpan API key (bisa multi-key) ke localStorage
 */
export function saveApiKey(keyString) {
  if (!keyString || !keyString.trim()) {
    localStorage.removeItem(STORAGE_KEY_API);
    localStorage.removeItem(STORAGE_KEY_MODEL);
  } else {
    localStorage.setItem(STORAGE_KEY_API, keyString.trim());
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
 * Fungsi helper delay (sleep)
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mendapatkan daftar model Gemini yang aktif dan didukung oleh API key pengguna
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
      const generateModels = data.models
        .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
        .map((m) => m.name.replace(/^models\//, ''));

      const sorted = [...generateModels].sort((a, b) => {
        const getScore = (name) => {
          if (name.includes('2.0-flash')) return 100;
          if (name.includes('2.5-flash')) return 90;
          if (name.includes('flash-latest')) return 80;
          if (name.includes('1.5-flash')) return 70;
          if (name.includes('flash')) return 60;
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
 * Melakukan analisis Nahwu & Sharaf dengan multi-key rotation, auto-retry, dan fallback
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

  // 3. Ambil daftar API key (mendukung multi-key)
  const apiKeys = getStoredApiKeys();
  if (apiKeys.length === 0) {
    throw new Error(
      `API Key Gemini belum disetel. Silakan klik tombol 'Set API Key' di navbar atas untuk memasukkan API Key Google Gemini Anda (gratis di aistudio.google.com), atau gunakan contoh preset bawaan (Al-Fatihah 1-2, Ayat Kursi 2:255, Al-Ikhlas 1, An-Nas 1).`
    );
  }

  let lastError = null;

  // 4. Iterasi melalui setiap API Key yang tersedia (Rotasi Otomatis)
  for (let keyIdx = 0; keyIdx < apiKeys.length; keyIdx++) {
    const currentApiKey = apiKeys[keyIdx];
    const genAI = new GoogleGenerativeAI(currentApiKey);

    // Tentukan model yang akan dicoba untuk key ini
    const knownWorkingModel = localStorage.getItem(STORAGE_KEY_MODEL);
    let modelsToTry = [];
    if (knownWorkingModel) modelsToTry.push(knownWorkingModel);

    try {
      const liveModels = await fetchSupportedGeminiModels(currentApiKey);
      if (liveModels.length > 0) {
        liveModels.forEach((m) => {
          if (!modelsToTry.includes(m)) modelsToTry.push(m);
        });
      }
    } catch (e) {
      // Abaikan jika gagal list models
    }

    DEFAULT_MODEL_CANDIDATES.forEach((m) => {
      if (!modelsToTry.includes(m)) modelsToTry.push(m);
    });

    // Coba model pada key saat ini
    for (const modelName of modelsToTry) {
      for (let attempt = 0; attempt < 2; attempt++) {
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

          // Simpan model sukses
          localStorage.setItem(STORAGE_KEY_MODEL, modelName);

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

          try {
            localStorage.setItem(cacheKey, JSON.stringify(completeData));
          } catch (storageErr) {
            console.warn('Gagal menyimpan cache:', storageErr);
          }

          return completeData;
        } catch (err) {
          const isRateLimit = err?.message?.includes('RESOURCE_EXHAUSTED') || err?.message?.includes('Quota exceeded') || err?.status === 429;
          const is404 = err?.message?.includes('404') || err?.message?.includes('not found');

          lastError = err;

          if (isRateLimit) {
            console.warn(`Rate limit (429) pada key #${keyIdx + 1} model ${modelName}.`);
            // Jika ada attempt kedua dan belum coba kunci lain, tunggu 2.5 detik
            if (attempt === 0) {
              await delay(2500);
              continue; // Coba sekali lagi setelah jeda
            }
            // Jika sudah 2x gagal dan ada key cadangan berikutnya, break loop model untuk ganti key!
            if (keyIdx < apiKeys.length - 1) {
              console.log(`Beralih ke API Key cadangan #${keyIdx + 2}...`);
              break;
            }
          }

          if (is404) {
            // Model tidak ada, langsung lanjut ke model berikutnya
            break;
          }

          // Error lainnya
          break;
        }
      }
    }
  }

  // Jika semua key dan model exhausted:
  const isFinalRateLimit = lastError?.message?.includes('RESOURCE_EXHAUSTED') || lastError?.message?.includes('Quota exceeded');
  if (isFinalRateLimit) {
    throw new Error(
      `Batas kuota gratis (Rate Limit 15 RPM / Requests Per Minute) dari Google tercapai. Kuota per menit ini biasanya di-reset otomatis dalam 30–60 detik. Anda juga dapat menambahkan API Key cadangan di menu 'Set API Key' untuk rotasi tanpa henti.`
    );
  }

  throw new Error(`Gagal memproses dengan Gemini AI: ${lastError?.message || 'Koneksi bermasalah'}`);
}
