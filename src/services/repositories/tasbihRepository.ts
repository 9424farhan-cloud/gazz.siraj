import { getDB } from '../db';
import type { TasbihHistory } from '../../types';

export const tasbihRepository = {
  async saveSession(item: Omit<TasbihHistory, 'id' | 'createdAt'>): Promise<TasbihHistory> {
    const history: TasbihHistory = {
      ...item,
      id: `tasbih_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now()
    };
    try {
      const db = await getDB();
      await db.put('tasbih_history', history);
    } catch (e) {
      console.warn('Failed to save tasbih session to IndexedDB:', e);
    }
    return history;
  },

  async getAllHistory(): Promise<TasbihHistory[]> {
    try {
      const db = await getDB();
      const records = await db.getAll('tasbih_history');
      return (records || []).sort((a, b) => b.createdAt - a.createdAt);
    } catch (e) {
      console.warn('Failed to fetch tasbih history from IndexedDB:', e);
      return [];
    }
  }
};
