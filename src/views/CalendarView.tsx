import React, { useState } from 'react';
import { hijriService, ISLAMIC_EVENTS } from '../services/hijriService';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Star, Sparkles } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const hijriInfo = hijriService.getHijriDate(currentDate);

  const monthNamesMasehi = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = new Date();
  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="glass-card-emerald rounded-3xl p-6 shadow-xl relative overflow-hidden text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-gold-300 text-xs font-semibold mb-2">
              <CalendarIcon className="w-4 h-4" />
              <span>Kalender Hijriah & Masehi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {hijriInfo.formatted}
            </h2>
            <p className="text-xs text-emerald-100 mt-1">
              Hari ini: {today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Calendar Grid Card */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {monthNamesMasehi[month]} {year}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 mb-2 uppercase">
          <span>Min</span>
          <span>Sen</span>
          <span>Sel</span>
          <span>Rab</span>
          <span>Kam</span>
          <span>Jum</span>
          <span>Sab</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty_${idx}`} className="h-12" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const currentDayDate = new Date(year, month, dayNum);
            const hInfo = hijriService.getHijriDate(currentDayDate);
            const activeToday = isToday(dayNum);

            return (
              <div
                key={dayNum}
                className={`h-14 p-1.5 rounded-2xl flex flex-col justify-between transition border ${
                  activeToday
                    ? 'bg-emerald-600 text-white font-bold border-emerald-500 shadow-md scale-105'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-xs font-bold self-start">{dayNum}</span>
                <span className={`text-[10px] self-end font-medium ${activeToday ? 'text-emerald-100' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {hInfo.day} {hInfo.monthName.substring(0, 3)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Islamic Events List */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-soft">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>Hari Besar & Peristiwa Penting Islam</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ISLAMIC_EVENTS.map(event => (
            <div
              key={event.title}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-gold-400/20 text-gold-600 dark:text-gold-400 flex items-center justify-center font-bold flex-shrink-0">
                ⭐
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{event.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
