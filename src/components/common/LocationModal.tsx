import React, { useState } from 'react';
import { Modal } from './Modal';
import { INDONESIA_CITIES, type CityLocation } from '../../data/indonesiaCitiesData';
import { MapPin, Navigation, Search, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (name: string, lat: number, lng: number) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation
}) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      showToast('Perangkat anda tidak mendukung Geolocation GPS', 'warning');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const name = `Lokasi Presisi (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`;
        onSelectLocation(name, lat, lng);
        showToast('Berhasil mendapatkan lokasi GPS presisi', 'success');
        onClose();
      },
      (err) => {
        setIsLocating(false);
        showToast('Izin GPS ditolak atau tidak tersedia. Silakan pilih kota manual di bawah.', 'warning');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const filteredCities = INDONESIA_CITIES.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.province.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pilih Lokasi Pengguna" maxWidth="lg">
      <div className="space-y-4">
        {/* GPS Button */}
        <button
          onClick={handleUseGPS}
          disabled={isLocating}
          className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition active:scale-95 disabled:opacity-50"
        >
          <Navigation className={`w-4 h-4 fill-current ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Mendeteksi Koordinat GPS...' : 'Gunakan Deteksi Lokasi Otomatis (GPS)'}</span>
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-slate-400 font-bold">Atau Pilih Kota Manual</span></div>
        </div>

        {/* Search City */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama kota (misal: Surabaya, Bandung, Medan)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Cities List */}
        <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
          {filteredCities.map(city => (
            <button
              key={city.name}
              onClick={() => {
                onSelectLocation(city.name, city.lat, city.lng);
                showToast(`Lokasi diubah ke ${city.name}`, 'info');
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{city.name}</h4>
                  <p className="text-[10px] text-slate-400">{city.province}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};
