import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Moon, LogIn, ChevronRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import welcomeLandscapeImg from '../../assets/welcome-landscape.jpg';

interface WelcomeScreenProps {
  onEnter: (targetTab?: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const { user, signInWithGoogle, loading: authLoading } = useAuth();
  const [isExiting, setIsExiting] = useState(false);
  const [rippleActive, setRippleActive] = useState(false);
  const [ripplePos, setRipplePos] = useState({ x: 50, y: 50 });
  const [imgLoaded, setImgLoaded] = useState(false);

  // Preload landscape image smoothly
  useEffect(() => {
    const img = new Image();
    img.src = welcomeLandscapeImg;
    img.onload = () => setImgLoaded(true);
    img.onerror = () => setImgLoaded(true); // gracefully fall back
  }, []);

  // Twinkling stars distributed panoramically
  const stars = React.useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${(i * 13 + 3) % 96 + 2}%`,
      top: `${(i * 19 + 7) % 85 + 2}%`,
      size: i % 4 === 0 ? 2.8 : i % 2 === 0 ? 1.8 : 1.2,
      opacity: ((i * 17) % 65 + 25) / 100,
      duration: `${((i % 4) + 2.5).toFixed(1)}s`,
      delay: `${((i * 0.35) % 3).toFixed(1)}s`,
      color: i % 5 === 0 ? '#fef08a' : i % 3 === 0 ? '#a7f3d0' : '#e0e7ff',
    }));
  }, []);

  const handleEnterApp = (e?: React.MouseEvent, tab: string = 'home') => {
    if (isExiting) return;

    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setRipplePos({ x, y });
    }

    setRippleActive(true);
    setIsExiting(true);

    // Smooth exit sequence
    setTimeout(() => {
      onEnter(tab);
    }, 700);
  };

  return (
    <div
      className={`fixed inset-0 z-50 w-screen h-screen flex flex-col justify-between select-none overflow-hidden transition-all duration-700 ease-in-out bg-[#04060f] text-slate-100 ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 1. Panoramic Landscape Background Layer */}
      <div
        className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 ease-out ${
          isExiting ? 'scale-110 brightness-110' : 'scale-100'
        } ${imgLoaded ? 'opacity-100' : 'opacity-80'}`}
        style={{
          backgroundImage: `url(${welcomeLandscapeImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 45%',
          backgroundColor: '#04060f',
        }}
      />

      {/* 2. Atmospheric Overlays & Cosmic Vignettes */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#04060f]/90 via-[#04060f]/60 to-[#04060f]/85" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#04060f]/75 via-transparent to-[#04060f]/90" />

      {/* Dynamic Nebulae Glow */}
      <div className="absolute top-10 left-10 w-[500px] h-[350px] rounded-full bg-purple-600/25 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[400px] rounded-full bg-indigo-600/20 blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-violet-500/15 blur-[130px] pointer-events-none" />

      {/* 3. Twinkling Cosmic Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
              opacity: star.opacity,
              animation: `sirajTwinkle ${star.duration} ease-in-out infinite`,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* 4. Landscape Header Bar */}
      <header className="relative z-20 w-full px-4 sm:px-8 lg:px-12 pt-3 sm:pt-6 landscape:pt-2 flex items-center justify-between flex-shrink-0">
        {/* Left: Brand Badge */}
        <div className="flex items-center gap-3 bg-slate-950/50 backdrop-blur-md px-3 sm:px-3.5 py-1.5 rounded-2xl border border-purple-400/30 shadow-lg shadow-purple-950/40">
          <div className="w-1 h-5 sm:h-6 bg-gradient-to-b from-purple-300 via-violet-400 to-indigo-500 rounded-full" />
          <div className="flex flex-col text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-purple-200/90 leading-tight">
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-amber-300">SIRAJ</span>
            <span className="text-[9px] text-slate-300 tracking-wider">Islamic Companion</span>
          </div>
        </div>

        {/* Center: Arabic Calligraphy Basmalah with luminous glow */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 backdrop-blur-md shadow-md shadow-purple-950/40">
          <span
            className="text-amber-200/95 text-sm sm:text-xl lg:text-2xl font-arabic tracking-wide drop-shadow-[0_2px_12px_rgba(245,158,11,0.4)] select-none"
            style={{ fontFamily: 'Amiri, serif' }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
        </div>

        {/* Right: User Login / Status */}
        <div className="flex items-center gap-3">
          {!user ? (
            <button
              onClick={() => signInWithGoogle()}
              disabled={authLoading}
              className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-semibold transition backdrop-blur-md flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Masuk dengan Akun Google"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Masuk Akun</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-purple-500/30 text-xs text-purple-200 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span className="max-w-[120px] truncate font-medium">{user.displayName || 'Tersambung'}</span>
            </div>
          )}
        </div>
      </header>

      {/* 5. Main Landscape 2-Column Panorama */}
      <main className="relative z-20 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-2 sm:py-6 landscape:py-1.5 flex items-center overflow-y-auto min-h-0">
        <div className="w-full grid grid-cols-1 md:grid-cols-12 landscape:grid-cols-12 gap-4 sm:gap-6 md:gap-8 lg:gap-10 items-center my-auto">
          
          {/* LEFT COLUMN: Grand Islamic Typography & Identity */}
          <div className="md:col-span-7 landscape:col-span-7 flex flex-col items-center md:items-start landscape:items-start text-center md:text-left landscape:text-left space-y-2 sm:space-y-4 landscape:space-y-1.5">
            
            {/* Spiritual Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-500/25 via-violet-500/20 to-transparent border border-purple-400/35 backdrop-blur-md text-purple-200 text-[10px] sm:text-xs font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
              <span>Lentera Cahaya Harian Muslim Indonesia</span>
            </div>

            {/* Brand Title: SIRAJ */}
            <div>
              <h1
                className="text-4xl sm:text-6xl md:text-6xl lg:text-8xl landscape:text-4xl lg:landscape:text-7xl font-black tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-200 to-amber-400 drop-shadow-[0_4px_35px_rgba(168,85,247,0.5)] leading-tight"
                style={{ fontFamily: 'serif' }}
              >
                S I R A J
              </h1>
              <p className="text-[11px] sm:text-sm lg:text-base landscape:text-[11px] font-light tracking-[0.35em] uppercase text-purple-100/90 mt-0.5 sm:mt-1">
                Your Islamic Digital Companion
              </p>
            </div>

            {/* Golden Divider with Star */}
            <div className="flex items-center gap-3 w-40 sm:w-64 my-0.5 sm:my-1">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-purple-400" />
              <span className="text-amber-300 text-xs drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]">✦</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-purple-400/60 to-purple-400" />
            </div>

            {/* Inspiring Ayah & Tagline */}
            <blockquote className="max-w-xl text-xs sm:text-sm lg:text-base landscape:text-xs text-purple-100/90 font-light leading-relaxed italic drop-shadow bg-slate-950/30 md:bg-transparent landscape:bg-transparent p-2.5 sm:p-3 md:p-0 landscape:p-0 rounded-2xl border border-white/5 md:border-none landscape:border-none">
              “Dan sebutlah nama Tuhanmu pada waktu pagi dan petang.”
              <span className="block text-[10px] sm:text-xs text-amber-300/80 not-italic font-normal mt-0.5 sm:mt-1">
                QS. Al-Insan: 25 • Perjalanan berkah dimulai dari satu langkah istiqomah
              </span>
            </blockquote>

            {/* Feature Highlights Pills */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5 sm:pt-1 justify-center md:justify-start landscape:justify-start">
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-slate-900/60 border border-purple-500/30 text-purple-200 text-[10px] sm:text-[11px] font-medium backdrop-blur-sm">
                <BookOpen className="w-3 h-3 text-purple-400" />
                Al-Qur'an 30 Juz & Audio
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-slate-900/60 border border-amber-500/25 text-amber-300 text-[10px] sm:text-[11px] font-medium backdrop-blur-sm">
                <Moon className="w-3 h-3 text-amber-400" />
                Jadwal Shalat & Arah Kiblat
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-slate-900/60 border border-violet-500/30 text-violet-200 text-[10px] sm:text-[11px] font-medium backdrop-blur-sm">
                <ShieldCheck className="w-3 h-3 text-violet-400" />
                Offline-First PWA
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Entry Hub & Quick Portals */}
          <div className="md:col-span-5 landscape:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-md backdrop-blur-2xl bg-[#0d0e26]/80 border border-purple-500/40 rounded-3xl landscape:rounded-2xl p-4 sm:p-6 lg:p-7 landscape:p-3.5 shadow-[0_15px_60px_rgba(124,58,237,0.4)] relative overflow-hidden flex flex-col items-center">
              
              {/* Subtle Card Glow Highlight */}
              <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-purple-600/25 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

              {/* Portal Header */}
              <div className="flex items-center justify-between w-full mb-2.5 sm:mb-4 landscape:mb-2 pb-2 sm:pb-3 landscape:pb-1.5 border-b border-purple-500/25">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.9)] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
                    Gerbang Utama
                  </span>
                </div>
                <span className="text-[10px] uppercase font-semibold text-purple-300/70 tracking-widest">
                  Akses Masuk
                </span>
              </div>

              {/* Primary Entrance Button Container with Glowing Pulse Waves */}
              <div className="relative w-full flex items-center justify-center my-1.5 sm:my-2 landscape:my-1">
                {/* Concentric Cosmic Pulse Waves */}
                <div
                  className="absolute inset-0 -m-3 rounded-full border border-purple-400/30 animate-ping pointer-events-none opacity-50"
                  style={{ animationDuration: '3s' }}
                />
                <div
                  className="absolute inset-0 -m-1.5 rounded-full border border-violet-300/40 pointer-events-none animate-pulse"
                  style={{ animationDuration: '2s' }}
                />
                <div className="absolute w-4/5 h-12 rounded-full bg-gradient-to-r from-purple-600/35 via-violet-500/35 to-indigo-600/35 blur-xl pointer-events-none" />

                {/* Primary Button */}
                <button
                  id="btn-welcome-enter"
                  onClick={(e) => handleEnterApp(e, 'home')}
                  className={`group relative w-full overflow-hidden flex items-center justify-between px-4 sm:px-8 landscape:px-4 py-3 sm:py-4 landscape:py-2.5 rounded-2xl landscape:rounded-xl font-extrabold transition-all duration-300 active:scale-95 shadow-2xl cursor-pointer ${
                    rippleActive ? 'ring-4 ring-purple-400/80 scale-95' : 'hover:scale-[1.02] hover:shadow-purple-500/40'
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.95), rgba(124, 58, 237, 0.9), rgba(49, 46, 129, 0.95))',
                    border: '1.5px solid rgba(192, 132, 252, 0.85)',
                    boxShadow: '0 0 45px rgba(147, 51, 234, 0.55), inset 0 1px 2px rgba(255, 255, 255, 0.35)',
                  }}
                >
                  {/* Ripple Animation */}
                  {rippleActive && (
                    <span
                      className="absolute rounded-full bg-purple-300/60 pointer-events-none animate-ping"
                      style={{
                        left: `${ripplePos.x}%`,
                        top: `${ripplePos.y}%`,
                        width: '260px',
                        height: '260px',
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  )}

                  {/* Shimmer sweep effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

                  {/* Left Touch Icon */}
                  <div className="w-8 sm:w-10 h-8 sm:h-10 landscape:w-8 landscape:h-8 rounded-xl bg-gradient-to-tr from-purple-500/70 via-violet-500/70 to-indigo-400/70 border border-purple-300/80 flex items-center justify-center flex-shrink-0 text-white shadow-inner group-hover:scale-110 transition-transform">
                    <svg
                      className="w-4 sm:w-5 h-4 sm:h-5 landscape:w-4 landscape:h-4 text-purple-100 animate-pulse"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                    </svg>
                  </div>

                  {/* Text */}
                  <div className="flex flex-col text-left flex-1 px-2.5 sm:px-3">
                    <span className="text-white text-sm sm:text-lg landscape:text-sm font-black tracking-[0.2em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                      KETUK UNTUK MASUK
                    </span>
                    <span className="text-[9px] sm:text-[10px] landscape:text-[9px] text-purple-200/90 font-normal">
                      Buka beranda utama Siraj
                    </span>
                  </div>

                  {/* Right Arrow */}
                  <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 text-purple-200 group-hover:translate-x-1 group-hover:text-white transition-transform flex-shrink-0" />
                </button>
              </div>

              {/* Spiritual Peaceful Blessing Hint inside card */}
              <div className="w-full flex items-center justify-center gap-2 mt-3 sm:mt-4 pt-3 border-t border-purple-500/25 text-center">
                <span className="text-[11px] sm:text-xs text-purple-200/90 font-light tracking-wider">
                  ✦ Bismillah, awali harimu dengan cahaya Al-Qur'an ✦
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 6. Landscape Minimalist Footer */}
      <footer className="relative z-20 w-full px-4 sm:px-8 lg:px-12 pb-2 sm:pb-4 landscape:pb-1.5 flex items-center justify-between text-[11px] text-slate-400 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">SIRAJ v1.0</span>
          <span className="text-slate-600">•</span>
          <span className="hidden sm:inline text-slate-400">PWA Offline & Terenkripsi</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="text-amber-300/80 font-arabic text-xs sm:text-sm">
            السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ
          </span>
        </div>
      </footer>

      {/* Global CSS for Smooth Star Twinkling */}
      <style>{`
        @keyframes sirajTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.85); }
          50% { opacity: 0.95; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};
