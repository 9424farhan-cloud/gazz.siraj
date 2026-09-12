import React, { useState, useEffect } from 'react';
import { BookOpen, Compass, Sparkles, Moon, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import welcomeBg from '../../assets/welcome-cosmic.jpg';

interface WelcomeScreenProps {
  onEnter: (targetTab?: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const { user, signInWithGoogle, loading: authLoading } = useAuth();
  const [isExiting, setIsExiting] = useState(false);
  const [rippleActive, setRippleActive] = useState(false);
  const [ripplePos, setRipplePos] = useState({ x: 50, y: 50 });
  const [targetDestination, setTargetDestination] = useState<string>('home');

  // Ambient twinkling stars data (deterministic so it doesn't recalculate on re-render)
  const stars = React.useMemo(() => {
    return Array.from({ length: 36 }).map((_, i) => ({
      id: i,
      left: `${(i * 17 + 7) % 94 + 3}%`,
      top: `${(i * 23 + 5) % 65 + 2}%`,
      size: (i % 3 === 0 ? 2.5 : i % 2 === 0 ? 1.8 : 1.2),
      opacity: ((i * 13) % 60 + 25) / 100,
      duration: `${((i % 4) + 2.5).toFixed(1)}s`,
      delay: `${((i * 0.4) % 3).toFixed(1)}s`,
      color: i % 5 === 0 ? '#fde68a' : i % 3 === 0 ? '#a7f3d0' : '#e0e7ff',
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

    setTargetDestination(tab);
    setRippleActive(true);
    setIsExiting(true);

    // Smooth transition: allows ripple to expand and galaxy background to scale gently
    setTimeout(() => {
      onEnter(tab);
    }, 700);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#04060f] text-slate-100 select-none overflow-hidden transition-all duration-700 ease-in-out ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        perspective: '1000px',
      }}
    >
      {/* Outer Cosmic Atmosphere (Blends seamlessly on desktop/tablet) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep Galaxy Nebulae */}
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full bg-purple-900/20 blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/3 -left-20 w-[500px] h-[500px] rounded-full bg-emerald-900/15 blur-[140px]" />
        <div className="absolute -bottom-20 right-1/4 w-[650px] h-[650px] rounded-full bg-blue-950/25 blur-[160px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-indigo-900/20 blur-[130px]" />
      </div>

      {/* Main Artwork Container - Responsive (Mobile full-bleed, Tablet/Desktop centered luxury poster) */}
      <div className="relative w-full h-full max-w-lg mx-auto sm:max-h-[96vh] sm:rounded-3xl sm:border sm:border-emerald-500/20 sm:shadow-[0_0_80px_rgba(4,120,87,0.25)] overflow-hidden flex flex-col justify-between">
        
        {/* Background Artwork with slow drift zoom on entry */}
        <div
          className={`absolute inset-0 transition-transform duration-1000 ease-out ${
            isExiting ? 'scale-110' : 'scale-100'
          }`}
        >
          <img
            src={welcomeBg}
            alt="SIRAJ Islamic Cosmic Background"
            className="w-full h-full object-cover object-center pointer-events-none select-none"
            loading="eager"
          />
          {/* Subtle vignette & color tone harmonizer */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950/40 pointer-events-none" />
        </div>

        {/* Dynamic Twinkling Stars Overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {stars.map(star => (
            <div
              key={star.id}
              className="absolute rounded-full pointer-events-none"
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

        {/* Top Header Information & Calligraphy */}
        <header className="relative z-10 w-full pt-6 sm:pt-8 px-6 sm:px-8 flex items-start justify-between">
          {/* Brand Tagline */}
          <div className="flex items-center gap-2.5">
            <div className="w-0.5 h-8 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500/30 rounded-full" />
            <div className="flex flex-col text-[11px] sm:text-xs font-medium tracking-widest uppercase text-amber-200/90 leading-tight">
              <span>Islamic</span>
              <span>Digital</span>
              <span className="text-amber-300 font-semibold">Companion</span>
            </div>
          </div>

          {/* Top Right: Calligraphy or Direct Login */}
          <div className="flex items-center gap-3">
            <span
              className="text-amber-200/90 text-sm sm:text-base font-arabic tracking-wider drop-shadow-sm select-none"
              style={{ fontFamily: 'Amiri, serif' }}
            >
              بِسْمِ اللَّهِ
            </span>

            {/* Quick Google Login toggle if not logged in */}
            {!user && (
              <button
                onClick={() => signInWithGoogle()}
                disabled={authLoading}
                className="p-2 rounded-xl bg-slate-900/50 hover:bg-slate-900/80 border border-purple-500/30 text-purple-200 hover:text-white transition backdrop-blur-md text-xs flex items-center gap-1.5 shadow-sm"
                title="Masuk dengan Google"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline text-[11px]">Masuk</span>
              </button>
            )}
          </div>
        </header>

        {/* Middle Cosmic Atmosphere Spacing */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 text-center pointer-events-none">
          {/* Subtle Ambient Cosmic Crescent Glow */}
          <div className="absolute top-1/4 right-8 w-20 h-20 rounded-full bg-cyan-400/10 blur-xl pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
        </div>

        {/* Lower Control Area: Interactive Button & Bottom Navigation */}
        <footer className="relative z-20 pb-6 sm:pb-8 px-6 sm:px-8 flex flex-col items-center">
          
          {/* Concentric Animated Ripple Rings on the water reflection */}
          <div className="relative flex items-center justify-center w-full mb-6">
            <div className="absolute w-72 h-16 rounded-full border border-emerald-400/20 animate-ping pointer-events-none opacity-40" style={{ animationDuration: '3.5s' }} />
            <div className="absolute w-60 h-14 rounded-full border border-teal-300/25 pointer-events-none animate-pulse" style={{ animationDuration: '2.5s' }} />
            <div className="absolute w-44 h-10 rounded-full bg-gradient-to-r from-emerald-500/20 via-cyan-400/25 to-teal-500/20 blur-lg pointer-events-none" />

            {/* Main Interactive Button: "KETUK UNTUK MASUK" */}
            <button
              id="btn-welcome-enter"
              onClick={(e) => handleEnterApp(e, 'home')}
              className={`group relative overflow-hidden flex items-center justify-center gap-3.5 px-8 py-3.5 sm:py-4 rounded-full font-bold transition-all duration-300 active:scale-95 shadow-2xl ${
                rippleActive ? 'ring-4 ring-emerald-400/60 scale-95' : 'hover:scale-105'
              }`}
              style={{
                background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.65), rgba(13, 148, 136, 0.45), rgba(15, 23, 42, 0.75))',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(52, 211, 153, 0.6)',
                boxShadow: '0 0 35px rgba(16, 185, 129, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
              }}
            >
              {/* Radial click ripple animation */}
              {rippleActive && (
                <span
                  className="absolute rounded-full bg-emerald-300/40 pointer-events-none animate-ping"
                  style={{
                    left: `${ripplePos.x}%`,
                    top: `${ripplePos.y}%`,
                    width: '180px',
                    height: '180px',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              )}

              {/* Shimmer sweep effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

              {/* Tap Hand / Touch Icon inside Glowing Circle Badge */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500/40 to-teal-300/40 border border-emerald-300/60 flex items-center justify-center flex-shrink-0 text-white shadow-inner group-hover:scale-110 transition-transform">
                <svg
                  className="w-4 h-4 text-emerald-100"
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

              {/* Primary Label */}
              <span className="text-white text-xs sm:text-sm font-extrabold tracking-[0.22em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                KETUK UNTUK MASUK
              </span>
            </button>
          </div>

          {/* Bottom Feature Shortcuts (Qur'an, Ibadah, Journey, Galaxy) */}
          <nav aria-label="Jalan Pintas Masuk" className="w-full max-w-sm flex items-center justify-between pt-3 border-t border-amber-400/20">
            {/* Qur'an */}
            <button
              onClick={(e) => handleEnterApp(e, 'quran')}
              className="flex-1 flex flex-col items-center gap-1.5 py-1 text-amber-200/70 hover:text-amber-300 transition group"
              title="Langsung Buka Qur'an Center"
            >
              <BookOpen className="w-4 h-4 text-amber-300/80 group-hover:text-amber-200 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] sm:text-[11px] font-medium tracking-wider">Qur'an</span>
            </button>

            <div className="w-px h-6 bg-amber-400/20" />

            {/* Ibadah */}
            <button
              onClick={(e) => handleEnterApp(e, 'worship')}
              className="flex-1 flex flex-col items-center gap-1.5 py-1 text-amber-200/70 hover:text-amber-300 transition group"
              title="Langsung Buka Jadwal & Ibadah"
            >
              <Moon className="w-4 h-4 text-amber-300/80 group-hover:text-amber-200 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] sm:text-[11px] font-medium tracking-wider">Ibadah</span>
            </button>

            <div className="w-px h-6 bg-amber-400/20" />

            {/* Journey */}
            <button
              onClick={(e) => handleEnterApp(e, 'journey')}
              className="flex-1 flex flex-col items-center gap-1.5 py-1 text-amber-200/70 hover:text-amber-300 transition group"
              title="Langsung Buka Qur'an Journey"
            >
              <Compass className="w-4 h-4 text-amber-300/80 group-hover:text-amber-200 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] sm:text-[11px] font-medium tracking-wider">Journey</span>
            </button>

            <div className="w-px h-6 bg-amber-400/20" />

            {/* Galaxy / Progress */}
            <button
              onClick={(e) => handleEnterApp(e, 'progress')}
              className="flex-1 flex flex-col items-center gap-1.5 py-1 text-amber-200/70 hover:text-amber-300 transition group"
              title="Langsung Buka Progress Galaxy"
            >
              <Sparkles className="w-4 h-4 text-amber-300/80 group-hover:text-amber-200 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] sm:text-[11px] font-medium tracking-wider">Galaxy</span>
            </button>
          </nav>
        </footer>
      </div>

      {/* Global subtle CSS keyframe for star twinkling if not present */}
      <style>{`
        @keyframes sirajTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.85); }
          50% { opacity: 0.95; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};
