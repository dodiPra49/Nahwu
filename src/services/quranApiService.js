/**
 * Layanan untuk mengambil teks rasm Utsmani dan terjemahan resmi Al-Qur'an
 */

export function formatAudioUrl(surahNumber, ayahNumber) {
  const sStr = String(surahNumber).padStart(3, '0');
  const aStr = String(ayahNumber).padStart(3, '0');
  return `https://everyayah.com/data/Alafasy_128kbps/${sStr}${aStr}.mp3`;
}

export async function fetchOfficialVerse(surahNumber, ayahNumber) {
  try {
    const url = `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/editions/quran-uthmani,id.indonesian`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Gagal memuat teks ayat dari Al-Quran Cloud (Status: ${response.status})`);
    }
    const json = await response.json();
    if (json.code === 200 && Array.isArray(json.data) && json.data.length >= 2) {
      const arabicText = json.data[0].text;
      const indonesianText = json.data[1].text;
      return {
        arabicFull: arabicText,
        translationId: indonesianText,
        audioUrl: formatAudioUrl(surahNumber, ayahNumber)
      };
    }
    throw new Error('Format response Al-Quran Cloud tidak sesuai');
  } catch (err) {
    // Fallback kedua: equran.id API v2
    try {
      const equranUrl = `https://equran.id/api/v2/surat/${surahNumber}`;
      const eqRes = await fetch(equranUrl);
      if (eqRes.ok) {
        const eqJson = await eqRes.json();
        const ayahObj = eqJson.data?.ayat?.find((a) => a.nomorAyat === ayahNumber);
        if (ayahObj) {
          return {
            arabicFull: ayahObj.teksArab,
            translationId: ayahObj.teksIndonesia,
            audioUrl: ayahObj.audio?.['01'] || formatAudioUrl(surahNumber, ayahNumber)
          };
        }
      }
    } catch (fallbackErr) {
      console.warn('Fallback equran.id error:', fallbackErr);
    }
    throw err;
  }
}
