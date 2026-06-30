// src/pages/EmbedBuilder.jsx
// The embed builder view (mockup lines 319–428): pick widget / theme / range /
// background, see a live preview on a faux host site, and copy the iframe snippet.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import EmbedWidget from '../components/EmbedWidget';
import { getTheme } from '../lib/theme';

const WIDGET_OPTS = [
  ['temperature', 'Temp'],
  ['humidity', 'Humidity'],
  ['light', 'Light'],
  ['motion', 'Motion'],
  ['summary', 'Summary'],
  ['all', 'All'],
];
const THEME_OPTS = [['auto', 'Auto'], ['light', 'Light'], ['dark', 'Dark']];
const RANGE_OPTS = [['live', 'Live'], ['1h', '1h'], ['24h', '24h']];
const BG_OPTS = [['transparent', 'Transparent'], ['solid', 'Solid']];

const optBtnStyle = (active) => ({
  fontSize: 12,
  fontWeight: 600,
  padding: '8px 13px',
  borderRadius: 9,
  cursor: 'pointer',
  fontFamily: 'inherit',
  border: `1px solid ${active ? 'color-mix(in oklch,var(--optimal) 42%,var(--line))' : 'var(--line)'}`,
  background: active ? 'color-mix(in oklch,var(--optimal) 15%,var(--bg1))' : 'var(--bg1)',
  color: active ? 'var(--optimal)' : 'var(--txt2)',
});

const groupLabelStyle = {
  fontSize: 12,
  color: 'var(--txt3)',
  textTransform: 'uppercase',
  letterSpacing: '.1em',
  marginBottom: 10,
};

