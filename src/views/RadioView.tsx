import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { Radio as RadioIcon, Play, Pause, Volume2, RadioTower, Globe, Tv } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export interface RadioStation {
  id: string;
  name: string;
  location: string;
  frequency: string;
  subtitle: string;
  streamUrl: string;
  badge?: string;
  isTv?: boolean;
}

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'rodja-tv-live',
    name: 'Rodja TV (Audio Live 24 Jam)',
    location: 'Cileungsi, Bogor',
    frequency: 'Rodja TV Live',
    subtitle: 'Siaran Audio Live Rodja TV - Menebar Cahaya Sunnah 24 Jam Nonstop',
    streamUrl: 'https://audio.rodja.tv/live',
    badge: 'RODJA TV',
    isTv: true
  },
  {
    id: 'radio-rodja-756',
    name: 'Radio Rodja 756 AM',
    location: 'Cileungsi, Bogor / Jakarta',
    frequency: '756 AM Live',
    subtitle: 'Menebar Cahaya Sunnah & Bimbingan Islam Berdasarkan Al-Qur\'an dan As-Sunnah',
    streamUrl: 'https://live.radiorodja.com/stream',
    badge: 'RADIO RODJA'
  },
  {
    id: 'radio-alafasy',
    name: 'Radio Murottal Mishary Al-Afasy 24/7',
    location: 'Kuwait / Internasional',
    frequency: 'Stream HQ HTTPS 24 Jam',
    subtitle: 'Lantunan Merdu Al-Qur\'an 30 Juz Full oleh Sheikh Mishary Rashid Alafasy',
    streamUrl: 'https://qurango.net/radio/mishary_alafasi',
    badge: 'UTAMA'
  },
  {
    id: 'radio-murottal-mix',
    name: 'Radio Tilawah Al-Qur\'an 24 Jam Pilihan',
    location: 'Makkah & Madinah',
    frequency: 'Stream HQ HTTPS 24 Jam',
    subtitle: 'Lantunan Suci Al-Qur\'an 24 Jam Nonstop Pilihan Qari Internasional',
    streamUrl: 'https://qurango.net/radio/mix',
    badge: 'POPULER'
  },
  {
    id: 'radio-almuaiqly',
    name: 'Radio Murottal Maher Al-Muaiqly',
    location: 'Masjidil Haram, Makkah',
    frequency: 'Live Makkah 24 Jam',
    subtitle: 'Lantunan Al-Qur\'an Khusyu\' oleh Imam Masjidil Haram Sheikh Maher Al-Muaiqly',
    streamUrl: 'https://qurango.net/radio/maher_al_muaiqly',
    badge: 'MAKKAH'
  },
  {
    id: 'radio-alminshawi',
    name: 'Radio Murottal Siddiq Al-Minshawi',
    location: 'Kairo, Mesir',
    frequency: '24/7 Mujawwad',
    subtitle: 'Lantunan Al-Qur\'an Klasik & Tajwid Presisi Sheikh Mohammad Siddiq Al-Minshawi',
    streamUrl: 'https://qurango.net/radio/mohammed_siddiq_alminshawi'
  },
  {
    id: 'radio-alghamdi',
    name: 'Radio Murottal Saad Al-Ghamdi',
    location: 'Dammam, Arab Saudi',
    frequency: '24/7 Murottal',
    subtitle: 'Lantunan Indah Al-Qur\'an 30 Juz Sheikh Saad Al-Ghamdi',
    streamUrl: 'https://qurango.net/radio/saad_alghamdi'
  },
  {
    id: 'radio-fares-abbad',
    name: 'Radio Murottal Fares Abbad',
    location: 'Yaman',
    frequency: '24/7 Murottal',
    subtitle: 'Lantunan Syahdu Al-Qur\'an 30 Juz Sheikh Fares Abbad',
    streamUrl: 'https://qurango.net/radio/fares_abbad'
  },
  {
    id: 'radio-abdulbasit',
    name: 'Radio Murottal Abdul Basit Mojawwad',
    location: 'Kairo, Mesir',
    frequency: '24/7 Mujawwad',
    subtitle: 'Lantunan Emas Al-Qur\'an Mojawwad Legend Sheikh Abdul Basit Abdus Samad',
    streamUrl: 'https://qurango.net/radio/abdulbasit_abdulsamad_mojawwad'
  },
  {
    id: 'radio-alqatami',
    name: 'Radio Murottal Nasser Al-Qatami',
    location: 'Riyadh, Arab Saudi',
    frequency: '24/7 Murottal',
    subtitle: 'Lantunan Syahdu Khusyu\' Sheikh Nasser Al-Qatami',
    streamUrl: 'https://qurango.net/radio/nasser_alqatami'
  },
  {
    id: 'radio-alshuraim',
    name: 'Radio Murottal Saud Al-Shuraim',
    location: 'Makkah, Arab Saudi',
    frequency: '24/7 Murottal',
    subtitle: 'Lantunan Al-Qur\'an oleh Mantan Imam Masjidil Haram Sheikh Saud Al-Shuraim',
    streamUrl: 'https://qurango.net/radio/saud_alshuraim'
  },
  {
    id: 'radio-muslim-jogja',
    name: 'Radio Muslim Yogyakarta',
    location: 'Yogyakarta, Indonesia',
    frequency: '1467 AM / Stream HTTPS',
    subtitle: 'Kajian Islam Ilmiyah & Murottal 24 Jam Nonstop',
    streamUrl: 'https://stream.radio-muslim.com/listen/stream/radio_muslim_mp3'
  }
];

