import React, { useEffect, useState } from 'react';
import { DOA_LIST } from '../data/doaData';
import { doaRepository } from '../services/repositories/doaRepository';
import type { DoaItem } from '../types';
import { Heart, Search, Bookmark, BookmarkCheck, CheckCircle2, RotateCcw } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const DoaView: React.FC = () => {
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState<'pagi' | 'petang' | 'shalat' | 'harian'>('pagi');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [counters, setCounters] = useState<Record<string, number>>({});

  useEffect(() => {
    doaRepository.getBookmarks().then(setBookmarkedIds);
  }, []);

  const handleToggleBookmark = async (doaId: string) => {
    const isBookmarked = await doaRepository.toggleBookmark(doaId);
    setBookmarkedIds(prev =>
      isBookmarked ? [...prev, doaId] : prev.filter(id => id !== doaId)
    );
    showToast(isBookmarked ? 'Doa ditambahkan ke favorit' : 'Doa dihapus dari favorit', 'info');
  };

  const handleIncrementCount = (doaId: string, maxRepeat: number = 1) => {
    setCounters(prev => {
      const current = prev[doaId] || 0;
      const next = current + 1;
      if (next === maxRepeat) {
        if (navigator.vibrate) navigator.vibrate(50);
      }
      return { ...prev, [doaId]: next };
    });
  };

  const handleResetCount = (doaId: string) => {
    setCounters(prev => ({ ...prev, [doaId]: 0 }));
  };

  const filteredList = DOA_LIST.filter(item => {
    const matchesCat = item.category === activeCategory;
    const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Card */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <Heart className="w-4 h-4" />
              <span>Kumpulan Doa & Dzikir Otentik</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Doa Harian & Dzikir Sunnah
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Bersumber dari riwayat shahih (HR. Bukhari, Muslim, Abu Dawud, Tirmidzi)
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari doa atau dzikir..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => setActiveCategory('pagi')}
            className={`py-2 rounded-2xl text-xs font-bold transition ${
              activeCategory === 'pagi'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            ☀️ Dzikir Pagi
          </button>

          <button
            onClick={() => setActiveCategory('petang')}
            className={`py-2 rounded-2xl text-xs font-bold transition ${
              activeCategory === 'petang'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            🌙 Dzikir Petang
          </button>

          <button
            onClick={() => setActiveCategory('shalat')}
            className={`py-2 rounded-2xl text-xs font-bold transition ${
              activeCategory === 'shalat'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            🕌 Dzikir Shalat
          </button>

          <button
            onClick={() => setActiveCategory('harian')}
            className={`py-2 rounded-2xl text-xs font-bold transition ${
              activeCategory === 'harian'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            🤲 Doa Harian
          </button>
        </div>
      </div>

      {/* Doa Cards List */}
      <div className="space-y-4">
        {filteredList.map(item => {
          const isFav = bookmarkedIds.includes(item.id);
          const currentCount = counters[item.id] || 0;
          const maxRepeat = item.repeat || 1;
          const isDone = currentCount >= maxRepeat;

          return (
            <div
              key={item.id}
              className={`glass-card rounded-3xl p-5 border transition-all ${
                isDone
                  ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/20'
                  : 'border-slate-200/60 dark:border-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <button
                  onClick={() => handleToggleBookmark(item.id)}
                  className={`p-2 rounded-xl border transition ${
                    isFav ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isFav ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>
              </div>

              {/* Arabic Text */}
              <div className="font-arabic text-2xl text-right text-slate-900 dark:text-slate-100 leading-loose mb-3">
                {item.arabic}
              </div>

              {/* Transliteration & Translation */}
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium italic mb-2">
                {item.latin}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                "{item.translation}"
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                <span className="text-slate-400 italic text-[11px]">{item.source}</span>

                {maxRepeat > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResetCount(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                      title="Reset"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleIncrementCount(item.id, maxRepeat)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
                        isDone
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{currentCount} / {maxRepeat} Dibaca</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
