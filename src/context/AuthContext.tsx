import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  redirectLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  authError: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Deteksi apakah environment saat ini mendukung popup (block di beberapa browser/webview)
function supportsPopup(): boolean {
  // Cek apakah ini bukan WebView embedded (Instagram, Facebook, dll.)
  const ua = navigator.userAgent;
  const isWebView = /FBAN|FBAV|Instagram|Line\/|Twitter\/|Snapchat/i.test(ua);
  // Cek apakah ini adalah mobile yang sering blokir popup
  const isMobile = /Android|iPhone|iPad/i.test(ua);
  return !isWebView && !isMobile;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [redirectLoading, setRedirectLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Listen to Firebase auth state changes (persistent session)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Handle redirect result setelah kembali dari Google Sign-In redirect
  useEffect(() => {
    setRedirectLoading(true);
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
          setAuthError(null);
        }
      })
      .catch((error: any) => {
        // Error umum yang tidak perlu diperlihatkan ke user
        const ignoredCodes = [
          'auth/popup-closed-by-user',
          'auth/cancelled-popup-request',
          'auth/no-auth-event', // tidak ada redirect yang terjadi, ini normal
        ];
        if (!ignoredCodes.includes(error?.code)) {
          console.error('[Auth] Redirect result error:', error);
          if (error?.code === 'auth/unauthorized-domain') {
            setAuthError('Domain ini belum terdaftar di Firebase. Silahkan tambahkan domain di Firebase Console → Authentication → Settings → Authorized domains.');
          } else if (error?.code === 'auth/configuration-not-found') {
            setAuthError('Konfigurasi Firebase tidak ditemukan. Pastikan Google Sign-In sudah diaktifkan di Firebase Console.');
          } else {
            setAuthError(error?.message || 'Terjadi kesalahan saat login.');
          }
        }
      })
      .finally(() => {
        setRedirectLoading(false);
      });
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      if (supportsPopup()) {
        // Desktop: gunakan popup (pengalaman lebih baik)
        await signInWithPopup(auth, googleProvider);
      } else {
        // Mobile / WebView: gunakan redirect (lebih kompatibel)
        setRedirectLoading(true);
        await signInWithRedirect(auth, googleProvider);
        // Halaman akan redirect ke Google, setelah kembali getRedirectResult() akan handle
      }
    } catch (error: any) {
      const ignoredCodes = [
        'auth/popup-closed-by-user',
        'auth/cancelled-popup-request',
      ];
      if (!ignoredCodes.includes(error?.code)) {
        console.error('[Auth] Google sign-in error:', error?.code, error?.message);

        if (error?.code === 'auth/unauthorized-domain') {
          setAuthError(`Domain "${window.location.hostname}" belum terdaftar di Firebase Console. Tambahkan di: Authentication → Settings → Authorized domains.`);
        } else if (error?.code === 'auth/popup-blocked') {
          // Popup diblokir browser, fallback ke redirect
          console.info('[Auth] Popup blocked, falling back to redirect...');
          try {
            await signInWithRedirect(auth, googleProvider);
          } catch (redirectErr: any) {
            setAuthError('Gagal membuka login Google. Pastikan popup tidak diblokir browser Anda.');
          }
        } else if (error?.code === 'auth/configuration-not-found') {
          setAuthError('Google Sign-In belum diaktifkan di Firebase Console. Aktifkan di: Authentication → Sign-in method → Google.');
        } else if (error?.code === 'auth/network-request-failed') {
          setAuthError('Gagal terhubung ke server. Periksa koneksi internet Anda.');
        } else {
          setAuthError(error?.message || 'Login gagal. Silahkan coba lagi.');
        }
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setAuthError(null);
      // Bersihkan guest mode jika ada
      sessionStorage.removeItem('SIRAJ_GUEST_MODE');
    } catch (error) {
      console.error('[Auth] Sign-out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, redirectLoading, signInWithGoogle, signOut, authError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
