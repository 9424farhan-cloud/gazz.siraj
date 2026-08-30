import React, { useEffect, useState } from 'react';
import { mosqueService } from '../services/mosqueService';
import type { Mosque } from '../types';
import { MapPin, Search, ExternalLink, Navigation, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface MosqueViewProps {
  lat: number;
  lng: number;
  locationName: string;
  onOpenLocationModal: () => void;
}

export const MosqueView: React.FC<MosqueViewProps> = ({ lat, lng, locationName, onOpenLocationModal }) => {
  const { showToast } = useToast();
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchMosques();
  }, [lat, lng]);

  const fetchMosques = async () => {
    setLoading(true);
    try {
      const list = await mosqueService.findNearbyMosques(lat, lng);
      setMosques(list);
    } catch {
      showToast('Gagal memuat daftar masjid terdekat', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtered = mosques.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="cosmic-card-glow rounded-3xl p-6 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-900/60 text-amber-300 text-xs font-semibold mb-2 border border-purple-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pencari Masjid Terdekat</span>
        </div>
        <h2 className="text-2xl font-black text-white font-serif">Masjid Terdekat</h2>
        <p className="text-xs text-purple-200/80 mt-1">
          Daftar masjid di sekitar lokasi {locationName}
        </p>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl cosmic-card border border-[#282552]/50 text-sm">
        <Search className="w-5 h-5 text-purple-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama masjid..."
          className="bg-transparent border-none outline-none text-white placeholder-purple-300/40 w-full"
        />
      </div>

      {/* List Grid */}
      {loading ? (
        <div className="cosmic-card p-12 rounded-3xl text-center">
          <div className="w-10 h-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-xs text-purple-200">Mencari masjid di sekitar anda...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="cosmic-card p-5 rounded-3xl border border-[#282552]/50 hover:border-purple-500/60 transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-purple-900/40 border border-purple-500/30 text-amber-300 flex items-center justify-center font-bold text-lg">
                  🕌
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{m.name}</h4>
                  <p className="text-xs text-purple-300/70 mt-0.5">
                    {m.distanceKm} km • ~{Math.round(m.distanceKm * 10)} menit
                  </p>
                </div>
              </div>

              <a
                href={mosqueService.getGoogleMapsUrl(m.lat, m.lng, m.name)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-md shadow-purple-900/40"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Petunjuk Arah</span>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
