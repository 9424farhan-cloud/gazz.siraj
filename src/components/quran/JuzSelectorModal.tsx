import React, { useState } from 'react';
import { JUZ_LIST } from '../../data/juzData';
import type { JuzDefinition } from '../../data/juzData';
import { Sparkles, Search, X, CheckCircle2, BookOpen, ChevronRight } from 'lucide-react';
import type { QuranJuzProgress } from '../../types';

interface JuzSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedJuzNumber: number;
  onSelectJuz: (juzNumber: number) => void;
  juzProgressMap: Record<number, QuranJuzProgress>;
}

export const JuzSelectorModal: React.FC<JuzSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedJuzNumber,
  onSelectJuz,
  juzProgressMap
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = JUZ_LIST.filter(j =>
    j.number.toString() === query.trim() ||
    j.name.toLowerCase().includes(query.toLowerCase()) ||
    j.surahRangeText.toLowerCase().includes(query.toLowerCase()) ||
    (j.description && j.description.toLowerCase().includes(query.toLowerCase()))
  );

  const getStatusBadge = (juz: JuzDefinition, progress?: QuranJuzProgress) => {
    const memPct = progress?.memorizationPercentage || 0;
    const isCurrent = juz.number === selectedJuzNumber;

    if (memPct >= 100) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" /> Selesai
        </span>
      );
    }
    if (isCurrent || memPct > 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
          Sedang Dipelajari
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-800/60 text-slate-400 border border-slate-700/40">
        Belum Dimulai
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] cosmic-card rounded-3xl border border-purple-500/30 flex flex-col shadow-2xl overflow-hidden bg-[#080915]">
        {/* Glow Header */}
        <div className="absolute top-0 right-0 w-72 h-40 bg-purple-600/15 blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-72 h-40 bg-emerald-600/10 blur-3xl pointer-events-none" />

        {/* Top Bar */}
        <div className="relative z-10 p-5 sm:p-6 border-b border-[#282552]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-purple-600 to-indigo-900 flex items-center justify-center text-amber-300 font-bold border border-amber-400/30 shadow-lg">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white font-serif tracking-wide flex items-center gap-2">
                Pilih Juz Al-Qur'an
              </h3>
              <p className="text-xs text-purple-200/70">
                Pilih Juz 1 sampai 30 untuk fokus belajar, hifzh, murajaah, & audio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 border border-purple-500/30 transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Quick Jump */}
        <div className="relative z-10 px-5 sm:px-6 py-3 border-b border-[#282552]/40 bg-[#0c0d20]/50 flex items-center gap-3">
          <Search className="w-4 h-4 text-purple-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nomor Juz (contoh: 30), nama surah (contoh: An-Naba', Al-Baqarah)..."
            className="bg-transparent border-none outline-none text-white placeholder-purple-300/40 w-full text-xs sm:text-sm"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-purple-300 hover:text-white px-2 py-1 rounded-lg bg-purple-950/60"
            >
              Reset
            </button>
          )}
        </div>

        {/* 30 Juz Grid */}
        <div className="relative z-10 flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 scrollbar-thin">
          {filtered.map((juz) => {
            const isSelected = juz.number === selectedJuzNumber;
            const progress = juzProgressMap[juz.number];
            const pct = progress?.memorizationPercentage || 0;

            return (
              <div
                key={juz.number}
                onClick={() => {
                  onSelectJuz(juz.number);
                  onClose();
                }}
                className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-purple-900/60 via-[#161436] to-indigo-950/80 border-amber-400 shadow-lg shadow-purple-900/40 ring-1 ring-amber-400/40'
                    : 'bg-[#0f1026]/70 hover:bg-[#151638] border-[#282552]/50 hover:border-purple-500/60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border ${
                        isSelected
                          ? 'bg-amber-400 text-purple-950 border-amber-300 shadow-md shadow-amber-400/30'
                          : 'bg-purple-900/40 text-amber-300 border-purple-500/30 group-hover:border-purple-400'
                      }`}>
                        {juz.number}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition font-serif">
                          {juz.name}
                        </h4>
                        <span className="text-[10px] text-purple-300/60 block">
                          {juz.totalSurahs} Surah
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {getStatusBadge(juz, progress)}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300/90 font-medium mb-1 line-clamp-1">
                    {juz.surahRangeText}
                  </p>
                  {juz.description && (
                    <p className="text-[11px] text-purple-200/50 line-clamp-2 leading-relaxed">
                      {juz.description}
                    </p>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-3 pt-2.5 border-t border-[#282552]/40">
                  <div className="flex items-center justify-between text-[10px] text-purple-200/70 mb-1">
                    <span>Progress Hafalan</span>
                    <span className="font-bold text-amber-300">{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-amber-400 text-purple-950 font-bold text-[9px] shadow-sm">
                    AKTIF
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="relative z-10 p-4 bg-[#0a0b1c] border-t border-[#282552]/40 flex items-center justify-between text-xs text-purple-200/70">
          <span>Juz saat ini: <strong className="text-amber-300">Juz {selectedJuzNumber}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 text-white font-semibold text-xs border border-purple-500/30 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
