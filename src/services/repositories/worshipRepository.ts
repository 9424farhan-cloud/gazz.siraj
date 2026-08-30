import { getDB } from '../db';
import type { WorshipLog, WorshipType, WorshipTarget } from '../../types';

export const DEFAULT_WORSHIP_TARGETS: WorshipTarget[] = [
  { type: 'tilawah', title: 'Tilawah Al-Qur\'an', target: 5, unit: 'Halaman', icon: '📖' },
  { type: 'dzikir', title: 'Dzikir Pagi & Petang', target: 2, unit: 'Sesi', icon: '🤲' },
  { type: 'murajaah', title: 'Murajaah Hafalan', target: 1, unit: 'Juz / Surah', icon: '📚' },
  { type: 'tasbih', title: 'Tasbih & Istighfar', target: 100, unit: 'Kali', icon: '📿' },
  { type: 'witir', title: 'Shalat Witir', target: 3, unit: 'Rakaat', icon: '🌙' },
];

export const worshipRepository = {
  async getWorshipLogsForDate(date: string): Promise<WorshipLog[]> {
    let all: any[] = [];
    try {
      const db = await getDB();
      all = (await db.getAllFromIndex('worship_logs', 'by-date', date)) || [];
    } catch (e) {
      console.warn(`Failed to fetch worship logs for ${date}:`, e);
    }
    
    return DEFAULT_WORSHIP_TARGETS.map(target => {
      const existing = all.find((item: any) => item.type === target.type);
      if (existing) return existing;
      return {
        id: `${date}_${target.type}`,
        date,
        type: target.type,
        count: 0,
        target: target.target,
        completed: false
      } as any;
    });
  },

  async saveWorshipLog(log: WorshipLog): Promise<void> {
    try {
      const db = await getDB();
      await db.put('worship_logs', {
        id: `${log.date}_${log.type}`,
        ...log
      } as any);
    } catch (e) {
      console.warn('Failed to save worship log:', e);
    }
  },

  async incrementWorship(date: string, type: WorshipType, delta: number = 1): Promise<WorshipLog> {
    const logs = await this.getWorshipLogsForDate(date);
    const item = logs.find(l => l.type === type) || {
      date,
      type,
      count: 0,
      target: DEFAULT_WORSHIP_TARGETS.find(t => t.type === type)?.target || 1,
      completed: false
    };

    item.count = Math.max(0, item.count + delta);
    item.completed = item.count >= item.target;
    await this.saveWorshipLog(item);
    return item;
  },

  async updateTarget(type: WorshipType, newTarget: number): Promise<void> {
    const targetObj = DEFAULT_WORSHIP_TARGETS.find(t => t.type === type);
    if (targetObj) {
      targetObj.target = newTarget;
    }
  },

  async getAllLogs(): Promise<WorshipLog[]> {
    try {
      const db = await getDB();
      return (await db.getAll('worship_logs')) || [];
    } catch (e) {
      console.warn('Failed to get all worship logs:', e);
      return [];
    }
  }
};
