import { getDB } from '../db';
import { getLocalDateString } from '../dateService';
import type {
  SurahMemorizationRecord,
  MurajaahScheduleItem,
  QuranGameRecord,
  QuranJuzProgress,
  MemorizationStatus
} from '../../types';
import { JUZ_LIST } from '../../data/juzData';

const SELECTED_JUZ_KEY = 'siraj_selected_juz';

export const quranCenterRepository = {
  getSelectedJuz(): number {
    try {
      const saved = localStorage.getItem(SELECTED_JUZ_KEY);
      if (saved) {
        const num = parseInt(saved, 10);
        if (!isNaN(num) && num >= 1 && num <= 30) {
          return num;
        }
      }
    } catch {
      // ignore
    }
    return 30; // Default to Juz 30 ('Amma)
  },

  setSelectedJuz(juzNumber: number): void {
    if (juzNumber >= 1 && juzNumber <= 30) {
      try {
        localStorage.setItem(SELECTED_JUZ_KEY, juzNumber.toString());
      } catch {
        // ignore
      }
    }
  },

  async getAllMemorizationRecords(): Promise<SurahMemorizationRecord[]> {
    try {
      const db = await getDB();
      return await db.getAll('quran_memorization');
    } catch (e) {
      console.warn('Failed to load memorization records from DB, using fallback:', e);
      try {
        const raw = localStorage.getItem('siraj_memorization_records');
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
  },

  async getMemorizationRecord(surahNumber: number, startAyah?: number, endAyah?: number): Promise<SurahMemorizationRecord | null> {
    const id = startAyah !== undefined && endAyah !== undefined
      ? `mem_${surahNumber}_${startAyah}_${endAyah}`
      : `mem_${surahNumber}`;

    try {
      const db = await getDB();
      const rec = await db.get('quran_memorization', id);
      if (rec) return rec;

      // Fallback check by surah
      const all = await db.getAll('quran_memorization');
      return all.find(r => r.surahNumber === surahNumber) || null;
    } catch {
      return null;
    }
  },

  async saveMemorizationRecord(record: SurahMemorizationRecord): Promise<void> {
    try {
      const db = await getDB();
      await db.put('quran_memorization', record);
    } catch (e) {
      console.warn('Failed to save memorization record to DB:', e);
    }
    // Also mirror to localStorage for extra offline safety
    try {
      const all = await this.getAllMemorizationRecords();
      const idx = all.findIndex(r => r.id === record.id);
      if (idx >= 0) {
        all[idx] = record;
      } else {
        all.push(record);
      }
      localStorage.setItem('siraj_memorization_records', JSON.stringify(all));
    } catch {
      // ignore
    }
  },

  async updateSurahStatus(
    surahNumber: number,
    status: MemorizationStatus,
    percentage: number = 100,
    startAyah: number = 1,
    endAyah: number = 1
  ): Promise<SurahMemorizationRecord> {
    const id = `mem_${surahNumber}`;
    const record: SurahMemorizationRecord = {
      id,
      surahNumber,
      startAyah,
      endAyah,
      status,
      percentage,
      lastStudiedAt: Date.now()
    };
    await this.saveMemorizationRecord(record);
    return record;
  },

  // Murajaah Schedules
  async getAllMurajaahSchedules(): Promise<MurajaahScheduleItem[]> {
    try {
      const db = await getDB();
      const items = await db.getAll('quran_murajaah');
      return items || [];
    } catch (e) {
      console.warn('Failed to get murajaah items from DB:', e);
      try {
        const raw = localStorage.getItem('siraj_murajaah_schedules');
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
  },

  async saveMurajaahSchedule(item: MurajaahScheduleItem): Promise<void> {
    try {
      const db = await getDB();
      await db.put('quran_murajaah', item);
    } catch (e) {
      console.warn('Failed to save murajaah schedule to DB:', e);
    }
    try {
      const all = await this.getAllMurajaahSchedules();
      const idx = all.findIndex(s => s.id === item.id);
      if (idx >= 0) all[idx] = item;
      else all.push(item);
      localStorage.setItem('siraj_murajaah_schedules', JSON.stringify(all));
    } catch {
      // ignore
    }
  },

  async completeMurajaah(id: string, nextIntervalDays: number = 3): Promise<void> {
    const all = await this.getAllMurajaahSchedules();
    const item = all.find(i => i.id === id);
    if (!item) return;

    item.isCompleted = true;
    item.completedAt = Date.now();

    // Calculate next date
    const d = new Date();
    d.setDate(d.getDate() + nextIntervalDays);
    const nextDateStr = getLocalDateString(d);

    // Create next scheduled repetition
    const nextItem: MurajaahScheduleItem = {
      id: `mur_${item.surahNumber}_${Date.now()}`,
      surahNumber: item.surahNumber,
      surahName: item.surahName,
      startAyah: item.startAyah,
      endAyah: item.endAyah,
      scheduledDate: nextDateStr,
      intervalDays: nextIntervalDays,
      isCompleted: false
    };

    await this.saveMurajaahSchedule(item);
    await this.saveMurajaahSchedule(nextItem);
  },

  // Games & Quiz Stats
  async getAllGameRecords(): Promise<QuranGameRecord[]> {
    try {
      const db = await getDB();
      const records = await db.getAll('quran_game_stats');
      return (records || []).sort((a, b) => b.timestamp - a.timestamp);
    } catch (e) {
      console.warn('Failed to get game records from DB:', e);
      try {
        const raw = localStorage.getItem('siraj_quran_game_stats');
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
  },

  async saveGameRecord(record: QuranGameRecord): Promise<void> {
    try {
      const db = await getDB();
      await db.put('quran_game_stats', record);
    } catch (e) {
      console.warn('Failed to save game record to DB:', e);
    }
    try {
      const all = await this.getAllGameRecords();
      all.unshift(record);
      localStorage.setItem('siraj_quran_game_stats', JSON.stringify(all.slice(0, 100)));
    } catch {
      // ignore
    }
  },

  // Progress Aggregator
  async getJuzProgress(juzNumber: number): Promise<QuranJuzProgress> {
    try {
      const db = await getDB();
      const p = await db.get('quran_juz_progress', juzNumber);
      if (p) return p;
    } catch {
      // fallback
    }

    // Compute progress dynamically from surah memorization records
    const juzDef = JUZ_LIST.find(j => j.number === juzNumber);
    if (!juzDef) {
      return {
        juzNumber,
        readPercentage: 0,
        memorizationPercentage: 0,
        audioPercentage: 0,
        lastActiveAt: Date.now()
      };
    }

    const mems = await this.getAllMemorizationRecords();
    const surahMems = mems.filter(m => juzDef.surahNumbers.includes(m.surahNumber));
    let totalScore = 0;
    surahMems.forEach(m => {
      if (m.status === 'kuat') totalScore += 100;
      else if (m.status === 'sedang') totalScore += 65;
      else if (m.status === 'perlu_murajaah') totalScore += 35;
    });

    const memorizationPercentage = juzDef.surahNumbers.length > 0
      ? Math.min(100, Math.round(totalScore / juzDef.surahNumbers.length))
      : 0;

    return {
      juzNumber,
      readPercentage: memorizationPercentage > 0 ? Math.min(100, memorizationPercentage + 15) : 0,
      memorizationPercentage,
      audioPercentage: memorizationPercentage > 0 ? Math.min(100, memorizationPercentage + 10) : 0,
      lastActiveAt: Date.now()
    };
  },

  async getAllJuzProgress(): Promise<Record<number, QuranJuzProgress>> {
    const map: Record<number, QuranJuzProgress> = {};
    for (const juz of JUZ_LIST) {
      map[juz.number] = await this.getJuzProgress(juz.number);
    }
    return map;
  }
};
