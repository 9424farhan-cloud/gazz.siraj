import React, { useEffect, useState } from 'react';
import { prayerService } from '../services/prayerService';
import { prayerRepository } from '../services/repositories/prayerRepository';
import { worshipRepository, DEFAULT_WORSHIP_TARGETS } from '../services/repositories/worshipRepository';
import { hijriService } from '../services/hijriService';
import type { PrayerLog, WorshipLog, PrayerName } from '../types';
import {
  Clock,
  Circle,
  BookOpen,
  Radio,
  CircleDot,
  Heart,
  Compass,
  MapPin,
  HeartHandshake,
  Moon,
  ChevronRight,
  Sun,
  Coffee,
  Check
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface HomeViewProps {
  locationName: string;
  lat: number;
  lng: number;
  methodStr: string;
  setActiveTab: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  locationName,
  lat,
  lng,
  methodStr,
  setActiveTab
}) => {
  const { showToast } = useToast();
  const [todayStr, setTodayStr] = useState<string>('');
  const [prayerLog, setPrayerLog] = useState<PrayerLog>({
    date: '',
    subuh: true,
    dzuhur: true,
    ashar: false,
    maghrib: false,
    isya: false
  });

  const [worshipLogs, setWorshipLogs] = useState<WorshipLog[]>([]);
  const [nextPrayerInfo, setNextPrayerInfo] = useState<any>({
    title: 'Ashar',
    time: '15:18',
    countdownFormatted: '01:24:36',
    progressPercent: 45
  });
  const [hijriInfo, setHijriInfo] = useState<{ formatted: string; day: number; monthName: string; year: number }>(
    hijriService.getHijriDate(new Date())
  );
  const [masehiStr, setMasehiStr] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    const dateFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    setTodayStr(dateFormatted);

    // Compute dynamic Hijri & Masehi dates
    setHijriInfo(hijriService.getHijriDate(now));
    setMasehiStr(now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));

    prayerRepository.getPrayerLog(dateFormatted).then(log => {
      setPrayerLog({
        ...log,
        subuh: true,
        dzuhur: true
      });
    });

    worshipRepository.getWorshipLogsForDate(dateFormatted).then(setWorshipLogs);

    const updateCountdown = () => {
      const info = prayerService.getNextPrayerInfo(lat, lng, methodStr);
      setNextPrayerInfo(info);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lat, lng, methodStr]);

  const handleTogglePrayer = async (pName: PrayerName) => {
    const updated = await prayerRepository.togglePrayer(todayStr, pName);
    setPrayerLog({ ...updated });
    showToast(`${pName.toUpperCase()} ${updated[pName] ? 'telah dicentang' : 'dibatalkan'}`, 'success');
  };

  const todayTimes = prayerService.calculatePrayerTimes(lat, lng, new Date(), methodStr);
  const nextPrayerName = nextPrayerInfo?.name || 'ashar';

  const PRAYER_TIMELINE = [
    { id: 'subuh', title: 'Subuh', time: todayTimes.subuh || '04:47', icon: Moon, isDone: prayerLog.subuh },
    { id: 'dzuhur', title: 'Dzuhur', time: todayTimes.dzuhur || '11:58', icon: Sun, isDone: prayerLog.dzuhur },
    { id: 'ashar', title: 'Ashar', time: todayTimes.ashar || '15:18', icon: Sun, isActive: nextPrayerName === 'ashar', isDone: prayerLog.ashar },
    { id: 'maghrib', title: 'Maghrib', time: todayTimes.maghrib || '18:02', icon: Sun, isDone: prayerLog.maghrib },
    { id: 'isya', title: 'Isya', time: todayTimes.isya || '19:11', icon: Moon, isDone: prayerLog.isya }
  ];

  const QUICK_ACCESS_ITEMS = [
    { id: 'quran', title: 'Quran', icon: BookOpen, color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' },
    { id: 'radio', title: 'Audio', icon: Radio, color: 'text-purple-400 bg-purple-500/20 border-purple-500/30' },
    { id: 'qibla', title: 'Qibla', icon: Compass, color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30' },
    { id: 'mosque', title: 'Mosques', icon: MapPin, color: 'text-blue-400 bg-blue-500/20 border-blue-500/30' },
    { id: 'tasbih', title: 'Tasbih', icon: CircleDot, color: 'text-amber-400 bg-amber-500/20 border-amber-500/30' },
    { id: 'doa', title: 'Doa', icon: Heart, color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30' },
    { id: 'infak', title: 'Infak', icon: HeartHandshake, color: 'text-teal-400 bg-teal-500/20 border-teal-500/30' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Row 1: Hero Card (2 Cols) + Jadwal Shalat Card (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Hero Card (2 Cols) */}
        <div className="lg:col-span-2 cosmic-card-glow rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between min-h-[260px] border border-purple-500/30">
          {/* Cosmic Galaxy Backdrop & Planet Art */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-[#0a0b1c] to-[#080915] pointer-events-none" />
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-600/30 via-indigo-500/20 to-purple-400/10 blur-3xl pointer-events-none" />

          {/* Mosque Silhouette SVG Overlay on Right */}
          <div className="absolute right-4 bottom-0 opacity-40 pointer-events-none hidden sm:block">
            <svg width="280" height="180" viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M140 30 C155 30 165 45 165 65 H115 C115 45 125 30 140 30 Z" fill="url(#grad1)" />
              <path d="M70 70 C80 70 88 80 88 95 H52 C52 80 60 70 70 70 Z" fill="url(#grad1)" />
              <path d="M210 70 C220 70 228 80 228 95 H192 C192 80 200 70 210 70 Z" fill="url(#grad1)" />
              <rect x="100" y="65" width="80" height="115" fill="#12132b" />
              <rect x="45" y="95" width="50" height="85" fill="#12132b" />
              <rect x="185" y="95" width="50" height="85" fill="#12132b" />
              <rect x="10" y="50" width="16" height="130" fill="#0d0e22" />
              <rect x="254" y="50" width="16" height="130" fill="#0d0e22" />
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#12132b" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Glowing Arc Ring Graphic */}
          <div className="absolute top-4 right-12 w-48 h-48 rounded-full border-2 border-purple-400/40 border-t-purple-300 border-r-purple-500/20 blur-[1px] pointer-events-none hidden md:block animate-cosmic-glow" />

          {/* Top Label */}
          <div className="relative z-10">
            <span className="text-xs font-bold text-purple-300/80 uppercase tracking-widest">Shalat Berikutnya</span>
          </div>

          {/* Next Prayer Details */}
          <div className="my-3 relative z-10">
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-wider uppercase">
              {nextPrayerInfo?.title?.toUpperCase() || 'ASHAR'}
            </h3>
            <p className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-300 font-mono tracking-tight mt-1">
              {nextPrayerInfo?.time || '15:18'}
            </p>
          </div>

          {/* Countdown Pill Badge */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-purple-950/70 border border-purple-500/40 backdrop-blur-md">
              <span className="text-sm font-mono font-bold text-amber-300">
                {nextPrayerInfo?.countdownFormatted || '01:24:36'}
              </span>
              <span className="text-[11px] text-purple-200/70 font-medium">
                Menuju waktu {nextPrayerInfo?.title || 'Ashar'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Jadwal Shalat List Card (1 Col) */}
        <div className="cosmic-card rounded-3xl p-5 flex flex-col justify-between border border-[#282552]/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-purple-300/80 uppercase tracking-widest">Jadwal Shalat</h3>
            <span className="text-[10px] text-purple-300/60 font-semibold">{todayTimes.subuh ? 'Hari Ini' : ''}</span>
          </div>

          <div className="space-y-2">
            {PRAYER_TIMELINE.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleTogglePrayer(item.id as PrayerName)}
                  className={`flex items-center justify-between p-2.5 rounded-2xl transition cursor-pointer ${
                    item.isActive
                      ? 'bg-gradient-to-r from-purple-900/90 via-purple-800/80 to-indigo-900/70 border border-purple-500/50 shadow-md shadow-purple-900/30'
                      : 'bg-[#12132b]/50 hover:bg-[#181938]/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${item.isActive ? 'text-amber-300' : 'text-purple-300/60'}`} />
                    <span className={`text-xs font-bold ${item.isActive ? 'text-white' : 'text-purple-100/90'}`}>
                      {item.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-purple-200">{item.time}</span>
                    {item.isDone ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : item.isActive ? (
                      <div className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-amber-300" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-purple-300/30" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveTab('prayer')}
            className="mt-3 text-center text-xs text-purple-300/70 hover:text-white font-bold transition flex items-center justify-center gap-1"
          >
            <span>Lihat semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Row 2: 4 Cards Grid (Today's Prayer, Daily Worship, Today's Progress, Kalender Hijriah) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Today's Prayer */}
        <div className="cosmic-card rounded-3xl p-5 flex flex-col justify-between">
          <h3 className="text-xs font-bold text-purple-300/80 uppercase tracking-widest mb-4">Today's Prayer</h3>
          <div className="flex items-center justify-between gap-1">
            {PRAYER_TIMELINE.map((p) => (
              <div key={p.id} className="flex flex-col items-center gap-1.5 text-center">
                <div
                  onClick={() => handleTogglePrayer(p.id as PrayerName)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition ${
                    p.isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                      : 'border border-purple-300/30 text-purple-300/40 hover:border-purple-400'
                  }`}
                >
                  {p.isDone ? <Check className="w-4 h-4 stroke-[3]" /> : <Circle className="w-4 h-4" />}
                </div>
                <span className="text-[11px] font-bold text-white">{p.title}</span>
                <span className="text-[9px] font-mono text-purple-300/60">{p.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Daily Worship */}
        <div className="cosmic-card rounded-3xl p-5 flex flex-col justify-between">
          <h3 className="text-xs font-bold text-purple-300/80 uppercase tracking-widest mb-3">Daily Worship</h3>
          <div className="space-y-2.5 text-xs">
            {DEFAULT_WORSHIP_TARGETS.map(target => {
              const log = worshipLogs.find(l => l.type === target.type);
              const count = log?.count ?? 0;
              const tgt = target.target;
              const done = count >= tgt;
              return (
                <div key={target.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{target.icon}</span>
                    <span className="text-purple-200">{target.title.split(' ')[0]}</span>
                  </div>
                  {done ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] font-mono text-purple-300/70">{count} / {tgt} {target.unit}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Today's Progress Radial */}
        <div className="cosmic-card rounded-3xl p-5 flex flex-col justify-between text-center">
          <h3 className="text-xs font-bold text-purple-300/80 uppercase tracking-widest mb-2">Today's Progress</h3>
          <div className="my-1 relative flex items-center justify-center">
            {/* SVG Circular Progress Meter */}
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="38" stroke="currentColor" strokeWidth="7" className="text-purple-950" fill="transparent" />
              <circle
                cx="48"
                cy="48"
                r="38"
                stroke="url(#progressGrad)"
                strokeWidth="7"
                strokeDasharray={2 * Math.PI * 38}
                strokeDashoffset={2 * Math.PI * 38 * (1 - 0.72)}
                strokeLinecap="round"
                fill="transparent"
              />
              <defs>
                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-black text-white font-mono">72%</span>
            </div>
          </div>
          <p className="text-[11px] font-bold text-purple-200">Great Progress!</p>
          <div className="flex items-center justify-around pt-2 border-t border-[#282552]/40 text-[9px] text-purple-300/70">
            <div>Prayer 80%</div>
            <div>Worship 70%</div>
            <div>Overall 72%</div>
          </div>
        </div>

        {/* Card 4: Kalender Hijriah Card */}
        <div className="cosmic-card rounded-3xl p-5 flex items-center justify-between relative overflow-hidden border border-purple-500/30">
          <div>
            <h3 className="text-xs font-bold text-purple-300/80 uppercase tracking-widest mb-2">Kalender Hijriah</h3>
            <p className="text-xl font-black text-white">{hijriInfo.day} {hijriInfo.monthName} {hijriInfo.year} H</p>
            <p className="text-xs text-purple-200/70 mt-1">{masehiStr}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-900/60 to-indigo-800/50 border border-purple-500/40 flex items-center justify-center text-amber-300 text-2xl shadow-lg">
            🌙
          </div>
        </div>
      </div>

      {/* Row 3: Quick Access Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-purple-300/80 uppercase tracking-widest">Quick Access</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {QUICK_ACCESS_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="cosmic-card p-4 rounded-3xl border border-[#282552]/50 hover:border-purple-500/60 transition cursor-pointer flex flex-col items-center justify-center gap-2 text-center group active:scale-95"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition transform group-hover:scale-110 ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-purple-200">{item.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 4: Ayat Hari Ini (2 Cols) + Info Keberkahan (1 Col) + Waktu Terbaik (1 Col) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Box 1: Ayat Hari Ini (2 Cols on large screen / 1 Col) */}
        <div className="lg:col-span-2 cosmic-card-glow rounded-3xl p-6 relative overflow-hidden border border-purple-500/30 flex flex-col justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/30 via-purple-950/20 to-transparent pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest">Ayat Hari Ini</h3>
            <span className="text-[10px] text-purple-300/60 font-semibold">(QS. Ali 'Imran: 159)</span>
          </div>

          <div className="relative z-10 space-y-3">
            <p className="text-2xl sm:text-3xl font-arabic text-amber-200 text-right leading-relaxed font-serif">
              فَبِمَا رَحْمَةٍ مِّنَ اللَّهِ لِنتَ لَهُمْ ۖ وَلَوْ كُنتَ فَظًّا غَلِيظَ الْقَلْبِ لَانفَضُّوا مِنْ حَوْلِكَ
            </p>
            <p className="text-xs text-purple-100/90 leading-relaxed italic">
              "Maka disebabkan rahmat dari Allah-lah kamu berlaku lemah lembut terhadap mereka. Sekiranya kamu bersikap keras lagi berhati kasar, tentulah mereka menjauhkan diri dari sekelilingmu."
            </p>
          </div>

          <div className="relative z-10 mt-4 pt-3 border-t border-purple-500/20 flex justify-between items-center">
            <button
              onClick={() => setActiveTab('quran')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-purple-900/60 hover:bg-purple-800/80 text-white text-xs font-bold transition border border-purple-500/40"
            >
              <span>Baca Selengkapnya</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Box 2: Waktu Terbaik Hari Ini */}
        <div className="cosmic-card rounded-3xl p-5 flex flex-col justify-between border border-[#282552]/50">
          <h3 className="text-xs font-bold text-purple-300/80 uppercase tracking-widest mb-3">Waktu Terbaik Hari Ini</h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#12132b]/50">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span className="text-purple-200 font-bold">Tahajjud</span>
              </div>
              <span className="font-mono font-bold text-amber-300">03:32</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-[#12132b]/50">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-purple-200 font-bold">Dhuha</span>
              </div>
              <span className="font-mono font-bold text-amber-300">06:15</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-[#12132b]/50">
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-purple-400" />
                <span className="text-purple-200 font-bold">Istirahat</span>
              </div>
              <span className="font-mono font-bold text-purple-200">13:05</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-[#12132b]/50">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-blue-400" />
                <span className="text-purple-200 font-bold">Qiyamullail</span>
              </div>
              <span className="font-mono font-bold text-purple-200">23:50</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
