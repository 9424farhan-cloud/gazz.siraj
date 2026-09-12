import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronLeft,
  Star,
  Repeat,
  Compass,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { JUZ_LIST } from '../../data/juzData';
import type { JuzDefinition } from '../../data/juzData';
import { quranCenterRepository } from '../../services/repositories/quranCenterRepository';
import { quranService } from '../../services/quranService';
import type { QuranJuzProgress, SurahMemorizationRecord } from '../../types';

interface QuranJourneyViewProps {
  currentJuz: JuzDefinition;
  onSelectJuz: (juzNumber: number) => void;
  onBackToHub: () => void;
}

export const QuranJourneyView: React.FC<QuranJourneyViewProps> = ({
  currentJuz,
  onSelectJuz,
  onBackToHub
}) => {
  const [progressMap, setProgressMap] = useState<Record<number, QuranJuzProgress>>({});
  const [memorizationMap, setMemorizationMap] = useState<Record<number, SurahMemorizationRecord>>({});
  const [selectedConstellation, setSelectedConstellation] = useState<JuzDefinition>(currentJuz);

  useEffect(() => {
    quranCenterRepository.getAllJuzProgress().then(setProgressMap);
    quranCenterRepository.getAllMemorizationRecords().then(records => {
      const map: Record<number, SurahMemorizationRecord> = {};
      records.forEach(r => { map[r.surahNumber] = r; });
      setMemorizationMap(map);
    });
  }, []);

  const totalCompletedJuz = Object.values(progressMap).filter(p => p.memorizationPercentage >= 100).length;
  const inProgressJuz = Object.values(progressMap).filter(p => p.memorizationPercentage > 0 && p.memorizationPercentage < 100).length;

  const surahsOfSelected = quranService.getSurahsForJuz(selectedConstellation.number);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#282552]/40">
        <button
          onClick={onBackToHub}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141638] hover:bg-[#1e204a] text-purple-200 text-xs font-semibold border border-purple-500/30 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Qur'an Center</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-purple-300/80">
          <span>Juz Terpilih:</span>
          <strong className="text-amber-300">{currentJuz.name}</strong>
        </div>
      </div>

      {/* Hero Cosmic Journey Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 cosmic-card border border-purple-500/40 bg-gradient-to-br from-[#0c0e27] via-[#080918] to-[#04050d] shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cosmic Spiritual Odyssey</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white font-serif tracking-tight">
              🌌 QUR'AN JOURNEY
            </h2>

            <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
              Jelajahi 30 konstelasi bintang Al-Qur'an. Setiap surah yang Anda pelajari, dengarkan, dan hafalkan akan menyalakan gugusan bintang di galaksi pribadi Anda.
            </p>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-[#121438]/80 border border-[#282552] text-center min-w-[110px]">
              <span className="text-[10px] text-purple-300/70 block uppercase font-bold">Juz Khatam</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">{totalCompletedJuz}</span>
              <span className="text-[10px] text-purple-300/50 block">dari 30 Juz</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#121438]/80 border border-[#282552] text-center min-w-[110px]">
              <span className="text-[10px] text-purple-300/70 block uppercase font-bold">Sedang Dipelajari</span>
              <span className="text-2xl font-black text-amber-400 font-mono">{inProgressJuz}</span>
              <span className="text-[10px] text-purple-300/50 block">Konstelasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* 30 Constellations Galaxy Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>30 Konstelasi Galaksi Al-Qur'an</span>
          </h3>
          <span className="text-xs text-purple-300/60">Klik konstelasi untuk melihat bintang surah</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {JUZ_LIST.map((juz) => {
            const p = progressMap[juz.number];
            const pct = p?.memorizationPercentage || 0;
            const isSelected = selectedConstellation.number === juz.number;
            const isCompleted = pct >= 100;
            const isStarted = pct > 0;

            return (
              <div
                key={juz.number}
                onClick={() => setSelectedConstellation(juz)}
                className={`relative p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between text-center group ${
                  isSelected
                    ? 'bg-gradient-to-b from-purple-900/80 to-indigo-950 border-amber-400 shadow-lg shadow-purple-900/50 scale-105 ring-1 ring-amber-400/50'
                    : isCompleted
                    ? 'bg-emerald-950/40 border-emerald-500/40 hover:border-emerald-400'
                    : isStarted
                    ? 'bg-[#121438]/70 border-purple-500/40 hover:border-purple-400'
                    : 'bg-[#0a0c20]/60 border-[#282552]/40 hover:border-[#3d3a7a]'
                }`}
              >
                {/* Star Icon Node */}
                <div className="mx-auto my-1">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs border transition-all ${
                    isCompleted
                      ? 'bg-emerald-400 text-purple-950 border-emerald-300 shadow-md shadow-emerald-400/30'
                      : isSelected
                      ? 'bg-amber-400 text-purple-950 border-amber-300 shadow-md shadow-amber-400/30 animate-pulse'
                      : isStarted
                      ? 'bg-purple-900/60 text-amber-300 border-purple-500/40'
                      : 'bg-slate-900/60 text-slate-500 border-slate-800'
                  }`}>
                    {juz.number}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                    Juz {juz.number}
                  </h4>
                  <span className="text-[10px] text-purple-300/60 block truncate">
                    {juz.totalSurahs} Surah
                  </span>
                </div>

                <div className="mt-2 pt-1.5 border-t border-[#282552]/30">
                  <span className={`text-[10px] font-bold ${isCompleted ? 'text-emerald-400' : isStarted ? 'text-amber-300' : 'text-slate-500'}`}>
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Constellation Detail Box */}
      <div className="cosmic-card p-6 sm:p-7 rounded-3xl border border-purple-500/50 bg-gradient-to-br from-[#121438] to-[#0a0b22] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#282552]/40">
          <div>
            <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block">
              Konstelasi Terpilih
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-serif flex items-center gap-2">
              <span>✦ {selectedConstellation.name}</span>
              <span className="text-amber-400 text-base font-normal font-arabic">
                {selectedConstellation.arabicName}
              </span>
            </h3>
            <p className="text-xs text-purple-200/70">
              {selectedConstellation.surahRangeText} • Total {selectedConstellation.totalSurahs} Surah
            </p>
          </div>

          <button
            onClick={() => onSelectJuz(selectedConstellation.number)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-purple-950 font-black text-xs shadow-lg shadow-amber-400/20 transition active:scale-95"
          >
            <span>Pelajari Konstelasi Ini</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Stars inside Constellation */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-purple-300/80 block">
            Bintang-bintang Surah dalam {selectedConstellation.name}:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {surahsOfSelected.map((surah) => {
              const mem = memorizationMap[surah.number];
              const isShining = mem?.status === 'kuat';
              const isGlowing = mem?.status === 'sedang';

              return (
                <div
                  key={surah.number}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                    isShining
                      ? 'bg-emerald-950/40 border-emerald-400/50 text-white shadow-sm'
                      : isGlowing
                      ? 'bg-purple-950/40 border-amber-400/40 text-purple-200'
                      : 'bg-[#0d0f28]/60 border-[#282552]/40 text-purple-300/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`text-base ${isShining ? 'text-amber-300 animate-pulse' : isGlowing ? 'text-amber-400' : 'text-slate-600'}`}>
                      ✦
                    </span>
                    <div>
                      <h5 className="font-bold text-white text-xs">{surah.latinName}</h5>
                      <span className="text-[10px] text-purple-300/50">{surah.totalAyahs} Ayat</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold">
                    {isShining ? '🟢 Terang' : isGlowing ? '🟡 Menyala' : '⚪ Redup'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
