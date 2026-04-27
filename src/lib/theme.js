// Simple theme manager — light / dark / system
const KEY = 'chemprep:theme';

export function getTheme(){
  try { return localStorage.getItem(KEY) || 'system'; } catch { return 'system'; }
}

export function applyTheme(mode){
  const root = document.documentElement;
  const dark = mode === 'dark' || (mode === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  root.classList.toggle('dark', dark);
  try { if (mode === 'system') localStorage.removeItem(KEY); else localStorage.setItem(KEY, mode); } catch {}
}

// Keep in sync with system when mode === 'system'
if (typeof window !== 'undefined'){
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener?.('change', () => {
    if (getTheme() === 'system') applyTheme('system');
  });
}
