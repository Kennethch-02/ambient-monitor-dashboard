// Small battery chip for the dashboard header. Hidden when no real battery is wired
// (a floating ADC pin reads ~0 V, so we only show it above a sane 1S threshold).
const colorFor = (pct) => (pct > 40 ? 'var(--optimal)' : pct > 20 ? 'var(--amber)' : 'var(--warm)');

export default function BatteryIndicator({ battery = 0, batteryVoltage = 0 }) {
  if (!(Number(batteryVoltage) > 2.5)) return null;

  const pct = Math.max(0, Math.min(100, Math.round(Number(battery) || 0)));
  const color = colorFor(pct);
  const fillW = Math.max(2, Math.round((pct / 100) * 15));

  return (
    <div
      title={`Battery ${pct}% · ${Number(batteryVoltage).toFixed(2)} V`}
      style={{
        display: 'flex', alignItems: 'center', gap: '7px',
        padding: '7px 11px', borderRadius: '999px',
        background: 'var(--bg1)', border: '1px solid var(--line)', whiteSpace: 'nowrap',
      }}
    >
      <span style={{ position: 'relative', width: '23px', height: '12px', display: 'inline-block' }}>
        <span style={{ position: 'absolute', inset: 0, border: `1.5px solid ${color}`, borderRadius: '3px', boxSizing: 'border-box' }} />
        <span style={{ position: 'absolute', right: '-3px', top: '3px', width: '2px', height: '6px', background: color, borderRadius: '0 1px 1px 0' }} />
        <span style={{ position: 'absolute', left: '2px', top: '2px', bottom: '2px', width: `${fillW}px`, background: color, borderRadius: '1px' }} />
      </span>
      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--txt2)', fontFamily: "'JetBrains Mono',monospace" }}>{pct}%</span>
    </div>
  );
}
