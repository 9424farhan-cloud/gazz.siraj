export type PrayerName = 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';

export interface PrayerTimes {
  subuh: string;
  syuruq: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface PrayerLog {
  date: string;
  subuh: boolean;
  dzuhur: boolean;
  ashar: boolean;
  maghrib: boolean;
  isya: boolean;
}

export type WorshipType = 'tilawah' | 'dzikir' | 'murajaah' | 'tasbih' | 'witir';

export interface WorshipTarget {
  type: WorshipType;
  title: string;
  target: number;
  unit: string;
  icon: string;
}

export interface WorshipLog {
  date: string;
  type: WorshipType;
  count: number;
  target: number;
  completed: boolean;
}

export type InfakCategory = 'Masjid' | 'Pendidikan' | 'Sosial' | 'Sedekah' | 'Lainnya';

export interface InfakRecord {
  id: string;
  date: string;
  amount: number;
  category: InfakCategory;
  note?: string;
  createdAt: number;
}

export interface TasbihHistory {
  id: string;
  date: string;
  dzikirName: string;
  count: number;
  target: number;
  createdAt: number;
}

export interface Surah {
  number: number;
  name: string;
  latinName: string;
  translation: string;
  totalAyahs: number;
  type: 'Meccan' | 'Medinan';
}

export interface Ayah {
  number: number;
  text: string;
  translation: string;
  audioUrl?: string;
  surahNumber: number;
}

export interface QuranBookmark {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  text: string;
  createdAt: number;
}

export interface QuranLastRead {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  timestamp: number;
}

export interface DoaItem {
  id: string;
  category: 'pagi' | 'petang' | 'shalat' | 'harian';
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  source: string;
  repeat?: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  locationName: string;
  latitude: number;
  longitude: number;
  calculationMethod: 'KEMENAG' | 'MWL' | 'EGYPTIAN' | 'ISNA' | 'UMM_AL_QURA';
  quranFontSize: number;
  selectedQari: string;
  volume: number;
  autoPlayNextAyah: boolean;
  prayerNotifications: Record<PrayerName, boolean>;
}

export interface Mosque {
  id: string;
  name: string;
  distanceKm: number;
  lat: number;
  lng: number;
  address?: string;
}

export interface ActiveAudioTrack {
  type: 'quran' | 'radio' | 'surah';
  title: string;
  subtitle: string;
  audioUrl: string;
  isPlaying: boolean;
  surahNumber?: number;
  ayahNumber?: number;
  isFullSurah?: boolean;
}

export type MemorizationStatus = 'kuat' | 'sedang' | 'perlu_murajaah' | 'belum';

export interface SurahMemorizationRecord {
  id: string; // e.g. "mem_78" or "mem_78_1_10"
  surahNumber: number;
  startAyah: number;
  endAyah: number;
  status: MemorizationStatus;
  percentage: number;
  lastStudiedAt: number;
  nextMurajaahAt?: number;
  notes?: string;
}

export interface MurajaahScheduleItem {
  id: string;
  surahNumber: number;
  surahName: string;
  startAyah: number;
  endAyah: number;
  scheduledDate: string; // YYYY-MM-DD
  intervalDays: number;
  isCompleted: boolean;
  completedAt?: number;
  notes?: string;
}

export type QuranGameType = 'tebak_surah' | 'lanjutkan_ayat' | 'pilih_ayat' | 'susun_urutan' | 'audio_murajaah';

export interface QuranGameRecord {
  id: string;
  juzNumber: number;
  gameType: QuranGameType;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  xpEarned: number;
  timestamp: number;
}

export interface QuranJuzProgress {
  juzNumber: number;
  readPercentage: number;
  memorizationPercentage: number;
  audioPercentage: number;
  lastActiveAt: number;
}

export type QuranCenterTab =
  | 'hub'
  | 'juz_detail'
  | 'baca'
  | 'audio'
  | 'hifzh'
  | 'murajaah'
  | 'games'
  | 'journey'
  | 'progress';