export default function EmbedBuilder() {
  const [cfg, setCfg] = useState({ widget: 'temperature', theme: 'auto', range: '1h', bg: 'transparent' });
  const [copied, setCopied] = useState(false);

  const setE = (key, value) => () => {
    setCfg((c) => ({ ...c, [key]: value }));
    setCopied(false);
  };

  const snippet =
    `<iframe\n  src="https://ambient.teonix.dev/embed.html?widget=${cfg.widget}&theme=${cfg.theme}&range=${cfg.range}&bg=${cfg.bg}"\n  width="340" height="190" frameborder="0"\n  style="border:0;border-radius:16px"\n  title="Ambient Monitor"></iframe>`;

  const onCopy = () => {
    try {
      navigator.clipboard.writeText(snippet);
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Preview the chosen widget THEME regardless of the page theme (mockup line 690).
  const pageTheme = getTheme();
  const previewClass = cfg.theme === 'light' ? 'light' : cfg.theme === 'dark' ? '' : pageTheme === 'light' ? 'light' : '';

  const hostStyle =
    cfg.bg === 'transparent'
      ? { background: 'repeating-conic-gradient(oklch(0.5 0.02 230/.16) 0% 25%, transparent 0% 50%) 50%/22px 22px' }
      : { background: 'linear-gradient(135deg,oklch(0.42 0.05 255),oklch(0.32 0.06 285))' };

  const group = (title, opts, key) => (
    <>
      <div style={groupLabelStyle}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 20 }}>
        {opts.map(([k, label]) => (
          <button key={k} onClick={setE(key, k)} style={optBtnStyle(cfg[key] === k)}>
            {label}
          </button>
        ))}
      </div>
    </>
  );

  const chip = (name, value) => (
    <span style={{ padding: '4px 9px', borderRadius: 7, background: 'var(--bg2)', color: 'var(--txt3)' }}>
      {name}=<b style={{ color: 'var(--txt)' }}>{value}</b>
    </span>
  );

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--bg0)',
        color: 'var(--txt)',
        fontFamily: "'Space Grotesk',sans-serif",
      }}
    >
      {/* ambient backdrop */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(60% 50% at 85% -5%, color-mix(in oklch,var(--optimal) 14%,transparent), transparent 70%), radial-gradient(50% 40% at 5% 0%, color-mix(in oklch,var(--cyan) 10%,transparent), transparent 70%)',
        }}
      />

      {/* top bar */}
      <header
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1120,
          margin: '0 auto',
          padding: 22,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: 11, marginRight: 'auto', textDecoration: 'none', color: 'inherit' }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'linear-gradient(150deg,color-mix(in oklch,var(--optimal) 40%,var(--bg2)),var(--bg2))',
              display: 'grid',
              placeItems: 'center',
              border: '1px solid var(--line)',
            }}
          >
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--optimal)', boxShadow: '0 0 12px var(--optimal)' }} />
          </div>
          <span style={{ fontWeight: 600, fontSize: 16, color: 'var(--txt)' }}>Ambient Monitor</span>
        </Link>
        <ThemeToggle />
        <Link
          to="/dashboard"
          style={{
            padding: '8px 18px',
            borderRadius: 999,
            background: 'var(--optimal)',
            color: 'var(--bg0)',
            fontWeight: 600,
            fontSize: 13,
            textDecoration: 'none',
          }}
        >
          Open dashboard
        </Link>
      </header>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 1080, margin: '0 auto', padding: '30px 22px 120px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: 'var(--optimal)',
            }}
          >
            Embed builder
          </span>
        </div>
        <h1 style={{ margin: '0 0 8px', fontSize: 30, fontWeight: 600, letterSpacing: '-.02em' }}>Put this room on any website</h1>
        <p style={{ margin: '0 0 28px', color: 'var(--txt2)', fontSize: 14.5, maxWidth: '60ch' }}>
          A chrome-less, self-contained widget that reads the same live Firebase data. Configure it entirely through the URL — then
          paste one line of HTML. It stays crisp down to 320×180.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }} data-embed-cols="">
          {/* controls */}
          <aside
            style={{
              borderRadius: 18,
              background: 'var(--bg1)',
              border: '1px solid var(--line)',
              padding: 18,
              boxShadow: 'var(--shadow)',
              alignSelf: 'start',
            }}
          >
            {group('Widget', WIDGET_OPTS, 'widget')}
            {group('Theme', THEME_OPTS, 'theme')}
            {group('History range', RANGE_OPTS, 'range')}
            <div style={groupLabelStyle}>Background</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {BG_OPTS.map(([k, label]) => (
                <button key={k} onClick={setE('bg', k)} style={optBtnStyle(cfg.bg === k)}>
                  {label}
                </button>
              ))}
            </div>
          </aside>

          {/* preview + snippet */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
            {/* host mock */}
            <div style={{ borderRadius: 18, border: '1px solid var(--line)', overflow: 'hidden' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '10px 14px',
                  background: 'var(--bg2)',
                  borderBottom: '1px solid var(--line)',
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'oklch(0.7 0.16 25)' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'oklch(0.82 0.15 85)' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'oklch(0.78 0.14 150)' }} />
                <span style={{ marginLeft: 8, fontSize: 11.5, color: 'var(--txt3)', fontFamily: "'JetBrains Mono',monospace" }}>
                  your-website.com — live preview
                </span>
              </div>
              <div style={{ ...hostStyle, padding: '44px 24px', display: 'grid', placeItems: 'center', minHeight: 280 }}>
                <div className={previewClass}>
                  <div style={{ width: 340, height: 190 }}>
                    <EmbedWidget {...cfg} />
                  </div>
                </div>
              </div>
            </div>

            {/* snippet */}
            <div style={{ borderRadius: 18, background: 'var(--bg1)', border: '1px solid var(--line)', padding: 18, boxShadow: 'var(--shadow)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, marginRight: 'auto' }}>Paste this snippet</span>
                <button
                  onClick={onCopy}
                  style={{
                    padding: '8px 15px',
                    borderRadius: 9,
                    background: 'var(--optimal)',
                    color: 'var(--bg0)',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: 12.5,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {copied ? 'Copied ✓' : 'Copy snippet'}
                </button>
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: '14px 16px',
                  borderRadius: 11,
                  background: 'var(--bg0)',
                  border: '1px solid var(--line)',
                  overflow: 'auto',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 12.5,
                  lineHeight: 1.6,
                  color: 'var(--txt2)',
                  whiteSpace: 'pre',
                }}
              >
                <code>{snippet}</code>
              </pre>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginTop: 14,
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 11,
                }}
              >
                {chip('widget', cfg.widget)}
                {chip('theme', cfg.theme)}
                {chip('range', cfg.range)}
                {chip('bg', cfg.bg)}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
