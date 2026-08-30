import React, { useEffect, useState } from 'react';
import { Search, Bell, MapPin, Download, Calendar, Moon, Sun, PanelLeftClose, PanelLeft } from 'lucide-react';
import { hijriService } from '../../services/hijriService';

interface HeaderProps {
  locationName: string;
  onOpenLocationModal: () => void;
  activeTab: string;
  isDesktopSidebarVisible: boolean;
  onToggleDesktopSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  locationName,
  onOpenLocationModal,
  activeTab,
  isDesktopSidebarVisible,
  onToggleDesktopSidebar
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);
  const [currentHijriStr, setCurrentHijriStr] = useState<string>('5 Safar 1448 H');
  const [currentMasehiStr, setCurrentMasehiStr] = useState<string>('29 Agustus 2026');

  useEffect(() => {
    const now = new Date();
    setCurrentMasehiStr(
      now.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    );
    setCurrentHijriStr(hijriService.getHijriDate(now).formatted);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsAppInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <header className="sticky top-0 z-40 w-full cosmic-card border-b border-[#282552]/40 px-4 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Left Greeting & Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleDesktopSidebar}
          className="hidden lg:flex items-center gap-2 p-2 rounded-2xl bg-[#12132b]/80 hover:bg-purple-900/40 text-xs font-semibold text-purple-200 transition border border-[#282552]/50"
          title={isDesktopSidebarVisible ? 'Sembunyikan Sidebar Desktop' : 'Tampilkan Sidebar Desktop'}
        >
          {isDesktopSidebarVisible ? (
            <PanelLeftClose className="w-4 h-4 text-amber-400" />
          ) : (
            <PanelLeft className="w-4 h-4 text-purple-300" />
          )}
        </button>

        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center text-amber-300 font-bold shadow-md">
            <span className="text-base font-serif">س</span>
          </div>
          <span className="font-extrabold text-lg text-white font-serif tracking-wider">SIRAJ</span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Assalamu'alaikum, Gazz <span className="animate-bounce">👋</span>
          </h2>
          <p className="text-xs text-purple-300/70 font-medium">
            Semoga harimu penuh keberkahan.
          </p>
        </div>
      </div>

      {/* Right Actions & Badges Group */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Date Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#12132b]/80 border border-[#282552]/50 text-xs text-purple-200">
          <div className="text-right leading-tight">
            <p className="font-bold text-white text-[11px]">{currentMasehiStr}</p>
            <p className="text-[10px] text-amber-300 font-medium">{currentHijriStr}</p>
          </div>
          <Calendar className="w-4 h-4 text-purple-400" />
        </div>

        {/* Location Selector Trigger */}
        <button
          onClick={onOpenLocationModal}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#12132b]/80 hover:bg-purple-900/40 text-xs font-bold text-purple-200 transition border border-[#282552]/50"
        >
          <span className="max-w-[120px] sm:max-w-[150px] truncate">{locationName}</span>
          <MapPin className="w-4 h-4 text-purple-400" />
        </button>

        {/* Weather Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#12132b]/80 border border-[#282552]/50 text-xs text-purple-200">
          <Moon className="w-4 h-4 text-blue-300" />
          <div className="leading-tight text-left">
            <p className="font-bold text-white text-[11px]">27°C</p>
            <p className="text-[10px] text-purple-300/70">Cerah</p>
          </div>
        </div>

        {/* PWA Install Button */}
        {deferredPrompt && !isAppInstalled && (
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-purple-900/40"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Install App</span>
          </button>
        )}
      </div>
    </header>
  );
};
