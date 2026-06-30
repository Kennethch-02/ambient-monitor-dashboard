// src/components/SummaryPanel.jsx
import React from 'react';
import { useEnvironment } from '../context/EnvironmentContext';
import { fmt } from '../lib/format';

const Row = ({ hue, label, value, unit }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <span style={{ width: 7, height: 34, borderRadius: 4, background: hue }} />
    <div style={{ marginRight: 'auto' }}>
      <div style={{ fontSize: 12, color: 'var(--txt3)' }}>{label}</div>
    </div>
    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 20, fontWeight: 600 }}>
      {value}
      {unit && <span style={{ fontSize: 12, color: 'var(--txt3)' }}>{unit}</span>}
    </div>
  </div>
);

const SummaryPanel = () => {
  const { summary } = useEnvironment();

  return (
    <div
      style={{
        borderRadius: 20,
        background: 'var(--bg1)',
        border: '1px solid var(--line)',
        padding: 20,
        boxShadow: 'var(--shadow)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>Hour summary</div>
      <div style={{ fontSize: 11.5, color: 'var(--txt3)', marginBottom: 16 }}>Rolling averages</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11, flex: 1 }}>
        <Row hue="var(--warm)" label="Avg temperature" value={fmt(summary.avgTemp, 1)} unit="°C" />
        <Row hue="var(--cyan)" label="Avg humidity" value={Math.round(summary.avgHumidity)} unit="%" />
        <Row hue="var(--amber)" label="Avg light" value={Math.round(summary.avgLight)} unit="lux" />
        <Row hue="var(--violet)" label="Motion events" value={summary.motionEvents} />
      </div>
    </div>
  );
};

export default SummaryPanel;
