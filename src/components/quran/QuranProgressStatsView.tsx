import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Sparkles,
  ChevronLeft,
  BookOpen,
  Headphones,
  Brain,
  RotateCcw,
  CheckCircle2,
  Award
} from 'lucide-react';
import type { JuzDefinition } from '../../data/juzData';
import { quranCenterRepository } from '../../services/repositories/quranCenterRepository';
import { quranService } from '../../services/quranService';
import type { QuranJuzProgress, SurahMemorizationRecord, MurajaahScheduleItem, QuranGameRecord } from '../../types';

interface QuranProgressStatsViewProps {
  currentJuz: JuzDefinition;
  juzProgress: QuranJuzProgress;
  onBackToHub: () => void;
  onOpenJuzModal: () => void;
}

export const QuranProgressStatsView: React.FC<QuranProgressStatsViewProps> = ({
  currentJuz,
  juzProgress,
  onBackToHub,
  onOpenJuzModal
}) => {
  const [memorizationRecords, setMemorizationRecords] = useState<SurahMemorizationRecord[]>([]);
  const [murajaahList, setMurajaahList] = useState<MurajaahScheduleItem[]>([]);
  const [gameRecords, setGameRecords] = useState<QuranGameRecord[]>([]);

  useEffect(() => {
    quranCenterRepository.getAllMemorizationRecords().then(setMemorizationRecords);
    quranCenterRepository.getAllMurajaahSchedules().then(setMurajaahList);
    quranCenterRepository.getAllGameRecords().then(setGameRecords);
  }, []);

  const totalSurahsLearned = memorizationRecords.filter(m => m.status !== 'belum').length;
  const completedMurajaahSessions = murajaahList.filter(m => m.isCompleted).length;
  const totalHifzhSessions = gameRecords.length;

  let totalAyahsLearned = 0;
  memorizationRecords.forEach(m => {
    const s = quranService.getSurahByNumber(m.surahNumber);
    if (s && m.status !== 'belum') {
      totalAyahsLearned += Math.max(1, (m.endAyah - m.startAyah + 1));
    }
  });

  const hifzhPct = juzProgress.memorizationPercentage || 0;
  const murajaahPct = Math.min(100, Math.round((completedMurajaahSessions / Math.max(1, murajaahList.length)) * 100)) || (hifzhPct > 0 ? Math.max(20, hifzhPct - 15) : 0);
  const audioPct = juzProgress.audioPercentage || (hifzhPct > 0 ? Math.min(100, hifzhPct + 10) : 0);
  const totalJuzPct = Math.round((hifzhPct + murajaahPct + audioPct) / 3);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#282552]/40">
        <button
          onClick={onBackToHub}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141638] hover:bg-[#1e204a] text-purple-200 text-xs font-semibold border border-purple-500/30 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Qur'an Center</span>
        </button>

        <button
          onClick={onOpenJuzModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 transition"
        >
          <span>Ganti Juz ({currentJuz.name})</span>
        </button>
      </div>

      {/* Hero Stats Card */}
      <div className="cosmic-card-glow p-6 sm:p-8 rounded-3xl border border-purple-500/40 bg-gradient-to-br from-[#121438] to-[#090a1f] shadow-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 text-amber-300 text-xs font-semibold border border-purple-500/30">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Statistik & Kemajuan Belajar</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white font-serif">
          📖 QUR'AN PROGRESS ({currentJuz.name})
        </h2>
        <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed max-w-2xl">
          Pantau konsistensi tilawah, audio listening, hafalan mandiri, dan sesi murajaah berkala untuk memperkuat interaksi harian Anda dengan kalamullah.
        </p>
      </div>

      {/* Global Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        <div className="cosmic-card p-4 rounded-2xl border border-[#282552]/70 text-center">
          <span className="text-[11px] text-purple-300/70 block uppercase font-bold">Surah Dipelajari</span>
          <span className="text-2xl sm:text-3xl font-black text-white font-mono my-1 block">
            {totalSurahsLearned}
          </span>
          <span className="text-[10px] text-purple-300/50">dari 114 Surah</span>
        </div>

        <div className="cosmic-card p-4 rounded-2xl border border-[#282552]/70 text-center">
          <span className="text-[11px] text-purple-300/70 block uppercase font-bold">Ayat Dipelajari</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono my-1 block">
            {totalAyahsLearned}
          </span>
          <span className="text-[10px] text-purple-300/50">Ayat Al-Qur'an</span>
        </div>

        <div className="cosmic-card p-4 rounded-2xl border border-[#282552]/70 text-center">
          <span className="text-[11px] text-purple-300/70 block uppercase font-bold">Sesi Murajaah</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono my-1 block">
            {completedMurajaahSessions}
          </span>
          <span className="text-[10px] text-purple-300/50">Selesai Ditinjau</span>
        </div>

        <div className="cosmic-card p-4 rounded-2xl border border-[#282552]/70 text-center">
          <span className="text-[11px] text-purple-300/70 block uppercase font-bold">Latihan Hifzh/Game</span>
          <span className="text-2xl sm:text-3xl font-black text-sky-400 font-mono my-1 block">
            {totalHifzhSessions}
          </span>
          <span className="text-[10px] text-purple-300/50">Sesi Latihan</span>
        </div>

        <div className="cosmic-card p-4 rounded-2xl border border-[#282552]/70 text-center">
          <span className="text-[11px] text-purple-300/70 block uppercase font-bold">Juz Aktif</span>
          <span className="text-2xl sm:text-3xl font-black text-purple-300 font-mono my-1 block">
            Juz {currentJuz.number}
          </span>
          <span className="text-[10px] text-purple-300/50">{currentJuz.totalSurahs} Surah</span>
        </div>

        <div className="cosmic-card p-4 rounded-2xl border border-[#282552]/70 text-center">
          <span className="text-[11px] text-purple-300/70 block uppercase font-bold">Rata-rata Akurasi</span>
          <span className="text-2xl sm:text-3xl font-black text-yellow-300 font-mono my-1 block">
            {hifzhPct}%
          </span>
          <span className="text-[10px] text-purple-300/50">Evaluasi Mandiri</span>
        </div>
      </div>

      {/* Detailed Progress Bars for Current Juz */}
      <div className="cosmic-card p-6 sm:p-7 rounded-3xl border border-purple-500/40 space-y-5">
        <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Indikator Kemajuan: {currentJuz.name}</span>
        </h3>

        {/* Total Juz Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-purple-200">
            <span className="font-bold text-white">Total {currentJuz.name}</span>
            <span className="font-bold text-amber-300 font-mono">{totalJuzPct}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-amber-400 transition-all duration-500"
              style={{ width: `${totalJuzPct}%` }}
            />
          </div>
        </div>

        {/* Hifzh Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-purple-200">
            <span className="flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hifzh (Hafalan)</span>
            </span>
            <span className="font-bold text-emerald-400 font-mono">{hifzhPct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${hifzhPct}%` }}
            />
          </div>
        </div>

        {/* Murajaah Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-purple-200">
            <span className="flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Murajaah Berkala</span>
            </span>
            <span className="font-bold text-amber-300 font-mono">{murajaahPct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
              style={{ width: `${murajaahPct}%` }}
            />
          </div>
        </div>

        {/* Audio Listening Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-purple-200">
            <span className="flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-pink-400" />
              <span>Audio Murottal</span>
            </span>
            <span className="font-bold text-pink-400 font-mono">{audioPct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
              style={{ width: `${audioPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
