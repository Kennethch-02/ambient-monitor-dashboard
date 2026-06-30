// src/components/MotionWidget.jsx
import React from 'react';
import { useEnvironment } from '../context/EnvironmentContext';

// Small floating real-time indicator (bottom-left). Only visible while there
// is recent motion. Violet pulsing ring, self-contained.
const MotionWidget = () => {
  const { current } = useEnvironment();
  if (!current.hasRecentMotion) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: 20,
        bottom: 20,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 14px 8px 12px',
        borderRadius: 999,
        background: 'color-mix(in oklch,var(--bg1) 86%,transparent)',
        backdropFilter: 'blur(14px)',
        border: '1px solid color-mix(in oklch,var(--violet) 30%,var(--line))',
        boxShadow: '0 14px 40px -16px oklch(0.05 0.02 215 / 0.7)',
      }}
    >
      <span style={{ position: 'relative', width: 10, height: 10 }}>
        <span
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            background: 'var(--violet)',
            animation: 'amb-ring 1.8s ease-out infinite',
          }}
        />
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'var(--violet)',
            boxShadow: '0 0 12px var(--violet)',
          }}
        />
      </span>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--violet)' }}>Motion active</span>
    </div>
  );
};

export default MotionWidget;
