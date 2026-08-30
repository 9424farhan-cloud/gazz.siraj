import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { PrayerLog, WorshipLog, InfakRecord, TasbihHistory, QuranBookmark, QuranLastRead } from '../types';

interface SirajDBSchema extends DBSchema {
  prayer_logs: {
    key: string;
    value: PrayerLog;
  };
  worship_logs: {
    key: string;
    value: WorshipLog;
    indexes: { 'by-date': string };
  };
  infak_records: {
    key: string;
    value: InfakRecord;
    indexes: { 'by-date': string };
  };
  tasbih_history: {
    key: string;
    value: TasbihHistory;
    indexes: { 'by-date': string };
  };
  quran_bookmarks: {
    key: string;
    value: QuranBookmark;
  };
  quran_last_read: {
    key: number;
    value: QuranLastRead;
  };
  doa_bookmarks: {
    key: string;
    value: { doaId: string; timestamp: number };
  };
  settings: {
    key: string;
    value: { key: string; value: any };
  };
}

const DB_NAME = 'SIRAJ_DB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<SirajDBSchema>> | null = null;

export const getDB = (): Promise<IDBPDatabase<SirajDBSchema>> => {
  if (!dbPromise) {
    const openPromise = openDB<SirajDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion) {
        console.log(`Upgrading IndexedDB from version ${oldVersion} to ${newVersion}`);
        
        if (!db.objectStoreNames.contains('prayer_logs')) {
          db.createObjectStore('prayer_logs', { keyPath: 'date' });
        }

        if (!db.objectStoreNames.contains('worship_logs')) {
          const worshipStore = db.createObjectStore('worship_logs', { keyPath: 'id' });
          worshipStore.createIndex('by-date', 'date');
        }

        if (!db.objectStoreNames.contains('infak_records')) {
          const infakStore = db.createObjectStore('infak_records', { keyPath: 'id' });
          infakStore.createIndex('by-date', 'date');
        }

        if (!db.objectStoreNames.contains('tasbih_history')) {
          const tasbihStore = db.createObjectStore('tasbih_history', { keyPath: 'id' });
          tasbihStore.createIndex('by-date', 'date');
        }

        if (!db.objectStoreNames.contains('quran_bookmarks')) {
          db.createObjectStore('quran_bookmarks', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('quran_last_read')) {
          db.createObjectStore('quran_last_read', { keyPath: 'surahNumber' });
        }

        if (!db.objectStoreNames.contains('doa_bookmarks')) {
          db.createObjectStore('doa_bookmarks', { keyPath: 'doaId' });
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('IndexedDB opening timed out')), 1500);
    });

    dbPromise = Promise.race([openPromise, timeoutPromise]).catch(err => {
      console.warn('Failed to open IndexedDB (reverting to fallback):', err);
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
};
