import { getDB } from './db';
import { getLocalDateString } from './dateService';
import { prayerRepository } from './repositories/prayerRepository';
import { worshipRepository } from './repositories/worshipRepository';
import { infakRepository } from './repositories/infakRepository';
import { tasbihRepository } from './repositories/tasbihRepository';
import { quranRepository } from './repositories/quranRepository';
import { settingsRepository } from './repositories/settingsRepository';

export interface SirajBackupData {
  app: 'SIRAJ';
  version: '1.0';
  exportedAt: string;
  prayer_logs: any[];
  worship_logs: any[];
  infak_records: any[];
  tasbih_history: any[];
  quran_bookmarks: any[];
  quran_last_read: any[];
  settings: Record<string, any>;
}

export const backupService = {
  async exportDataJSON(): Promise<string> {
    const prayerLogs = await prayerRepository.getAllLogs();
    const worshipLogs = await worshipRepository.getAllLogs();
    const infakRecords = await infakRepository.getAllRecords();
    const tasbihHistory = await tasbihRepository.getAllHistory();
    const quranBookmarks = await quranRepository.getBookmarks();
    const quranLastRead = await quranRepository.getLastRead();
    const settings = await settingsRepository.getSettings();

    const backupObj: SirajBackupData = {
      app: 'SIRAJ',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      prayer_logs: prayerLogs,
      worship_logs: worshipLogs,
      infak_records: infakRecords,
      tasbih_history: tasbihHistory,
      quran_bookmarks: quranBookmarks,
      quran_last_read: quranLastRead ? [quranLastRead] : [],
      settings
    };

    return JSON.stringify(backupObj, null, 2);
  },

  downloadJSONFile(jsonStr: string) {
    const dateStr = getLocalDateString();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SIRAJ_Backup_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  validateJSON(jsonStr: string): { valid: boolean; data?: SirajBackupData; error?: string } {
    try {
      const data = JSON.parse(jsonStr);
      if (!data || typeof data !== 'object') {
        return { valid: false, error: 'Format file JSON tidak valid.' };
      }
      if (data.app !== 'SIRAJ') {
        return { valid: false, error: 'File ini bukan file backup resmi dari aplikasi SIRAJ.' };
      }
      return { valid: true, data };
    } catch (e) {
      return { valid: false, error: 'Gagal membaca file JSON. Pastikan file tidak rusak.' };
    }
  },

  async restoreData(data: SirajBackupData): Promise<void> {
    const db = await getDB();

    if (Array.isArray(data.prayer_logs)) {
      for (const item of data.prayer_logs) {
        await db.put('prayer_logs', item);
      }
    }

    if (Array.isArray(data.worship_logs)) {
      for (const item of data.worship_logs) {
        await db.put('worship_logs', item);
      }
    }

    if (Array.isArray(data.infak_records)) {
      for (const item of data.infak_records) {
        await db.put('infak_records', item);
      }
    }

    if (Array.isArray(data.tasbih_history)) {
      for (const item of data.tasbih_history) {
        await db.put('tasbih_history', item);
      }
    }

    if (Array.isArray(data.quran_bookmarks)) {
      for (const item of data.quran_bookmarks) {
        await db.put('quran_bookmarks', item);
      }
    }

    if (Array.isArray(data.quran_last_read) && data.quran_last_read.length > 0) {
      await db.put('quran_last_read', data.quran_last_read[0]);
    }

    if (data.settings) {
      await settingsRepository.saveSettings(data.settings as any);
    }
  },

  async clearAllData(): Promise<void> {
    const db = await getDB();
    await db.clear('prayer_logs');
    await db.clear('worship_logs');
    await db.clear('infak_records');
    await db.clear('tasbih_history');
    await db.clear('quran_bookmarks');
    await db.clear('quran_last_read');
    await db.clear('doa_bookmarks');
    await db.clear('settings');
    localStorage.clear();
  }
};
