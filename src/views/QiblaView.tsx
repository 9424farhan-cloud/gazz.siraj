import React, { useEffect, useState } from 'react';
import { qiblaService } from '../services/qiblaService';
import { Compass as CompassIcon, Navigation, MapPin, Sparkles } from 'lucide-react';

interface QiblaViewProps {
  lat: number;
  lng: number;
  locationName: string;
}

export const QiblaView: React.FC<QiblaViewProps> = ({ lat, lng, locationName }) => {
  const [qiblaBearing, setQiblaBearing] = useState<number>(292);
  const [distanceKm, setDistanceKm] = useState<number>(7842);

  useEffect(() => {
    const bearing = qiblaService.calculateQiblaBearing(lat, lng);
    const dist = qiblaService.calculateDistanceToKaaba(lat, lng);
    setQiblaBearing(bearing);
    setDistanceKm(dist);
  }, [lat, lng]);

  return (
    <div className="space-y-6 pb-12 max-w-xl mx-auto text-center">
      {/* Header */}
      <div className="cosmic-card-glow rounded-3xl p-6 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-900/60 text-amber-300 text-xs font-semibold mb-2 border border-purple-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Kompas Kiblat Presisi</span>
        </div>
        <h2 className="text-2xl font-black text-white font-serif">Arah Kiblat</h2>
        <p className="text-xs text-purple-200/80 mt-1">
          Arah sudut Ka'bah dari lokasi {locationName}
        </p>
      </div>

      {/* Main Glowing Qibla Dial */}
      <div className="cosmic-card rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Glowing Dial Background */}
        <div className="relative w-64 h-64 flex items-center justify-center my-4">
          <div className="w-full h-full rounded-full border-4 border-purple-500/30 bg-gradient-to-tr from-purple-950/60 via-indigo-900/40 to-purple-900/60 p-2 shadow-2xl flex items-center justify-center relative">
            {/* North Indicator */}
            <span className="absolute top-2 text-xs font-black text-purple-300">U</span>
            <span className="absolute bottom-2 text-xs font-black text-purple-300/40">S</span>
            <span className="absolute left-2 text-xs font-black text-purple-300/40">B</span>
            <span className="absolute right-2 text-xs font-black text-purple-300/40">T</span>

            {/* Rotating Qibla Needle */}
            <div
              className="w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
              style={{ transform: `rotate(${qiblaBearing}deg)` }}
            >
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center shadow-lg shadow-amber-400/50 mb-1">
                  🕋
                </div>
                <div className="w-1 h-20 bg-gradient-to-b from-amber-400 to-purple-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Degree & Distance Specs */}
        <div className="space-y-1 mt-2">
          <h3 className="text-4xl font-black text-white font-mono tracking-wider">
            {qiblaBearing}°
          </h3>
          <p className="text-xs font-semibold text-purple-300/80">Arah Kiblat (Derajat)</p>
          <p className="text-xs text-amber-300 font-bold pt-2">
            Jarak ke Ka'bah: {distanceKm.toLocaleString('id-ID')} km
          </p>
        </div>
      </div>
    </div>
  );
};
