import React, { useEffect, useState } from 'react';
import { settingsRepository } from '../services/repositories/settingsRepository';
import { backupService } from '../services/backupService';
import type { AppSettings } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Laptop,
  Download,
  Upload,
  Trash2,
  MapPin,
  Clock,
  BookOpen,
  Volume2,
  ShieldCheck,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface SettingsViewProps {
  onOpenLocationModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenLocationModal }) => {
  const { showToast } = useToast();
  const { theme, setTheme } = useTheme();

  const [settings, setSettingsState] = useState<AppSettings>({
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

  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [pendingRestoreData, setPendingRestoreData] = useState<any>(null);

  useEffect(() => {
    settingsRepository.getSettings().then(setSettingsState);
  }, []);

  const handleUpdate = async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettingsState(updated);
    await settingsRepository.updateSetting(key, value);
    if (key === 'theme') {
      setTheme(value as any);
    }
    showToast('Pengaturan disimpan', 'success');
  };

  // BACKUP & RESTORE
  const handleExportJSON = async () => {
    try {
      const jsonStr = await backupService.exportDataJSON();
      backupService.downloadJSONFile(jsonStr);
      showToast('File backup SIRAJ berhasil diunduh', 'success');
    } catch (e) {
      showToast('Gagal mengekspor data backup', 'error');
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const jsonText = evt.target?.result as string;
      const res = backupService.validateJSON(jsonText);
      if (!res.valid) {
        showToast(res.error || 'File JSON tidak valid', 'error');
        return;
      }
      setPendingRestoreData(res.data);
      setIsRestoreModalOpen(true);
    };
    reader.readAsText(file);
  };

  const handleConfirmRestore = async () => {
    if (!pendingRestoreData) return;
    try {
      await backupService.restoreData(pendingRestoreData);
      setIsRestoreModalOpen(false);
      showToast('Data berhasil dipulihkan dari backup! Halaman akan dimuat ulang...', 'success');
      setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      showToast('Gagal memulihkan data dari backup', 'error');
    }
  };

  const handleConfirmClearData = async () => {
    try {
      await backupService.clearAllData();
      setIsClearModalOpen(false);
      showToast('Seluruh data aplikasi telah dihapus. Halaman akan dimuat ulang...', 'info');
      setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      showToast('Gagal menghapus data', 'error');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="cosmic-card rounded-3xl p-6 border border-purple-500/20">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
          <SettingsIcon className="w-4 h-4" />
          <span>Pengaturan Aplikasi</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white">
          Preferensi & Keselamatan Data
        </h2>
        <p className="text-xs text-purple-300/70 mt-1">
          Atur tampilan, metode shalat, audio, dan cadangkan data anda secara mandiri.
        </p>
      </div>

      {/* 1. TAMPILAN (APPEARANCE) */}
      <div className="cosmic-card rounded-3xl p-6 border border-purple-500/20 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-400" />
          <span>Tampilan & Tema</span>
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleUpdate('theme', 'light')}
            className={`p-3.5 rounded-2xl border text-center font-bold text-xs flex flex-col items-center gap-2 transition ${
              settings.theme === 'light'
                ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                : 'bg-[#12132b]/80 border-[#282552]/60 text-purple-200 hover:border-purple-500/40'
            }`}
          >
            <Sun className="w-5 h-5" />
            <span>Terang (Light)</span>
          </button>

          <button
            onClick={() => handleUpdate('theme', 'dark')}
            className={`p-3.5 rounded-2xl border text-center font-bold text-xs flex flex-col items-center gap-2 transition ${
              settings.theme === 'dark'
                ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                : 'bg-[#12132b]/80 border-[#282552]/60 text-purple-200 hover:border-purple-500/40'
            }`}
          >
            <Moon className="w-5 h-5" />
            <span>Gelap (Dark)</span>
          </button>

          <button
            onClick={() => handleUpdate('theme', 'system')}
            className={`p-3.5 rounded-2xl border text-center font-bold text-xs flex flex-col items-center gap-2 transition ${
              settings.theme === 'system'
                ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                : 'bg-[#12132b]/80 border-[#282552]/60 text-purple-200 hover:border-purple-500/40'
            }`}
          >
            <Laptop className="w-5 h-5" />
            <span>Sistem</span>
          </button>
        </div>
      </div>

      {/* 2. PRAYER SETTINGS */}
      <div className="cosmic-card rounded-3xl p-6 border border-purple-500/20 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          <span>Pengaturan Shalat & Lokasi</span>
        </h3>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#12132b]/80 border border-[#282552]/60">
          <div>
            <h4 className="text-sm font-bold text-white">Lokasi Saat Ini</h4>
            <p className="text-xs text-purple-300/70">{settings.locationName}</p>
          </div>
          <button
            onClick={onOpenLocationModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md hover:from-purple-500 hover:to-indigo-500 transition"
          >
            Ubah Lokasi
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-purple-300/80 uppercase tracking-wider mb-2">
            Metode Perhitungan Waktu Shalat
          </label>
          <select
            value={settings.calculationMethod}
            onChange={(e) => handleUpdate('calculationMethod', e.target.value as any)}
            className="w-full px-4 py-2.5 rounded-2xl bg-[#12132b]/80 border border-[#282552]/60 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="KEMENAG">Kemenag RI / Standar Asia Tenggara (Fajr 20°, Isha 18°)</option>
            <option value="MWL">Muslim World League (MWL)</option>
            <option value="EGYPTIAN">Egyptian General Authority of Survey</option>
            <option value="ISNA">Islamic Society of North America (ISNA)</option>
            <option value="UMM_AL_QURA">Umm al-Qura University, Makkah</option>
          </select>
        </div>
      </div>

      {/* 3. DATA SAFETY & BACKUP RESTORE */}
      <div className="cosmic-card rounded-3xl p-6 border border-purple-500/20 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>Data Safety, Backup & Restore</span>
        </h3>
        <p className="text-xs text-purple-300/70">
          Data tersimpan di IndexedDB browser perangkat anda. Ekspor file backup secara berkala untuk menjaga keamanan data.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleExportJSON}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Backup Data (JSON)</span>
          </button>

          <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#12132b]/80 hover:bg-purple-900/30 text-purple-200 font-bold text-xs transition border border-[#282552]/60 cursor-pointer">
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Impor / Pulihkan Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
        </div>

        <div className="pt-4 border-t border-[#282552]/40">
          <button
            onClick={() => setIsClearModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 font-bold text-xs transition border border-rose-500/30"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus Seluruh Data (Clear Data)</span>
          </button>
        </div>
      </div>

      {/* 4. ABOUT */}
      <div className="cosmic-card rounded-3xl p-6 border border-purple-500/20 text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-purple-600 to-indigo-900 text-amber-200 font-bold text-2xl mx-auto flex items-center justify-center shadow-lg shadow-purple-900/40 border border-amber-400/30">
          س
        </div>
        <h3 className="text-lg font-extrabold text-white">SIRAJ v1.0.0</h3>
        <p className="text-xs text-purple-300/70">
          Your Daily Worship Companion • Modern, Elegan, Tenang & Offline-First PWA
        </p>
        <div className="pt-3 flex justify-center">
          <button
            onClick={() => {
              sessionStorage.removeItem('SIRAJ_WELCOME_DISMISSED');
              window.dispatchEvent(new Event('siraj-show-welcome'));
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/50 hover:to-teal-600/50 border border-emerald-400/40 text-emerald-200 hover:text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <span>✨ Buka Layar Sambutan (Welcome Screen)</span>
          </button>
        </div>
        <p className="text-[11px] text-purple-300/50 pt-2 border-t border-[#282552]/40">
          Privasi Terjamin • Tidak Mengirimkan Data Lokasi atau Keuangan ke Server Luar
        </p>
      </div>

      {/* RESTORE CONFIRMATION MODAL */}
      <Modal isOpen={isRestoreModalOpen} onClose={() => setIsRestoreModalOpen(false)} title="Konfirmasi Pemulihan Data">
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Perhatian Pemulihan Backup:</p>
              <p className="mt-1">
                Data dari file backup JSON ini akan digabungkan dan memperbarui database IndexedDB lokal anda. Pastikan anda yakin.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsRestoreModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-purple-300/70 hover:text-white transition"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmRestore}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md hover:from-purple-500 hover:to-indigo-500 transition"
            >
              Pulihkan Data Sekarang
            </button>
          </div>
        </div>
      </Modal>

      {/* CLEAR DATA CONFIRMATION MODAL */}
      <Modal isOpen={isClearModalOpen} onClose={() => setIsClearModalOpen(false)} title="Konfirmasi Hapus Seluruh Data">
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Apakah Anda Yakin?</p>
              <p className="mt-1">
                Tindakan ini akan **MENGHAPUS SEMUA DATA** berikut dari IndexedDB:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-[11px]">
                <li>Riwayat checklist shalat fardhu</li>
                <li>Progres tracker ibadah harian</li>
                <li>Seluruh catatan infak & sedekah</li>
                <li>Riwayat tasbih digital & penanda Al-Qur'an</li>
                <li>Pengaturan preferensi lokasi & tema</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsClearModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-purple-300/70 hover:text-white transition"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmClearData}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
            >
              Ya, Hapus Permanen
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
