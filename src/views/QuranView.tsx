import React, { useEffect, useState } from 'react';
import { quranService } from '../services/quranService';
import { quranRepository } from '../services/repositories/quranRepository';
import type { Surah, Ayah, QuranBookmark, QuranLastRead } from '../types';
import { useAudio } from '../context/AudioContext';
import { useToast } from '../context/ToastContext';
import {
  BookOpen,
  Search,
  Bookmark,
  Play,
  Pause,
  ChevronLeft,
  Sliders,
  Sparkles,
  Volume2
} from 'lucide-react';

export const QuranView: React.FC = () => {
  const { showToast } = useToast();
  const { playTrack, playFullSurah, currentTrack, isPlaying, togglePlayPause } = useAudio();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loadingAyahs, setLoadingAyahs] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(28);
  const [bookmarks, setBookmarks] = useState<QuranBookmark[]>([]);
  const [lastRead, setLastRead] = useState<QuranLastRead | null>(null);

  useEffect(() => {
    setSurahs(quranService.getAllSurahs());
    quranRepository.getBookmarks().then(setBookmarks);
    quranRepository.getLastRead().then(setLastRead);
  }, []);

  const isSurahAudioActive = (surahNumber: number) => {
    return currentTrack?.surahNumber === surahNumber && (currentTrack?.type === 'surah' || currentTrack?.isFullSurah);
  };

  const handleToggleSurahMurottal = (surah: Surah, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isSurahAudioActive(surah.number)) {
      togglePlayPause();
    } else {
      playFullSurah(surah.number, surah.name, surah.latinName);
      showToast(`Memutar Murottal Full Surah ${surah.latinName}`, 'info');
    }
  };

  const handleSelectSurah = async (surah: Surah) => {
    setSelectedSurah(surah);
    setLoadingAyahs(true);
    try {
      const fetched = await quranService.getAyahsBySurah(surah.number);
      setAyahs(fetched);
    } catch {
      showToast('Gagal memuat ayat Al-Qur\'an', 'error');
    } finally {
      setLoadingAyahs(false);
    }
  };

  const filteredSurahs = surahs.filter(
    s =>
      s.latinName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toString() === searchQuery
  );

  const handleBookmarkAyah = async (ayah: Ayah) => {
    if (!selectedSurah) return;
    const bm: QuranBookmark = {
      id: `${selectedSurah.number}_${ayah.number}`,
      surahNumber: selectedSurah.number,
      ayahNumber: ayah.number,
      surahName: selectedSurah.latinName,
      text: ayah.text,
      createdAt: Date.now()
    };
    await quranRepository.addBookmark(bm);
    setBookmarks(prev => [...prev.filter(b => b.id !== bm.id), bm]);
    showToast(`Bookmark QS. ${selectedSurah.latinName}: ${ayah.number} disimpan`, 'success');
  };

  const handlePlayAyahAudio = (ayah: Ayah) => {
    if (!selectedSurah) return;
    const audioUrl = ayah.audioUrl || `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${quranService.getGlobalAyahNumber(selectedSurah.number, ayah.number)}.mp3`;
    
    if (currentTrack?.audioUrl === audioUrl) {
      togglePlayPause();
    } else {
      playTrack({
        type: 'quran',
        title: `QS. ${selectedSurah.latinName}: Ayat ${ayah.number}`,
        subtitle: `Murottal Al-Qur'an (Mishary Rashid Alafasy)`,
        audioUrl,
        isPlaying: true,
        surahNumber: selectedSurah.number,
        ayahNumber: ayah.number
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="cosmic-card-glow rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 text-amber-300 text-xs font-semibold mb-2 border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Al-Qur'anul Karim</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-serif">
              {selectedSurah ? selectedSurah.latinName : 'Katalog 114 Surah'}
            </h2>
            <p className="text-xs text-purple-200/80 mt-1">
              {selectedSurah
                ? `${selectedSurah.name} • ${selectedSurah.totalAyahs} Ayat • ${selectedSurah.type}`
                : 'Baca dan dengarkan lantunan suci Al-Qur\'an dengan terjemahan Indonesia'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedSurah && (
              <button
                onClick={(e) => handleToggleSurahMurottal(selectedSurah, e)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs transition shadow-lg ${
                  isSurahAudioActive(selectedSurah.number) && isPlaying
                    ? 'bg-amber-400 text-purple-950 shadow-amber-400/30'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/40'
                }`}
              >
                {isSurahAudioActive(selectedSurah.number) && isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Jeda Murottal</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Putar Full Surah</span>
                  </>
                )}
              </button>
            )}

            {selectedSurah && (
              <button
                onClick={() => setSelectedSurah(null)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-900/60 hover:bg-purple-800/80 text-white text-xs font-bold transition border border-purple-500/40"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Katalog</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {!selectedSurah ? (
        <>
          {/* Search Bar */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl cosmic-card border border-[#282552]/50 text-sm">
            <Search className="w-5 h-5 text-purple-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Surah (contoh: Al-Kahf, Al-Baqarah, 18)..."
              className="bg-transparent border-none outline-none text-white placeholder-purple-300/40 w-full"
            />
          </div>

          {/* Surah List Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSurahs.map((surah) => (
              <div
                key={surah.number}
                onClick={() => handleSelectSurah(surah)}
                className="cosmic-card p-4 rounded-3xl border border-[#282552]/50 hover:border-purple-500/60 transition cursor-pointer flex items-center justify-between group active:scale-95"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-900/40 border border-purple-500/30 text-amber-300 flex items-center justify-center font-bold text-sm">
                    {surah.number}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-200 transition">
                      {surah.latinName}
                    </h4>
                    <p className="text-xs text-purple-300/60">
                      {surah.translation} • {surah.totalAyahs} Ayat
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleToggleSurahMurottal(surah, e)}
                    className={`p-2.5 rounded-2xl border transition ${
                      isSurahAudioActive(surah.number) && isPlaying
                        ? 'bg-amber-400 text-purple-950 border-amber-400 font-bold shadow-md shadow-amber-400/30 scale-105'
                        : 'bg-purple-900/40 text-amber-300 border-purple-500/30 hover:bg-purple-800/60'
                    }`}
                    title={`Putar Murottal Full Surah ${surah.latinName}`}
                  >
                    {isSurahAudioActive(surah.number) && isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                  </button>

                  <div className="text-right">
                    <span className="text-xl font-serif text-amber-300 group-hover:scale-105 transition block">
                      {surah.name}
                    </span>
                    <span className="text-[10px] text-purple-300/50 uppercase font-semibold">
                      {surah.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Ayah Reader View */
        <div className="space-y-4">
          {loadingAyahs ? (
            <div className="cosmic-card p-12 rounded-3xl text-center">
              <div className="w-10 h-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mx-auto mb-3" />
              <p className="text-xs text-purple-200">Memuat ayat Al-Qur'an...</p>
            </div>
          ) : (
            ayahs.map((ayah) => {
              const isCurrentPlaying = currentTrack?.surahNumber === selectedSurah.number && currentTrack?.ayahNumber === ayah.number && isPlaying;
              return (
                <div
                  key={ayah.number}
                  className={`cosmic-card p-6 rounded-3xl border transition ${
                    isCurrentPlaying ? 'border-amber-400 bg-purple-900/40 shadow-lg shadow-purple-900/30' : 'border-[#282552]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#282552]/40">
                    <span className="px-3 py-1 rounded-full bg-purple-900/50 text-amber-300 font-bold text-xs border border-purple-500/30">
                      Ayat {ayah.number}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlayAyahAudio(ayah)}
                        className={`p-2 rounded-xl border transition ${
                          isCurrentPlaying
                            ? 'bg-amber-400 text-purple-950 border-amber-400 font-bold'
                            : 'bg-purple-900/40 text-purple-200 border-purple-500/30 hover:bg-purple-800/60'
                        }`}
                        title="Putar Audio Ayat"
                      >
                        {isCurrentPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      </button>

                      <button
                        onClick={() => handleBookmarkAyah(ayah)}
                        className="p-2 rounded-xl bg-purple-900/40 text-purple-200 border border-purple-500/30 hover:bg-purple-800/60 transition"
                        title="Simpan Bookmark"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Arabic Text */}
                  <p
                    className="font-arabic text-right text-white leading-loose my-4"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {ayah.text}
                  </p>

                  {/* Indonesian Translation */}
                  <p className="text-xs text-purple-200/80 leading-relaxed pt-3 border-t border-[#282552]/30">
                    {ayah.translation}
                  </p>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
