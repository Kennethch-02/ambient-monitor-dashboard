// src/components/MetricCard.jsx
import React from 'react';
import { metricVar, qualityVar } from '../lib/quality';

const ICONS = {
  temperature: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 14.76V4a2 2 0 0 0-4 0v10.76a4 4 0 1 0 4 0z" />
    </svg>
  ),
  humidity: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.7S5 10 5 14a7 7 0 0 0 14 0c0-4-7-11.3-7-11.3z" />
    </svg>
  ),
  light: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
    </svg>
  ),
};

const LABELS = {
  temperature: 'Temperature',
  humidity: 'Humidity',
  light: 'Ambient Light',
};

// metric: temperature | humidity | light | motion
// For metric/humidity/light: { value, unit, quality, trend, spark }
// For motion: { motionLabel, lastMotion, motionEvents }
const MetricCard = ({ metric, value, unit, quality, trend, spark, motionLabel, lastMotion, motionEvents }) => {
  const hue = metricVar(metric);

  if (metric === 'motion') {
    return (
      <article
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 18,
          background: 'var(--bg1)',
          border: '1px solid color-mix(in oklch,var(--violet) 24%,var(--line))',
          padding: 18,
          boxShadow: 'var(--shadow)',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: -30,
            top: -30,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'radial-gradient(circle,color-mix(in oklch,var(--violet) 24%,transparent),transparent 70%)',
          }}
        />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              display: 'grid',
              placeItems: 'center',
              background: 'color-mix(in oklch,var(--violet) 16%,var(--bg2))',
              color: 'var(--violet)',
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12a7 7 0 0 1 7-7M5 12a7 7 0 0 0 7 7M2 12a10 10 0 0 1 10-10" />
              <circle cx="12" cy="12" r="1.6" fill="currentColor" />
            </svg>
          </span>
          <span style={{ fontSize: 13, color: 'var(--txt2)', fontWeight: 500 }}>Movement</span>
          <span style={{ marginLeft: 'auto', position: 'relative', width: 9, height: 9 }}>
            <span
              style={{
                position: 'absolute',
                inset: -6,
                borderRadius: '50%',
                background: 'var(--violet)',
                animation: 'amb-ring 1.8s ease-out infinite',
              }}
            />
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--violet)' }} />
          </span>
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 8, fontFamily: "'JetBrains Mono',monospace" }}>
          <span style={{ fontSize: 27, fontWeight: 600, color: 'var(--violet)' }}>{motionLabel}</span>
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 13 }}>
          <span style={{ fontSize: 11.5, color: 'var(--txt3)', fontFamily: "'JetBrains Mono',monospace" }}>last {lastMotion}</span>
          <span style={{ fontSize: 11.5, color: 'var(--txt3)', fontFamily: "'JetBrains Mono',monospace" }}>{motionEvents} events / 1h</span>
        </div>
      </article>
    );
  }

  return (
    <article
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 18,
        background: 'var(--bg1)',
        border: `1px solid color-mix(in oklch,${hue} 22%,var(--line))`,
        padding: 18,
        boxShadow: 'var(--shadow)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: -30,
          top: -30,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `radial-gradient(circle,color-mix(in oklch,${hue} 24%,transparent),transparent 70%)`,
        }}
      />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            display: 'grid',
            placeItems: 'center',
            background: `color-mix(in oklch,${hue} 16%,var(--bg2))`,
            color: hue,
          }}
        >
          {ICONS[metric]}
        </span>
        <span style={{ fontSize: 13, color: 'var(--txt2)', fontWeight: 500 }}>{LABELS[metric]}</span>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: 10.5,
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: 999,
            background: `color-mix(in oklch,${qualityVar(quality)} 16%,transparent)`,
            color: qualityVar(quality),
          }}
        >
          {quality}
        </span>
      </div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 5, fontFamily: "'JetBrains Mono',monospace" }}>
        <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-.02em' }}>{value}</span>
        <span style={{ fontSize: 16, color: 'var(--txt3)' }}>{unit}</span>
      </div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
        <span style={{ fontSize: 11.5, color: 'var(--txt3)', fontFamily: "'JetBrains Mono',monospace" }}>{trend} vs prev</span>
        <svg width="86" height="30" viewBox="0 0 120 34" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
          <path d={spark.area} fill={`color-mix(in oklch,${hue} 16%,transparent)`} />
          <path d={spark.line} fill="none" stroke={hue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </article>
  );
};

export default MetricCard;
