import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { getDB } from './services/db';
import './index.css';

console.log('[BOOT] Starting SIRAJ');
console.log('[BOOT] Loading configuration');

async function bootApp() {
  const container = document.getElementById('root');
  if (!container) return;

  const root = createRoot(container);

  try {
    console.log('[BOOT] Initializing database');
    const bootTimeout = new Promise((resolve) => setTimeout(resolve, 1200));

    await Promise.race([
      (async () => {
        try {
          await getDB();
          console.log('[BOOT] Database ready');
        } catch (e) {
          console.warn('[BOOT] Database fallback initialized:', e);
        }
      })(),
      bootTimeout
    ]);
  } catch (err: any) {
    console.error('[BOOT ERROR]', err);
  } finally {
    console.log('[BOOT] Loading application');
    console.log('[BOOT] Rendering App');
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
}

bootApp().catch((err) => {
  console.error('[BOOT ERROR] Critical startup catch:', err);
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
});
