import React from 'react';
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
  Calendar as CalendarIcon,
  Settings,
  Sparkles,
  PanelLeftClose,
  Flame,
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onToggleDesktopSidebar?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onToggleDesktopSidebar }) => {
  const MENU_ITEMS = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'prayer', label: 'Prayer', icon: Clock },
    { id: 'quran', label: 'Quran', icon: BookOpen },
    { id: 'worship', label: 'Worship', icon: Heart },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'divider-1', isDivider: true },
    { id: 'radio', label: 'Audio', icon: Radio },
    { id: 'qibla', label: 'Qibla', icon: Compass },
    { id: 'mosque', label: 'Mosques', icon: MapPin },
    { id: 'infak', label: 'Infak', icon: HeartHandshake },
    { id: 'tasbih', label: 'Tasbih', icon: CircleDot },
    { id: 'doa', label: 'Doa & Dzikir', icon: Heart },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'divider-2', isDivider: true },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 cosmic-card border-r border-[#282552]/40 min-h-screen p-5 flex-shrink-0 justify-between">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-purple-600 to-indigo-900 flex items-center justify-center text-amber-300 font-bold shadow-lg shadow-purple-900/40 relative border border-amber-400/30">
              <span className="text-xl font-serif">س</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h1 className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-200 to-white font-serif">
                  SIRAJ
                </h1>
              </div>
              <p className="text-[10px] text-purple-300/70 font-medium tracking-wide">
                Your Daily Worship Companion
              </p>
            </div>
          </div>

          {onToggleDesktopSidebar && (
            <button
              onClick={onToggleDesktopSidebar}
              className="p-1.5 rounded-xl hover:bg-purple-900/40 text-purple-300/60 hover:text-amber-300 transition"
              title="Sembunyikan Sidebar Desktop"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          {MENU_ITEMS.map((item) => {
            if (item.isDivider) {
              return <div key={item.id} className="my-2 border-t border-[#282552]/40" />;
            }

            const Icon = item.icon!;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-900/80 via-purple-800/60 to-indigo-900/50 text-white border border-purple-500/40 shadow-lg shadow-purple-900/30 font-bold'
                    : 'text-purple-200/60 hover:text-white hover:bg-purple-900/20'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isActive ? 'text-amber-400 scale-110' : 'text-purple-300/50'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sidebar Widgets */}
      <div className="space-y-3 pt-4 border-t border-[#282552]/40">
        {/* Streak Widget */}
        <div className="p-3.5 rounded-2xl bg-[#12132b]/80 border border-[#282552]/50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold text-lg shadow-md">
            🔥
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-white">12</span>
              <span className="text-[10px] text-amber-300 font-bold">Streak</span>
            </div>
            <p className="text-[10px] text-purple-300/60 leading-tight">hari berturut-turut</p>
          </div>
        </div>

        {/* User Profile Widget */}
        <div className="p-3 rounded-2xl bg-[#12132b]/80 border border-[#282552]/50 flex items-center justify-between cursor-pointer hover:bg-purple-900/30 transition">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-amber-400 p-0.5 shadow-md">
              <div className="w-full h-full rounded-full bg-[#080915] flex items-center justify-center text-white font-bold text-xs">
                🔮
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Gazz</h4>
              <p className="text-[10px] text-purple-300/60">Jazakumullahu khairan</p>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-purple-300/60" />
        </div>
      </div>
    </aside>
  );
};
