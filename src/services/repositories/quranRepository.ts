import { getDB } from '../db';
import type { QuranBookmark, QuranLastRead } from '../../types';

export const quranRepository = {
  async addBookmark(item: Omit<QuranBookmark, 'id' | 'createdAt'>): Promise<QuranBookmark> {
    const id = `bm_${item.surahNumber}_${item.ayahNumber}`;
    const bookmark: QuranBookmark = {
      ...item,
      id,
      createdAt: Date.now()
    };
    try {
      const db = await getDB();
      await db.put('quran_bookmarks', bookmark);
    } catch (e) {
      console.warn('Failed to add Quran bookmark:', e);
    }
    return bookmark;
  },

  async removeBookmark(id: string): Promise<void> {
    try {
      const db = await getDB();
      await db.delete('quran_bookmarks', id);
    } catch (e) {
      console.warn('Failed to remove Quran bookmark:', e);
    }
  },

  async getBookmarks(): Promise<QuranBookmark[]> {
    try {
      const db = await getDB();
      const bookmarks = await db.getAll('quran_bookmarks');
      return (bookmarks || []).sort((a, b) => b.createdAt - a.createdAt);
    } catch (e) {
      console.warn('Failed to fetch Quran bookmarks:', e);
      return [];
    }
  },

  async isBookmarked(surahNumber: number, ayahNumber: number): Promise<boolean> {
    try {
      const db = await getDB();
      const id = `bm_${surahNumber}_${ayahNumber}`;
      const existing = await db.get('quran_bookmarks', id);
      return !!existing;
    } catch (e) {
      console.warn('Failed to check bookmark status:', e);
      return false;
    }
  },

  async saveLastRead(lastRead: QuranLastRead): Promise<void> {
    try {
      const db = await getDB();
      await db.put('quran_last_read', lastRead);
    } catch (e) {
      console.warn('Failed to save last read:', e);
    }
  },

  async getLastRead(): Promise<QuranLastRead | null> {
    try {
      const db = await getDB();
      const all = await db.getAll('quran_last_read');
      if (!all || all.length === 0) return null;
      return all.sort((a, b) => b.timestamp - a.timestamp)[0];
    } catch (e) {
      console.warn('Failed to fetch last read Quran status:', e);
      return null;
    }
  }
};
