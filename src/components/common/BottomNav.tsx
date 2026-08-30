import React, { useState } from 'react';
import {
  Home,
  Clock,
  BookOpen,
  Heart,
  BarChart3,
  Radio,
  Compass,
  MapPin,
  HeartHandshake,
  CircleDot,
  Calendar,
  Settings,
  Sparkles,
  X
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const PRIMARY_NAV = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'prayer', label: 'Prayer', icon: Clock },
    { id: 'center-orb', label: 'Menu', isCenterOrb: true },
    { id: 'worship', label: 'Worship', icon: Heart },
    { id: 'progress', label: 'Progress', icon: BarChart3 }
  ];

  const SECONDARY_NAV = [
    { id: 'quran', label: 'Al-Qur\'an', icon: BookOpen },
    { id: 'radio', label: 'Audio & Radio', icon: Radio },
    { id: 'qibla', label: 'Arah Kiblat', icon: Compass },
    { id: 'mosque', label: 'Masjid Terdekat', icon: MapPin },
    { id: 'infak', label: 'Catatan Infak', icon: HeartHandshake },
    { id: 'tasbih', label: 'Tasbih Digital', icon: CircleDot },
    { id: 'doa', label: 'Doa & Dzikir', icon: Heart },
    { id: 'calendar', label: 'Kalender', icon: Calendar },
    { id: 'settings', label: 'Pengaturan', icon: Settings }
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Quick Menu Bottom Sheet Modal */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-md animate-fade-in lg:hidden">
          <div className="w-full max-w-md cosmic-card rounded-t-3xl p-6 border-t border-purple-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#282552]/40">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Fitur Islami SIRAJ</h3>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 rounded-full bg-purple-900/40 text-purple-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {SECONDARY_NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className="flex flex-col items-center p-3 rounded-2xl bg-[#12132b]/80 border border-[#282552]/40 hover:border-purple-500/50 transition group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-purple-900/40 border border-purple-500/30 text-purple-300 flex items-center justify-center mb-1 group-hover:scale-110 transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-purple-200">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden cosmic-card border-t border-[#282552]/40 px-3 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto relative">
          {PRIMARY_NAV.map((item) => {
            if (item.isCenterOrb) {
              return (
                <button
                  key={item.id}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="relative -top-5 w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 via-purple-600 to-indigo-800 p-0.5 shadow-xl shadow-purple-900/50 active:scale-95 transition transform"
                >
                  <div className="w-full h-full rounded-full bg-[#080915] flex items-center justify-center text-amber-300">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                </button>
              );
            }

            const Icon = item.icon!;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex flex-col items-center gap-1 p-1 transition ${
                  isActive ? 'text-amber-400 font-bold' : 'text-purple-300/50 hover:text-purple-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
