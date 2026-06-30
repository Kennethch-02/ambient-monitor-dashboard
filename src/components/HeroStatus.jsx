// src/components/HeroStatus.jsx
import React from 'react';
import { worstQuality, comfortScore, fmt } from '../lib/format';

const HeroStatus = ({ current, analysis }) => {
  const status = worstQuality(analysis);
  const feelsLike = fmt(current.temperature, 1);
  const comfort = comfortScore(analysis);

  const headline = status.allOptimal
    ? 'Your room feels great right now'
    : 'Your room could use a small adjustment';

  const sub = status.allOptimal
    ? 'Temperature, humidity and light are all in the ideal range for focused work. Air is calm and the space is comfortably lit.'
    : `Most readings look good, but ${status.label}. Everything else is steady and within range.`;

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 22,
        border: '1px solid color-mix(in oklch,var(--optimal) 26%,var(--line))',
        background: 'linear-gradient(135deg,color-mix(in oklch,var(--optimal) 13%,var(--bg1)),var(--bg1) 60%)',
        padding: '28px 28px',
        marginBottom: 18,
        boxShadow: 'var(--shadow)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: -60,
          top: -60,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle,color-mix(in oklch,var(--optimal) 34%,transparent),transparent 70%)',
          animation: 'amb-breathe 6s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 11px',
              borderRadius: 999,
              background: `color-mix(in oklch,${status.color} 18%,transparent)`,
              color: status.color,
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 14,
            }}
          >
            {status.allOptimal && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            )}
            {status.label}
          </div>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.05 }}>
            {headline}
          </h1>
          <p style={{ margin: '8px 0 0', color: 'var(--txt2)', fontSize: 14.5, maxWidth: '46ch' }}>{sub}</p>
        </div>
        <div style={{ display: 'flex', gap: 26, fontFamily: "'JetBrains Mono',monospace" }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--txt3)', letterSpacing: '.08em' }}>FEELS LIKE</div>
            <div style={{ fontSize: 26, fontWeight: 600, marginTop: 3 }}>{feelsLike}°</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--txt3)', letterSpacing: '.08em' }}>COMFORT</div>
            <div style={{ fontSize: 26, fontWeight: 600, marginTop: 3, color: 'var(--optimal)' }}>{comfort}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroStatus;
