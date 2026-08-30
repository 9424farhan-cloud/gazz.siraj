import React, { useState } from 'react';
import { CircleDot, RotateCcw, Plus, Minus, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const PRESET_DZIKIR = [
  { id: 'subhanallah', name: 'Subhanallah', arabic: 'سُبْحَانَ اللَّهِ', target: 33 },
  { id: 'alhamdulillah', name: 'Alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', target: 33 },
  { id: 'allahuakbar', name: 'Allahu Akbar', arabic: 'اللَّهُ أَكْبَرُ', target: 33 },
  { id: 'astaghfirullah', name: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ', target: 100 }
];

export const TasbihView: React.FC = () => {
  const { showToast } = useToast();
  const [selectedDzikir, setSelectedDzikir] = useState(PRESET_DZIKIR[0]);
  const [count, setCount] = useState<number>(230);
  const [target, setTarget] = useState<number>(500);

  const handleIncrement = () => {
    const next = count + 1;
    setCount(next);
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const handleDecrement = () => {
    setCount(prev => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setCount(0);
    showToast('Hitungan tasbih telah direset', 'info');
  };

  return (
    <div className="space-y-6 pb-12 max-w-xl mx-auto text-center">
      {/* Header */}
      <div className="cosmic-card-glow rounded-3xl p-6 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-900/60 text-amber-300 text-xs font-semibold mb-2 border border-purple-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tasbih Digital Counter</span>
        </div>
        <h2 className="text-2xl font-black text-white font-serif">{selectedDzikir.name}</h2>
        <p className="text-xl font-serif text-amber-300 my-1">{selectedDzikir.arabic}</p>
      </div>

      {/* Preset Selector Pill Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PRESET_DZIKIR.map(item => (
          <button
            key={item.id}
            onClick={() => { setSelectedDzikir(item); setCount(0); setTarget(item.target); }}
            className={`p-2.5 rounded-2xl text-xs font-bold transition border ${
              selectedDzikir.id === item.id
                ? 'bg-purple-900/80 border-purple-500/60 text-amber-300 shadow-md shadow-purple-900/30'
                : 'cosmic-card border-[#282552]/40 text-purple-200/70 hover:text-white'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Main Glowing Circular Counter Tap Button */}
      <div className="cosmic-card rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
        <button
          onClick={handleIncrement}
          className="relative w-56 h-56 rounded-full bg-gradient-to-tr from-purple-950 via-indigo-900 to-purple-800 p-1.5 shadow-2xl shadow-purple-900/60 border-2 border-purple-500/40 hover:scale-105 active:scale-95 transition transform group flex items-center justify-center my-4"
        >
          <div className="w-full h-full rounded-full bg-[#080915] flex flex-col items-center justify-center p-4">
            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-purple-200 font-mono tracking-tight">
              {count}
            </span>
            <span className="text-xs font-bold text-purple-300/60 mt-1">/ {target}</span>
            <span className="text-[11px] font-semibold text-amber-300 mt-2">Ketuk untuk Menguji</span>
          </div>
        </button>

        {/* Counter Action Buttons */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={handleDecrement}
            className="w-12 h-12 rounded-2xl bg-[#12132b] text-purple-200 border border-[#282552] flex items-center justify-center hover:bg-purple-900/40 transition active:scale-95"
            title="Kurangi 1"
          >
            <Minus className="w-5 h-5" />
          </button>

          <button
            onClick={handleReset}
            className="w-12 h-12 rounded-2xl bg-[#12132b] text-purple-200 border border-[#282552] flex items-center justify-center hover:bg-purple-900/40 transition active:scale-95"
            title="Reset Counter"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleIncrement}
            className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-purple-500/40 flex items-center justify-center hover:from-purple-500 hover:to-indigo-500 transition active:scale-95 shadow-md shadow-purple-900/40"
            title="Tambah 1"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* History Metrics Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="cosmic-card p-4 rounded-2xl border border-[#282552]/40 text-center">
          <p className="text-[10px] text-purple-300/60 font-semibold uppercase">Hari Ini</p>
          <p className="text-lg font-black text-white font-mono mt-0.5">230</p>
        </div>
        <div className="cosmic-card p-4 rounded-2xl border border-[#282552]/40 text-center">
          <p className="text-[10px] text-purple-300/60 font-semibold uppercase">Kemarin</p>
          <p className="text-lg font-black text-purple-300 font-mono mt-0.5">150</p>
        </div>
        <div className="cosmic-card p-4 rounded-2xl border border-[#282552]/40 text-center">
          <p className="text-[10px] text-purple-300/60 font-semibold uppercase">Terbaik</p>
          <p className="text-lg font-black text-amber-300 font-mono mt-0.5">560</p>
        </div>
      </div>
    </div>
  );
};
