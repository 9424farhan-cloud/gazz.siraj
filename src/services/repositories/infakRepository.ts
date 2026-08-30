import { getDB } from '../db';
import type { InfakRecord } from '../../types';

export const infakRepository = {
  async addRecord(item: Omit<InfakRecord, 'id' | 'createdAt'>): Promise<InfakRecord> {
    const record: InfakRecord = {
      ...item,
      id: `infak_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now()
    };
    try {
      const db = await getDB();
      await db.put('infak_records', record);
    } catch (e) {
      console.warn('Failed to add infak record to IndexedDB:', e);
    }
    return record;
  },

  async getAllRecords(): Promise<InfakRecord[]> {
    try {
      const db = await getDB();
      const records = await db.getAll('infak_records');
      return (records || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (e) {
      console.warn('Failed to fetch infak records from IndexedDB:', e);
      return [];
    }
  },

  async getInfakRecords(): Promise<InfakRecord[]> {
    return this.getAllRecords();
  },

  async deleteRecord(id: string): Promise<void> {
    try {
      const db = await getDB();
      await db.delete('infak_records', id);
    } catch (e) {
      console.warn('Failed to delete infak record from IndexedDB:', e);
    }
  },

  async deleteInfakRecord(id: string): Promise<void> {
    return this.deleteRecord(id);
  },

  async addInfakRecord(record: InfakRecord): Promise<InfakRecord> {
    try {
      const db = await getDB();
      await db.put('infak_records', record);
    } catch (e) {
      console.warn('Failed to save infak record:', e);
    }
    return record;
  },

  async getSummary() {
    const records = await this.getAllRecords();
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    let total = 0;
    let thisMonth = 0;
    const byCategory: Record<string, number> = {
      Masjid: 0,
      Pendidikan: 0,
      Sosial: 0,
      Sedekah: 0,
      Lainnya: 0
    };

    records.forEach(r => {
      total += r.amount;
      if (r.date.startsWith(currentMonthStr)) {
        thisMonth += r.amount;
      }
      if (byCategory[r.category] !== undefined) {
        byCategory[r.category] += r.amount;
      } else {
        byCategory[r.category] = r.amount;
      }
    });

    return { total, thisMonth, byCategory, count: records.length };
  }
};
