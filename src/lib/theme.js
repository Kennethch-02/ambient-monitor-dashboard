// Theme = a `light` class on <html>. Dark is the default (no class). Persisted in localStorage.
const KEY = 'amb-theme';

export function getTheme() {
  return document.documentElement.classList.contains('light') ? 'light' : 'dark';
}

function apply(theme) {
  const html = document.documentElement;
  if (theme === 'light') html.classList.add('light');
  else html.classList.remove('light');
}

export function initTheme() {
  let stored = null;
  try { stored = localStorage.getItem(KEY); } catch { /* ignore */ }
  apply(stored === 'light' ? 'light' : 'dark'); // default dark
}

export function toggleTheme() {
  const next = getTheme() === 'light' ? 'dark' : 'light';
  apply(next);
  try { localStorage.setItem(KEY, next); } catch { /* ignore */ }
  return next;
}

// For the embed: honor ?theme=light|dark|auto without persisting.
export function applyEmbedTheme(theme) {
  if (theme === 'auto') {
    const prefersLight = typeof window !== 'undefined'
      && window.matchMedia
      && window.matchMedia('(prefers-color-scheme: light)').matches;
    apply(prefersLight ? 'light' : 'dark');
  } else {
    apply(theme === 'light' ? 'light' : 'dark');
  }
}
