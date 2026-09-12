import React, { useEffect, useState } from 'react';
import { quranService } from '../services/quranService';
import { quranRepository } from '../services/repositories/quranRepository';
import { quranCenterRepository } from '../services/repositories/quranCenterRepository';
import { audioService } from '../services/audioService';
import { getJuzByNumber } from '../data/juzData';
import type {
  Surah,
  Ayah,
  QuranBookmark,
  QuranLastRead,
  QuranCenterTab,
  QuranJuzProgress,
  SurahMemorizationRecord,
  MurajaahScheduleItem,
  MemorizationStatus
} from '../types';
import { useAudio } from '../context/AudioContext';
import { useToast } from '../context/ToastContext';

// Icons
import {
  BookOpen,
  Search,
  Bookmark,
  Play,
  Pause,
  ChevronLeft,
  Sparkles,
  Volume2,
  Headphones,
  Brain,
  RotateCcw,
  Gamepad2,
  BarChart3,
  Repeat,
  Sliders,
  CheckCircle2,
  Award
} from 'lucide-react';

// Subcomponents
import { JuzSelectorModal } from '../components/quran/JuzSelectorModal';
import { QuranHub } from '../components/quran/QuranHub';
import { JuzDetailView } from '../components/quran/JuzDetailView';
import { QuranAudioPlayerView } from '../components/quran/QuranAudioPlayerView';
import { QuranHifzhView } from '../components/quran/QuranHifzhView';
import { QuranMurajaahView } from '../components/quran/QuranMurajaahView';
import { QuranGamesView } from '../components/quran/QuranGamesView';
import { QuranJourneyView } from '../components/quran/QuranJourneyView';
import { QuranProgressStatsView } from '../components/quran/QuranProgressStatsView';

