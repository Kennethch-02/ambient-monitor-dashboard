// src/pages/Dashboard.jsx
import React from 'react';
import { useEnvironment } from '../context/EnvironmentContext';
import { hasRealData, isStale, timeAgo, fmt } from '../lib/format';
import { buildPath } from '../lib/spark';
import Layout from '../components/Layout';
import HeroStatus from '../components/HeroStatus';
import MetricCard from '../components/MetricCard';
import HistoryChart from '../components/HistoryChart';
import SummaryPanel from '../components/SummaryPanel';
import MotionTimeline from '../components/MotionTimeline';
import EmbedTeaser from '../components/EmbedTeaser';
import MotionWidget from '../components/MotionWidget';

// signed trend string, e.g. "+0.3°" / "−2%"
const trend = (a, b, d, u = '') => {
  const dv = (a || 0) - (b || 0);
  const sign = dv >= 0 ? '+' : '−';
  return sign + Math.abs(dv).toFixed(d) + u;
};

// ---- LOADING ----
const LoadingBody = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: 40,
        borderRadius: 20,
        background: 'var(--bg1)',
        border: '1px solid var(--line)',
      }}
    >
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          border: '3px solid var(--line)',
          borderTopColor: 'var(--optimal)',
          animation: 'amb-spin .9s linear infinite',
        }}
      />
      <div>
        <div style={{ fontWeight: 600, fontSize: 15 }}>Connecting to sensor node…</div>
        <div style={{ fontSize: 12.5, color: 'var(--txt3)', fontFamily: "'JetBrains Mono',monospace" }}>
          subscribing to /ambient_data
        </div>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(232px,1fr))', gap: 14 }}>
      {[1, 2, 3, 4].map((s) => (
        <div
          key={s}
          style={{
            height: 150,
            borderRadius: 18,
            background: 'linear-gradient(100deg,var(--bg1) 30%,var(--bg1b) 50%,var(--bg1) 70%)',
            backgroundSize: '200% 100%',
            border: '1px solid var(--line)',
            animation: 'amb-breathe 1.6s ease-in-out infinite',
          }}
        />
      ))}
    </div>
  </div>
);

// ---- OFFLINE / EMPTY ----
const OfflineBody = ({ current }) => (
  <div
    style={{
      display: 'grid',
      placeItems: 'center',
      padding: '64px 24px',
      borderRadius: 22,
      background: 'var(--bg1)',
      border: '1px solid var(--line)',
      textAlign: 'center',
    }}
  >
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: 18,
        display: 'grid',
        placeItems: 'center',
        background: 'color-mix(in oklch,var(--muted) 14%,var(--bg2))',
        color: 'var(--muted)',
        marginBottom: 18,
      }}
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M5 12.9a10 10 0 0 1 4-2.6M2 8.8a15 15 0 0 1 4.2-2.6M22 8.8a15 15 0 0 0-6-3.4M12 20h.01" />
      </svg>
    </div>
    <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 600 }}>Sensor node is offline</h2>
    <p style={{ margin: '0 0 20px', color: 'var(--txt2)', fontSize: 14, maxWidth: '42ch' }}>
      No readings received in the last few minutes. The ESP32 may be powered down or off the network. Showing last known
      state.
    </p>
    <div style={{ display: 'flex', gap: 18, fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, color: 'var(--txt3)' }}>
      <span>last seen · {timeAgo(current.timestamp)}</span>
      <span style={{ color: 'var(--muted)' }}>● disconnected</span>
    </div>
  </div>
);

// ---- ERROR ----
const ErrorBody = ({ onRetry }) => (
  <div
    style={{
      display: 'grid',
      placeItems: 'center',
      padding: '64px 24px',
      borderRadius: 22,
      background: 'color-mix(in oklch,var(--warm) 7%,var(--bg1))',
      border: '1px solid color-mix(in oklch,var(--warm) 30%,var(--line))',
      textAlign: 'center',
    }}
  >
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: 18,
        display: 'grid',
        placeItems: 'center',
        background: 'color-mix(in oklch,var(--warm) 16%,var(--bg2))',
        color: 'var(--warm)',
        marginBottom: 18,
      }}
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      </svg>
    </div>
    <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 600 }}>Couldn&rsquo;t reach the database</h2>
    <p style={{ margin: '0 0 20px', color: 'var(--txt2)', fontSize: 14, maxWidth: '42ch' }}>
      The connection to Firebase Realtime Database failed. Check the network and try again.
    </p>
    <button
      onClick={onRetry}
      style={{
        padding: '11px 20px',
        borderRadius: 11,
        background: 'var(--warm)',
        color: 'var(--bg0)',
        border: 'none',
        fontWeight: 600,
        fontSize: 13.5,
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      Retry connection
    </button>
  </div>
);

// ---- LIVE ----
const LiveBody = () => {
  const { current, historical, analysis, summary } = useEnvironment();
  const prev = historical.length >= 2 ? historical[historical.length - 2] : current;

  const spark = (metric) => buildPath(historical.slice(-20).map((h) => h[metric]), 120, 34, 4, 4);

  const motionActive = current.hasRecentMotion || current.motionDetected;

  return (
    <div>
      <HeroStatus current={current} analysis={analysis} />

      {/* metric cards */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(232px,1fr))',
          gap: 14,
          marginBottom: 18,
        }}
      >
        <MetricCard
          metric="temperature"
          value={fmt(current.temperature, 1)}
          unit="°C"
          quality={analysis.tempQuality}
          trend={trend(current.temperature, prev.temperature, 1, '°')}
          spark={spark('temperature')}
        />
        <MetricCard
          metric="humidity"
          value={Math.round(current.humidity)}
          unit="%"
          quality={analysis.humidityQuality}
          trend={trend(current.humidity, prev.humidity, 0, '%')}
          spark={spark('humidity')}
        />
        <MetricCard
          metric="light"
          value={Math.round(current.light)}
          unit="lux"
          quality={analysis.lightQuality}
          trend={trend(current.light, prev.light, 0, '')}
          spark={spark('light')}
        />
        <MetricCard
          metric="motion"
          motionLabel={motionActive ? 'Active' : 'Quiet'}
          lastMotion={motionActive ? 'just now' : timeAgo(current.timestamp)}
          motionEvents={summary.motionEvents}
        />
      </section>

      {/* chart + summary */}
      <section
        style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 14, marginBottom: 18 }}
        data-cols
      >
        <HistoryChart />
        <SummaryPanel />
      </section>

      <MotionTimeline />
      <EmbedTeaser />
      <MotionWidget />
    </div>
  );
};

// Simple error boundary → renders the warm "couldn't reach the database" card.
class DashboardBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <ErrorBody onRetry={() => window.location.reload()} />;
    }
    return this.props.children;
  }
}

const Dashboard = () => {
  const { current, historical } = useEnvironment();

  const loading = !hasRealData(current) && historical.length === 0;
  const offline = hasRealData(current) && isStale(current);

  return (
    <Layout>
      <DashboardBoundary>
        {loading ? <LoadingBody /> : offline ? <OfflineBody current={current} /> : <LiveBody />}
      </DashboardBoundary>
    </Layout>
  );
};

export default Dashboard;