export const RadioView: React.FC = () => {
  const { showToast } = useToast();
  const { playTrack, currentTrack, isPlaying, togglePlayPause, volume, setVolume } = useAudio();

  const [selectedStation, setSelectedStation] = useState<RadioStation>(RADIO_STATIONS[0]);

  const isCurrentRadioPlaying = (url: string) => {
    return currentTrack?.type === 'radio' && currentTrack?.audioUrl === url && isPlaying;
  };

  const handleSelectAndPlayStation = (station: RadioStation) => {
    setSelectedStation(station);
    if (currentTrack?.type === 'radio' && currentTrack?.audioUrl === station.streamUrl) {
      togglePlayPause();
    } else {
      playTrack({
        type: 'radio',
        title: station.name,
        subtitle: `${station.location} (${station.frequency}) • ${station.subtitle}`,
        audioUrl: station.streamUrl,
        isPlaying: true
      });
      showToast(`Memulai streaming ${station.name}...`, 'info');
    }
  };

  const isAnyRadioActive = currentTrack?.type === 'radio';
  const activeStationTitle = currentTrack?.type === 'radio' ? currentTrack.title : selectedStation.name;
  const activeStationSubtitle = currentTrack?.type === 'radio' ? currentTrack.subtitle : selectedStation.subtitle;

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Radio Hero Player Card */}
      <div className="cosmic-card-glow rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden flex flex-col items-center justify-between min-h-[380px] border border-purple-500/30">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-900/40 via-indigo-600/30 to-purple-400/20 blur-3xl pointer-events-none" />

        {/* Live Badge Header */}
        <div className="flex items-center justify-between w-full relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/60 text-emerald-400 text-xs font-bold border border-emerald-500/30 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>● LIVE STREAMING RADIO & RODJA TV</span>
          </div>

          <span className="text-xs font-bold text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            {RADIO_STATIONS.length} Stasiun Aktif
          </span>
        </div>

        {/* Planet Orb Visualizer */}
        <div className="my-6 relative z-10">
          <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-indigo-950 via-purple-900 to-indigo-800 p-1 border-2 border-purple-500/40 shadow-2xl flex items-center justify-center ${isAnyRadioActive && isPlaying ? 'animate-cosmic-glow' : ''}`}>
            <div className="w-full h-full rounded-full bg-[#080915] flex flex-col items-center justify-center p-4 text-center">
              {selectedStation.isTv ? (
                <Tv className={`w-12 h-12 ${isAnyRadioActive && isPlaying ? 'text-amber-400 animate-pulse' : 'text-purple-300/40'}`} />
              ) : (
                <RadioIcon className={`w-12 h-12 ${isAnyRadioActive && isPlaying ? 'text-amber-400 animate-pulse' : 'text-purple-300/40'}`} />
              )}
              <span className="text-[10px] font-bold text-purple-200 mt-2">24/7 STREAMING</span>
            </div>
          </div>
        </div>

        {/* Active Title & Info */}
        <div className="space-y-1 relative z-10 max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-black text-white">{activeStationTitle}</h2>
          <p className="text-xs text-purple-200/80 leading-relaxed">{activeStationSubtitle}</p>
        </div>

        {/* Main Play/Pause Button */}
        <div className="my-5 relative z-10">
          <button
            onClick={() => handleSelectAndPlayStation(selectedStation)}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-purple-600 to-indigo-800 p-0.5 shadow-2xl shadow-purple-900/50 hover:scale-105 active:scale-95 transition transform flex items-center justify-center"
          >
            <div className="w-full h-full rounded-full bg-purple-950 flex items-center justify-center text-amber-300">
              {isCurrentRadioPlaying(selectedStation.streamUrl) ? (
                <Pause className="w-7 h-7 fill-current" />
              ) : (
                <Play className="w-7 h-7 fill-current ml-1" />
              )}
            </div>
          </button>
        </div>

        {/* Volume Slider */}
        <div className="w-full max-w-xs flex items-center gap-3 relative z-10">
          <Volume2 className="w-4 h-4 text-purple-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </div>

      {/* Station List Selector Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RadioTower className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Daftar Stasiun Rodja TV & Radio Sunnah 24 Jam</h3>
          </div>
          <span className="text-xs text-purple-300/60">Pilih stasiun untuk memutar streaming</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RADIO_STATIONS.map((station) => {
            const isPlayingThis = isCurrentRadioPlaying(station.streamUrl);
            const isSelected = selectedStation.id === station.id;

            return (
              <div
                key={station.id}
                onClick={() => handleSelectAndPlayStation(station)}
                className={`cosmic-card p-4 rounded-3xl border transition cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                  isPlayingThis
                    ? 'border-amber-400 bg-purple-900/40 shadow-lg shadow-purple-900/30 ring-1 ring-amber-400/40'
                    : isSelected
                    ? 'border-purple-500/80 bg-purple-950/60'
                    : 'border-[#282552]/50 hover:border-purple-500/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      isPlayingThis ? 'bg-amber-400 text-purple-950 shadow-md shadow-amber-400/30' : 'bg-purple-900/50 text-amber-300 border border-purple-500/30'
                    }`}>
                      {isPlayingThis ? <Play className="w-4 h-4 fill-current ml-0.5" /> : station.isTv ? <Tv className="w-4 h-4" /> : <RadioIcon className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-200 transition line-clamp-1">
                        {station.name}
                      </h4>
                      <p className="text-[11px] text-purple-300/70">
                        {station.location} • <span className="font-semibold text-purple-200">{station.frequency}</span>
                      </p>
                    </div>
                  </div>

                  {station.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-900/60 text-amber-300 text-[10px] font-extrabold border border-purple-500/30 flex-shrink-0">
                      {station.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-purple-200/60 line-clamp-2 mt-1 mb-3 leading-relaxed">
                  {station.subtitle}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#282552]/40 text-xs">
                  <span className={`font-semibold flex items-center gap-1.5 ${isPlayingThis ? 'text-amber-400 font-bold' : 'text-purple-300/60'}`}>
                    {isPlayingThis ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        <span>Sedang Memutar...</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-3.5 h-3.5" />
                        <span>Putar Stasiun</span>
                      </>
                    )}
                  </span>

                  <button
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                      isPlayingThis
                        ? 'bg-amber-400 text-purple-950'
                        : 'bg-purple-900/50 text-amber-300 border border-purple-500/30 hover:bg-purple-800/80'
                    }`}
                  >
                    {isPlayingThis ? 'Jeda' : 'Putar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