export const QuranView: React.FC = () => {
  const { showToast } = useToast();
  const { playTrack, playFullSurah, currentTrack, isPlaying, togglePlayPause } = useAudio();

  // Navigation & Juz state
  const [activeSubTab, setActiveSubTab] = useState<QuranCenterTab>('hub');
  const [selectedJuzNumber, setSelectedJuzNumber] = useState<number>(() => quranCenterRepository.getSelectedJuz());
  const [isJuzModalOpen, setIsJuzModalOpen] = useState<boolean>(false);

  // Progress & Data Maps
  const [juzProgressMap, setJuzProgressMap] = useState<Record<number, QuranJuzProgress>>({});
  const [memorizationMap, setMemorizationMap] = useState<Record<number, SurahMemorizationRecord>>({});
  const [murajaahList, setMurajaahList] = useState<MurajaahScheduleItem[]>([]);

  // Surahs & Reading states
  const [allSurahs, setAllSurahs] = useState<Surah[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'juz' | 'all'>('juz');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [hifzhPreselectedSurah, setHifzhPreselectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loadingAyahs, setLoadingAyahs] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(28);
  const [bookmarks, setBookmarks] = useState<QuranBookmark[]>([]);
  const [lastRead, setLastRead] = useState<QuranLastRead | null>(null);
  const [lastAudio, setLastAudio] = useState<any | null>(null);

  const currentJuz = getJuzByNumber(selectedJuzNumber);
  const surahsInCurrentJuz = allSurahs.filter(s => currentJuz.surahNumbers.includes(s.number));

  const loadAllData = async () => {
    const surahList = quranService.getAllSurahs();
    setAllSurahs(surahList);

    const bms = await quranRepository.getBookmarks();
    setBookmarks(bms);

    const lr = await quranRepository.getLastRead();
    setLastRead(lr);

    const la = audioService.getLastPlayedAudio();
    setLastAudio(la);

    const pMap = await quranCenterRepository.getAllJuzProgress();
    setJuzProgressMap(pMap);

    const mems = await quranCenterRepository.getAllMemorizationRecords();
    const mMap: Record<number, SurahMemorizationRecord> = {};
    mems.forEach(m => { mMap[m.surahNumber] = m; });
    setMemorizationMap(mMap);

    const murItems = await quranCenterRepository.getAllMurajaahSchedules();
    setMurajaahList(murItems);
  };

  useEffect(() => {
    loadAllData();
  }, [selectedJuzNumber]);

  const handleSelectJuz = (juzNumber: number) => {
    setSelectedJuzNumber(juzNumber);
    quranCenterRepository.setSelectedJuz(juzNumber);
    showToast(`Beralih ke Juz ${juzNumber}`, 'info');
  };

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
      showToast("Gagal memuat ayat Al-Qur'an", 'error');
    } finally {
      setLoadingAyahs(false);
    }
  };

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
    const audioUrl = ayah.audioUrl || quranService.getAyahAudioUrl(selectedSurah.number, ayah.number);

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

  const handleSaveLastRead = async (ayah: Ayah) => {
    if (!selectedSurah) return;
    const item: QuranLastRead = {
      surahNumber: selectedSurah.number,
      ayahNumber: ayah.number,
      surahName: selectedSurah.latinName,
      timestamp: Date.now()
    };
    await quranRepository.saveLastRead(item);
    setLastRead(item);
    showToast(`Terakhir dibaca diperbarui: QS. ${selectedSurah.latinName}: ${ayah.number}`, 'info');
  };

  const handleChangeSurahStatus = async (surahNumber: number, status: MemorizationStatus) => {
    const s = quranService.getSurahByNumber(surahNumber);
    const rec = await quranCenterRepository.updateSurahStatus(
      surahNumber,
      status,
      status === 'kuat' ? 100 : status === 'sedang' ? 65 : status === 'perlu_murajaah' ? 35 : 0,
      1,
      s?.totalAyahs || 1
    );
    setMemorizationMap(prev => ({ ...prev, [surahNumber]: rec }));
    const pMap = await quranCenterRepository.getAllJuzProgress();
    setJuzProgressMap(pMap);
    showToast(`Status hafalan QS. ${s?.latinName} diperbarui`, 'success');
  };

  const handleStartHifzhFromSurah = (surah: Surah) => {
    setHifzhPreselectedSurah(surah);
    setActiveSubTab('hifzh');
  };

  const displayedSurahs = (filterMode === 'juz' ? surahsInCurrentJuz : allSurahs).filter(
    s =>
      s.latinName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toString() === searchQuery.trim()
  );

  const SUB_TABS = [
    { id: 'hub' as QuranCenterTab, label: 'Pusat', icon: Sparkles },
    { id: 'juz_detail' as QuranCenterTab, label: `Juz ${selectedJuzNumber}`, icon: BookOpen },
    { id: 'baca' as QuranCenterTab, label: 'Baca', icon: BookOpen },
    { id: 'audio' as QuranCenterTab, label: 'Audio', icon: Headphones },
    { id: 'hifzh' as QuranCenterTab, label: 'Hifzh', icon: Brain },
    { id: 'murajaah' as QuranCenterTab, label: 'Murajaah', icon: RotateCcw },
    { id: 'games' as QuranCenterTab, label: 'Games', icon: Gamepad2 },
    { id: 'journey' as QuranCenterTab, label: 'Journey', icon: Sparkles },
    { id: 'progress' as QuranCenterTab, label: 'Progress', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Global Juz Selector Modal */}
      <JuzSelectorModal
        isOpen={isJuzModalOpen}
        onClose={() => setIsJuzModalOpen(false)}
        selectedJuzNumber={selectedJuzNumber}
        onSelectJuz={handleSelectJuz}
        juzProgressMap={juzProgressMap}
      />

      {/* Persistent Universal Sub-Navigation Tab Bar */}
      <div className="cosmic-card p-1.5 sm:p-2 rounded-2xl border border-[#282552]/70 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none sticky top-0 z-30 bg-[#080918]/95 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-1 shrink-0">
          {SUB_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSubTab(tab.id);
                  if (tab.id === 'baca') setSelectedSurah(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white shadow-md shadow-purple-900/40 ring-1 ring-amber-400/40'
                    : 'text-purple-200/70 hover:text-white hover:bg-purple-900/30'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Quick Switch Juz Button */}
        <button
          onClick={() => setIsJuzModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 transition shrink-0 active:scale-95 shadow-sm"
          title="Ganti Juz yang dipelajari"
        >
          <Repeat className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ganti Juz</span>
          <span className="px-1.5 py-0.2 rounded bg-amber-400 text-purple-950 text-[10px] font-black">
            Juz {selectedJuzNumber}
          </span>
        </button>
      </div>

      {/* Main View Router */}
      {activeSubTab === 'hub' && (
        <QuranHub
          currentJuz={currentJuz}
          juzProgress={juzProgressMap[selectedJuzNumber] || {
            juzNumber: selectedJuzNumber,
            readPercentage: 0,
            memorizationPercentage: 0,
            audioPercentage: 0,
            lastActiveAt: Date.now()
          }}
          onOpenJuzModal={() => setIsJuzModalOpen(true)}
          onNavigate={(tab) => {
            setActiveSubTab(tab);
            if (tab === 'baca') setSelectedSurah(null);
          }}
          lastRead={lastRead}
          lastAudio={lastAudio}
          onContinueReading={() => {
            if (lastRead) {
              const s = quranService.getSurahByNumber(lastRead.surahNumber);
              if (s) {
                handleSelectSurah(s);
                setActiveSubTab('baca');
              }
            }
          }}
          onContinueAudio={() => {
            if (lastAudio) {
              audioService.playTrack(lastAudio);
              setActiveSubTab('audio');
            }
          }}
        />
      )}

      {activeSubTab === 'juz_detail' && (
        <JuzDetailView
          currentJuz={currentJuz}
          surahsInJuz={surahsInCurrentJuz}
          memorizationMap={memorizationMap}
          murajaahList={murajaahList}
          juzProgress={juzProgressMap[selectedJuzNumber] || {
            juzNumber: selectedJuzNumber,
            readPercentage: 0,
            memorizationPercentage: 0,
            audioPercentage: 0,
            lastActiveAt: Date.now()
          }}
          onOpenJuzModal={() => setIsJuzModalOpen(true)}
          onBackToHub={() => setActiveSubTab('hub')}
          onSelectSurahForReading={(surah) => {
            handleSelectSurah(surah);
            setActiveSubTab('baca');
          }}
          onPlaySurahAudio={(surah) => {
            handleToggleSurahMurottal(surah);
            setActiveSubTab('audio');
          }}
          onStartHifzh={(surah) => handleStartHifzhFromSurah(surah)}
          onScheduleMurajaah={(surah) => setActiveSubTab('murajaah')}
          onChangeSurahStatus={handleChangeSurahStatus}
        />
      )}

      {activeSubTab === 'audio' && (
        <QuranAudioPlayerView
          currentJuz={currentJuz}
          surahsInJuz={surahsInCurrentJuz}
          onOpenJuzModal={() => setIsJuzModalOpen(true)}
          onBackToHub={() => setActiveSubTab('hub')}
        />
      )}

      {activeSubTab === 'hifzh' && (
        <QuranHifzhView
          currentJuz={currentJuz}
          surahsInJuz={surahsInCurrentJuz}
          preselectedSurah={hifzhPreselectedSurah}
          onBackToHub={() => setActiveSubTab('hub')}
          onOpenJuzModal={() => setIsJuzModalOpen(true)}
        />
      )}

      {activeSubTab === 'murajaah' && (
        <QuranMurajaahView
          currentJuz={currentJuz}
          surahsInJuz={surahsInCurrentJuz}
          onBackToHub={() => setActiveSubTab('hub')}
          onOpenJuzModal={() => setIsJuzModalOpen(true)}
        />
      )}

      {activeSubTab === 'games' && (
        <QuranGamesView
          currentJuz={currentJuz}
          surahsInJuz={surahsInCurrentJuz}
          onBackToHub={() => setActiveSubTab('hub')}
          onOpenJuzModal={() => setIsJuzModalOpen(true)}
        />
      )}

      {activeSubTab === 'journey' && (
        <QuranJourneyView
          currentJuz={currentJuz}
          onSelectJuz={(num) => {
            handleSelectJuz(num);
            setActiveSubTab('juz_detail');
          }}
          onBackToHub={() => setActiveSubTab('hub')}
        />
      )}

      {activeSubTab === 'progress' && (
        <QuranProgressStatsView
          currentJuz={currentJuz}
          juzProgress={juzProgressMap[selectedJuzNumber] || {
            juzNumber: selectedJuzNumber,
            readPercentage: 0,
            memorizationPercentage: 0,
            audioPercentage: 0,
            lastActiveAt: Date.now()
          }}
          onBackToHub={() => setActiveSubTab('hub')}
          onOpenJuzModal={() => setIsJuzModalOpen(true)}
        />
      )}

      {/* Reading Mode (Surah Catalog & Ayah Reader) */}
      {activeSubTab === 'baca' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Banner */}
          <div className="cosmic-card-glow rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 text-amber-300 text-xs font-semibold mb-2 border border-purple-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{filterMode === 'juz' ? currentJuz.name : "Katalog 114 Surah"}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-serif">
                  {selectedSurah ? selectedSurah.latinName : filterMode === 'juz' ? `Surah dalam ${currentJuz.name}` : 'Katalog 114 Surah'}
                </h2>
                <p className="text-xs text-purple-200/80 mt-1">
                  {selectedSurah
                    ? `${selectedSurah.name} • ${selectedSurah.totalAyahs} Ayat • ${selectedSurah.type}`
                    : filterMode === 'juz'
                    ? `Menampilkan ${surahsInCurrentJuz.length} surah dalam ${currentJuz.name} (${currentJuz.surahRangeText})`
                    : "Baca dan dengarkan lantunan suci Al-Qur'an dengan terjemahan resmi Indonesia"}
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
                    <span>Daftar Surah</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {!selectedSurah ? (
            <>
              {/* Filter Tabs: Current Juz vs All Surahs */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilterMode('juz')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                      filterMode === 'juz'
                        ? 'bg-purple-700 text-white shadow-md'
                        : 'bg-[#121438] text-purple-300/70 hover:text-white'
                    }`}
                  >
                    Hanya {currentJuz.name} ({surahsInCurrentJuz.length})
                  </button>
                  <button
                    onClick={() => setFilterMode('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                      filterMode === 'all'
                        ? 'bg-purple-700 text-white shadow-md'
                        : 'bg-[#121438] text-purple-300/70 hover:text-white'
                    }`}
                  >
                    Semua 114 Surah
                  </button>
                </div>

                <div className="flex-1 max-w-xs flex items-center gap-2 px-3 py-2 rounded-xl cosmic-card border border-[#282552]/50 text-xs">
                  <Search className="w-4 h-4 text-purple-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari surah..."
                    className="bg-transparent border-none outline-none text-white placeholder-purple-300/40 w-full"
                  />
                </div>
              </div>

              {/* Surah Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedSurahs.map((surah) => (
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
              {/* Font Size & Control Bar */}
              <div className="flex items-center justify-between p-3 rounded-2xl cosmic-card border border-[#282552]/50 text-xs">
                <span className="text-purple-200 font-semibold">
                  QS. {selectedSurah.latinName} ({selectedSurah.totalAyahs} Ayat)
                </span>
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-purple-300/60">Ukuran Teks:</span>
                  {[24, 28, 32].map(sz => (
                    <button
                      key={sz}
                      onClick={() => setFontSize(sz)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                        fontSize === sz
                          ? 'bg-purple-700 text-white border-purple-500'
                          : 'bg-purple-950/40 text-purple-300 border-purple-500/20'
                      }`}
                    >
                      {sz}px
                    </button>
                  ))}
                </div>
              </div>

              {loadingAyahs ? (
                <div className="cosmic-card p-12 rounded-3xl text-center">
                  <div className="w-10 h-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mx-auto mb-3" />
                  <p className="text-xs text-purple-200">Memuat ayat Al-Qur'an...</p>
                </div>
              ) : (
                ayahs.map((ayah) => {
                  const isCurrentPlaying = currentTrack?.surahNumber === selectedSurah.number && currentTrack?.ayahNumber === ayah.number && isPlaying;
                  const isLastReadAyah = lastRead?.surahNumber === selectedSurah.number && lastRead?.ayahNumber === ayah.number;

                  return (
                    <div
                      key={ayah.number}
                      className={`cosmic-card p-6 rounded-3xl border transition ${
                        isCurrentPlaying ? 'border-amber-400 bg-purple-900/40 shadow-lg shadow-purple-900/30' : 'border-[#282552]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#282552]/40">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-purple-900/50 text-amber-300 font-bold text-xs border border-purple-500/30">
                            Ayat {ayah.number}
                          </span>
                          {isLastReadAyah && (
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] border border-blue-500/30">
                              Terakhir Dibaca
                            </span>
                          )}
                        </div>

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
                            onClick={() => handleSaveLastRead(ayah)}
                            className="p-2 rounded-xl bg-purple-900/40 text-purple-200 border border-purple-500/30 hover:bg-purple-800/60 transition"
                            title="Tandai Terakhir Dibaca"
                          >
                            <BookOpen className="w-4 h-4" />
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
      )}
    </div>
  );
};
