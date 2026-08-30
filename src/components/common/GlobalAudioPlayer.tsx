import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import { Play, Pause, Square, Radio, Volume2, VolumeX, WifiOff, ChevronUp, ChevronDown } from 'lucide-react';

export const GlobalAudioPlayer: React.FC = () => {
  const { currentTrack, currentTime, duration, isOnline, togglePlayPause, stop, seek, setVolume } = useAudio();
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentTrack) return null;

  const isRadio = currentTrack.type === 'radio';
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleToggleMute = () => {
    if (isMuted) {
      setVolume(0.9);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-16 lg:bottom-4 left-4 right-4 lg:left-72 lg:right-8 z-40 transition-all duration-300">
      <div className="glass-card bg-slate-900/95 dark:bg-slate-900/95 border border-emerald-500/40 text-white rounded-3xl p-3 sm:p-4 shadow-2xl backdrop-blur-xl">
        {/* Offline Banner */}
        {!isOnline && (
          <div className="flex items-center gap-2 mb-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-xl text-xs">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Streaming membutuhkan koneksi internet.</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          {/* Track Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-md ${
              isRadio ? 'bg-gradient-to-tr from-amber-600 to-gold-400' : 'bg-gradient-to-tr from-emerald-600 to-emerald-400'
            }`}>
              {isRadio ? <Radio className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white truncate">{currentTrack.title}</h4>
                {isRadio ? (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold tracking-wider uppercase animate-pulse">
                    LIVE
                  </span>
                ) : currentTrack.isFullSurah ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-purple-950 text-[10px] font-extrabold tracking-wider uppercase shadow-md shadow-amber-400/20">
                    FULL SURAH
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-slate-300 truncate">{currentTrack.subtitle}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayPause}
              className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-emerald-500/30 transition transform active:scale-95"
              title={currentTrack.isPlaying ? 'Jeda' : 'Putar'}
            >
              {currentTrack.isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={stop}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-full transition"
              title="Hentikan Audio"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-slate-400 hover:text-white rounded-full transition hidden sm:block"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Progress Bar for Quran Audio */}
        {!isRadio && (
          <div className="mt-2.5 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-mono">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime || 0}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <span className="text-[10px] text-slate-400 font-mono">{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {/* Expanded Volume / Controls */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button onClick={handleToggleMute} className="text-slate-400 hover:text-white">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                defaultValue="0.9"
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
            <div className="text-[11px] text-slate-400">
              {isRadio
                ? 'Stream Audio HQ 128kbps'
                : currentTrack.isFullSurah
                ? 'Murottal Full Surah 1-Selesai'
                : `Ayat ${currentTrack.ayahNumber || 1}`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
