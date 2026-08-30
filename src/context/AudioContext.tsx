import React, { createContext, useContext, useEffect, useState } from 'react';
import { audioService } from '../services/audioService';
import type { ActiveAudioTrack } from '../types';

interface AudioContextType {
  currentTrack: ActiveAudioTrack | null;
  currentTime: number;
  duration: number;
  isOnline: boolean;
  isPlaying: boolean;
  volume: number;
  playTrack: (track: ActiveAudioTrack) => void;
  playFullSurah: (surahNumber: number, surahName: string, latinName: string) => void;
  playQuranVerse: (url: string, title: string, subtitle: string, surahNumber?: number, ayahNumber?: number) => void;
  playRadio: (streamUrl?: string, title?: string, subtitle?: string) => void;
  togglePlayPause: () => void;
  seek: (seconds: number) => void;
  stop: () => void;
  setVolume: (vol: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<ActiveAudioTrack | null>(audioService.getCurrentTrack());
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [volume, setVolumeState] = useState<number>(0.8);

  useEffect(() => {
    const unsubscribe = audioService.subscribe((track, time, dur, online) => {
      setCurrentTrack(track ? { ...track } : null);
      setCurrentTime(time);
      setDuration(dur);
      setIsOnline(online);
      setVolumeState(audioService.getVolume());
    });

    return () => unsubscribe();
  }, []);

  const handleSetVolume = (vol: number) => {
    setVolumeState(vol);
    audioService.setVolume(vol);
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        currentTime,
        duration,
        isOnline,
        isPlaying: !!currentTrack?.isPlaying,
        volume,
        playTrack: (track) => audioService.playTrack(track),
        playFullSurah: (surahNum, sName, lName) => audioService.playFullSurah(surahNum, sName, lName),
        playQuranVerse: (url, title, subtitle, sNum, aNum) => audioService.playQuranVerse(url, title, subtitle, sNum, aNum),
        playRadio: (url, title, sub) => audioService.playRadio(url, title, sub),
        togglePlayPause: () => audioService.togglePlayPause(),
        seek: (sec) => audioService.seek(sec),
        stop: () => audioService.stop(),
        setVolume: handleSetVolume,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
};
