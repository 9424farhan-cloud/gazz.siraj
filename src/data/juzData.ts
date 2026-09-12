export interface JuzDefinition {
  number: number;
  name: string;
  arabicName: string;
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
  surahNumbers: number[];
  surahRangeText: string;
  totalSurahs: number;
  description?: string;
}

export const JUZ_LIST: JuzDefinition[] = [
  {
    number: 1,
    name: "Juz 1",
    arabicName: "الجزء الأول",
    startSurah: 1,
    startAyah: 1,
    endSurah: 2,
    endAyah: 141,
    surahNumbers: [1, 2],
    surahRangeText: "Al-Fatihah: 1 → Al-Baqarah: 141",
    totalSurahs: 2,
    description: "Pembukaan Kitabullah dan dasar-dasar keimanan, penciptaan manusia, kisah Nabi Adam 'alaihissalam."
  },
  {
    number: 2,
    name: "Juz 2",
    arabicName: "الجزء الثاني (سَيَقُولُ)",
    startSurah: 2,
    startAyah: 142,
    endSurah: 2,
    endAyah: 252,
    surahNumbers: [2],
    surahRangeText: "Al-Baqarah: 142 → Al-Baqarah: 252",
    totalSurahs: 1,
    description: "Pengalihan Kiblat, hukum syariat, puasa Ramadhan, haji, qishash, dan kisah Thalut & Jalut."
  },
  {
    number: 3,
    name: "Juz 3",
    arabicName: "الجزء الثالث (تِلْكَ الرُّسُلُ)",
    startSurah: 2,
    startAyah: 253,
    endSurah: 3,
    endAyah: 92,
    surahNumbers: [2, 3],
    surahRangeText: "Al-Baqarah: 253 → Ali 'Imran: 92",
    totalSurahs: 2,
    description: "Ayat Kursi, larangan riba, ayat pencatatan hutang, dan keteguhan iman keluarga 'Imran."
  },
  {
    number: 4,
    name: "Juz 4",
    arabicName: "الجزء الرابع (لَنْ تَنَالُوا)",
    startSurah: 3,
    startAyah: 93,
    endSurah: 4,
    endAyah: 23,
    surahNumbers: [3, 4],
    surahRangeText: "Ali 'Imran: 93 → An-Nisa': 23",
    totalSurahs: 2,
    description: "Pelajaran Perang Uhud, persatuan umat, hukum anak yatim, waris, dan hak-hak wanita."
  },
  {
    number: 5,
    name: "Juz 5",
    arabicName: "الجزء الخامس (وَالْمُحْصَنَاتُ)",
    startSurah: 4,
    startAyah: 24,
    endSurah: 4,
    endAyah: 147,
    surahNumbers: [4],
    surahRangeText: "An-Nisa': 24 → An-Nisa': 147",
    totalSurahs: 1,
    description: "Hukum pernikahan, keadilan rumah tangga, ketaatan kepada Allah dan Rasul, serta bahaya kemunafikan."
  },
  {
    number: 6,
    name: "Juz 6",
    arabicName: "الجزء السادس (لَا يُحِبُّ اللَّهُ)",
    startSurah: 4,
    startAyah: 148,
    endSurah: 5,
    endAyah: 81,
    surahNumbers: [4, 5],
    surahRangeText: "An-Nisa': 148 → Al-Ma'idah: 81",
    totalSurahs: 2,
    description: "Larangan perkataan buruk, kesempurnaan agama Islam, hukum makanan halal & thoyyib, wudhu dan tayamum."
  },
  {
    number: 7,
    name: "Juz 7",
    arabicName: "الجزء السابع (وَإِذَا سَمِعُوا)",
    startSurah: 5,
    startAyah: 82,
    endSurah: 6,
    endAyah: 110,
    surahNumbers: [5, 6],
    surahRangeText: "Al-Ma'idah: 82 → Al-An'am: 110",
    totalSurahs: 2,
    description: "Hukum sumpah, larangan khamr & judi, tauhid murni dan perdebatan akidah dengan kaum musyrik."
  },
  {
    number: 8,
    name: "Juz 8",
    arabicName: "الجزء الثامن (وَلَوْ أَنَّنَا)",
    startSurah: 6,
    startAyah: 111,
    endSurah: 7,
    endAyah: 87,
    surahNumbers: [6, 7],
    surahRangeText: "Al-An'am: 111 → Al-A'raf: 87",
    totalSurahs: 2,
    description: "Ketetapan makanan halal, wasiat sepuluh kebaikan, kisah Nabi Adam dan Iblis, para Nabi terdahulu."
  },
  {
    number: 9,
    name: "Juz 9",
    arabicName: "الجزء التاسع (قَالَ الْمَلَأُ)",
    startSurah: 7,
    startAyah: 88,
    endSurah: 8,
    endAyah: 40,
    surahNumbers: [7, 8],
    surahRangeText: "Al-A'raf: 88 → Al-Anfal: 40",
    totalSurahs: 2,
    description: "Kisah Nabi Musa dengan Fir'aun, perjanjian Bani Israil, dan hikmah Perang Badar."
  },
  {
    number: 10,
    name: "Juz 10",
    arabicName: "الجزء العاشر (وَاعْلَمُوا)",
    startSurah: 8,
    startAyah: 41,
    endSurah: 9,
    endAyah: 92,
    surahNumbers: [8, 9],
    surahRangeText: "Al-Anfal: 41 → At-Tawbah: 92",
    totalSurahs: 2,
    description: "Pembagian harta rampasan perang, keteguhan saat berjihad, kemakmuran masjid-masjid Allah, dan zakat."
  },
  {
    number: 11,
    name: "Juz 11",
    arabicName: "الجزء الحادي عشر (يَعْتَذِرُونَ)",
    startSurah: 9,
    startAyah: 93,
    endSurah: 11,
    endAyah: 5,
    surahNumbers: [9, 10, 11],
    surahRangeText: "At-Tawbah: 93 → Hud: 5",
    totalSurahs: 3,
    description: "Taubat tiga sahabat yang tertinggal Perang Tabuk, keagungan mukjizat Al-Qur'an, dan kisah Nabi Yunus."
  },
  {
    number: 12,
    name: "Juz 12",
    arabicName: "الجزء الثاني عشر (وَمَا مِنْ دَابَّةٍ)",
    startSurah: 11,
    startAyah: 6,
    endSurah: 12,
    endAyah: 52,
    surahNumbers: [11, 12],
    surahRangeText: "Hud: 6 → Yusuf: 52",
    totalSurahs: 2,
    description: "Kisah Nabi Nuh, Nabi Hud, Nabi Shalih, serta kisah terbaik (Ahsanul Qashash) Nabi Yusuf 'alaihissalam."
  },
  {
    number: 13,
    name: "Juz 13",
    arabicName: "الجزء الثالث عشر (وَمَا أُبَرِّئُ)",
    startSurah: 12,
    startAyah: 53,
    endSurah: 14,
    endAyah: 52,
    surahNumbers: [12, 13, 14],
    surahRangeText: "Yusuf: 53 → Ibrahim: 52",
    totalSurahs: 3,
    description: "Pertemuan indah keluarga Yusuf di Mesir, keagungan tasbih petir dan malaikat, serta doa Nabi Ibrahim."
  },
  {
    number: 14,
    name: "Juz 14",
    arabicName: "الجزء الرابع عشر (رُبَمَا)",
    startSurah: 15,
    startAyah: 1,
    endSurah: 16,
    endAyah: 128,
    surahNumbers: [15, 16],
    surahRangeText: "Al-Hijr: 1 → An-Nahl: 128",
    totalSurahs: 2,
    description: "Jaminan pemeliharaan Al-Qur'an, penciptaan alam semesta, dan aneka nikmat Allah dalam Surah An-Nahl."
  },
  {
    number: 15,
    name: "Juz 15",
    arabicName: "الجزء الخامس عشر (سُبْحَانَ الَّذِي)",
    startSurah: 17,
    startAyah: 1,
    endSurah: 18,
    endAyah: 74,
    surahNumbers: [17, 18],
    surahRangeText: "Al-Isra': 1 → Al-Kahf: 74",
    totalSurahs: 2,
    description: "Peristiwa agung Isra' Mi'raj, adab kepada orang tua, dan kisah Ashabul Kahfi serta pemilik dua kebun."
  },
  {
    number: 16,
    name: "Juz 16",
    arabicName: "الجزء السادس عشر (قَالَ أَلَمْ)",
    startSurah: 18,
    startAyah: 75,
    endSurah: 20,
    endAyah: 135,
    surahNumbers: [18, 19, 20],
    surahRangeText: "Al-Kahf: 75 → Taha: 135",
    totalSurahs: 3,
    description: "Kisah Musa dan Khidhir, Dzulqarnain, kisah Maryam melahirkan Nabi Isa, dan panggilan wahyu Nabi Musa di Lembah Thuwa."
  },
  {
    number: 17,
    name: "Juz 17",
    arabicName: "الجزء السابع عشر (اقْتَرَبَ)",
    startSurah: 21,
    startAyah: 1,
    endSurah: 22,
    endAyah: 78,
    surahNumbers: [21, 22],
    surahRangeText: "Al-Anbiya': 1 → Al-Hajj: 78",
    totalSurahs: 2,
    description: "Kisah para Nabi (Ibrahim, Luth, Ayyub, Yunus, Zakariya) dan pensyariatan ibadah Haji di Baitullah."
  },
  {
    number: 18,
    name: "Juz 18",
    arabicName: "الجزء الثامن عشر (قَدْ أَفْلَحَ)",
    startSurah: 23,
    startAyah: 1,
    endSurah: 25,
    endAyah: 20,
    surahNumbers: [23, 24, 25],
    surahRangeText: "Al-Mu'minun: 1 → Al-Furqan: 20",
    totalSurahs: 3,
    description: "Ciri-ciri orang beriman yang beruntung, ayat cahaya (An-Nur), adab menjaga pandangan, dan kehormatan keluarga."
  },
  {
    number: 19,
    name: "Juz 19",
    arabicName: "الجزء التاسع عشر (وَقَالَ الَّذِينَ)",
    startSurah: 25,
    startAyah: 21,
    endSurah: 27,
    endAyah: 55,
    surahNumbers: [25, 26, 27],
    surahRangeText: "Al-Furqan: 21 → An-Naml: 55",
    totalSurahs: 3,
    description: "Karakteristik 'Ibadurrahman (hamba-hamba Allah Yang Maha Penyayang), kisah para Rasul dan keajaiban mukjizat Nabi Sulaiman."
  },
  {
    number: 20,
    name: "Juz 20",
    arabicName: "الجزء العشرون (فَمَا كَانَ)",
    startSurah: 27,
    startAyah: 56,
    endSurah: 29,
    endAyah: 45,
    surahNumbers: [27, 28, 29],
    surahRangeText: "An-Naml: 56 → Al-'Ankabut: 45",
    totalSurahs: 3,
    description: "Kisah Ratu Balqis, kelahiran Nabi Musa dan Qarun, serta perumpamaan sarang laba-laba yang rapuh."
  },
  {
    number: 21,
    name: "Juz 21",
    arabicName: "الجزء الحادي والعشرون (وَلَا تُجَادِلُوا)",
    startSurah: 29,
    startAyah: 46,
    endSurah: 33,
    endAyah: 30,
    surahNumbers: [29, 30, 31, 32, 33],
    surahRangeText: "Al-'Ankabut: 46 → Al-Ahzab: 30",
    totalSurahs: 5,
    description: "Tanda kebesaran ciptaan Allah, wasiat mulia Luqman Al-Hakim, keutamaan sujud dan kemuliaan istri-istri Nabi."
  },
  {
    number: 22,
    name: "Juz 22",
    arabicName: "الجزء الثاني والعشرون (وَمَنْ يَقْنُتْ)",
    startSurah: 33,
    startAyah: 31,
    endSurah: 36,
    endAyah: 27,
    surahNumbers: [33, 34, 35, 36],
    surahRangeText: "Al-Ahzab: 31 → Yasin: 27",
    totalSurahs: 4,
    description: "Kedudukan mulia Rasulullah shallallahu 'alaihi wasallam, kerajaan Saba', penciptaan malaikat, dan awal Surah Yasin."
  },
  {
    number: 23,
    name: "Juz 23",
    arabicName: "الجزء الثالث والعشرون (وَمَا أَنْزَلْنَا)",
    startSurah: 36,
    startAyah: 28,
    endSurah: 39,
    endAyah: 31,
    surahNumbers: [36, 37, 38, 39],
    surahRangeText: "Yasin: 28 → Az-Zumar: 31",
    totalSurahs: 4,
    description: "Kebenaran Hari Kebangkitan, barisan malaikat, kesabaran Nabi Dawud & Sulaiman, dan keikhlasan beribadah hanya bagi Allah."
  },
  {
    number: 24,
    name: "Juz 24",
    arabicName: "الجزء الرابع والعشرون (فَمَنْ أَظْلَمُ)",
    startSurah: 39,
    startAyah: 32,
    endSurah: 41,
    endAyah: 46,
    surahNumbers: [39, 40, 41],
    surahRangeText: "Az-Zumar: 32 → Fussilat: 46",
    totalSurahs: 3,
    description: "Keluasan ampunan Allah (ayat harapan terbesar), doa malaikat pemikul 'Arsy, dan keagungan Al-Qur'an."
  },
  {
    number: 25,
    name: "Juz 25",
    arabicName: "الجزء الخامس والعشرون (إِلَيْهِ يُرَدُّ)",
    startSurah: 41,
    startAyah: 47,
    endSurah: 45,
    endAyah: 37,
    surahNumbers: [41, 42, 43, 44, 45],
    surahRangeText: "Fussilat: 47 → Al-Jasiyah: 37",
    totalSurahs: 5,
    description: "Musyawarah dalam Islam, malam Lailatul Qadr (Ad-Dukhan), dan tunduknya seluruh makhluk di Hari Mahsyar."
  },
  {
    number: 26,
    name: "Juz 26",
    arabicName: "الجزء السادس والعشرون (حم)",
    startSurah: 46,
    startAyah: 1,
    endSurah: 51,
    endAyah: 30,
    surahNumbers: [46, 47, 48, 49, 50, 51],
    surahRangeText: "Al-Ahqaf: 1 → Az-Zariyat: 30",
    totalSurahs: 6,
    description: "Kemenangan nyata Fathu Makkah, adab sesama mukmin (Al-Hujurat), dan kedekatan Allah dengan hamba-Nya lebih dekat dari urat leher (Qaf)."
  },
  {
    number: 27,
    name: "Juz 27",
    arabicName: "الجزء السابع والعشرون (قَالَ فَمَا خَطْبُكُمْ)",
    startSurah: 51,
    startAyah: 31,
    endSurah: 57,
    endAyah: 29,
    surahNumbers: [51, 52, 53, 54, 55, 56, 57],
    surahRangeText: "Az-Zariyat: 31 → Al-Hadid: 29",
    totalSurahs: 7,
    description: "Mi'raj di Sidratul Muntaha, nikmat Ar-Rahman, kelompok orang beriman di Hari Kiamat (Al-Waqi'ah), dan kemuliaan Surah Al-Hadid."
  },
  {
    number: 28,
    name: "Juz 28",
    arabicName: "الجزء الثامن والعشرون (قَدْ سَمِعَ)",
    startSurah: 58,
    startAyah: 1,
    endSurah: 66,
    endAyah: 12,
    surahNumbers: [58, 59, 60, 61, 62, 63, 64, 65, 66],
    surahRangeText: "Al-Mujadilah: 1 → At-Tahrim: 12",
    totalSurahs: 9,
    description: "Gugatan doa wanita didengar dari atas langit ke-7, Asma'ul Husna di akhir Surah Al-Hasyr, keutamaan shalat Jum'at, dan teladan keluarga mukmin."
  },
  {
    number: 29,
    name: "Juz 29",
    arabicName: "الجزء التاسع والعشرون (تَبَارَكَ)",
    startSurah: 67,
    startAyah: 1,
    endSurah: 77,
    endAyah: 50,
    surahNumbers: [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77],
    surahRangeText: "Al-Mulk: 1 → Al-Mursalat: 50",
    totalSurahs: 11,
    description: "Surah Al-Mulk sebagai pelindung siksa kubur, kemuliaan akhlak Nabi (Al-Qalam), qiyamullail (Al-Muzzammil), dan seruan dakwah (Al-Muddassir)."
  },
  {
    number: 30,
    name: "Juz 30",
    arabicName: "الجزء الثلاثون (عَمَّ يَتَسَاءَلُونَ)",
    startSurah: 78,
    startAyah: 1,
    endSurah: 114,
    endAyah: 6,
    surahNumbers: [
      78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96,
      97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114
    ],
    surahRangeText: "An-Naba': 1 → An-Nas: 6",
    totalSurahs: 37,
    description: "Juz 'Amma: surah-surah pendek Makkiyah sarat peringatan hari akhir, tauhid, ketenangan jiwa (Ad-Duha & Al-Insyirah), serta Al-Mu'awwidzatain."
  }
];

export const getJuzByNumber = (juzNumber: number): JuzDefinition => {
  return JUZ_LIST.find(j => j.number === juzNumber) || JUZ_LIST[29]; // default Juz 30
};
