import { getDB } from '../db';
import type { AppSettings } from '../../types';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  locationName: 'Jakarta (DKI Jakarta)',
  latitude: -6.2088,
  longitude: 106.8456,
  calculationMethod: 'KEMENAG',
  quranFontSize: 28,
  selectedQari: 'ar.alafasy',
  volume: 0.8,
  autoPlayNextAyah: true,
  prayerNotifications: {
    subuh: true,
    dzuhur: true,
    ashar: true,
    maghrib: true,
    isya: true
  }
};

export const settingsRepository = {
  async getSettings(): Promise<AppSettings> {
    try {
      const db = await getDB();
      const all = await db.getAll('settings');
      const settings = { ...DEFAULT_SETTINGS };

      if (Array.isArray(all)) {
        all.forEach(item => {
          if (item && item.key) {
            (settings as any)[item.key] = item.value;
          }
        });
      }

      return settings;
    } catch (e) {
      console.warn('Failed to load settings from IndexedDB, returning defaults:', e);
      return { ...DEFAULT_SETTINGS };
    }
  },

  async updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): Promise<void> {
    try {
      const db = await getDB();
      await db.put('settings', { key, value });
    } catch (e) {
      console.warn(`Failed to update setting ${key} in IndexedDB:`, e);
    }
  },

  async saveSettings(newSettings: AppSettings): Promise<void> {
    try {
      const db = await getDB();
      for (const [key, value] of Object.entries(newSettings)) {
        await db.put('settings', { key, value });
      }
    } catch (e) {
      console.warn('Failed to save settings to IndexedDB:', e);
    }
  }
};
