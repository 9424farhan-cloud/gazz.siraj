import type { ActiveAudioTrack } from '../types';

export const RADIO_STREAM_URL = 'https://stream.radio-muslim.com/listen/stream/radio_muslim_mp3';

export interface QariOption {
  id: string;
  name: string;
  country: string;
}

export const AVAILABLE_QARIS: QariOption[] = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', country: 'Kuwait' },
  { id: 'ar.ahmedajamy', name: 'Ahmed ibn Ali al-Ajamy', country: 'Arab Saudi' },
  { id: 'ar.saoodshuraym', name: 'Saud Al-Shuraim', country: 'Imam Masjidil Haram' },
  { id: 'ar.abdulsamad', name: 'AbdulBaset AbdulSamad', country: 'Mesir' }
];

export type RepeatMode = 'none' | 'ayah' | 'surah';

type AudioEventListener = (
  track: ActiveAudioTrack | null,
  currentTime: number,
  duration: number,
  isOnline: boolean,
  extra?: {
    repeatMode: RepeatMode;
    sleepTimerMinutes: number;
    hasPlaylist: boolean;
    hasNext: boolean;
    hasPrev: boolean;
    selectedQari: string;
  }
) => void;

class AudioServiceManager {
  private audio: HTMLAudioElement;
  private currentTrack: ActiveAudioTrack | null = null;
  private listeners: Set<AudioEventListener> = new Set();
  private isOnlineStatus: boolean = navigator.onLine;

  // Playlist & Advanced features
  private playlist: ActiveAudioTrack[] = [];
  private playlistIndex: number = -1;
  private repeatMode: RepeatMode = 'none';
  private sleepTimerTimeout: any = null;
  private sleepTimerMinutes: number = 0;
  private selectedQari: string = 'ar.alafasy';

  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'none';

    this.audio.addEventListener('timeupdate', () => this.notify());
    this.audio.addEventListener('ended', () => this.handleTrackEnded());
    this.audio.addEventListener('play', () => {
      if (this.currentTrack) {
        this.currentTrack.isPlaying = true;
        this.updateMediaSession();
        this.notify();
      }
    });
    this.audio.addEventListener('pause', () => {
      if (this.currentTrack) {
        this.currentTrack.isPlaying = false;
        this.updateMediaSession();
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

    // Restore last selected qari
    try {
      const q = localStorage.getItem('siraj_selected_qari');
      if (q) this.selectedQari = q;
    } catch {
      // ignore
    }

    this.initMediaSessionHandlers();
  }

  private initMediaSessionHandlers() {
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.setActionHandler('play', () => this.togglePlayPause());
        navigator.mediaSession.setActionHandler('pause', () => this.togglePlayPause());
        navigator.mediaSession.setActionHandler('previoustrack', () => this.playPrevious());
        navigator.mediaSession.setActionHandler('nexttrack', () => this.playNext());
        navigator.mediaSession.setActionHandler('seekto', (details) => {
          if (details.seekTime !== undefined) {
            this.seek(details.seekTime);
          }
        });
      } catch (e) {
        console.warn('MediaSession action handler initialization skipped:', e);
      }
    }
  }

