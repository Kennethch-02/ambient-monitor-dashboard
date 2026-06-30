// src/components/EmbedWidget.jsx
// One self-contained, chrome-less widget. Fills its parent (100% × 100%) and is
// used BOTH by the lean iframe entry (src/embed.jsx) and by the builder preview
// (src/pages/EmbedBuilder.jsx). It only consumes CSS vars — the page-level theme
// is set elsewhere (the iframe entry / the builder's preview wrapper).
import React from 'react';
import { useEnvironment } from '../context/EnvironmentContext';
import { buildPath } from '../lib/spark';
import { metricVar, qualityVar } from '../lib/quality';
import { fmt, hasRealData, timeAgo, isStale } from '../lib/format';

const SINGLE = {
  temperature: { label: 'Temperature', unit: '°C', qKey: 'tempQuality', val: (c) => fmt(c.temperature, 1) },
  humidity: { label: 'Humidity', unit: '%', qKey: 'humidityQuality', val: (c) => String(Math.round(c.humidity)) },
  light: { label: 'Ambient Light', unit: 'lux', qKey: 'lightQuality', val: (c) => String(Math.round(c.light)) },
};

const RANGE_LABEL = { live: 'realtime', '1h': 'last hour', '24h': 'last 24 hours' };

export default function EmbedWidget({ widget = 'temperature', theme, range = '1h', bg = 'transparent' }) {
  const { current, historical, motionHistory, summary, analysis } = useEnvironment();
  const offline = !hasRealData(current) || isStale(current);

  const rootStyle = {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 18px 50px -22px oklch(0.05 0.02 215/.6)',
    backdropFilter: 'blur(8px)',
    color: 'var(--txt)',
    fontFamily: "'Space Grotesk',sans-serif",
    ...(bg === 'transparent'
      ? { background: 'transparent', border: '1px solid color-mix(in oklch,var(--txt) 12%,transparent)' }
      : { background: 'var(--bg1)', border: '1px solid var(--line)' }),
  };

  return <div style={rootStyle}>{renderVariant()}</div>;

  // Shared "LIVE" / "offline" chip (single + summary).
  function liveChip() {
    if (offline) {
      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 600, color: 'var(--muted)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--muted)' }} />
          offline
        </span>
      );
    }
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 600, color: 'var(--optimal)' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--optimal)' }} />
        LIVE
      </span>
    );
  }

  function renderVariant() {
    if (widget === 'motion') return motionVariant();
    if (widget === 'summary') return summaryVariant();
    if (widget === 'all') return allVariant();
    return singleVariant();
  }

  // ---- single: temperature | humidity | light ----
  function singleVariant() {
    const meta = SINGLE[widget] || SINGLE.temperature;
    const hue = metricVar(widget);
    const valueColor = offline ? 'var(--txt3)' : hue;
    const qLabel = (analysis && analysis[meta.qKey]) || 'Normal';
    const qVar = qualityVar(qLabel);
    const showSpark = range !== 'live';
    const spark = buildPath(historical.slice(-20).map((h) => h[widget]), 120, 34, 4, 4);

    return (
      <div style={{ height: '100%', padding: '18px 18px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: offline ? 'var(--muted)' : hue,
              boxShadow: offline ? 'none' : `0 0 12px ${hue}`,
            }}
          />
          <span style={{ fontSize: 13, color: 'var(--txt2)', fontWeight: 500 }}>{meta.label}</span>
          <span style={{ marginLeft: 'auto' }}>{liveChip()}</span>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: 5, fontFamily: "'JetBrains Mono',monospace" }}>
          <span style={{ fontSize: 46, fontWeight: 600, letterSpacing: '-.02em', color: valueColor }}>{meta.val(current)}</span>
          <span style={{ fontSize: 17, color: 'var(--txt3)' }}>{meta.unit}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                padding: '3px 9px',
                borderRadius: 999,
                background: `color-mix(in oklch,${qVar} 16%,transparent)`,
                color: qVar,
                alignSelf: 'flex-start',
              }}
            >
              {qLabel}
            </span>
            {showSpark && (
              <span style={{ fontSize: 10, color: 'var(--txt3)', fontFamily: "'JetBrains Mono',monospace" }}>
                {RANGE_LABEL[range]}
              </span>
            )}
          </div>
          {showSpark && (
            <svg width="120" height="34" viewBox="0 0 120 34" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
              <path d={spark.area} fill={`color-mix(in oklch,${hue} 16%,transparent)`} />
              <path d={spark.line} fill="none" stroke={hue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
    );
  }

  // ---- motion ----
  function motionVariant() {
    const active = current.hasRecentMotion && !offline;
    const lastEvent = [...(motionHistory || [])].reverse().find((m) => m.detected);
    const lastLabel = active ? 'just now' : lastEvent ? timeAgo(lastEvent.timestamp) : 'just now';
    const accent = active ? 'var(--violet)' : 'var(--txt3)';

    return (
      <div
        style={{
          height: '100%',
          padding: 18,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 12,
        }}
      >
        <span style={{ position: 'relative', width: 46, height: 46, display: 'grid', placeItems: 'center' }}>
          <span
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'color-mix(in oklch,var(--violet) 24%,transparent)',
              opacity: active ? 1 : 0.4,
            }}
          />
          <span
            style={{
              position: 'absolute',
              inset: 11,
              borderRadius: '50%',
              background: active ? 'var(--violet)' : 'var(--muted)',
              boxShadow: active ? '0 0 20px var(--violet)' : 'none',
            }}
          />
        </span>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 26, fontWeight: 600, color: accent }}>
            {active ? 'Motion active' : 'Quiet'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--txt3)', marginTop: 3 }}>
            last detected · {lastLabel} · {summary.motionEvents} events / hr
          </div>
        </div>
      </div>
    );
  }

  // ---- summary: 2×2 averages ----
  function summaryVariant() {
    const cells = [
      { label: 'AVG TEMP', val: `${fmt(summary.avgTemp, 1)}°`, hue: 'var(--warm)' },
      { label: 'AVG RH', val: `${Math.round(summary.avgHumidity)}%`, hue: 'var(--cyan)' },
      { label: 'AVG LIGHT', val: String(Math.round(summary.avgLight)), hue: 'var(--amber)' },
      { label: 'MOTION', val: String(summary.motionEvents), hue: 'var(--violet)' },
    ];
    return (
      <div style={{ height: '100%', padding: '16px 18px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'auto' }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Hour summary</span>
          <span style={{ marginLeft: 'auto' }}>{liveChip()}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontFamily: "'JetBrains Mono',monospace" }}>
          {cells.map((c) => (
            <div key={c.label}>
              <div style={{ fontSize: 10, color: 'var(--txt3)' }}>{c.label}</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: offline ? 'var(--txt3)' : c.hue }}>{c.val}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---- all: 2×2 mini cards ----
  function allVariant() {
    const cards = [
      { label: 'Temp', val: fmt(current.temperature, 1), unit: '°C', hue: 'var(--warm)' },
      { label: 'Humidity', val: String(Math.round(current.humidity)), unit: '%', hue: 'var(--cyan)' },
      { label: 'Light', val: String(Math.round(current.light)), unit: 'lx', hue: 'var(--amber)' },
      { label: 'Motion', val: current.hasRecentMotion && !offline ? 'Active' : 'Quiet', unit: '', hue: 'var(--violet)' },
    ];
    return (
      <div
        style={{
          height: '100%',
          padding: 13,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 9,
        }}
      >
        {cards.map((c) => (
          <div
            key={c.label}
            style={{
              borderRadius: 11,
              background: 'color-mix(in oklch,var(--txt) 5%,transparent)',
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: 10, color: 'var(--txt3)' }}>{c.label}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 19, fontWeight: 600, color: offline ? 'var(--txt3)' : c.hue }}>
              {c.val}
              <span style={{ fontSize: 10, color: 'var(--txt3)' }}>{c.unit}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
