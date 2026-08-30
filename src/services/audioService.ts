import type { ActiveAudioTrack } from '../types';

export const RADIO_STREAM_URL = 'https://stream.radio-muslim.com/listen/stream/radio_muslim_mp3';

type AudioEventListener = (track: ActiveAudioTrack | null, currentTime: number, duration: number, isOnline: boolean) => void;

class AudioServiceManager {
  private audio: HTMLAudioElement;
  private currentTrack: ActiveAudioTrack | null = null;
  private listeners: Set<AudioEventListener> = new Set();
  private isOnlineStatus: boolean = navigator.onLine;

  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'none';

    this.audio.addEventListener('timeupdate', () => this.notify());
    this.audio.addEventListener('ended', () => this.handleTrackEnded());
    this.audio.addEventListener('play', () => {
      if (this.currentTrack) {
        this.currentTrack.isPlaying = true;
        this.notify();
      }
    });
    this.audio.addEventListener('pause', () => {
      if (this.currentTrack) {
        this.currentTrack.isPlaying = false;
        this.notify();
      }
    });
    this.audio.addEventListener('error', (e) => {
      console.warn('Audio playback error:', e);
      if (this.currentTrack) {
        this.currentTrack.isPlaying = false;
        this.notify();
      }
    });

    window.addEventListener('online', () => {
      this.isOnlineStatus = true;
      this.notify();
    });
    window.addEventListener('offline', () => {
      this.isOnlineStatus = false;
      this.notify();
    });
  }

  subscribe(listener: AudioEventListener) {
    this.listeners.add(listener);
    listener(this.currentTrack, this.audio.currentTime || 0, this.audio.duration || 0, this.isOnlineStatus);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const time = this.audio.currentTime || 0;
    const dur = isNaN(this.audio.duration) ? 0 : this.audio.duration;
    this.listeners.forEach(l => l());
  }

  playQuranVerse(url: string, title: string, subtitle: string, surahNumber?: number, ayahNumber?: number) {
    if (!navigator.onLine) {
      alert("Audio membutuhkan koneksi internet.");
      return;
    }

    // Stop current track (e.g. Radio)
    this.audio.pause();

    this.currentTrack = {
      type: 'quran',
      title,
      subtitle,
      audioUrl: url,
      isPlaying: true,
      surahNumber,
      ayahNumber
    };

    this.audio.src = url;
    this.audio.volume = 0.9;
    this.audio.play().catch(err => {
      console.warn('Failed to play Quran verse:', err);
      if (this.currentTrack) this.currentTrack.isPlaying = false;
      this.notify();
    });
    this.notify();
  }

  playRadio(streamUrl: string = RADIO_STREAM_URL, title: string = 'Radio Murottal Al-Qur\'an 24 Jam', subtitle: string = 'Kajian & Murottal 24 Jam Live Stream') {
    if (!navigator.onLine) {
      alert("Audio streaming membutuhkan koneksi internet.");
      return;
    }

    this.audio.pause();

    this.currentTrack = {
      type: 'radio',
      title,
      subtitle,
      audioUrl: streamUrl,
      isPlaying: true
    };

    this.audio.src = streamUrl;
    this.audio.volume = 0.9;
    
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn('Primary stream playback blocked or failed, loading HTTPS fallback stream:', err);
        const fallbackUrl = 'https://qurango.net/radio/mix';
        this.audio.src = fallbackUrl;
        if (this.currentTrack) {
          this.currentTrack.audioUrl = fallbackUrl;
        }
        this.audio.play().catch(e => {
          console.warn('Fallback stream playback failed:', e);
          if (this.currentTrack) this.currentTrack.isPlaying = false;
          this.notify();
        });
      });
    }
    this.notify();
  }

  togglePlayPause() {
    if (!this.currentTrack) return;
    if (this.audio.paused) {
      if (!navigator.onLine) {
        alert(this.currentTrack.type === 'radio' ? "Streaming membutuhkan koneksi internet." : "Audio membutuhkan koneksi internet.");
        return;
      }
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  stop() {
    this.audio.pause();
    this.audio.src = '';
    this.currentTrack = null;
    this.notify();
  }

  seek(seconds: number) {
    if (this.currentTrack?.type === 'quran' && !isNaN(this.audio.duration)) {
      this.audio.currentTime = seconds;
    }
  }

  setVolume(vol: number) {
    this.audio.volume = Math.max(0, Math.min(1, vol));
  }

  private handleTrackEnded() {
    if (this.currentTrack) {
      this.currentTrack.isPlaying = false;
      this.notify();
    }
  }

  playFullSurah(surahNumber: number, surahName: string, latinName: string) {
    if (!navigator.onLine) {
      alert("Audio murottal membutuhkan koneksi internet.");
      return;
    }

    this.audio.pause();

    const audioUrl = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`;

    this.currentTrack = {
      type: 'surah',
      title: `Surah ${latinName} (${surahName})`,
      subtitle: `Murottal Full Surah 1-Selesai (Mishary Rashid Alafasy)`,
      audioUrl,
      isPlaying: true,
      surahNumber,
      isFullSurah: true
    };

    this.audio.src = audioUrl;
    this.audio.volume = 0.9;
    this.audio.play().catch(err => {
      console.warn('Primary CDN failed, trying fallback surah audio:', err);
      const fallbackUrl = `https://server8.mp3quran.net/afs/${String(surahNumber).padStart(3, '0')}.mp3`;
      this.audio.src = fallbackUrl;
      this.audio.play().catch(e => {
        console.warn('Fallback surah audio failed:', e);
        if (this.currentTrack) this.currentTrack.isPlaying = false;
        this.notify();
      });
    });
    this.notify();
  }

  playTrack(track: ActiveAudioTrack) {
    if (track.type === 'surah' || track.isFullSurah) {
      this.playFullSurah(track.surahNumber || 1, track.title, track.title);
    } else if (track.type === 'quran') {
      this.playQuranVerse(track.audioUrl, track.title, track.subtitle, track.surahNumber, track.ayahNumber);
    } else {
      this.playRadio(track.audioUrl, track.title, track.subtitle);
    }
  }

  getVolume(): number {
    return this.audio.volume;
  }

  getCurrentTrack() {
    return this.currentTrack;
  }
}

export const audioService = new AudioServiceManager();
