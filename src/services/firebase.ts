import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase configuration from environment variables
// Copy your Firebase project config here or set VITE_ env vars in .env
// Ensure valid Firebase API key (sanitizing against uppercase typo in secrets)
const rawApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const apiKey = (!rawApiKey || rawApiKey.includes("DTtFQL"))
  ? "AIzaSyASM2WzDTtFQlI0cECPX47iwHZunhnns7M"
  : rawApiKey;

const firebaseConfig = {
  apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "siraj-app-871fc.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "siraj-app-871fc",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "siraj-app-871fc.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "127036603676",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:127036603676:web:fccdd5161fe0161ecc8ed9",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-VQ2P3KRX7J",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Request additional user info (profile picture, name)
googleProvider.addScope('profile');
googleProvider.addScope('email');
