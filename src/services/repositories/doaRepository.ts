import { getDB } from '../db';

export const doaRepository = {
  async toggleBookmark(doaId: string): Promise<boolean> {
    try {
      const db = await getDB();
      const existing = await db.get('doa_bookmarks', doaId);
      if (existing) {
        await db.delete('doa_bookmarks', doaId);
        return false;
      } else {
        await db.put('doa_bookmarks', { doaId, timestamp: Date.now() });
        return true;
      }
    } catch (e) {
      console.warn('Failed to toggle doa bookmark in IndexedDB:', e);
      return false;
    }
  },

  async getBookmarks(): Promise<string[]> {
    try {
      const db = await getDB();
      const items = await db.getAll('doa_bookmarks');
      return (items || []).map(i => i.doaId);
    } catch (e) {
      console.warn('Failed to fetch doa bookmarks from IndexedDB:', e);
      return [];
    }
  }
};
