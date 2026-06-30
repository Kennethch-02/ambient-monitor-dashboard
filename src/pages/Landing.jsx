import { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import HardwareDiagram from '../components/HardwareDiagram';
import { useEnvironment } from '../context/EnvironmentContext';
import { buildPath } from '../lib/spark';
import { useDocumentTitle } from '../lib/seo';

const GH_PROFILE = 'https://github.com/Kennethch-02';
const GH_FIRMWARE = 'https://github.com/Kennethch-02/ambient_monitor_scripts';
const GH_DASHBOARD = 'https://github.com/Kennethch-02/ambient-monitor-dashboard';

// ---- ported logic arrays (mockup lines 742–773) ----
const techBadges = ['React 18', 'Vite 6', 'Tailwind 3.4', 'Recharts', 'Firebase RTDB', 'ESP32 · PlatformIO'];

const landingFeatures = [
  { hue: 'var(--warm)', title: 'Real-time sensing', body: 'Temperature, humidity, ambient light and motion — sampled every 60 seconds and streamed live from the room.' },
  { hue: 'var(--optimal)', title: 'Environment quality', body: 'Automatic Optimal / Too Hot / Too Dry / Too Dark analysis, tuned for a comfortable place to focus and work.' },
  { hue: 'var(--cyan)', title: 'History & trends', body: 'A rolling one-hour chart, summary averages and a motion timeline — the room’s recent story at a glance.' },
  { hue: 'var(--violet)', title: 'Embeddable widgets', body: 'Drop a live widget into any website with one line of HTML. Configurable by URL, transparent or solid.' },
  { hue: 'var(--amber)', title: 'Dark & light', body: 'A calm, ambient theme in both modes that encodes the room’s state in colour — readable at a glance.' },
  { hue: 'var(--muted)', title: 'Open hardware', body: 'An ESP32 node with DHT22, BH1750 and a PIR sensor — fully documented and reproducible from scratch.' },
];

const wiringRows = [
  { part: 'DHT22', sub: 'temperature + humidity', pin: 'GPIO 4', note: 'data line · 3.3V', hue: 'var(--warm)' },
  { part: 'BH1750', sub: 'ambient light', pin: 'SDA 21 · SCL 22', note: 'I²C · 3.3V', hue: 'var(--amber)' },
  { part: 'PIR sensor', sub: 'motion', pin: 'GPIO 13', note: 'active-low (!digitalRead)', hue: 'var(--violet)' },
  { part: 'RGB LED', sub: 'status indicator', pin: 'R 25 · G 26 · B 27', note: 'onboard signal', hue: 'var(--optimal)' },
  { part: 'Power', sub: 'rails', pin: '3.3V / GND', note: 'PIR Vcc may need 5V', hue: 'var(--cyan)' },
];

const ledLegend = [
  { dot: { background: 'var(--optimal)', boxShadow: '0 0 12px var(--optimal)' }, label: 'System OK', sub: 'solid green' },
  { dot: { background: 'var(--cold)', boxShadow: '0 0 12px var(--cold)' }, label: 'Connecting to WiFi', sub: 'blue blink' },
  { dot: { background: 'oklch(0.62 0.2 25)', boxShadow: '0 0 12px oklch(0.62 0.2 25)' }, label: 'Sensor error', sub: 'red blink' },
  { dot: { background: 'linear-gradient(90deg,oklch(0.62 0.2 25) 50%,var(--cold) 50%)' }, label: 'Firebase error', sub: 'red / blue alternating' },
  { dot: { background: 'linear-gradient(90deg,var(--optimal) 50%,var(--cold) 50%)' }, label: 'Motion detected', sub: 'green + blue' },
  { dot: { background: 'var(--cold)', boxShadow: '0 0 12px var(--cold)' }, label: 'PIR calibrating', sub: 'blue blink · 30s' },
  { dot: { background: 'oklch(0.96 0.01 230)', boxShadow: '0 0 12px oklch(0.9 0.02 230)' }, label: 'Initializing', sub: 'white blink' },
];

const steps = [
  { n: '01', title: 'Gather the bill of materials', lead: 'Most parts are common and substitutable — the PIR and LED models in particular.', items: ['ESP32 dev board — upesy_wroom / generic WROOM-32', 'DHT22 temperature + humidity sensor', 'BH1750 (GY-302) ambient light sensor', 'PIR motion sensor (e.g. HC-SR501)', 'Common RGB LED + 3×220Ω resistors', 'Breadboard, jumper wires and a USB cable'] },
  { n: '02', title: 'Wire it up', lead: 'Follow the connection map above. Everything shares the 3.3V and GND rails.', items: ['DHT22 data → GPIO 4', 'BH1750 → I²C: SDA 21, SCL 22', 'PIR output → GPIO 13 (3.3V logic)', 'RGB LED → GPIO 25 / 26 / 27 through resistors'] },
  { n: '03', title: 'Flash the firmware (PlatformIO)', lead: 'The firmware repo ships with its dependencies declared in lib_deps.', items: ['Clone ambient_monitor_scripts', 'Copy include/secrets.example.h → include/secrets.h', 'Fill in your WiFi and Firebase credentials', 'Build & upload to the ESP32'] },
  { n: '04', title: 'Set up Firebase', lead: 'The device writes; the dashboard reads with a dedicated account.', items: ['Create a project and enable Realtime Database', 'Enable Email/Password auth (device account)', 'Enable Email/Password auth (device writer + read-only dashboard account)', 'Set DB rules — data lands at /ambient_data/{ts} and /motion_events/{ts}'] },
  { n: '05', title: 'Run the dashboard', lead: 'A standard Vite + React app.', items: ['Clone ambient-monitor-dashboard', 'Set your web config in src/config/firebase.js', 'npm install', 'npm run dev — or npm run build'] },
  { n: '06', title: 'Embed it anywhere (optional)', lead: 'One line drops a live widget into any page.', items: ['<iframe src=".../embed?widget=temperature&theme=auto">'] },
];

function Landing() {
  useDocumentTitle('Ambient Monitor — live room temperature, light & motion');
  const env = useEnvironment();
  const { current, historical } = env;
  const [openStep, setOpenStep] = useState(1);

  const temp = Number(current?.temperature) || 0;
  const heroTemp = temp.toFixed(1);
  const tS = buildPath((historical || []).slice(-20).map((h) => h.temperature), 120, 34, 4, 4);

  return (
    <div
      className="light-aware"
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

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* top bar */}
        <header style={{ maxWidth: '1120px', margin: '0 auto', padding: '22px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '11px', marginRight: 'auto', textDecoration: 'none', color: 'var(--txt)' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(150deg,color-mix(in oklch,var(--optimal) 40%,var(--bg2)),var(--bg2))', display: 'grid', placeItems: 'center', border: '1px solid var(--line)' }}>
              <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: 'var(--optimal)', boxShadow: '0 0 12px var(--optimal)' }} />
            </div>
            <span style={{ fontWeight: 600, fontSize: '16px' }}>Ambient Monitor</span>
          </Link>
          <ThemeToggle />
          <a href={GH_PROFILE} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontSize: '13.5px', fontWeight: 600, color: 'var(--txt2)', padding: '9px 15px', borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--bg1)' }}>GitHub</a>
        </header>

        {/* A. HERO */}
        <section style={{ maxWidth: '1120px', margin: '0 auto', padding: '36px 22px 60px', display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: '48px', alignItems: 'center' }} data-hero>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '999px', background: 'color-mix(in oklch,var(--optimal) 12%,var(--bg1))', border: '1px solid color-mix(in oklch,var(--optimal) 26%,var(--line))', marginBottom: '22px', whiteSpace: 'nowrap' }}>
              <span style={{ position: 'relative', width: '8px', height: '8px' }}>
                <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--optimal)', animation: 'amb-pulse 2s ease-in-out infinite' }} />
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--optimal)' }}>Live · ESP32 → Firebase → React</span>
            </div>
            <h1 style={{ margin: 0, fontSize: 'clamp(36px,5.4vw,54px)', lineHeight: 1.03, fontWeight: 600, letterSpacing: '-.03em', textWrap: 'balance' }}>A live window into a room&rsquo;s air, light &amp; motion.</h1>
            <p style={{ margin: '20px 0 0', fontSize: '17px', lineHeight: 1.55, color: 'var(--txt2)', maxWidth: '48ch' }}>A physical sensor node measures a real room and streams it to the web. Watch the temperature, humidity, ambient light and movement update in real time — and embed the live readout anywhere.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '30px' }}>
              <Link to="/dashboard" style={{ textDecoration: 'none', padding: '14px 24px', borderRadius: '12px', background: 'var(--optimal)', color: 'var(--bg0)', border: 'none', fontWeight: 600, fontSize: '15px', cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center' }}>Open dashboard →</Link>
              <a href={GH_PROFILE} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', padding: '14px 24px', borderRadius: '12px', background: 'var(--bg1)', color: 'var(--txt)', border: '1px solid var(--line)', fontWeight: 600, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '9px' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 8.8 21.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.4 4.8-4.6 5 .3.3.7 1 .7 2v3c0 .3.2.6.7.5A10 10 0 0 0 12 2z" /></svg>View on GitHub
              </a>
            </div>
          </div>
          {/* live preview widget */}
          <div style={{ position: 'relative', display: 'grid', placeItems: 'center', minHeight: '280px' }}>
            <div aria-hidden="true" style={{ position: 'absolute', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle,color-mix(in oklch,var(--warm) 22%,transparent),transparent 65%)' }} />
            <div style={{ position: 'relative', width: '360px', maxWidth: '100%', borderRadius: '18px', background: 'var(--bg1)', border: '1px solid var(--line)', boxShadow: '0 30px 70px -30px oklch(0.05 0.02 215/.8)', padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '24px' }}>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: 'var(--warm)', boxShadow: '0 0 12px var(--warm)' }} />
                <span style={{ fontSize: '13.5px', color: 'var(--txt2)', fontWeight: 500 }}>Temperature</span>
                <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10.5px', fontWeight: 600, color: 'var(--optimal)' }}>
                  <span style={{ position: 'relative', width: '7px', height: '7px' }}>
                    <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--optimal)', animation: 'amb-pulse 2s ease-in-out infinite' }} />
                  </span>LIVE
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', fontFamily: "'JetBrains Mono',monospace" }}>
                <span style={{ fontSize: '58px', fontWeight: 600, letterSpacing: '-.02em', color: 'var(--warm)' }}>{heroTemp}</span>
                <span style={{ fontSize: '20px', color: 'var(--txt3)' }}>°C</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 11px', borderRadius: '999px', background: 'color-mix(in oklch,var(--optimal) 16%,transparent)', color: 'var(--optimal)' }}>Optimal</span>
                <svg width="150" height="40" viewBox="0 0 120 34" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                  <path d={tS.area} fill="color-mix(in oklch,var(--warm) 16%,transparent)" />
                  <path d={tS.line} fill="none" stroke="var(--warm)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: 'var(--txt3)', fontFamily: "'JetBrains Mono',monospace" }}>Living Room · node-01</span>
                <span style={{ fontSize: '11px', color: 'var(--txt3)' }}>embedded live →</span>
              </div>
            </div>
          </div>
        </section>

        {/* B. WHAT IT DOES */}
        <section style={{ maxWidth: '1120px', margin: '0 auto', padding: '40px 22px' }}>
          <div style={{ maxWidth: '60ch', marginBottom: '34px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--optimal)', marginBottom: '12px' }}>What it does</div>
            <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 600, letterSpacing: '-.02em' }}>An instrument panel for a living space</h2>
            <p style={{ margin: '14px 0 0', fontSize: '15.5px', lineHeight: 1.6, color: 'var(--txt2)' }}>A two-part IoT system. A physical ESP32 node measures the room and pushes readings to Firebase Realtime Database; this React dashboard subscribes live, reads the room&rsquo;s quality, and can be embedded into other sites.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: '14px' }}>
            {landingFeatures.map((f, i) => (
              <article key={i} style={{ borderRadius: '18px', background: 'var(--bg1)', border: '1px solid var(--line)', padding: '22px', boxShadow: 'var(--shadow)' }}>
                <span style={{ display: 'inline-flex', width: '38px', height: '38px', borderRadius: '11px', background: `color-mix(in oklch,${f.hue} 15%,var(--bg2))`, alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <span style={{ width: '13px', height: '13px', borderRadius: '4px', background: f.hue }} />
                </span>
                <h3 style={{ margin: '0 0 7px', fontSize: '16.5px', fontWeight: 600 }}>{f.title}</h3>
                <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.55, color: 'var(--txt2)' }}>{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* C. HARDWARE */}
        <section style={{ maxWidth: '1120px', margin: '0 auto', padding: '48px 22px' }}>
          <div style={{ maxWidth: '60ch', marginBottom: '30px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--optimal)', marginBottom: '12px' }}>The hardware</div>
            <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 600, letterSpacing: '-.02em' }}>One ESP32, four senses</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '18px' }} data-hw>
            {/* diagram */}
            <div style={{ borderRadius: '20px', background: 'var(--bg1)', border: '1px solid var(--line)', padding: '16px', boxShadow: 'var(--shadow)' }}>
              <HardwareDiagram />
            </div>
            {/* connection table */}
            <div style={{ borderRadius: '20px', background: 'var(--bg1)', border: '1px solid var(--line)', padding: '8px 6px', boxShadow: 'var(--shadow)' }}>
              {wiringRows.map((w, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 14px', borderBottom: '1px solid var(--line-soft)' }}>
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: w.hue, flex: 'none' }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{w.part}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--txt3)' }}>{w.sub}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '13px', color: 'var(--txt)', fontWeight: 600 }}>{w.pin}</div>
                    <div style={{ fontSize: '11px', color: 'var(--txt3)' }}>{w.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LED legend */}
          <div style={{ marginTop: '18px', borderRadius: '20px', background: 'var(--bg1)', border: '1px solid var(--line)', padding: '20px', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '15px', fontWeight: 600, marginRight: 'auto' }}>Status-LED legend</span>
              <span style={{ fontSize: '11.5px', color: 'var(--txt3)', fontFamily: "'JetBrains Mono',monospace" }}>onboard RGB</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '12px' }}>
              {ledLegend.map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '11px 13px', borderRadius: '12px', background: 'var(--bg0)', border: '1px solid var(--line-soft)' }}>
                  <span style={{ width: '14px', height: '14px', borderRadius: '50%', flex: 'none', ...l.dot }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{l.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--txt3)', fontFamily: "'JetBrains Mono',monospace" }}>{l.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* D. RECREATE */}
        <section style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 22px' }}>
          <div style={{ maxWidth: '60ch', marginBottom: '28px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--optimal)', marginBottom: '12px' }}>Build your own</div>
            <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 600, letterSpacing: '-.02em' }}>Recreate it in six steps</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {steps.map((s, i) => {
              const idx = i + 1;
              const open = openStep === idx;
              return (
                <div key={s.n} style={{ borderRadius: '16px', background: 'var(--bg1)', border: '1px solid var(--line)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                  <button onClick={() => setOpenStep(open ? 0 : idx)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', color: 'var(--txt)' }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '13px', fontWeight: 600, color: 'var(--optimal)' }}>{s.n}</span>
                    <span style={{ fontSize: '16px', fontWeight: 600, marginRight: 'auto' }}>{s.title}</span>
                    <span style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'var(--bg2)', display: 'grid', placeItems: 'center', color: 'var(--txt2)', fontSize: '18px', lineHeight: 1 }}>+</span>
                  </button>
                  {open && (
                    <div style={{ padding: '0 20px 20px 56px' }}>
                      <p style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--txt2)', lineHeight: 1.55 }}>{s.lead}</p>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {s.items.map((it, j) => (
                          <li key={j} style={{ display: 'flex', gap: '10px', fontSize: '13.5px', color: 'var(--txt)', lineHeight: 1.5 }}>
                            <span style={{ color: 'var(--optimal)', flex: 'none' }}>·</span>
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12.5px', color: 'var(--txt2)' }}>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* E. FOOTER */}
        <footer style={{ borderTop: '1px solid var(--line)', marginTop: '30px' }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '44px 22px 110px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '30px' }} data-foot>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '14px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'linear-gradient(150deg,color-mix(in oklch,var(--optimal) 40%,var(--bg2)),var(--bg2))', display: 'grid', placeItems: 'center', border: '1px solid var(--line)' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--optimal)', boxShadow: '0 0 10px var(--optimal)' }} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '15px' }}>Ambient Monitor</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--txt3)', lineHeight: 1.55, maxWidth: '36ch' }}>A live window into a room&rsquo;s air, light and motion. Part of the teonix.dev portfolio.</p>
              </div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--txt3)', marginBottom: '12px' }}>Repositories</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13.5px' }}>
                  <a href={GH_FIRMWARE} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--txt2)', textDecoration: 'none', fontFamily: "'JetBrains Mono',monospace" }}>ambient_monitor_scripts</a>
                  <a href={GH_DASHBOARD} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--txt2)', textDecoration: 'none', fontFamily: "'JetBrains Mono',monospace" }}>ambient-monitor-dashboard</a>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--txt3)', marginBottom: '12px' }}>Author</div>
                <div style={{ fontSize: '13.5px', color: 'var(--txt)', fontWeight: 600 }}>Kenneth · kcastilloh</div>
                <div style={{ fontSize: '12.5px', color: 'var(--txt3)', fontFamily: "'JetBrains Mono',monospace", marginTop: '4px' }}>GitHub Kennethch-02</div>
                <a href="https://teonix.dev" target="_blank" rel="noopener" style={{ display: 'inline-block', marginTop: '8px', fontSize: '13px', color: 'var(--optimal)', textDecoration: 'none' }}>teonix.dev →</a>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '30px', paddingTop: '24px', borderTop: '1px solid var(--line-soft)' }}>
              {techBadges.map((b, i) => (
                <span key={i} style={{ fontSize: '11.5px', fontFamily: "'JetBrains Mono',monospace", color: 'var(--txt3)', padding: '5px 11px', borderRadius: '8px', background: 'var(--bg1)', border: '1px solid var(--line)' }}>{b}</span>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Landing;
