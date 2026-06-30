// src/components/Layout.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useEnvironment } from '../context/EnvironmentContext';
import { timeAgo } from '../lib/format';
import ThemeToggle from './ThemeToggle';

// Dashboard shell: fixed ambient backdrop + header + main content area.
const Layout = ({ children }) => {
  const { current } = useEnvironment();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg0)',
        color: 'var(--txt)',
        fontFamily: "'Space Grotesk',system-ui,sans-serif",
        fontFeatureSettings: "'ss01'",
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* ambient backdrop */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background:
            'radial-gradient(900px 520px at 82% -8%, color-mix(in oklch, var(--optimal) 16%, transparent), transparent 60%), radial-gradient(760px 480px at 6% 4%, color-mix(in oklch, var(--cyan) 12%, transparent), transparent 58%)',
        }}
      />

      <main
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1180,
          margin: '0 auto',
          padding: '26px 22px 120px',
        }}
      >
        {/* header */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 24,
          }}
        >
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginRight: 'auto',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                background:
                  'linear-gradient(150deg,color-mix(in oklch,var(--optimal) 40%,var(--bg2)),var(--bg2))',
                display: 'grid',
                placeItems: 'center',
                border: '1px solid var(--line)',
              }}
            >
              <span
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: '50%',
                  background: 'var(--optimal)',
                  boxShadow: '0 0 14px var(--optimal)',
                }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 17, letterSpacing: '-.01em' }}>Ambient Monitor</div>
              <div
                style={{
                  fontSize: 11.5,
                  color: 'var(--txt3)',
                  fontFamily: "'JetBrains Mono',monospace",
                }}
              >
                Living Room · node-01
              </div>
            </div>
          </Link>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 13px',
              borderRadius: 999,
              background: 'color-mix(in oklch,var(--optimal) 12%,var(--bg1))',
              border: '1px solid color-mix(in oklch,var(--optimal) 30%,var(--line))',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ position: 'relative', width: 8, height: 8 }}>
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: 'var(--optimal)',
                  animation: 'amb-pulse 2s ease-in-out infinite',
                }}
              />
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--optimal)' }}>LIVE</span>
            <span
              style={{
                fontSize: 11.5,
                color: 'var(--txt2)',
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              updated {timeAgo(current.timestamp)}
            </span>
          </div>

          <ThemeToggle />
        </header>

        {children}
      </main>
    </div>
  );
};

export default Layout;
