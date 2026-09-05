// Preset data analisis Al-Qur'an (Nahwu, Sharaf, Terjemahan Kata)
// Berfungsi sebagai demonstrasi instan, offline backup, dan referensi format standar AI

export const PRESET_ANALYSIS = {
  "1:1": {
    surahNumber: 1,
    surahName: "Al-Fatihah",
    ayahNumber: 1,
    arabicFull: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    translationId: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001001.mp3",
    words: [
      {
        index: 1,
        arabic: "بِسْمِ",
        transliteration: "bismi",
        translation: "Dengan nama",
        irabStatus: "majrur", // marfu, manshub, majrur, majzum, mabni
        irabLabel: "Majrur",
        nahwu: {
          kedudukan: "Jar wa Majrur (حرف جر + اسم مجرور)",
          tandaIrab: "Kasrah zhirah di akhir kata (الكسرة الظاهرة)",
          rincian: "Huruf 'Ba' (بِ) adalah harf jarr mabni 'ala al-kasr. Kata 'Ism' (اسْمِ) adalah isim majrur bil-ba' dan bertindak sebagai mudhaf (مضاف).",
          taalluq: "Syibhul jumlah (جار ومجرور) muta'alliq dengan fi'il mahdzuf تقديره: (أَبْتَدِئُ / أَقْرَأُ) yang posisinya sebagai mu'akhkhar untuk faedah pembatasan/hasyr."
        },
        sharaf: {
          bentukKata: "Isim (اسم)",
          subTipe: "Isim Jamid Mashdar",
          akarKata: "س - م - و (S-M-W) atau و-س-م",
          wazan: "فِعْل (Fi'l)",
          polaPerubahan: "Berasal dari kata 'sumuw' (العلو والرفعة) yang berarti ketinggian/kemuliaan. Huruf wawu di akhir dibuang dan diganti hamzah washal di awal."
        }
      },
      {
        index: 2,
        arabic: "ٱللَّهِ",
        transliteration: "Allāh",
        translation: "Allah",
        irabStatus: "majrur",
        irabLabel: "Majrur",
        nahwu: {
          kedudukan: "Mudhaf Ilaih (مضاف إليه)",
          tandaIrab: "Kasrah zhahirah (الكسرة الظاهرة)",
          rincian: "Lafdzul Jalalah (اسم الجلالة) majrur sebagai mudhaf ilaih dari kata 'bismi'. Mengagungkan Dzat Sang Pencipta.",
          taalluq: "-"
        },
        sharaf: {
          bentukKata: "Isim Alam (اسم علم)",
          subTipe: "Isim Alam Lil-Bari Ta'ala",
          akarKata: "إ - ل - ه (A-L-H)",
          wazan: "فِعَال (Fi'al)",
          polaPerubahan: "Dari 'Ilah' (إِلَٰه) yang dimasuki 'Al' (ال) lil-ta'dhim sehingga menjadi 'Allah' (الله). Maknanya: Dzat yang berhak disembah dengan penuh ketundukan dan cinta."
        }
      },
      {
        index: 3,
        arabic: "ٱلرَّحْمَٰنِ",
        transliteration: "ar-Raḥmān",
        translation: "Maha Pengasih",
        irabStatus: "majrur",
        irabLabel: "Majrur (Na'at)",
        nahwu: {
          kedudukan: "Na'at / Shifat Awwal (نعت أول للفظ الجلالة)",
          tandaIrab: "Kasrah zhahirah (الكسرة الظاهرة)",
          rincian: "Na'at tabi' (mengikuti) lafdzul jalalah yang majrur, maka statusnya ikut majrur.",
          taalluq: "-"
        },
        sharaf: {
          bentukKata: "Isim Shifat (صفة مشبهة)",
          subTipe: "Shifat Musyabbahah bismil fa'il",
          akarKata: "ر - ح - م (R-H-M)",
          wazan: "فَعْلَان (Fa'lān)",
          polaPerubahan: "Wazan fa'lan menunjukkan kepenuhan, keluasan, dan kelimpahan rahmat (السعة والامتلاء) yang mencakup seluruh makhluk di dunia."
        }
      },
      {
        index: 4,
        arabic: "ٱلرَّحِيمِ",
        transliteration: "ar-Raḥīm",
        translation: "Maha Penyayang",
        irabStatus: "majrur",
        irabLabel: "Majrur (Na'at)",
        nahwu: {
          kedudukan: "Na'at / Shifat Tsani (نعت ثانٍ للفظ الجلالة)",
          tandaIrab: "Kasrah zhahirah (الكسرة الظاهرة)",
          rincian: "Na'at kedua bagi lafdzul jalalah, mengikuti status majrur.",
          taalluq: "-"
        },
        sharaf: {
          bentukKata: "Isim Shifat / Shighah Mubalaghah (صيغة مبالغة)",
          subTipe: "Shighah Mubalaghah / Shifat Musyabbahah",
          akarKata: "ر - ح - م (R-H-M)",
          wazan: "فَعِيل (Fa'īl)",
          polaPerubahan: "Wazan fa'il menunjukkan kesinambungan, ketetapan (الثبوت والدوام), dan penyampaian rahmat khusus kepada hamba-hamba yang beriman di akhirat."
        }
      }
    ],
    grammarNotes: "Basmalah tersusun dari rangkaian Syibhul Jumlah (جار ومجرور) dan Mudhaf-Mudhaf Ilaih, diikuti dua Shifat (Na'at). Fi'il (kata kerja) yang dibuang diletakkan di akhir secara taqdir untuk mengkhususkan dan mengagungkan nama Allah SWT semata."
  },
  "1:2": {
    surahNumber: 1,
    surahName: "Al-Fatihah",
    ayahNumber: 2,
    arabicFull: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
    translationId: "Segala puji bagi Allah, Tuhan semesta alam.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/001002.mp3",
    words: [
      {
        index: 1,
        arabic: "ٱلْحَمْدُ",
        transliteration: "al-ḥamdu",
        translation: "Segala puji",
        irabStatus: "marfu",
        irabLabel: "Marfu'",
        nahwu: {
          kedudukan: "Mubtada' (مبتدأ)",
          tandaIrab: "Dhammah zhahirah (الضمة الظاهرة)",
          rincian: "Isim ma'rifah diawali 'Al' istighraqiyah (mencakup segala bentuk pujian yang sempurna) marfu' sebagai pokok kalimat (Mubtada').",
          taalluq: "-"
        },
        sharaf: {
          bentukKata: "Isim (اسم)",
          subTipe: "Mashdar Sharih Tsulatsi",
          akarKata: "ح - م - د (H-M-D)",
          wazan: "فَعْل (Fa'l)",
          polaPerubahan: "Berasal dari fi'il tsulatsi mujarrad 'hamida - yahmadu' (حَمِدَ - يَحْمَدُ). Maknanya memuji pihak yang berbuat kebaikan atas kehendaknya sendiri disertai rasa cinta dan hormat."
        }
      },
      {
        index: 2,
        arabic: "لِلَّهِ",
        transliteration: "lillāhi",
        translation: "Bagi Allah",
        irabStatus: "majrur",
        irabLabel: "Majrur (Khabar)",
        nahwu: {
          kedudukan: "Jar wa Majrur Syibhul Jumlah fi mahalli raf'in Khabar (شبه جملة في محل رفع خبر)",
          tandaIrab: "Kasrah zhahirah (الكسرة الظاهرة)",
          rincian: "Huruf 'Lam' adalah lamul istihqaq wal ikhtishash (huruf jarr). Lafdzul Jalalah majrur bil-lam. Susunan jar-majrur menempati posisi rafa' sebagai khabar bagi 'al-hamdu'.",
          taalluq: "Muta'alliq bil-kain / mustaqir mahdzuf (كائن أو مستقر)."
        },
        sharaf: {
          bentukKata: "Isim Alam (اسم علم)",
          subTipe: "Isim Jalalah",
          akarKata: "إ - ل - ه (A-L-H)",
          wazan: "فِعَال (Fi'al)",
          polaPerubahan: "Lafadz Jalalah didahului huruf jarr Lam istihqaq."
        }
      },
      {
        index: 3,
        arabic: "رَبِّ",
        transliteration: "rabbi",
        translation: "Tuhan / Pemelihara",
        irabStatus: "majrur",
        irabLabel: "Majrur (Badal/Na'at)",
        nahwu: {
          kedudukan: "Badal atau Na'at (بدل أو نعت للفظ الجلالة)",
          tandaIrab: "Kasrah zhahirah (الكسرة الظاهرة)",
          rincian: "Mengikuti (tabi') lafdzul jalalah yang majrur. Kata 'rabbi' sekaligus berposisi sebagai mudhaf.",
          taalluq: "-"
        },
        sharaf: {
          bentukKata: "Isim Shifat / Shifat Musyabbahah",
          subTipe: "Isim Mabni Lil-Fa'il / Shifat",
          akarKata: "ر - ب - ب (R-B-B)",
          wazan: "فَعْل (Fa'l)",
          polaPerubahan: "Dari akar fi'il mudha'af 'rabba - yarubbu' (رَبَّ - يَرُبُّ) yang bermakna mendidik, memelihara, menguasai, dan memperbaiki tahap demi tahap hingga sempurna."
        }
      },
      {
        index: 4,
        arabic: "ٱلْعَٰلَمِينَ",
        transliteration: "al-'ālamīn",
        translation: "Semesta alam",
        irabStatus: "majrur",
        irabLabel: "Majrur",
        nahwu: {
          kedudukan: "Mudhaf Ilaih (مضاف إليه)",
          tandaIrab: "Ya' (الياء) karena mulhaq bi jam'il mudzakkar as-salim",
          rincian: "Majrur dengan huruf ya' sebagai pengganti kasrah karena termasuk kata yang disamakan dengan jamak mudzakkar salim (ملحق بجمع المذكر السالم).",
          taalluq: "-"
        },
        sharaf: {
          bentukKata: "Isim Jamak (جمع)",
          subTipe: "Mulhaq bi Jam'il Mudzakkar Salim",
          akarKata: "ع - ل - م ('-L-M)",
          wazan: "فَاعَلِين (Fa'alīn)",
          polaPerubahan: "Bentuk tunggalnya adalah 'alam' (عَالَم) yaitu segala sesuatu selain Allah. Kata ini satu akar dengan 'alamah' (tanda/bukti) karena alam semesta adalah tanda keberadaan Sang Maha Pencipta."
        }
      }
    ],
    grammarNotes: "Ayat kedua merupakan Kalimat Ismiyyah (جملة اسمية) yang kokoh: 'Al-Hamdu' sebagai Mubtada' dan 'Lillahi' sebagai Khabar Syibhul Jumlah. Bentuk kalimat ismiyyah dipilih karena memberikan makna ketetapan yang kekal abadi (tsubut wal istimrar), bukan temporer."
  },
  "2:255": {
    surahNumber: 2,
    surahName: "Al-Baqarah",
    ayahNumber: 255,
    arabicFull: "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ",
    translationId: "Allah, tidak ada tuhan selain Dia. Yang Mahahidup, Yang terus-menerus mengurus (makhluk-Nya). Tidak mengantuk dan tidak tidur.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/002255.mp3",
    words: [
      {
        index: 1,
        arabic: "ٱللَّهُ",
        transliteration: "Allāhu",
        translation: "Allah",
        irabStatus: "marfu",
        irabLabel: "Marfu'",
        nahwu: {
          kedudukan: "Mubtada' (مبتدأ أول)",
          tandaIrab: "Dhammah zhahirah",
          rincian: "Lafdzul Jalalah marfu' sebagai mubtada' awal kalimat tauhid agung ini.",
          taalluq: "-"
        },
        sharaf: {
          bentukKata: "Isim Alam",
          subTipe: "Isim Jalalah",
          akarKata: "إ - ل - ه",
          wazan: "فِعَال",
          polaPerubahan: "Lafadz khusus bagi Dzat Yang Maha Tunggal dan Berhak Disembah."
        }
      },
      {
        index: 2,
        arabic: "لَآ",
        transliteration: "lā",
        translation: "Tidak ada",
        irabStatus: "mabni",
        irabLabel: "Mabni",
        nahwu: {
          kedudukan: "Harf Nafi Lil-Jins (حرف نفي للجنس)",
          tandaIrab: "Mabni 'ala as-sukun",
          rincian: "Beramal seperti 'Inna' (menashabkan isim dan merafa'kan khabar) untuk meniadakan seluruh jenis keilahian selain Allah.",
          taalluq: "-"
        },
        sharaf: {
          bentukKata: "Harf (حرف)",
          subTipe: "Harf Nafi",
          akarKata: "-",
          wazan: "-",
          polaPerubahan: "Partikel penafian mutlak."
        }
      },
      {
        index: 3,
        arabic: "إِلَٰهَ",
        transliteration: "ilāha",
        translation: "Tuhan",
        irabStatus: "manshub",
        irabLabel: "Manshub / Mabni Fathah",
        nahwu: {
          kedudukan: "Isim Laa Nafi lil Jins (اسم لا النافية للجنس)",
          tandaIrab: "Mabni 'ala al-fath fi mahalli nashbin",
          rincian: "Mabni di atas fathah tanpa tanwin karena berbentuk mufrad (bukan mudhaf atau syabih bil mudhaf).",
          taalluq: "-"
        },
        sharaf: {
          bentukKata: "Isim",
          subTipe: "Isim Ma'luh (makna maf'ul)",
          akarKata: "إ - ل - ه",
          wazan: "فِعَال",
          polaPerubahan: "Bermakna sesuatu yang disembah dengan cinta dan pemuliaan."
        }
      },
      {
        index: 4,
        arabic: "إِلَّا",
        transliteration: "illā",
        translation: "Kecuali / Melainkan",
        irabStatus: "mabni",
        irabLabel: "Mabni (Istitsna')",
        nahwu: {
          kedudukan: "Adat Hashr / Istitsna' Mulghah (أداة حصر / استثناء ملغاة)",
          tandaIrab: "Mabni 'ala as-sukun",
          rincian: "Digunakan untuk pembatasan (hashr/qashr) karena kalimat sebelumnya dinafikan.",
          taalluq: "-"
        },
        sharaf: {
          bentukKata: "Harf (حرف)",
          subTipe: "Adat Istitsna'",
          akarKata: "-",
          wazan: "-",
          polaPerubahan: "Partikel pengecualian dan penegasan."
        }
      },
      {
        index: 5,
        arabic: "هُوَ",
        transliteration: "huwa",
        translation: "Dia",
        irabStatus: "marfu",
        irabLabel: "Fi Mahalli Raf'in",
        nahwu: {
          kedudukan: "Badal dari tempat isim Laa, atau Khabar (بدل مرفوع أو خبر)",
          tandaIrab: "Dhamir munfashil mabni 'ala al-fath fi mahalli raf'in",
          rincian: "Kata ganti orang ketiga tunggal menegaskan Dzat Allah SWT.",
          taalluq: "-"
        },
        sharaf: {
          bentukKata: "Isim Dhamir (ضمير منفصل)",
          subTipe: "Dhamir Gha'ib Mufrad Mudzakkar",
          akarKata: "-",
          wazan: "-",
          polaPerubahan: "Pronomina personal ketiga tunggal."
        }
      },
      {
        index: 6,
        arabic: "ٱلْحَىُّ",
        transliteration: "al-Ḥayyu",
        translation: "Yang Maha Hidup",
        irabStatus: "marfu",
        irabLabel: "Marfu' (Khabar)",
        nahwu: {
          kedudukan: "Khabar Tsani bagi Lafdzul Jalalah (خبر ثانٍ للمبتدأ)",
          tandaIrab: "Dhammah zhahirah",
          rincian: "Menyatakan sifat dzatiyah Allah yang Mahahidup kekal abadi tanpa permulaan dan tanpa akhir.",
          taalluq: "-"
        },
        sharaf: {
          bentukKata: "Isim Shifat",
          subTipe: "Shifat Musyabbahah bismil fa'il",
          akarKata: "ح - ي - ي (H-Y-Y)",
          wazan: "فَعْل (Fa'l)",
          polaPerubahan: "Dari 'hayiya' (حَيِيَ). Huruf ya' di-idghamkan menjadi ya' bertasydid."
        }
      },
      {
        index: 7,
        arabic: "ٱلْقَيُّومُ",
        transliteration: "al-Qayyūm",
        translation: "Yang Terus-menerus Mengurus",
        irabStatus: "marfu",
        irabLabel: "Marfu' (Khabar)",
        nahwu: {
          kedudukan: "Khabar Tsalits bagi Lafdzul Jalalah (خبر ثالث)",
          tandaIrab: "Dhammah zhahirah",
          rincian: "Khabar ketiga, menegaskan sifat kesempurnaan pengaturan seluruh alam tanpa butuh bantuan apapun.",
          taalluq: "-"
        },
        sharaf: {
          bentukKata: "Shighah Mubalaghah",
          subTipe: "Mubalaghah Isim Fa'il",
          akarKata: "ق - و - م (Q-W-M)",
          wazan: "فَيْعُول (Fay'ūl)",
          polaPerubahan: "Dari kata 'Qiyam' (قِيَام). Mengalami perpaduan wazan fay'ul (قَيْوُوم menjadi قَيُّوم) untuk menunjukkan puncak kemandirian dan pemeliharaan."
        }
      }
    ],
    grammarNotes: "Ayat Kursi diawali dengan deklarasi keesaan mutlak (Nafi wal Itsbat) menggunakan Laa Nafi lil Jins dan Illa al-Hashriyyah. Kemudian disusul rentetan Khabar yang menggambarkan sifat kemahakuasaan absolut Allah SWT."
  },
  "112:1": {
    surahNumber: 112,
    surahName: "Al-Ikhlas",
    ayahNumber: 1,
    arabicFull: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
    translationId: "Katakanlah (Muhammad), 'Dialah Allah, Yang Maha Esa.'",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/112001.mp3",
    words: [
      {
        index: 1,
        arabic: "قُلْ",
        transliteration: "qul",
        translation: "Katakanlah",
        irabStatus: "majzum",
        irabLabel: "Mabni 'ala Sukun (Fi'il Amr)",
        nahwu: {
          kedudukan: "Fi'il Amr (فعل أمر)",
          tandaIrab: "Mabni 'ala as-sukun",
          rincian: "Fi'il amr dengan fa'il dhamir mustatir wujuban taqdiruhu 'Anta' (أنت) yang merujuk kepada Nabi Muhammad SAW.",
          taalluq: "Seluruh kalimat setelahnya berkedudukan sebagai Maqulul Qawl fi mahalli nashbin maf'ul bih."
        },
        sharaf: {
          bentukKata: "Fi'il Amr (فعل أمر)",
          subTipe: "Fi'il Mu'tal Ajwaf Wawi",
          akarKata: "ق - و - ل (Q-W-L)",
          wazan: "فُلْ (Ful)",
          polaPerubahan: "Berasal dari 'Qaala - Yaquulu' (قَالَ - يَقُولُ). Bentuk aslinya adalah 'uqwul' -> 'quwl', lalu huruf wawu sukun dihilangkan karena bertemunya dua sukun (التقاء الساكنين) saat lam berharakat sukun."
        }
      },
      {
        index: 2,
        arabic: "هُوَ",
        transliteration: "huwa",
        translation: "Dia",
        irabStatus: "marfu",
        irabLabel: "Fi Mahalli Raf'in (Dhamirusy-Sya'n)",
        nahwu: {
          kedudukan: "Mubtada' / Dhamirusy Sya'n (ضمير الشأن مبتدأ)",
          tandaIrab: "Mabni 'ala al-fath fi mahalli raf'in",
          rincian: "Bisa berkedudukan sebagai Dhamir Sya'n (kata ganti untuk perkara agung) atau mubtada' awal.",
          taalluq: "-"
        },
        sharaf: {
          bentukKata: "Isim Dhamir",
          subTipe: "Dhamir Munfashil",
          akarKata: "-",
          wazan: "-",
          polaPerubahan: "Kata ganti orang ketiga tunggal laki-laki."
        }
      },
      {
        index: 3,
        arabic: "ٱللَّهُ",
        transliteration: "Allāhu",
        translation: "Allah",
        irabStatus: "marfu",
        irabLabel: "Marfu' (Mubtada' Tsani)",
        nahwu: {
          kedudukan: "Mubtada' Tsani (مبتدأ ثانٍ)",
          tandaIrab: "Dhammah zhahirah",
          rincian: "Lafdzul Jalalah marfu' dengan dhammah zhahirah.",
          taalluq: "-"
        },
        sharaf: {
          bentukKata: "Isim Alam Lil-Bari",
          subTipe: "Isim Jalalah",
          akarKata: "إ - ل - ه",
          wazan: "فِعَال",
          polaPerubahan: "Nama agung Pencipta alam semesta."
        }
      },
      {
        index: 4,
        arabic: "أَحَدٌ",
        transliteration: "aḥad",
        translation: "Maha Esa",
        irabStatus: "marfu",
        irabLabel: "Marfu' (Khabar)",
        nahwu: {
          kedudukan: "Khabar Mubtada' Tsani (خبر للمبتدأ الثاني)",
          tandaIrab: "Dhammah zhahirah dengan tanwin",
          rincian: "Khabar bagi Lafdzul Jalalah. Jumlah ismiyyah (الله أحد) berposisi rafa' sebagai khabar bagi dhamir 'Huwa'.",
          taalluq: "-"
        },
        sharaf: {
          bentukKata: "Isim Shifat",
          subTipe: "Shifat Musyabbahah",
          akarKata: "و - ح - د (W-H-D)",
          wazan: "فَعَل (Fa'al)",
          polaPerubahan: "Berasal dari 'wahad' (وَحَد). Huruf wawu diganti dengan hamzah menjadi 'ahad' (أَحَد) untuk menunjukkan kemurnian keesaan yang tidak terbagi."
        }
      }
    ],
    grammarNotes: "Ayat ini memiliki struktur kalimat bersarang (Nested Sentence). Jumlah ismiyyah 'Allahu Ahad' menjadi khabar bagi 'Huwa', dan seluruh rangkaiannya menjadi Maqulul Qawl dari Fi'il Amr 'Qul'."
  },
  "114:1": {
    surahNumber: 114,
    surahName: "An-Nas",
    ayahNumber: 1,
    arabicFull: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ",
    translationId: "Katakanlah, 'Aku berlindung kepada Tuhannya manusia.'",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/114001.mp3",
    words: [
      {
        index: 1,
        arabic: "قُلْ",
        transliteration: "qul",
        translation: "Katakanlah",
        irabStatus: "majzum",
        irabLabel: "Mabni 'ala Sukun",
        nahwu: {
          kedudukan: "Fi'il Amr (فعل أمر)",
          tandaIrab: "Mabni 'ala as-sukun",
          rincian: "Fa'il dhamir mustatir wujuban taqdiruhu anta.",
          taalluq: "-"
        },
        sharaf: {
          bentukKata: "Fi'il Amr",
          subTipe: "Ajwaf Wawi",
          akarKata: "ق - و - ل",
          wazan: "فُلْ",
          polaPerubahan: "Fi'il amr dari Qaala - Yaquulu."
        }
      },
      {
        index: 2,
        arabic: "أَعُوذُ",
        transliteration: "a'ūżu",
        translation: "Aku berlindung",
        irabStatus: "marfu",
        irabLabel: "Marfu' (Fi'il Mudhari')",
        nahwu: {
          kedudukan: "Fi'il Mudhari' Marfu' (فعل مضارع مرفوع)",
          tandaIrab: "Dhammah zhahirah",
          rincian: "Marfu' karena sepi dari amil nawashib (nashab) dan jawazim (jazm). Fa'il adalah dhamir mustatir wujuban taqdiruhu 'Ana' (أنا).",
          taalluq: "-"
        },
        sharaf: {
          bentukKata: "Fi'il Mudhari'",
          subTipe: "Fi'il Tsulatsi Mujarrad Mu'tal Ajwaf Wawi",
          akarKata: "ع - و - ذ ('-W-DZ)",
          wazan: "أَفْعُلُ (Af'ulu)",
          polaPerubahan: "Dari 'adha - ya'udzu' (عَاذَ - يَعُوذُ). Huruf hamzah di awal adalah hamzah mutakallim (saya)."
        }
      },
      {
        index: 3,
        arabic: "بِرَبِّ",
        transliteration: "bi-rabbi",
        translation: "Kepada Tuhan / Pemelihara",
        irabStatus: "majrur",
        irabLabel: "Majrur",
        nahwu: {
          kedudukan: "Jar wa Majrur (حرف جر + اسم مجrور)",
          tandaIrab: "Kasrah zhahirah",
          rincian: "Ba' adalah harf jarr. 'Rabbi' majrur sekaligus menjadi mudhaf.",
          taalluq: "Muta'alliq bil-fi'il 'a'udzu'."
        },
        sharaf: {
          bentukKata: "Isim",
          subTipe: "Shifat Musyabbahah",
          akarKata: "ر - ب - ب",
          wazan: "فَعْل",
          polaPerubahan: "Pemelihara dan Penguasa mutlak."
        }
      },
      {
        index: 4,
        arabic: "ٱلنَّاسِ",
        transliteration: "an-nās",
        translation: "Manusia",
        irabStatus: "majrur",
        irabLabel: "Majrur (Mudhaf Ilaih)",
        nahwu: {
          kedudukan: "Mudhaf Ilaih (مضاف إليه)",
          tandaIrab: "Kasrah zhahirah",
          rincian: "Majrur sebagai mudhaf ilaih dari kata 'rabbi'.",
          taalluq: "-"
        },
        sharaf: {
          bentukKata: "Isim Jamak",
          subTipe: "Isim Jamak Taktsir",
          akarKata: "ن - و - س atau أ - ن - س",
          wazan: "فَعْل atau فَعَال",
          polaPerubahan: "Berasal dari 'unas' (أُنَاس) lalu hamzahnya dibuang dan dimasuki Al ta'rif menjadi 'an-nas'."
        }
      }
    ],
    grammarNotes: "Ayat ini mengajarkan isti'adzah (permohonan perlindungan). Fi'il mudhari' 'a'udzu' menunjukkan tindakan perlindungan yang berkesinambungan setiap saat kepada Rabb yang memelihara manusia."
  }
};
