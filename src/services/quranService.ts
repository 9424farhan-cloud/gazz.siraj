import { SURAHS_LIST } from '../data/surahsData';
import type { Surah, Ayah } from '../types';

// Fallback offline ayahs for key surahs
const SAMPLE_AYAH_CACHE: Record<number, Ayah[]> = {
  1: [
    { number: 1, text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3", surahNumber: 1 },
    { number: 2, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translation: "Segala puji bagi Allah, Tuhan seluruh alam.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3", surahNumber: 1 },
    { number: 3, text: "الرَّحْمَٰنِ الرَّحِيمِ", translation: "Yang Maha Pengasih, Maha Penyayang.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/3.mp3", surahNumber: 1 },
    { number: 4, text: "مَالِكِ يَوْمِ الدِّينِ", translation: "Pemilik hari pembalasan.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4.mp3", surahNumber: 1 },
    { number: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translation: "Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5.mp3", surahNumber: 1 },
    { number: 6, text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", translation: "Tunjukilah kami jalan yang lurus,", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6.mp3", surahNumber: 1 },
    { number: 7, text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", translation: "(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/7.mp3", surahNumber: 1 },
  ],
  112: [
    { number: 1, text: "قُلْ هُوَ اللَّهُ أَحَدٌ", translation: "Katakanlah (Muhammad), \"Dialah Allah, Yang Maha Esa.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6222.mp3", surahNumber: 112 },
    { number: 2, text: "اللَّهُ الصَّمَدُ", translation: "Allah tempat meminta segala sesuatu.", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6223.mp3", surahNumber: 112 },
    { number: 3, text: "لَمْ يَلِدْ وَلَمْ يُولَدْ", translation: "(Allah) tidak beranak dan tidak pula diperanakkan,", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6224.mp3", surahNumber: 112 },
    { number: 4, text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", translation: "dan tidak ada sesuatu pun yang setara dengan Dia.\"", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6225.mp3", surahNumber: 112 }
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
    // Check session/local storage cache
    const cacheKey = `siraj_surah_${surahNumber}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // ignore parse error
      }
    }

    try {
      // Primary API equran.id
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
      console.warn(`Failed to fetch surah ${surahNumber} online, checking fallback cache`, e);
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
      console.warn('Secondary Quran API also failed', e);
    }

    // Return sample offline fallback if available
    if (SAMPLE_AYAH_CACHE[surahNumber]) {
      return SAMPLE_AYAH_CACHE[surahNumber];
    }

    // If completely offline and uncached, generate structured fallback notice
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

  getGlobalAyahNumber(surahNumber: number, ayahNumber: number): number {
    let globalIndex = 0;
    for (let i = 1; i < surahNumber; i++) {
      const s = SURAHS_LIST.find(item => item.number === i);
      if (s) globalIndex += s.totalAyahs;
    }
    return globalIndex + ayahNumber;
  }
};
