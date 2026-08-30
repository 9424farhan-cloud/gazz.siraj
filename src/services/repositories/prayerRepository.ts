import { getDB } from '../db';
import type { PrayerLog } from '../../types';

export const prayerRepository = {
  async getPrayerLog(date: string): Promise<PrayerLog> {
    try {
      const db = await getDB();
      const log = await db.get('prayer_logs', date);
      if (log) return log;
    } catch (e) {
      console.warn(`Failed to fetch prayer log for ${date}:`, e);
    }
    
    return {
      date,
      subuh: false,
      dzuhur: false,
      ashar: false,
      maghrib: false,
      isya: false
    };
  },

  async savePrayerLog(log: PrayerLog): Promise<void> {
    try {
      const db = await getDB();
      await db.put('prayer_logs', log);
    } catch (e) {
      console.warn('Failed to save prayer log:', e);
    }
  },

  async togglePrayer(date: string, prayerName: keyof Omit<PrayerLog, 'date'>): Promise<PrayerLog> {
    const log = await this.getPrayerLog(date);
    log[prayerName] = !log[prayerName];
    await this.savePrayerLog(log);
    return log;
  },

  async getAllLogs(): Promise<PrayerLog[]> {
    try {
      const db = await getDB();
      return (await db.getAll('prayer_logs')) || [];
    } catch (e) {
      console.warn('Failed to fetch all prayer logs:', e);
      return [];
    }
  }
};
