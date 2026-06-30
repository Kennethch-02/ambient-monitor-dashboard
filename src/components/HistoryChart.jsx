// src/components/HistoryChart.jsx
import React, { useState } from 'react';
import { useEnvironment } from '../context/EnvironmentContext';
import { buildPath } from '../lib/spark';
import { metricVar } from '../lib/quality';
import { fmt } from '../lib/format';

const CFG = {
  temperature: { unit: '°C', d: 1, label: 'Temp' },
  humidity: { unit: '%', d: 0, label: 'Humidity' },
  light: { unit: ' lux', d: 0, label: 'Light' },
};

const tabStyle = (on, col) => ({
  fontSize: 12,
  fontWeight: 600,
  padding: '6px 13px',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  background: on ? 'var(--bg1)' : 'transparent',
  color: on ? col : 'var(--txt3)',
  boxShadow: on ? '0 1px 4px oklch(0.05 0.02 215/.3)' : 'none',
});

// 5 evenly spaced x-axis labels derived from the historical timestamps.
const xLabels = (historical) => {
  if (!historical || historical.length < 2) return ['-60m', '-45m', '-30m', '-15m', 'now'];
  const now = Date.now();
  const out = [];
  for (let i = 0; i < 5; i++) {
    const idx = Math.round((i / 4) * (historical.length - 1));
    const ts = historical[idx]?.timestamp;
    if (i === 4) {
      out.push('now');
    } else if (ts) {
      const m = Math.max(0, Math.round((now - new Date(ts).getTime()) / 60000));
      out.push(`-${m}m`);
    } else {
      out.push('');
    }
  }
  return out;
};

const HistoryChart = () => {
  const { historical } = useEnvironment();
  const [activeMetric, setActiveMetric] = useState('temperature');

  const cfg = CFG[activeMetric];
  const hue = metricVar(activeMetric);
  const vals = historical.map((h) => h[activeMetric]);
  const path = buildPath(vals, 640, 200, 16, 28);
  const [lastX, lastY] = path.last;
  const nowVal = vals.length ? vals[vals.length - 1] : 0;
  const times = xLabels(historical);

  return (
    <div
      style={{
        borderRadius: 20,
        background: 'var(--bg1)',
        border: '1px solid var(--line)',
        padding: '20px 20px 14px',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ marginRight: 'auto' }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>History</div>
          <div style={{ fontSize: 11.5, color: 'var(--txt3)' }}>Last hour · 60 samples</div>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 4,
            background: 'var(--bg0)',
            border: '1px solid var(--line)',
            borderRadius: 10,
            padding: 3,
          }}
        >
          {Object.keys(CFG).map((m) => (
            <button key={m} onClick={() => setActiveMetric(m)} style={tabStyle(activeMetric === m, metricVar(m))}>
              {CFG[m].label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <svg viewBox="0 0 640 200" preserveAspectRatio="none" style={{ width: '100%', height: 200, overflow: 'visible' }}>
          <defs>
            <linearGradient id="amb-chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={hue} stopOpacity="0.28" />
              <stop offset="100%" stopColor={hue} stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="50" x2="640" y2="50" stroke="var(--line-soft)" strokeWidth="1" />
          <line x1="0" y1="100" x2="640" y2="100" stroke="var(--line-soft)" strokeWidth="1" />
          <line x1="0" y1="150" x2="640" y2="150" stroke="var(--line-soft)" strokeWidth="1" />
          <path d={path.area} fill="url(#amb-chart-fill)" />
          <path d={path.line} fill="none" stroke={hue} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={lastX} cy={lastY} r="4.5" fill={hue} />
          <circle cx={lastX} cy={lastY} r="9" fill="none" stroke={hue} strokeOpacity="0.4" strokeWidth="2">
            <animate attributeName="r" values="6;12;6" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.5;0;0.5" dur="2.4s" repeatCount="indefinite" />
          </circle>
        </svg>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 8,
            fontSize: 10.5,
            color: 'var(--txt3)',
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          {times.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 18,
          marginTop: 10,
          fontSize: 12,
          color: 'var(--txt2)',
          fontFamily: "'JetBrains Mono',monospace",
        }}
      >
        <span>
          min <b style={{ color: 'var(--txt)' }}>{fmt(path.min, cfg.d)}{cfg.unit}</b>
        </span>
        <span>
          max <b style={{ color: 'var(--txt)' }}>{fmt(path.max, cfg.d)}{cfg.unit}</b>
        </span>
        <span>
          now <b style={{ color: hue }}>{fmt(nowVal, cfg.d)}{cfg.unit}</b>
        </span>
      </div>
    </div>
  );
};

export default HistoryChart;
