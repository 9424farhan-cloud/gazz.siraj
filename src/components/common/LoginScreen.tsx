import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { signInWithGoogle, loading, redirectLoading, authError } = useAuth();

  const isLoading = loading || redirectLoading;

  // Tampilkan loading khusus saat sedang proses redirect dari Google
  if (redirectLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080915]">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #7c3aed, #4c1d95)',
              boxShadow: '0 20px 60px rgba(124, 58, 237, 0.5)',
            }}
          >
            <span className="text-4xl font-bold text-amber-200" style={{ fontFamily: 'serif' }}>
              س
            </span>
          </div>
          <div className="flex items-center gap-2 text-purple-300">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Memproses login Google...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080915] overflow-hidden">
      {/* Cosmic Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-purple-700/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/15 blur-[100px]" />
      </div>

      {/* Stars Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              animation: `pulse ${Math.random() * 3 + 2}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-6">
        {/* Logo */}
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #7c3aed, #4c1d95)',
            boxShadow: '0 20px 60px rgba(124, 58, 237, 0.5)',
          }}
        >
          <span className="text-5xl font-bold text-amber-200" style={{ fontFamily: 'serif' }}>
            س
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black text-white tracking-tight mb-1" style={{ fontFamily: 'serif' }}>
          SIRAJ
        </h1>
        <p className="text-sm text-purple-300/70 mb-2 font-medium tracking-wide">
          Pendamping Ibadah Harian
        </p>
        <div className="w-16 h-0.5 rounded-full bg-gradient-to-r from-amber-400 to-purple-500 mb-8" />

        {/* Welcome Text */}
        <p className="text-center text-slate-300 text-sm leading-relaxed mb-6 max-w-xs">
          Masuk untuk menyimpan progress ibadahmu dan menikmati pengalaman yang lebih personal.
        </p>

        {/* Error Message */}
        {authError && (
          <div className="w-full mb-5 p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-rose-400 mb-1">Login Gagal</p>
              <p className="text-xs text-rose-300/80 leading-relaxed">{authError}</p>
            </div>
          </div>
        )}

        {/* Google Sign-In Button */}
        <button
          id="btn-google-signin"
          onClick={signInWithGoogle}
          disabled={isLoading}
          className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mb-3"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.05))',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
            color: '#fff',
          }}
          onMouseEnter={e => {
            if (!isLoading) {
              (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.10))';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.12)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.5)';
            }
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.05))';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
          }}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-purple-300" />
          ) : (
            /* Google Icon */
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          <span>{isLoading ? 'Memuat...' : 'Masuk dengan Google'}</span>
        </button>

        {/* Info hint */}
        <p className="text-[10px] text-purple-400/50 text-center mb-5 leading-relaxed">
          Di perangkat mobile, Anda akan diarahkan ke halaman Google.
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full mb-4">
          <div className="flex-1 h-px bg-purple-500/20" />
          <span className="text-[10px] text-purple-400/50 font-semibold uppercase tracking-wider">atau</span>
          <div className="flex-1 h-px bg-purple-500/20" />
        </div>

        {/* Skip (Guest Mode) */}
        <button
          id="btn-guest-mode"
          onClick={() => {
            sessionStorage.setItem('SIRAJ_GUEST_MODE', 'true');
            window.dispatchEvent(new Event('siraj-guest-mode'));
          }}
          className="flex items-center gap-1.5 text-xs text-purple-400/60 hover:text-purple-300 transition-colors duration-200 py-2 px-4 rounded-xl hover:bg-purple-900/20"
        >
          <span>Lanjutkan tanpa akun</span>
          <ArrowRight className="w-3 h-3" />
        </button>

        {/* Footer */}
        <p className="mt-10 text-[10px] text-slate-600 text-center leading-relaxed">
          Dengan masuk, kamu menyetujui kebijakan privasi SIRAJ.<br />
          Data ibadahmu aman dan terjaga.
        </p>
      </div>
    </div>
  );
};
