import { qualityVar } from './quality';

// "12s ago" / "6m ago" / "2h ago" from a Date (or null).
export function timeAgo(date) {
  if (!date) return '—';
  const t = new Date(date).getTime();
  if (isNaN(t)) return '—';
  const s = Math.max(0, Math.floor((Date.now() - t) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// First-load default state is all-zeros — treat that as "no real data yet".
export function hasRealData(current) {
  if (!current) return false;
  return current.temperature > 0 || current.humidity > 0 || current.light > 0;
}

export function ageMs(current) {
  if (!current || !current.timestamp) return Infinity;
  const t = new Date(current.timestamp).getTime();
  return isNaN(t) ? Infinity : Date.now() - t;
}

export function isStale(current, ms = 5 * 60 * 1000) {
  return ageMs(current) > ms;
}

// Comfort score 0–100: Optimal −2, Normal −8, anything else −22 (all-optimal ≈ 94).
const PENALTY = { Optimal: 2, Normal: 8 };
export function comfortScore(analysis) {
  if (!analysis) return 0;
  const labels = [analysis.tempQuality, analysis.humidityQuality, analysis.lightQuality];
  let score = 100;
  for (const l of labels) score -= PENALTY[l] !== undefined ? PENALTY[l] : 22;
  return Math.max(0, Math.min(100, Math.round(score)));
}

// Worst of the three qualities → drives the hero status chip + colour.
export function worstQuality(analysis) {
  if (!analysis) return { allOptimal: false, label: 'No data', color: 'var(--muted)' };
  const entries = [
    ['Temperature', analysis.tempQuality],
    ['Humidity', analysis.humidityQuality],
    ['Light', analysis.lightQuality],
  ];
  const bad = entries.filter(([, q]) => q && q !== 'Optimal' && q !== 'Normal');
  if (bad.length === 0) {
    const allOpt = entries.every(([, q]) => q === 'Optimal');
    return {
      allOptimal: allOpt,
      label: allOpt ? 'All readings optimal' : 'Conditions are normal',
      color: 'var(--optimal)',
    };
  }
  const [name, q] = bad[0];
  return { allOptimal: false, label: `${name.toLowerCase()} is ${q.toLowerCase()}`, color: qualityVar(q) };
}

export const fmt = (n, d = 0) => Number(n || 0).toFixed(d);
