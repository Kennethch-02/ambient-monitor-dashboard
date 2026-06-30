// Central mapping so the `analysis` labels drive colour consistently everywhere.
// Values are CSS custom-property references (the design uses var() in inline styles).

export const QUALITY_VAR = {
  Optimal: 'var(--optimal)',
  Normal: 'var(--cyan)',
  'Too Hot': 'var(--warm)',
  'Too Cold': 'var(--cold)',
  'Too Dry': 'var(--amber)',
  'Too Humid': 'var(--cyan)',
  'Too Dark': 'var(--muted)',
  'Too Bright': 'var(--amber)',
};

export const METRIC_VAR = {
  temperature: 'var(--warm)',
  humidity: 'var(--cyan)',
  light: 'var(--amber)',
  motion: 'var(--violet)',
};

export const qualityVar = (label) => QUALITY_VAR[label] || 'var(--cyan)';
export const metricVar = (metric) => METRIC_VAR[metric] || 'var(--cyan)';
