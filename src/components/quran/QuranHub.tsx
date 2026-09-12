import React from 'react';
import {
  BookOpen,
  Headphones,
  Brain,
  RotateCcw,
  Gamepad2,
  Sparkles,
  Repeat,
  Compass,
  ArrowRight,
  Play,
  CheckCircle2,
  Flame,
  Award
} from 'lucide-react';
import type { JuzDefinition } from '../../data/juzData';
import type { QuranCenterTab, QuranJuzProgress, QuranLastRead } from '../../types';

interface QuranHubProps {
  currentJuz: JuzDefinition;
  juzProgress: QuranJuzProgress;
  onOpenJuzModal: () => void;
  onNavigate: (tab: QuranCenterTab) => void;
  lastRead: QuranLastRead | null;
  lastAudio: any | null;
  onContinueReading: () => void;
  onContinueAudio: () => void;
}

export const QuranHub: React.FC<QuranHubProps> = ({
  currentJuz,
  juzProgress,
  onOpenJuzModal,
  onNavigate,
  lastRead,
  lastAudio,
  onContinueReading,
  onContinueAudio
}) => {
  const pct = juzProgress.memorizationPercentage || 0;

  const FEATURES = [
    {
      id: 'baca' as QuranCenterTab,
      title: "Baca Qur'an",
      subtitle: `Buka teks Al-Qur'an & terjemahan untuk ${currentJuz.name}`,
      icon: BookOpen,
      badge: `${currentJuz.totalSurahs} Surah`,
      gradient: "from-blue-600/30 via-indigo-600/20 to-purple-600/10",
      accent: "text-sky-300",
      border: "hover:border-sky-400/50"
    },
    {
      id: 'audio' as QuranCenterTab,
      title: "Audio Qur'an",
      subtitle: `Murottal playlist terintegrasi ${currentJuz.name} & sleep timer`,
      icon: Headphones,
      badge: "Playlist Juz",
      gradient: "from-purple-600/30 via-pink-600/20 to-purple-600/10",
      accent: "text-purple-300",
      border: "hover:border-purple-400/50"
    },
    {
      id: 'hifzh' as QuranCenterTab,
      title: "Hifzh (Hafalan)",
      subtitle: `Latihan menghafal ayat-ayat pilihan dengan 5 mode interaktif`,
      icon: Brain,
      badge: "5 Mode Latihan",
      gradient: "from-emerald-600/30 via-teal-600/20 to-emerald-600/10",
      accent: "text-emerald-300",
      border: "hover:border-emerald-400/50"
    },
    {
      id: 'murajaah' as QuranCenterTab,
      title: "Murajaah",
      subtitle: `Sistem jadwal pengulangan berkala (+1, +3, +7, +14 hari)`,
      icon: RotateCcw,
      badge: "Spaced Repetition",
      gradient: "from-amber-600/30 via-orange-600/20 to-amber-600/10",
      accent: "text-amber-300",
      border: "hover:border-amber-400/50"
    },
    {
      id: 'games' as QuranCenterTab,
      title: "Qur'an Games",
      subtitle: `Audio Qur'an Challenge: Tebak Surah, Lanjutkan Ayat, dsb.`,
      icon: Gamepad2,
      badge: "Audio Challenge",
      gradient: "from-rose-600/30 via-purple-600/20 to-rose-600/10",
      accent: "text-rose-300",
      border: "hover:border-rose-400/50"
    },
    {
      id: 'journey' as QuranCenterTab,
      title: "Qur'an Journey",
      subtitle: `Visual galaksi 30 konstelasi bintang perjalanan Al-Qur'an Anda`,
      icon: Sparkles,
      badge: "Cosmic Galaxy",
      gradient: "from-indigo-600/30 via-purple-600/20 to-cyan-600/10",
      accent: "text-indigo-300",
      border: "hover:border-indigo-400/50"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Cosmic Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 cosmic-card border border-purple-500/30 shadow-2xl bg-gradient-to-br from-[#0c0e27] via-[#090a1a] to-[#060714]">
        {/* Galaxy Glow Elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-600/20 to-pink-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-64 h-64 bg-gradient-to-tr from-emerald-600/15 to-teal-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 text-amber-300 text-xs font-semibold border border-purple-500/30 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIRAJ Qur'an Learning Center</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white font-serif tracking-tight">
              QUR'AN CENTER
            </h1>

            <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
              Tingkatkan kedekatan dengan Al-Qur'an melalui tilawah, murottal audio terpadu, latihan hifzh bertahap, murajaah berkala, dan tantangan audio edukatif.
            </p>
          </div>

          {/* Quick Selected Juz Showcase */}
          <div className="cosmic-card p-5 rounded-2xl border border-[#282552]/80 bg-[#121433]/80 backdrop-blur-md flex flex-col gap-3 min-w-[280px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-purple-300/70 font-bold">
                Juz Yang Dipelajari
              </span>
              <button
                onClick={onOpenJuzModal}
                className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 px-2.5 py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 transition active:scale-95"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Ganti Juz</span>
              </button>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-purple-600 text-purple-950 font-black text-base flex items-center justify-center shadow-lg shadow-amber-400/20">
                  {currentJuz.number}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-serif">
                    {currentJuz.name}
                  </h3>
                  <p className="text-xs text-purple-200/70 font-medium">
                    {currentJuz.surahRangeText}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs text-purple-200">
                <span className="text-[11px] text-purple-300/70">Progress Juz {currentJuz.number}</span>
                <span className="font-bold text-emerald-400">{pct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => onNavigate('juz_detail')}
              className="w-full mt-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/50 text-purple-200 text-xs font-bold border border-purple-500/30 transition"
            >
              <span>Buka Detail {currentJuz.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Continue Last Activity Strip */}
        {(lastRead || lastAudio) && (
          <div className="mt-6 pt-5 border-t border-[#282552]/40 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lastRead && (
              <div
                onClick={onContinueReading}
                className="p-3.5 rounded-2xl bg-[#0e1026]/70 hover:bg-[#15173d] border border-[#282552]/60 hover:border-purple-500/50 transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-300/60 uppercase font-semibold block">
                      Lanjut Membaca
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-blue-200 transition">
                      QS. {lastRead.surahName}: Ayat {lastRead.ayahNumber}
                    </span>
                  </div>
                </div>
                <ChevronRightIcon />
              </div>
            )}

            {lastAudio && (
              <div
                onClick={onContinueAudio}
                className="p-3.5 rounded-2xl bg-[#0e1026]/70 hover:bg-[#15173d] border border-[#282552]/60 hover:border-purple-500/50 transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-300/60 uppercase font-semibold block">
                      Lanjut Mendengarkan
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-amber-200 transition line-clamp-1">
                      {lastAudio.title}
                    </span>
                  </div>
                </div>
                <ChevronRightIcon />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 6 Core Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.id}
              onClick={() => onNavigate(feat.id)}
              className={`cosmic-card p-5 rounded-3xl border border-[#282552]/60 ${feat.border} transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br ${feat.gradient}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-2xl bg-[#141638] border border-[#282552] flex items-center justify-center ${feat.accent} group-hover:scale-110 transition shadow-inner`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#141638] text-purple-200/90 border border-[#282552]/60">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition font-serif mb-1">
                  {feat.title}
                </h3>
                <p className="text-xs text-purple-200/70 leading-relaxed">
                  {feat.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#282552]/30 flex items-center justify-between text-xs font-bold text-purple-300/80 group-hover:text-amber-300 transition">
                <span>Buka Fitur</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ChevronRightIcon = () => (
  <svg className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
