import React from 'react';
import {
  Sparkles,
  ChevronLeft,
  Repeat,
  BookOpen,
  Headphones,
  Brain,
  RotateCcw,
  Play,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import type { JuzDefinition } from '../../data/juzData';
import type {
  Surah,
  SurahMemorizationRecord,
  MemorizationStatus,
  MurajaahScheduleItem,
  QuranJuzProgress
} from '../../types';

interface JuzDetailViewProps {
  currentJuz: JuzDefinition;
  surahsInJuz: Surah[];
  memorizationMap: Record<number, SurahMemorizationRecord>;
  murajaahList: MurajaahScheduleItem[];
  juzProgress: QuranJuzProgress;
  onOpenJuzModal: () => void;
  onBackToHub: () => void;
  onSelectSurahForReading: (surah: Surah) => void;
  onPlaySurahAudio: (surah: Surah) => void;
  onStartHifzh: (surah: Surah) => void;
  onScheduleMurajaah: (surah: Surah) => void;
  onChangeSurahStatus: (surahNumber: number, status: MemorizationStatus) => void;
}

export const JuzDetailView: React.FC<JuzDetailViewProps> = ({
  currentJuz,
  surahsInJuz,
  memorizationMap,
  murajaahList,
  juzProgress,
  onOpenJuzModal,
  onBackToHub,
  onSelectSurahForReading,
  onPlaySurahAudio,
  onStartHifzh,
  onScheduleMurajaah,
  onChangeSurahStatus
}) => {
  const pct = juzProgress.memorizationPercentage || 0;

  const renderStatusBadge = (status?: MemorizationStatus) => {
    switch (status) {
      case 'kuat':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            🟢 Kuat
          </span>
        );
      case 'sedang':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            🟡 Sedang
          </span>
        );
      case 'perlu_murajaah':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            🔴 Perlu Murajaah
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700/40">
            ⚪ Belum Dipelajari
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
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
          <Repeat className="w-3.5 h-3.5" />
          <span>Ganti Juz ({currentJuz.name})</span>
        </button>
      </div>

      {/* Juz Detail Header Card */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 cosmic-card border border-purple-500/30 bg-gradient-to-br from-[#121438] via-[#0b0c22] to-[#070817] shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 text-amber-300 text-xs font-semibold mb-2 border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Detail Pembagian Juz</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-serif flex items-center gap-3">
              <span>🌌 {currentJuz.name}</span>
              <span className="text-xl font-normal text-amber-300/80 font-arabic">
                {currentJuz.arabicName}
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-purple-200/80 mt-1">
              Rentang Surah: <strong>{currentJuz.surahRangeText}</strong> • Total {currentJuz.totalSurahs} Surah
            </p>
            {currentJuz.description && (
              <p className="text-xs text-purple-300/60 mt-2 max-w-2xl leading-relaxed">
                {currentJuz.description}
              </p>
            )}
          </div>

          {/* Overall Progress Gauge */}
          <div className="p-4 rounded-2xl bg-[#090a1c]/80 border border-[#282552]/70 min-w-[200px] text-center">
            <span className="text-[11px] text-purple-300/70 font-semibold block mb-1">
              Progress Keseluruhan
            </span>
            <span className="text-3xl font-black text-amber-400 font-mono">
              {pct}%
            </span>
            <div className="w-full h-2 rounded-full bg-slate-800 mt-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Surah List in Current Juz */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-purple-200 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Daftar Surah Dalam {currentJuz.name}</span>
          </h3>
          <span className="text-xs text-purple-300/60 font-medium">
            {surahsInJuz.length} Surah
          </span>
        </div>

        <div className="space-y-3">
          {surahsInJuz.map((surah) => {
            const memRecord = memorizationMap[surah.number];
            const status = memRecord?.status || 'belum';
            const progressPct = memRecord?.percentage || (status === 'kuat' ? 100 : status === 'sedang' ? 65 : status === 'perlu_murajaah' ? 35 : 0);
            const murajaahItem = murajaahList.find(m => m.surahNumber === surah.number && !m.isCompleted);

            return (
              <div
                key={surah.number}
                className="cosmic-card p-4 sm:p-5 rounded-3xl border border-[#282552]/60 hover:border-purple-500/50 transition-all duration-200 bg-[#0d0f28]/70 flex flex-col gap-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Surah Info */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-purple-900/40 border border-purple-500/30 text-amber-300 flex items-center justify-center font-bold text-sm shadow-md">
                      {surah.number}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-white font-serif">
                          {surah.latinName}
                        </h4>
                        <span className="text-lg text-amber-300/90 font-arabic">
                          {surah.name}
                        </span>
                      </div>
                      <p className="text-xs text-purple-300/60">
                        {surah.translation} • {surah.totalAyahs} Ayat • {surah.type}
                      </p>
                    </div>
                  </div>

                  {/* Right: Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {renderStatusBadge(status)}

                    {murajaahItem && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        <Clock className="w-3 h-3" /> Murajaah: {murajaahItem.scheduledDate}
                      </span>
                    )}

                    {memRecord?.lastStudiedAt && (
                      <span className="text-[10px] text-purple-300/50 hidden sm:inline">
                        Terakhir: {new Date(memRecord.lastStudiedAt).toLocaleDateString('id-ID')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar per surah */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-purple-300/70">
                    <span>Progress Hafalan</span>
                    <span className="font-bold text-amber-300">{progressPct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#282552]/40">
                  {/* Status Picker Dropdown */}
                  <div className="flex items-center gap-1.5 text-xs text-purple-300/70">
                    <span className="text-[11px]">Ubah Status:</span>
                    <select
                      value={status}
                      onChange={(e) => onChangeSurahStatus(surah.number, e.target.value as MemorizationStatus)}
                      className="bg-[#141638] text-purple-200 text-xs rounded-xl px-2.5 py-1 border border-purple-500/30 outline-none focus:border-amber-400"
                    >
                      <option value="belum">⚪ Belum Dipelajari</option>
                      <option value="perlu_murajaah">🔴 Perlu Murajaah</option>
                      <option value="sedang">🟡 Sedang</option>
                      <option value="kuat">🟢 Kuat</option>
                    </select>
                  </div>

                  {/* 4 Quick Action Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => onSelectSurahForReading(surah)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 text-xs font-semibold border border-purple-500/30 transition"
                      title="Baca teks dan terjemahan surah ini"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                      <span>Baca</span>
                    </button>

                    <button
                      onClick={() => onPlaySurahAudio(surah)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 text-xs font-semibold border border-purple-500/30 transition"
                      title="Dengarkan audio murottal surah ini"
                    >
                      <Headphones className="w-3.5 h-3.5 text-pink-400" />
                      <span>Audio</span>
                    </button>

                    <button
                      onClick={() => onStartHifzh(surah)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 text-xs font-semibold border border-purple-500/30 transition"
                      title="Latihan menghafal ayat surah ini"
                    >
                      <Brain className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Hifzh</span>
                    </button>

                    <button
                      onClick={() => onScheduleMurajaah(surah)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30 transition"
                      title="Jadwalkan atau mulai murajaah surah ini"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                      <span>Murajaah</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
