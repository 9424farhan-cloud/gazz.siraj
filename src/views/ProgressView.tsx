import React, { useEffect, useState } from 'react';
import { prayerRepository } from '../services/repositories/prayerRepository';
import { worshipRepository } from '../services/repositories/worshipRepository';
import { dateService, getLocalDateString } from '../services/dateService';
import { BarChart3, Flame, Calendar, Award, TrendingUp } from 'lucide-react';

export const ProgressView: React.FC = () => {
  const [totalTrackedDays, setTotalTrackedDays] = useState<number>(1);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [bestStreakDays, setBestStreakDays] = useState<number>(0);
  const [prayerConsistency, setPrayerConsistency] = useState<number>(0);
  const [chartData, setChartData] = useState<{ day: string; shalat: number }[]>([]);

  useEffect(() => {
    loadProgressData();
    const unsubscribeReset = dateService.subscribe(() => {
      loadProgressData();
    });
    return () => unsubscribeReset();
  }, []);

  const loadProgressData = async () => {
    try {
      const prayerLogs = (await prayerRepository.getAllLogs()) || [];

      setTotalTrackedDays(Math.max(1, prayerLogs.length));

      let totalChecked = 0;
      prayerLogs.forEach(l => {
        if (l.subuh) totalChecked++;
        if (l.dzuhur) totalChecked++;
        if (l.ashar) totalChecked++;
        if (l.maghrib) totalChecked++;
        if (l.isya) totalChecked++;
      });

      const maxPossible = Math.max(1, prayerLogs.length * 5);
      const consistency = Math.round((totalChecked / maxPossible) * 100);
      setPrayerConsistency(consistency);

      const completedDaysCount = prayerLogs.filter(l => l.subuh || l.dzuhur || l.ashar || l.maghrib || l.isya).length;
      setStreakDays(completedDaysCount);
      setBestStreakDays(completedDaysCount);

      const last7Days: { day: string; shalat: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = getLocalDateString(d);
        const dayLabel = d.toLocaleDateString('id-ID', { weekday: 'short' });

        const log = prayerLogs.find(l => l.date === dateStr);
        const count = log ? [log.subuh, log.dzuhur, log.ashar, log.maghrib, log.isya].filter(Boolean).length : 0;

        last7Days.push({
          day: dayLabel,
          shalat: count
        });
      }

      setChartData(last7Days);
    } catch (e) {
      console.warn('Failed to load progress data:', e);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-soft">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Statistik Perkembangan Ibadah</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Grafik Konsistensi & Streak
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Analisis langsung hasil catatan ibadah harian anda dari IndexedDB
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-3xl p-5 border border-slate-200/60 dark:border-slate-800/60 shadow-soft">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3 font-bold">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase">Streak Saat Ini</p>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{streakDays} Hari</h3>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-slate-200/60 dark:border-slate-800/60 shadow-soft">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 font-bold">
            <Award className="w-5 h-5" />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase">Streak Terbaik</p>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{bestStreakDays} Hari</h3>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-slate-200/60 dark:border-slate-800/60 shadow-soft">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center mb-3 font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase">Konsistensi Shalat</p>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{prayerConsistency}%</h3>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-slate-200/60 dark:border-slate-800/60 shadow-soft">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3 font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase">Total Hari Dicatat</p>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{totalTrackedDays} Hari</h3>
        </div>
      </div>

      {/* 7 Days SVG Native Bar Chart */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-soft">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Grafik Shalat 7 Hari Terakhir</h3>
        <div className="h-64 w-full flex items-end justify-between gap-2 pt-8 pb-4 px-2 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/60">
          {chartData.map((item, idx) => {
            const heightPercent = Math.max(12, (item.shalat / 5) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 opacity-80 group-hover:opacity-100 transition">
                  {item.shalat}/5
                </span>
                <div
                  className="w-full max-w-[36px] bg-gradient-to-t from-emerald-700 to-emerald-400 rounded-2xl transition-all duration-500 shadow-md group-hover:scale-105"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-xs font-semibold text-slate-400 mt-1">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
