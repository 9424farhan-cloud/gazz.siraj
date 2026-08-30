import React, { Component, ErrorInfo, ReactNode, useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AudioProvider } from './context/AudioContext';
import { settingsRepository } from './services/repositories/settingsRepository';
import type { AppSettings } from './types';

import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { GlobalAudioPlayer } from './components/common/GlobalAudioPlayer';
import { ToastContainer } from './components/common/ToastContainer';
import { LocationModal } from './components/common/LocationModal';

import { HomeView } from './views/HomeView';
import { PrayerView } from './views/PrayerView';
import { WorshipView } from './views/WorshipView';
import { QuranView } from './views/QuranView';
import { RadioView } from './views/RadioView';
import { QiblaView } from './views/QiblaView';
import { MosqueView } from './views/MosqueView';
import { InfakView } from './views/InfakView';
import { ProgressView } from './views/ProgressView';
import { TasbihView } from './views/TasbihView';
import { DoaView } from './views/DoaView';
import { CalendarView } from './views/CalendarView';
import { SettingsView } from './views/SettingsView';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SIRAJ Error Boundary Caught Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#080915] text-white text-center">
          <div className="max-w-md w-full cosmic-card p-8 rounded-3xl border border-rose-500/40 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold border border-rose-500/30">
              ⚠️
            </div>
            <h2 className="text-xl font-bold mb-2 text-white">SIRAJ mengalami masalah</h2>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              {this.state.error?.message || 'Terjadi kesalahan sistem saat memuat komponen.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg transition"
              >
                Coba Lagi
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-purple-200 text-xs font-bold transition border border-purple-500/30"
              >
                Kembali ke Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTabState] = useState<string>('home');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'system',
    locationName: 'Jakarta (DKI Jakarta)',
    latitude: -6.2088,
    longitude: 106.8456,
    calculationMethod: 'KEMENAG',
    quranFontSize: 28,
    selectedQari: 'ar.alafasy',
    volume: 0.8,
    autoPlayNextAyah: true,
    prayerNotifications: { subuh: true, dzuhur: true, ashar: true, maghrib: true, isya: true }
  });

  const [isDesktopSidebarVisible, setIsDesktopSidebarVisible] = useState<boolean>(() => {
    const saved = localStorage.getItem('SIRAJ_SIDEBAR_VISIBLE');
    return saved !== null ? saved === 'true' : true;
  });

  const handleToggleDesktopSidebar = () => {
    setIsDesktopSidebarVisible(prev => {
      const next = !prev;
      localStorage.setItem('SIRAJ_SIDEBAR_VISIBLE', String(next));
      return next;
    });
  };

  useEffect(() => {
    const syncTabFromHash = () => {
      const hash = window.location.hash.replace('#', '').replace('/', '').trim();
      const validTabs = ['home', 'prayer', 'worship', 'quran', 'radio', 'qibla', 'mosque', 'infak', 'progress', 'tasbih', 'doa', 'calendar', 'settings'];
      if (validTabs.includes(hash)) {
        setActiveTabState(hash);
      } else {
        setActiveTabState('home');
      }
    };

    syncTabFromHash();
    window.addEventListener('hashchange', syncTabFromHash);
    return () => window.removeEventListener('hashchange', syncTabFromHash);
  }, []);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    window.location.hash = tab === 'home' ? '' : `#${tab}`;
  };

  useEffect(() => {
    settingsRepository.getSettings().then(setSettings).catch(err => {
      console.warn('Failed to load settings in AppContent:', err);
    });
  }, []);

  const handleSelectLocation = async (name: string, lat: number, lng: number) => {
    const updated = { ...settings, locationName: name, latitude: lat, longitude: lng };
    setSettings(updated);
    await settingsRepository.updateSetting('locationName', name);
    await settingsRepository.updateSetting('latitude', lat);
    await settingsRepository.updateSetting('longitude', lng);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Desktop Sidebar */}
      {isDesktopSidebarVisible && (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onToggleDesktopSidebar={handleToggleDesktopSidebar}
        />
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          locationName={settings.locationName}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
          activeTab={activeTab}
          isDesktopSidebarVisible={isDesktopSidebarVisible}
          onToggleDesktopSidebar={handleToggleDesktopSidebar}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'home' && (
            <HomeView
              locationName={settings.locationName}
              lat={settings.latitude}
              lng={settings.longitude}
              methodStr={settings.calculationMethod}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'prayer' && (
            <PrayerView
              locationName={settings.locationName}
              lat={settings.latitude}
              lng={settings.longitude}
              methodStr={settings.calculationMethod}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'worship' && <WorshipView />}

          {activeTab === 'quran' && <QuranView />}

          {activeTab === 'radio' && <RadioView />}

          {activeTab === 'qibla' && (
            <QiblaView
              lat={settings.latitude}
              lng={settings.longitude}
              locationName={settings.locationName}
            />
          )}

          {activeTab === 'mosque' && (
            <MosqueView
              lat={settings.latitude}
              lng={settings.longitude}
              locationName={settings.locationName}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
            />
          )}

          {activeTab === 'infak' && <InfakView />}

          {activeTab === 'progress' && <ProgressView />}

          {activeTab === 'tasbih' && <TasbihView />}

          {activeTab === 'doa' && <DoaView />}

          {activeTab === 'calendar' && <CalendarView />}

          {activeTab === 'settings' && (
            <SettingsView onOpenLocationModal={() => setIsLocationModalOpen(true)} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Global Persistent Audio Player */}
      <GlobalAudioPlayer />

      {/* Global Toast Container */}
      <ToastContainer />

      {/* Location Picker Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocation={handleSelectLocation}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AudioProvider>
            <AppContent />
          </AudioProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
