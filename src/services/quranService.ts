import { SURAHS_LIST } from '../data/surahsData';
import { JUZ_LIST, getJuzByNumber } from '../data/juzData';
import type { Surah, Ayah } from '../types';

// Fallback offline ayahs for key surahs (ensures offline stability)
const SAMPLE_AYAH_CACHE: Record<number, Ayah[]> = {
  1: [
    { number: 1, text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3", surahNumber: 1 },
    { number: 2, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translation: "Segala puji bagi Allah, Tuhan seluruh alam.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3", surahNumber: 1 },
    { number: 3, text: "الرَّحْمَٰنِ الرَّحِيمِ", translation: "Yang Maha Pengasih, Maha Penyayang.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/3.mp3", surahNumber: 1 },
    { number: 4, text: "مَالِكِ يَوْمِ الدِّينِ", translation: "Pemilik hari pembalasan.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4.mp3", surahNumber: 1 },
    { number: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translation: "Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5.mp3", surahNumber: 1 },
    { number: 6, text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", translation: "Tunjukilah kami jalan yang lurus,", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6.mp3", surahNumber: 1 },
    { number: 7, text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", translation: "(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/7.mp3", surahNumber: 1 }
  ],
  78: [
    { number: 1, text: "عَمَّ يَتَسَاءَلُونَ", translation: "Tentang apakah mereka saling bertanya-tanya?", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5673.mp3", surahNumber: 78 },
    { number: 2, text: "عَنِ النَّبَإِ الْعَظِيمِ", translation: "Tentang berita yang besar (hari berbangkit),", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5674.mp3", surahNumber: 78 },
    { number: 3, text: "الَّذِي هُمْ فِيهِ مُخْتَلِفُونَ", translation: "yang dalam hal itu mereka berselisih.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5675.mp3", surahNumber: 78 },
    { number: 4, text: "كَلَّا سَيَعْلَمُونَ", translation: "Tidak! Kelak mereka akan mengetahui,", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5676.mp3", surahNumber: 78 },
    { number: 5, text: "ثُمَّ كَلَّا سَيَعْلَمُونَ", translation: "sekali lagi tidak! Kelak mereka akan mengetahui.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5677.mp3", surahNumber: 78 }
  ],
  93: [
    { number: 1, text: "وَالضُّحَىٰ", translation: "Demi waktu duha (ketika matahari naik sepenggalah),", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6082.mp3", surahNumber: 93 },
    { number: 2, text: "وَاللَّيْلِ إِذَا سَجَىٰ", translation: "dan demi malam apabila telah sunyi,", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6083.mp3", surahNumber: 93 },
    { number: 3, text: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ", translation: "Tuhanmu tidak meninggalkan engkau (Muhammad) dan tidak (pula) membencimu,", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6084.mp3", surahNumber: 93 },
    { number: 4, text: "وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ", translation: "dan sungguh, yang kemudian itu lebih baik bagimu daripada yang permulaan.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6085.mp3", surahNumber: 93 },
    { number: 5, text: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ", translation: "Dan sungguh, kelak Tuhanmu pasti memberikan karunia-Nya kepadamu, sehingga engkau menjadi puas.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6086.mp3", surahNumber: 93 }
  ],
  94: [
    { number: 1, text: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", translation: "Bukankah Kami telah melapangkan dadamu (Muhammad)?", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6093.mp3", surahNumber: 94 },
    { number: 2, text: "وَوَضَعْنَا عَنكَ وِزْرَكَ", translation: "dan Kami pun telah menurunkan bebanmu darimu,", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6094.mp3", surahNumber: 94 },
    { number: 3, text: "الَّذِي أَنقَضَ ظَهْرَكَ", translation: "yang memberatkan punggungmu,", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6095.mp3", surahNumber: 94 },
    { number: 4, text: "وَرَفَعْنَا لَكَ ذِكْرَكَ", translation: "dan Kami tinggikan sebutan (nama)mu bagimu.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6096.mp3", surahNumber: 94 },
    { number: 5, text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "Maka sesungguhnya beserta kesulitan ada kemudahan,", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6097.mp3", surahNumber: 94 },
    { number: 6, text: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "sesungguhnya beserta kesulitan itu ada kemudahan.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6098.mp3", surahNumber: 94 },
    { number: 7, text: "فَإِذَا فَرَغْتَ فَانصَبْ", translation: "Maka apabila engkau telah selesai (dari suatu urusan), tetaplah bekerja keras (untuk urusan yang lain),", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6099.mp3", surahNumber: 94 },
    { number: 8, text: "وَإِلَىٰ رَبِّكَ فَارْغَب", translation: "dan hanya kepada Tuhanmulah engkau berharap.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6100.mp3", surahNumber: 94 }
  ],
  97: [
    { number: 1, text: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ", translation: "Sesungguhnya Kami telah menurunkannya (Al-Qur'an) pada malam qadar.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6126.mp3", surahNumber: 97 },
    { number: 2, text: "وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ", translation: "Dan tahukah kamu apakah malam kemuliaan itu?", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6127.mp3", surahNumber: 97 },
    { number: 3, text: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ", translation: "Malam kemuliaan itu lebih baik daripada seribu bulan.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6128.mp3", surahNumber: 97 },
    { number: 4, text: "تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ", translation: "Pada malam itu turun para malaikat dan Rūḥ (Jibril) dengan izin Tuhannya untuk mengatur semua urusan.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6129.mp3", surahNumber: 97 },
    { number: 5, text: "سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ", translation: "Sejahteralah (malam itu) sampai terbit fajar.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6130.mp3", surahNumber: 97 }
  ],
  108: [
    { number: 1, text: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", translation: "Sungguh, Kami telah memberimu (Muhammad) nikmat yang banyak.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6205.mp3", surahNumber: 108 },
    { number: 2, text: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", translation: "Maka laksanakanlah shalat karena Tuhanmu, dan berkurbanlah.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6206.mp3", surahNumber: 108 },
    { number: 3, text: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", translation: "Sungguh, orang-orang yang membencimu dialah yang terputus (dari rahmat Allah).", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6207.mp3", surahNumber: 108 }
  ],
  112: [
    { number: 1, text: "قُلْ هُوَ اللَّهُ أَحَدٌ", translation: "Katakanlah (Muhammad), \"Dialah Allah, Yang Maha Esa.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6222.mp3", surahNumber: 112 },
    { number: 2, text: "اللَّهُ الصَّمَدُ", translation: "Allah tempat meminta segala sesuatu.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6223.mp3", surahNumber: 112 },
    { number: 3, text: "لَمْ يَلِدْ وَلَمْ يُولَدْ", translation: "(Allah) tidak beranak dan tidak pula diperanakkan,", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6224.mp3", surahNumber: 112 },
    { number: 4, text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", translation: "dan tidak ada sesuatu pun yang setara dengan Dia.\"", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6225.mp3", surahNumber: 112 }
  ],
  113: [
    { number: 1, text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", translation: "Katakanlah, \"Aku berlindung kepada Tuhan yang menguasai subuh (fajar),", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6226.mp3", surahNumber: 113 },
    { number: 2, text: "مِن شَرِّ مَا خَلَقَ", translation: "dari kejahatan (makhluk yang) Dia ciptakan,", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6227.mp3", surahNumber: 113 },
    { number: 3, text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", translation: "dan dari kejahatan malam apabila telah gelap gulita,", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6228.mp3", surahNumber: 113 },
    { number: 4, text: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", translation: "dan dari kejahatan (perempuan-perempuan) penyihir yang meniup pada buhul-buhul (talinya),", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6229.mp3", surahNumber: 113 },
    { number: 5, text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", translation: "dan dari kejahatan orang yang dengki apabila dia dengki.\"", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6230.mp3", surahNumber: 113 }
  ],
  114: [
    { number: 1, text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", translation: "Katakanlah, \"Aku berlindung kepada Tuhannya manusia,", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6231.mp3", surahNumber: 114 },
    { number: 2, text: "مَلِكِ النَّاسِ", translation: "Raja manusia,", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6232.mp3", surahNumber: 114 },
    { number: 3, text: "إِلَٰهِ النَّاسِ", translation: "sembahan manusia,", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6233.mp3", surahNumber: 114 },
    { number: 4, text: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", translation: "dari kejahatan (bisikan) setan yang bersembunyi,", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6234.mp3", surahNumber: 114 },
    { number: 5, text: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", translation: "yang membisikkan (kejahatan) ke dalam dada manusia,", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6235.mp3", surahNumber: 114 },
    { number: 6, text: "مِنَ الْجِنَّةِ وَالنَّاسِ", translation: "dari (golongan) jin dan manusia.\"", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6236.mp3", surahNumber: 114 }
  ]
};

export const quranService = {
  getSurahs(): Surah[] {
    return SURAHS_LIST;
  },

  getAllSurahs(): Surah[] {
    return this.getSurahs();
  },

  getSurahByNumber(number: number): Surah | undefined {
    return SURAHS_LIST.find(s => s.number === number);
  },

  getSurahsForJuz(juzNumber: number): Surah[] {
    const juz = getJuzByNumber(juzNumber);
    return SURAHS_LIST.filter(s => juz.surahNumbers.includes(s.number));
  },

  searchSurahs(query: string): Surah[] {
    const q = query.trim().toLowerCase();
    if (!q) return SURAHS_LIST;
    return SURAHS_LIST.filter(s =>
      s.latinName.toLowerCase().includes(q) ||
      s.translation.toLowerCase().includes(q) ||
      s.number.toString() === q
    );
  },

  async getSurahDetail(surahNumber: number): Promise<Ayah[]> {
    const cacheKey = `siraj_surah_${surahNumber}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // ignore parse error
      }
    }

    try {
      // Primary API: equran.id
      const res = await fetch(`https://equran.id/api/v2/surah/${surahNumber}`);
      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        const ayahs: Ayah[] = data.ayat.map((item: any) => ({
          number: item.nomorAyat,
          text: item.teksArab,
          translation: item.teksIndonesia,
          audioUrl: item.audio['05'] || item.audio['01'] || item.audio['02'],
          surahNumber
        }));

        localStorage.setItem(cacheKey, JSON.stringify(ayahs));
        return ayahs;
      }
    } catch (e) {
      console.warn(`Failed to fetch surah ${surahNumber} from equran.id, checking secondary:`, e);
    }

    // Try secondary API (alquran.cloud)
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,id.indonesian,ar.alafasy`);
      if (res.ok) {
        const json = await res.json();
        const arabicData = json.data[0].ayahs;
        const transData = json.data[1].ayahs;
        const audioData = json.data[2].ayahs;

        const ayahs: Ayah[] = arabicData.map((item: any, idx: number) => ({
          number: item.numberInSurah,
          text: item.text,
          translation: transData[idx]?.text || '',
          audioUrl: audioData[idx]?.audio || '',
          surahNumber
        }));

        localStorage.setItem(cacheKey, JSON.stringify(ayahs));
        return ayahs;
      }
    } catch (e) {
      console.warn('Secondary Quran API also failed:', e);
    }

    // Return sample offline fallback if available
    if (SAMPLE_AYAH_CACHE[surahNumber]) {
      return SAMPLE_AYAH_CACHE[surahNumber];
    }

    // Structured graceful fallback
    const surahInfo = this.getSurahByNumber(surahNumber);
    return Array.from({ length: surahInfo?.totalAyahs || 7 }).map((_, i) => ({
      number: i + 1,
      text: `سُورَةُ ${surahInfo?.name || 'القرآن'} - آية ${i + 1}`,
      translation: `Ayat ${i + 1} Surah ${surahInfo?.latinName || ''}. (Sambungan internet dibutuhkan untuk pertama kali memuat teks lengkap surah ini).`,
      surahNumber
    }));
  },

  async getAyahsBySurah(surahNumber: number): Promise<Ayah[]> {
    return this.getSurahDetail(surahNumber);
  },

  async getAyahRange(surahNumber: number, startAyah: number, endAyah: number): Promise<Ayah[]> {
    const all = await this.getAyahsBySurah(surahNumber);
    return all.filter(a => a.number >= startAyah && a.number <= endAyah);
  },

  getGlobalAyahNumber(surahNumber: number, ayahNumber: number): number {
    let globalIndex = 0;
    for (let i = 1; i < surahNumber; i++) {
      const s = SURAHS_LIST.find(item => item.number === i);
      if (s) globalIndex += s.totalAyahs;
    }
    return globalIndex + ayahNumber;
  },

  getAyahAudioUrl(surahNumber: number, ayahNumber: number, qari: string = 'ar.alafasy'): string {
    const globalAyah = this.getGlobalAyahNumber(surahNumber, ayahNumber);
    return `https://cdn.islamic.network/quran/audio/128/${qari}/${globalAyah}.mp3`;
  },

  getSurahAudioUrl(surahNumber: number, qari: string = 'ar.alafasy'): string {
    return `https://cdn.islamic.network/quran/audio-surah/128/${qari}/${surahNumber}.mp3`;
  }
};
