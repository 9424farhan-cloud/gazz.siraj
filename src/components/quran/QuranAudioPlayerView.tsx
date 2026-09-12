import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Moon,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronLeft,
  ListMusic,
  User,
  Music
} from 'lucide-react';
import { audioService, AVAILABLE_QARIS } from '../../services/audioService';
import type { RepeatMode } from '../../services/audioService';
import type { JuzDefinition } from '../../data/juzData';
import type { Surah, ActiveAudioTrack } from '../../types';

interface QuranAudioPlayerViewProps {
  currentJuz: JuzDefinition;
  surahsInJuz: Surah[];
  onOpenJuzModal: () => void;
  onBackToHub: () => void;
}

export const QuranAudioPlayerView: React.FC<QuranAudioPlayerViewProps> = ({
  currentJuz,
  surahsInJuz,
  onOpenJuzModal,
  onBackToHub
}) => {
  const [currentTrack, setCurrentTrack] = useState<ActiveAudioTrack | null>(audioService.getCurrentTrack());
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(!!audioService.getCurrentTrack()?.isPlaying);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(audioService.getRepeatMode());
  const [sleepTimer, setSleepTimer] = useState<number>(audioService.getSleepTimer());
  const [selectedQari, setSelectedQari] = useState<string>(audioService.getQari());
  const [showPlaylist, setShowPlaylist] = useState<boolean>(true);

  useEffect(() => {
    const unsub = audioService.subscribe((track, time, dur, _online, extra) => {
      setCurrentTrack(track);
      setCurrentTime(time);
      setDuration(dur);
      setIsPlaying(!!track?.isPlaying);
      if (extra) {
        setRepeatMode(extra.repeatMode);
        setSleepTimer(extra.sleepTimerMinutes);
        setSelectedQari(extra.selectedQari);
      }
    });
    return unsub;
  }, []);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = parseFloat(e.target.value);
    audioService.seek(target);
    setCurrentTime(target);
  };

  const handleTogglePlay = () => {
    if (!currentTrack && surahsInJuz.length > 0) {
      // Start playing first surah in this Juz
      const first = surahsInJuz[0];
      audioService.playFullSurah(first.number, first.name, first.latinName);
    } else {
      audioService.togglePlayPause();
    }
  };

  const handlePlaySurahFromPlaylist = (surah: Surah) => {
    audioService.playFullSurah(surah.number, surah.name, surah.latinName);
  };

  const cycleRepeatMode = () => {
    const next: RepeatMode = repeatMode === 'none' ? 'ayah' : repeatMode === 'ayah' ? 'surah' : 'none';
    audioService.setRepeatMode(next);
  };

  const handleSelectSleepTimer = (mins: number) => {
    audioService.setSleepTimer(mins);
  };

  const handleSelectQari = (qariId: string) => {
    audioService.setQari(qariId);
    // If currently playing a surah, reload with new qari
    if (currentTrack?.surahNumber) {
      const s = surahsInJuz.find(item => item.number === currentTrack.surahNumber);
      if (s) {
        audioService.playFullSurah(s.number, s.name, s.latinName);
      }
    }
  };

  const activeSurahNumber = currentTrack?.surahNumber;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top Bar */}
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

      {/* Main Cosmic Player Card */}
      <div className="cosmic-card-glow rounded-3xl p-6 sm:p-8 relative overflow-hidden bg-gradient-to-b from-[#131438] via-[#0b0c24] to-[#070817] border border-purple-500/40 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Animated Cosmic Rotating Vinyl / Galaxy Ring */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
            {/* Outer pulsating ring */}
            <div className={`absolute inset-0 rounded-full border-2 border-dashed border-purple-500/40 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '24s' }} />
            <div className={`absolute inset-3 rounded-full border border-amber-400/40 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '18s', animationDirection: 'reverse' }} />

            {/* Glowing Cosmic Disc */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-amber-400 via-purple-700 to-indigo-950 p-1 shadow-2xl flex items-center justify-center relative overflow-hidden">
              <div className="w-full h-full rounded-full bg-[#090a1f] flex flex-col items-center justify-center p-4 text-center">
                <span className="text-3xl sm:text-4xl font-serif text-amber-300 mb-1">
                  {currentTrack ? '﷽' : 'س'}
                </span>
                <span className="text-[10px] text-purple-200/80 uppercase tracking-widest font-bold">
                  {currentJuz.name}
                </span>
              </div>
            </div>

            {/* Central Glow Dot */}
            <div className={`absolute w-4 h-4 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50 ${isPlaying ? 'animate-ping' : ''}`} />
          </div>

          {/* Track Info */}
          <div className="space-y-1.5 max-w-md">
            <h2 className="text-xl sm:text-2xl font-black text-white font-serif tracking-tight">
              {currentTrack?.title || `Murottal ${currentJuz.name}`}
            </h2>
            <p className="text-xs text-purple-200/70">
              {currentTrack?.subtitle || `Pilih surah dari ${currentJuz.name} untuk memutar`}
            </p>
          </div>

          {/* Seek Bar & Timers */}
          <div className="w-full max-w-lg space-y-1.5">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 rounded-lg bg-slate-800 accent-amber-400 cursor-pointer transition-all"
            />
            <div className="flex items-center justify-between text-xs text-purple-300/70 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Player Controls Bar */}
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            {/* Repeat Button */}
            <button
              onClick={cycleRepeatMode}
              className={`p-3 rounded-2xl border transition ${
                repeatMode !== 'none'
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-sm'
                  : 'bg-purple-900/30 text-purple-300/70 border-purple-500/20 hover:text-white'
              }`}
              title={`Mode Ulangi: ${repeatMode === 'none' ? 'Nonaktif' : repeatMode === 'ayah' ? 'Ulangi Ayat' : 'Ulangi Surah'}`}
            >
              {repeatMode === 'ayah' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
            </button>

            {/* Previous */}
            <button
              onClick={() => audioService.playPrevious()}
              className="p-3.5 rounded-2xl bg-purple-900/40 hover:bg-purple-800/60 text-white border border-purple-500/30 transition active:scale-95"
              title="Sebelumnya"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            {/* Play / Pause Giant Button */}
            <button
              onClick={handleTogglePlay}
              className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 text-purple-950 flex items-center justify-center font-black shadow-lg shadow-amber-400/30 hover:scale-105 active:scale-95 transition-all"
              title={isPlaying ? 'Jeda Audio' : 'Putar Audio'}
            >
              {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </button>

            {/* Next */}
            <button
              onClick={() => audioService.playNext()}
              className="p-3.5 rounded-2xl bg-purple-900/40 hover:bg-purple-800/60 text-white border border-purple-500/30 transition active:scale-95"
              title="Selanjutnya"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            {/* Playlist Toggle */}
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className={`p-3 rounded-2xl border transition ${
                showPlaylist
                  ? 'bg-purple-600/30 text-purple-200 border-purple-400/40'
                  : 'bg-purple-900/30 text-purple-300/70 border-purple-500/20 hover:text-white'
              }`}
              title="Tampilkan / Sembunyikan Playlist"
            >
              <ListMusic className="w-5 h-5" />
            </button>
          </div>

          {/* Reciter & Sleep Timer Settings Bar */}
          <div className="w-full max-w-lg pt-4 border-t border-[#282552]/40 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Qari Selector */}
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              <span className="text-purple-300/70">Qari:</span>
              <select
                value={selectedQari}
                onChange={(e) => handleSelectQari(e.target.value)}
                className="bg-[#16183d] text-white text-xs rounded-xl px-2.5 py-1.5 border border-purple-500/40 outline-none focus:border-amber-400"
              >
                {AVAILABLE_QARIS.map(q => (
                  <option key={q.id} value={q.id}>
                    {q.name} ({q.country})
                  </option>
                ))}
              </select>
            </div>

            {/* Sleep Timer */}
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300/70">Sleep Timer:</span>
              <div className="flex items-center gap-1">
                {[0, 15, 30, 60].map(mins => (
                  <button
                    key={mins}
                    onClick={() => handleSelectSleepTimer(mins)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                      sleepTimer === mins
                        ? 'bg-amber-400 text-purple-950 border-amber-300 shadow-sm'
                        : 'bg-purple-900/40 text-purple-300 border-purple-500/20 hover:bg-purple-800/40'
                    }`}
                  >
                    {mins === 0 ? 'Off' : `${mins}m`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Section */}
      {showPlaylist && (
        <div className="cosmic-card p-5 rounded-3xl border border-[#282552]/60 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-pink-400" />
              <span>Playlist {currentJuz.name} ({surahsInJuz.length} Surah)</span>
            </h3>
            <span className="text-xs text-purple-300/60">Klik surah untuk memutar</span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
            {surahsInJuz.map((surah) => {
              const isCurrent = activeSurahNumber === surah.number;
              return (
                <div
                  key={surah.number}
                  onClick={() => handlePlaySurahFromPlaylist(surah)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isCurrent
                      ? 'bg-gradient-to-r from-purple-900/60 to-indigo-950/80 border-amber-400 text-white shadow-md'
                      : 'bg-[#0f1028]/60 hover:bg-[#16183d] border-[#282552]/40 text-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs border ${
                      isCurrent
                        ? 'bg-amber-400 text-purple-950 border-amber-300'
                        : 'bg-purple-900/40 text-amber-300 border-purple-500/30'
                    }`}>
                      {isCurrent && isPlaying ? (
                        <span className="flex gap-0.5 items-end h-3">
                          <span className="w-0.5 h-3 bg-purple-950 animate-pulse" />
                          <span className="w-0.5 h-2 bg-purple-950 animate-pulse delay-75" />
                          <span className="w-0.5 h-3 bg-purple-950 animate-pulse delay-150" />
                        </span>
                      ) : (
                        surah.number
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold group-hover:text-amber-300 transition">
                        {surah.latinName}
                      </h4>
                      <span className="text-[11px] text-purple-300/60">
                        {surah.translation} • {surah.totalAyahs} Ayat
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-lg font-serif text-amber-300/90 font-arabic">
                      {surah.name}
                    </span>
                    <button className={`p-2 rounded-xl transition ${
                      isCurrent && isPlaying
                        ? 'bg-amber-400 text-purple-950'
                        : 'bg-purple-900/40 text-purple-200 hover:bg-purple-800/60'
                    }`}>
                      {isCurrent && isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
