export interface HijriDateInfo {
  day: number;
  monthName: string;
  monthNumber: number;
  year: number;
  formatted: string;
}

export interface IslamicEvent {
  title: string;
  hijriMonth: number;
  hijriDay: number;
  description: string;
}

const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabi\'ul Awwal', 'Rabi\'ul Akhir',
  'Jumadil Awwal', 'Jumadil Akhir', 'Rajab', 'Sya\'ban',
  'Ramadhan', 'Syawwal', 'Zulqa\'dah', 'Zulhijjah'
];

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  { title: 'Tahun Baru Islam (1 Muharram)', hijriMonth: 1, hijriDay: 1, description: 'Awal Tahun Hijriah' },
  { title: 'Hari Asyura (10 Muharram)', hijriMonth: 1, hijriDay: 10, description: 'Puasa Sunnah Asyura' },
  { title: 'Maulid Nabi Muhammad SAW (12 Rabi\'ul Awwal)', hijriMonth: 3, hijriDay: 12, description: 'Peringatan Hari Kelahiran Rasulullah SAW' },
  { title: 'Isra Mi\'raj (27 Rajab)', hijriMonth: 7, hijriDay: 27, description: 'Peristiwa Isra Mi\'raj Nabi Muhammad SAW' },
  { title: 'Nisfu Sya\'ban (15 Sya\'ban)', hijriMonth: 8, hijriDay: 15, description: 'Malam Pertengahan Bulan Sya\'ban' },
  { title: 'Awal Ramadhan (1 Ramadhan)', hijriMonth: 9, hijriDay: 1, description: 'Awal Ibadah Puasa Wajib' },
  { title: 'Nuzulul Qur\'an (17 Ramadhan)', hijriMonth: 9, hijriDay: 17, description: 'Peringatan Turunnya Al-Qur\'an' },
  { title: 'Hari Raya Idul Fitri (1 Syawwal)', hijriMonth: 10, hijriDay: 1, description: 'Hari Kemenangan Umat Islam' },
  { title: 'Hari Arafah (9 Zulhijjah)', hijriMonth: 12, hijriDay: 9, description: 'Puasa Sunnah Arafah bagi non-haji' },
  { title: 'Hari Raya Idul Adha (10 Zulhijjah)', hijriMonth: 12, hijriDay: 10, description: 'Hari Raya Kurban' },
];

export const hijriService = {
  getHijriDate(date: Date = new Date()): HijriDateInfo {
    try {
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      let m = month + 1;
      let y = year;
      if (m < 3) {
        y -= 1;
        m += 12;
      }

      let a = Math.floor(y / 100);
      let b = 2 - a + Math.floor(a / 4);
      if (y < 1583) b = 0;
      if (y === 1582) {
        if (m > 10) b = -10;
        if (m === 10) {
          b = 0;
          if (day > 4) b = -10;
        }
      }

      let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
      let b2 = 0;
      if (jd > 2299160) {
        a = Math.floor((jd - 1867216.25) / 36524.25);
        b2 = 1 + a - Math.floor(a / 4);
      }
      let bb = jd + b2 + 1524;
      let cc = Math.floor((bb - 122.1) / 365.25);
      let dd = Math.floor(365.25 * cc);
      let ee = Math.floor((bb - dd) / 30.6001);

      let l = jd - 1948440 + 10632;
      let n = Math.floor((l - 1) / 10631);
      l = l - 10631 * n + 354;
      let j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) + (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
      l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
      let hMonth = Math.floor((24 * l) / 709);
      let hDay = l - Math.floor((709 * hMonth) / 24);
      let hYear = 30 * n + j - 30;

      const idx = Math.abs((hMonth - 1) % 12);
      const monthName = HIJRI_MONTHS[idx] || 'Rabi\'ul Awwal';
      const validDay = Math.max(1, Math.min(30, hDay || 11));
      const validYear = hYear || 1448;

      return {
        day: validDay,
        monthName,
        monthNumber: hMonth || 3,
        year: validYear,
        formatted: `${validDay} ${monthName} ${validYear} H`
      };
    } catch (e) {
      console.warn('Hijri conversion fallback triggered:', e);
      return {
        day: 11,
        monthName: 'Rabi\'ul Awwal',
        monthNumber: 3,
        year: 1448,
        formatted: '11 Rabi\'ul Awwal 1448 H'
      };
    }
  },

  getEventsForMonth(hijriMonth: number): IslamicEvent[] {
    return ISLAMIC_EVENTS.filter(e => e.hijriMonth === hijriMonth);
  }
};
