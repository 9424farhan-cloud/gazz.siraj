/**
 * Service untuk menangani kalkulasi waktu dan auto-reset harian (setiap 24 jam tepat pukul 00:00 waktu lokal).
 */

export const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getFormattedMasehiDate = (date: Date = new Date()): string => {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const getMsUntilNextMidnight = (): number => {
  const now = new Date();
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    150 // +150ms agar pasti sudah melewati 00:00
  );
  return Math.max(1000, nextMidnight.getTime() - now.getTime());
};

type DailyResetListener = (newDateStr: string) => void;

class DailyResetManager {
  private listeners: Set<DailyResetListener> = new Set();
  private lastKnownDate: string = getLocalDateString();
  private midnightTimer: any = null;
  private heartbeatInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.scheduleNextMidnight();

      // Cek ketika user kembali ke tab browser atau membuka kunci HP
      window.addEventListener('focus', () => this.checkDateChange());
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.checkDateChange();
        }
      });

      // Heartbeat berkala setiap 30 detik untuk memastikan timer tidak tertunda saat sleep
      this.heartbeatInterval = setInterval(() => this.checkDateChange(), 30000);
    }
  }

  private scheduleNextMidnight() {
    if (this.midnightTimer) {
      clearTimeout(this.midnightTimer);
    }

    const ms = getMsUntilNextMidnight();
    this.midnightTimer = setTimeout(() => {
      this.checkDateChange();
      this.scheduleNextMidnight();
    }, ms);
  }

  public checkDateChange() {
    const currentDate = getLocalDateString();
    if (currentDate !== this.lastKnownDate) {
      console.info(`[SIRAJ] 🌙 Pergantian hari 00:00 terdeteksi: ${this.lastKnownDate} -> ${currentDate}. Melakukan reset target harian.`);
      this.lastKnownDate = currentDate;
      this.listeners.forEach(callback => {
        try {
          callback(currentDate);
        } catch (err) {
          console.error('[SIRAJ] Error in daily reset listener:', err);
        }
      });
      this.scheduleNextMidnight();
    }
  }

  public subscribe(callback: DailyResetListener): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public getCurrentDate(): string {
    return this.lastKnownDate;
  }
}

export const dateService = new DailyResetManager();
