// src/components/MotionTimeline.jsx
import React from 'react';
import { useEnvironment } from '../context/EnvironmentContext';

const MotionTimeline = () => {
  const { motionHistory } = useEnvironment();
  // Up to the most recent 48 ticks; render only what exists (no fabrication).
  const ticks = motionHistory.slice(-48);

  return (
    <section
      style={{
        borderRadius: 20,
        background: 'var(--bg1)',
        border: '1px solid var(--line)',
        padding: 20,
        marginBottom: 18,
        boxShadow: 'var(--shadow)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginRight: 'auto' }}>Motion timeline</div>
        <div style={{ fontSize: 11.5, color: 'var(--txt3)', fontFamily: "'JetBrains Mono',monospace" }}>last 60 min</div>
      </div>
      <div style={{ position: 'relative', height: 46, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
        {ticks.map((m, i) => {
          const on = m.detected;
          return (
            <span
              key={i}
              style={{
                flex: 1,
                borderRadius: 3,
                height: on ? 40 + (i % 3) * 4 : 8,
                background: on ? 'var(--violet)' : 'var(--line)',
                opacity: on ? 0.6 + 0.4 * (i / 48) : 1,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 10,
          fontSize: 10.5,
          color: 'var(--txt3)',
          fontFamily: "'JetBrains Mono',monospace",
        }}
      >
        <span>-60m</span>
        <span>-40m</span>
        <span>-20m</span>
        <span>now</span>
      </div>
    </section>
  );
};

export default MotionTimeline;
