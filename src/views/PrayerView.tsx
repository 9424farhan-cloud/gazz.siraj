import React, { useEffect, useState } from 'react';
import { prayerService } from '../services/prayerService';
import { prayerRepository } from '../services/repositories/prayerRepository';
import { settingsRepository } from '../services/repositories/settingsRepository';
import type { PrayerLog, PrayerName } from '../types';
import { Clock, CheckCircle2, Circle, MapPin, Bell, Compass, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface PrayerViewProps {
  locationName: string;
  lat: number;
  lng: number;
  methodStr: string;
  onOpenLocationModal: () => void;
  setActiveTab: (tab: string) => void;
}

export const PrayerView: React.FC<PrayerViewProps> = ({
  locationName,
  lat,
  lng,
  methodStr,
  onOpenLocationModal,
  setActiveTab
}) => {
  const { showToast } = useToast();
  const [todayStr, setTodayStr] = useState<string>('');
  const [prayerTimes, setPrayerTimes] = useState<any>({
    subuh: '04:35',
    syuruq: '05:48',
    dzuhur: '11:54',
    ashar: '15:12',
    maghrib: '17:55',
    isya: '19:05'
  });

  const [nextInfo, setNextInfo] = useState<any>({
    title: 'Ashar',
    time: '15:18',
    countdownFormatted: '01:24:36'
  });

  const [prayerLog, setPrayerLog] = useState<PrayerLog>({
    date: '',
    subuh: true,
    dzuhur: true,
    ashar: false,
    maghrib: false,
    isya: false
  });

  const [notifications, setNotifications] = useState<Record<PrayerName, boolean>>({
    subuh: true,
    dzuhur: true,
    ashar: true,
    maghrib: true,
    isya: true
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setTodayStr(today);

    const times = prayerService.calculatePrayerTimes(lat, lng, new Date(), methodStr);
    setPrayerTimes(times);

    prayerRepository.getPrayerLog(today).then(log => {
      setPrayerLog({ ...log, subuh: true, dzuhur: true });
    });

    settingsRepository.getSettings().then(s => {
      if (s.prayerNotifications) setNotifications(s.prayerNotifications);
    });

    const timer = setInterval(() => {
      const info = prayerService.getNextPrayerInfo(lat, lng, methodStr);
      setNextInfo(info);
    }, 1000);

    setNextInfo(prayerService.getNextPrayerInfo(lat, lng, methodStr));
    return () => clearInterval(timer);
  }, [lat, lng, methodStr]);

  const handleTogglePrayer = async (pName: PrayerName) => {
    const updated = await prayerRepository.togglePrayer(todayStr, pName);
    setPrayerLog({ ...updated });
    showToast(`Shalat ${pName.toUpperCase()} ${updated[pName] ? 'selesai' : 'dibatalkan'}`, 'success');
  };

  const handleToggleNotification = async (pName: PrayerName) => {
    const updated = { ...notifications, [pName]: !notifications[pName] };
    setNotifications(updated);
    await settingsRepository.updateSetting('prayerNotifications', updated);
    showToast(`Pengingat ${pName.toUpperCase()} ${updated[pName] ? 'diaktifkan' : 'dinonaktifkan'}`, 'info');
  };

  const PRAYER_CARDS: { id: PrayerName; title: string; time: string; desc: string }[] = [
    { id: 'subuh', title: 'Subuh', time: prayerTimes.subuh, desc: '2 Rakaat • Fajar' },
    { id: 'dzuhur', title: 'Dzuhur', time: prayerTimes.dzuhur, desc: '4 Rakaat • Siang Hari' },
    { id: 'ashar', title: 'Ashar', time: prayerTimes.ashar, desc: '4 Rakaat • Sore Hari' },
    { id: 'maghrib', title: 'Maghrib', time: prayerTimes.maghrib, desc: '3 Rakaat • Terbenam Matahari' },
    { id: 'isya', title: 'Isya', time: prayerTimes.isya, desc: '4 Rakaat • Malam Hari' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Card */}
      <div className="cosmic-card-glow rounded-3xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" />
              <span>Jadwal Shalat Hari Ini</span>
            </div>
            <h2 className="text-2xl font-black text-white font-serif">
              Waktu Shalat Presisi
            </h2>
            <p className="text-xs text-purple-200/80 mt-1">
              Metode Perhitungan: <strong className="text-white">{methodStr}</strong> • Syuruq: {prayerTimes.syuruq}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenLocationModal}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/40 transition"
            >
              <MapPin className="w-4 h-4" />
              <span>Ubah Lokasi</span>
            </button>

            <button
              onClick={() => setActiveTab('qibla')}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#12132b] text-purple-200 font-bold text-xs border border-[#282552] hover:bg-purple-900/40 transition"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>Arah Kiblat</span>
            </button>
          </div>
        </div>

        {/* Realtime Next Prayer Spotlight Banner */}
        {nextInfo && (
          <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-purple-950/90 to-indigo-900/90 text-white border border-purple-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-900/40 text-amber-300 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-[11px] text-purple-200/70 font-medium">Shalat Berikutnya dalam Antrean</p>
                <h4 className="text-lg font-bold">{nextInfo.title} • {nextInfo.time}</h4>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-purple-200/70 uppercase font-semibold">Hitung Mundur Realtime</span>
              <p className="text-2xl font-mono font-extrabold text-amber-300 tracking-wider">
                {nextInfo.countdownFormatted}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Prayer Times List Cards */}
      <div className="space-y-3">
        {PRAYER_CARDS.map(p => {
          const isNext = nextInfo?.name === p.id;
          const isDone = prayerLog[p.id];
          const isNotifOn = notifications[p.id];

          return (
            <div
              key={p.id}
              className={`cosmic-card rounded-3xl p-5 border transition-all duration-300 flex items-center justify-between gap-4 ${
                isNext
                  ? 'border-purple-500 bg-purple-900/40 shadow-lg shadow-purple-900/30'
                  : 'border-[#282552]/50 hover:border-purple-500/40'
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleTogglePrayer(p.id)}
                  className="p-1 rounded-full text-purple-300 hover:text-amber-300 transition transform active:scale-90"
                  title="Tandai Selesai"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-8 h-8 text-purple-300/30" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-white">{p.title}</h3>
                    {isNext && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-400 text-purple-950 text-[10px] font-bold uppercase tracking-wider">
                        Berikutnya
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-purple-300/70">{p.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-2xl font-extrabold font-mono text-white">
                  {p.time}
                </span>

                <button
                  onClick={() => handleToggleNotification(p.id)}
                  className={`p-2 rounded-xl border transition ${
                    isNotifOn
                      ? 'bg-purple-900/40 border-purple-500/40 text-amber-300'
                      : 'bg-[#12132b] border-[#282552] text-purple-300/40'
                  }`}
                  title="Toggle Pengingat"
                >
                  <Bell className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