  private updateMediaSession() {
    if ('mediaSession' in navigator && this.currentTrack) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this.currentTrack.title,
          artist: this.currentTrack.subtitle || 'SIRAJ Islamic Companion',
          album: "Al-Qur'anul Karim",
          artwork: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
          ]
        });
        navigator.mediaSession.playbackState = this.currentTrack.isPlaying ? 'playing' : 'paused';
      } catch (e) {
        // ignore
      }
    }
  }

  subscribe(listener: AudioEventListener) {
    this.listeners.add(listener);
    listener(
      this.currentTrack,
      this.audio.currentTime || 0,
      this.audio.duration || 0,
      this.isOnlineStatus,
      this.getExtraState()
    );
    return () => {
      this.listeners.delete(listener);
    };
  }

  private getExtraState() {
    return {
      repeatMode: this.repeatMode,
      sleepTimerMinutes: this.sleepTimerMinutes,
      hasPlaylist: this.playlist.length > 0,
      hasNext: this.playlistIndex >= 0 && this.playlistIndex < this.playlist.length - 1,
      hasPrev: this.playlistIndex > 0,
      selectedQari: this.selectedQari
    };
  }

  private notify() {
    this.listeners.forEach(l => l(
      this.currentTrack,
      this.audio.currentTime || 0,
      isNaN(this.audio.duration) ? 0 : this.audio.duration,
      this.isOnlineStatus,
      this.getExtraState()
    ));
  }

  setQari(qariId: string) {
    this.selectedQari = qariId;
    try {
      localStorage.setItem('siraj_selected_qari', qariId);
    } catch {
      // ignore
    }
    this.notify();
  }

  getQari(): string {
    return this.selectedQari;
  }

  setRepeatMode(mode: RepeatMode) {
    this.repeatMode = mode;
    this.notify();
  }

  getRepeatMode(): RepeatMode {
    return this.repeatMode;
  }

  setSleepTimer(minutes: number) {
    if (this.sleepTimerTimeout) {
      clearTimeout(this.sleepTimerTimeout);
      this.sleepTimerTimeout = null;
    }
    this.sleepTimerMinutes = minutes;
    if (minutes > 0) {
      this.sleepTimerTimeout = setTimeout(() => {
        this.audio.pause();
        if (this.currentTrack) this.currentTrack.isPlaying = false;
        this.sleepTimerMinutes = 0;
        this.notify();
      }, minutes * 60 * 1000);
    }
    this.notify();
  }

  getSleepTimer(): number {
    return this.sleepTimerMinutes;
  }

  // Playlist management
  setPlaylist(tracks: ActiveAudioTrack[], startIndex: number = 0) {
    this.playlist = tracks;
    this.playlistIndex = startIndex;
    if (tracks[startIndex]) {
      this.playTrack(tracks[startIndex]);
    }
  }

  getPlaylist(): ActiveAudioTrack[] {
    return this.playlist;
  }

  getPlaylistIndex(): number {
    return this.playlistIndex;
  }

  playNext() {
    if (this.playlist.length > 0 && this.playlistIndex < this.playlist.length - 1) {
      this.playlistIndex += 1;
      this.playTrack(this.playlist[this.playlistIndex]);
    } else if (this.playlist.length > 0 && this.repeatMode === 'surah') {
      this.playlistIndex = 0;
      this.playTrack(this.playlist[0]);
    }
  }

  playPrevious() {
    if (this.playlist.length > 0 && this.playlistIndex > 0) {
      this.playlistIndex -= 1;
      this.playTrack(this.playlist[this.playlistIndex]);
    } else if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
    }
  }

  private handleTrackEnded() {
    if (this.repeatMode === 'ayah') {
      this.audio.currentTime = 0;
      this.audio.play().catch(() => {});
      return;
    }

    if (this.playlist.length > 0 && this.playlistIndex < this.playlist.length - 1) {
      this.playNext();
      return;
    }

    if (this.repeatMode === 'surah' && this.playlist.length > 0) {
      this.playlistIndex = 0;
      this.playTrack(this.playlist[0]);
      return;
    }

    if (this.currentTrack) {
      this.currentTrack.isPlaying = false;
      this.notify();
    }
  }

  playQuranVerse(url: string, title: string, subtitle: string, surahNumber?: number, ayahNumber?: number) {
    if (!navigator.onLine) {
      alert("Audio membutuhkan koneksi internet.");
      return;
    }

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

    // Save continue listening state
    try {
      localStorage.setItem('siraj_last_played_audio', JSON.stringify({
        title,
        subtitle,
        audioUrl: url,
        surahNumber,
        ayahNumber,
        timestamp: Date.now()
      }));
    } catch {
      // ignore
    }

    this.audio.src = url;
    this.audio.volume = 0.9;
    this.audio.play().catch(err => {
      console.warn('Failed to play Quran verse:', err);
      if (this.currentTrack) this.currentTrack.isPlaying = false;
      this.notify();
    });
    this.updateMediaSession();
    this.notify();
  }

  playFullSurah(surahNumber: number, surahName: string, latinName: string) {
    if (!navigator.onLine) {
      alert("Audio murottal membutuhkan koneksi internet.");
      return;
    }

    this.audio.pause();

    const qari = this.selectedQari || 'ar.alafasy';
    const audioUrl = `https://cdn.islamic.network/quran/audio-surah/128/${qari}/${surahNumber}.mp3`;

    const qariObj = AVAILABLE_QARIS.find(q => q.id === qari) || AVAILABLE_QARIS[0];

    this.currentTrack = {
      type: 'surah',
      title: `Surah ${latinName} (${surahName})`,
      subtitle: `Murottal Full Surah (${qariObj.name})`,
      audioUrl,
      isPlaying: true,
      surahNumber,
      isFullSurah: true
    };

    try {
      localStorage.setItem('siraj_last_played_audio', JSON.stringify({
        title: this.currentTrack.title,
        subtitle: this.currentTrack.subtitle,
        audioUrl,
        surahNumber,
        isFullSurah: true,
        timestamp: Date.now()
      }));
    } catch {
      // ignore
    }

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
    this.updateMediaSession();
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
        console.warn('Primary stream playback failed, loading HTTPS fallback stream:', err);
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
    this.updateMediaSession();
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

  togglePlayPause() {
    if (!this.currentTrack) return;
    if (this.audio.paused) {
      if (!navigator.onLine) {
        alert("Audio membutuhkan koneksi internet.");
        return;
      }
      this.audio.play();
    } else {
      this.audio.pause();
    }
    this.updateMediaSession();
  }

  stop() {
    this.audio.pause();
    this.audio.src = '';
    this.currentTrack = null;
    this.playlist = [];
    this.playlistIndex = -1;
    this.notify();
  }

  seek(seconds: number) {
    if (!isNaN(this.audio.duration)) {
      this.audio.currentTime = Math.max(0, Math.min(this.audio.duration, seconds));
    }
  }

  setVolume(vol: number) {
    this.audio.volume = Math.max(0, Math.min(1, vol));
  }

  getVolume(): number {
    return this.audio.volume;
  }

  getCurrentTrack() {
    return this.currentTrack;
  }

  getLastPlayedAudio(): any | null {
    try {
      const raw = localStorage.getItem('siraj_last_played_audio');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}

export const audioService = new AudioServiceManager();
