# Ambient Monitor — Implementation Guide (for Claude Code)

> **Read this whole file before writing code.** It is the port spec that turns the design
> mockup `Ambient Monitor.dc.html` into the real React + Vite + Tailwind app. Work top to
> bottom and tick every box in the **Build checklist** — do not skip a section.
>
> The mockup is the single source of truth for **visual format, layout, color, type,
> spacing, copy and interaction**. It is a streaming HTML prototype with mock data; you are
> re-implementing it as production React components. **Do NOT touch the data layer.**

---

## 0. Hard constraints (do not break)

- Stack is **fixed**: React 18.3 (function components + hooks), Vite 6, Tailwind CSS 3.4
  (Tailwind only), Recharts 2.15, lucide-react. No new heavy deps without asking.
- **Do NOT modify** `src/context/EnvironmentContext.jsx`, the `useEnvironment()` hook, the
  Firebase queries, or the Spanish→English field mapping. Components **consume** the hook.
- UI language **English**. Code/comments **English**.
- Keep **dark + light** themes via Tailwind `dark:` (see §2 — we drive it with a `.dark`
  class on `<html>` + CSS variables).
- Windows / PowerShell dev env: no `mkdir -p`, no `&&` chaining in shell commands.

### Two things to CONFIRM with the user before installing
1. **Router** — the app has no router. Proposed: add **`react-router-dom@6`** for `/`
   (landing), `/dashboard` (app), `/embed` (widgets). Confirm before `npm install`.
2. **Embed entry** — proposed: a **separate Vite entry `embed.html`** so the embed bundle
   stays lean (no router, no landing). Alternative is a routed `/embed` view. Confirm which.

---

## 1. The mockup → what maps where

`Ambient Monitor.dc.html` contains **three views** behind a bottom view-switcher. In the real
app each becomes a **route**, not a switcher:

| Mockup view | Route | Entry |
|---|---|---|
| Landing | `/` | `index.html` → `src/main.jsx` |
| Dashboard (the live app) | `/dashboard` | same SPA |
| Embed widgets | `/embed` | **separate** `embed.html` → `src/embed.jsx` (lean) |

The bottom floating pill in the mockup is **only a demo navigator** — replace it with real
routing. The dashboard's "Preview state" segmented control is also **demo-only** (it fakes
loading/offline/error); in production those states are derived from the real hook (see §6).

> ⚠️ **Animation gotcha learned in the mockup:** never gate a *displayed value* behind an
> animation. Bind real readings directly (`current.temperature`, etc.). Cosmetic count-ups
> must always end at, and fall back to, the true value. Entrance reveals: drive opacity from
> mounted state or use a one-shot CSS animation that is safe if it never re-fires.

---

## 2. Design system → `tailwind.config.js` + `src/index.css`

The palette is **OKLCH CSS variables** with a light override. Keep it that way (it gives you
free light/dark) and let Tailwind reference the vars.

### 2a. `src/index.css` — paste the tokens

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root{
  --bg-0: oklch(0.155 0.012 215); --bg-1: oklch(0.205 0.015 215);
  --bg-1b: oklch(0.235 0.017 215); --bg-2: oklch(0.265 0.018 215);
  --line: oklch(0.33 0.02 215);   --line-soft: oklch(0.275 0.016 215);
  --txt: oklch(0.965 0.006 215);  --txt-2: oklch(0.74 0.013 215); --txt-3: oklch(0.56 0.015 215);
  /* state / metric accents */
  --optimal: oklch(0.82 0.13 168); --warm: oklch(0.76 0.15 48);  --cold: oklch(0.78 0.12 245);
  --amber: oklch(0.85 0.13 88);    --cyan: oklch(0.82 0.10 215);  --violet: oklch(0.78 0.13 292);
  --muted: oklch(0.64 0.04 250);
  --shadow: 0 1px 0 oklch(0.5 0.02 215 / .04) inset, 0 18px 40px -24px oklch(0.05 0.02 215 / .8);
}
.dark{ /* dark IS the default look above; map :root tokens here if you prefer light-as-base */ }
.light, :root:not(.dark){
  --bg-0: oklch(0.972 0.006 210); --bg-1: oklch(0.995 0.003 210);
  --bg-1b: oklch(0.985 0.005 210);--bg-2: oklch(0.955 0.008 210);
  --line: oklch(0.9 0.012 215);   --line-soft: oklch(0.93 0.009 215);
  --txt: oklch(0.26 0.022 220);   --txt-2: oklch(0.46 0.02 220);  --txt-3: oklch(0.62 0.018 220);
  --optimal: oklch(0.62 0.13 168);--warm: oklch(0.62 0.16 48);    --cold: oklch(0.6 0.14 250);
  --amber: oklch(0.68 0.14 80);   --cyan: oklch(0.6 0.12 230);     --violet: oklch(0.58 0.15 292);
  --muted: oklch(0.55 0.04 250);
  --shadow: 0 1px 0 oklch(1 0 0 / .6) inset, 0 18px 40px -28px oklch(0.5 0.04 215 / .35);
}

/* the only non-inline CSS the mockup needs */
@keyframes amb-pulse{0%,100%{opacity:.35;transform:scale(.85)}50%{opacity:1;transform:scale(1.1)}}
@keyframes amb-ring{0%{opacity:.6;transform:scale(.6)}70%{opacity:0}100%{opacity:0;transform:scale(2.4)}}
@keyframes amb-breathe{0%,100%{opacity:.5}50%{opacity:.9}}
@keyframes amb-spin{to{transform:rotate(360deg)}}
```

> **Theme strategy:** put **dark as the default** (matches the brief's "instrument" feel).
> Use Tailwind `darkMode: 'class'` and toggle a `dark` class on `<html>`. The mockup uses a
> `.light` class for the light override — pick ONE convention (recommended: `darkMode:'class'`,
> dark default, add `.light` override as above) and keep `ThemeToggle` in sync with it +
> `localStorage`.

### 2b. `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './embed.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg0:'var(--bg-0)', bg1:'var(--bg-1)', bg1b:'var(--bg-1b)', bg2:'var(--bg-2)',
        line:'var(--line)', lineSoft:'var(--line-soft)',
        txt:'var(--txt)', txt2:'var(--txt-2)', txt3:'var(--txt-3)',
        optimal:'var(--optimal)', warm:'var(--warm)', cold:'var(--cold)',
        amber:'var(--amber)', cyan:'var(--cyan)', violet:'var(--violet)', muted:'var(--muted)',
      },
      fontFamily: {
        sans: ["'Space Grotesk'", 'system-ui', 'sans-serif'],
        mono: ["'JetBrains Mono'", 'ui-monospace', 'monospace'],
      },
      borderRadius: { card:'18px', xl2:'20px', hero:'22px' },
      boxShadow: { amb:'var(--shadow)' },
      maxWidth: { app:'1180px', site:'1120px' },
      keyframes: {
        pulse2:{'0%,100%':{opacity:'.35',transform:'scale(.85)'},'50%':{opacity:'1',transform:'scale(1.1)'}},
        ring:{'0%':{opacity:'.6',transform:'scale(.6)'},'70%':{opacity:'0'},'100%':{opacity:'0',transform:'scale(2.4)'}},
        breathe:{'0%,100%':{opacity:'.5'},'50%':{opacity:'.9'}},
      },
      animation: { pulse2:'pulse2 2s ease-in-out infinite', ring:'ring 1.8s ease-out infinite', breathe:'breathe 6s ease-in-out infinite' },
    },
  },
  plugins: [],
}
```

- **Type scale**: hero `clamp(36px,5.4vw,54px)`; section H2 32px; card value 40px;
  hero widget value 58px; body 13.5–15px; mono captions 11–12.5px. Min readable 11px.
- **`color-mix(in oklch, var(--x) N%, transparent)`** is used heavily for tinted chips/glows.
  Keep it (modern browsers) or precompute equivalents — do not flatten to opaque.

### 2c. Quality → color mapping (central, reuse everywhere)

Make a tiny helper so the `analysis` labels drive color consistently:

```js
// src/lib/quality.js
export const QUALITY_COLOR = {
  Optimal:'optimal', Normal:'cyan',
  'Too Hot':'warm', 'Too Cold':'cold',
  'Too Dry':'amber', 'Too Humid':'cyan',
  'Too Dark':'muted', 'Too Bright':'amber',
};
export const METRIC_HUE = { temperature:'warm', humidity:'cyan', light:'amber', motion:'violet' };
```

---

## 3. Routing & entries

```
src/
  main.jsx          // BrowserRouter: / -> Landing, /dashboard -> Dashboard
  embed.jsx         // NO router; reads ?params; renders one widget
  App.jsx           // <ThemeProvider> wrapper, <EnvironmentProvider>, <Routes>
index.html          // landing/dashboard SPA
embed.html          // <div id="embed"></div> + <script type=module src=/src/embed.jsx>
```

- Wrap **all three** in the existing `EnvironmentProvider` so each reuses `useEnvironment()`.
- `vite.config.js` → `build.rollupOptions.input = { main:'index.html', embed:'embed.html' }`.

---

## 4. Components — restyle / rebuild spec

Rebuild these `src/components/` files to match the mockup. Each bullet is a requirement.

### 4a. `Layout.jsx` (dashboard shell)
- Container `max-w-app mx-auto px-[22px] pt-[26px] pb-[120px]`, relative.
- **Fixed ambient backdrop**: two radial gradients (optimal top-right, cyan top-left), `-z-0`.
- **Header**: logo chip (gradient + glowing optimal dot) + "Ambient Monitor" / "Living Room ·
  node-01" (mono); right side: **LIVE badge** (pulsing dot via `animation-pulse2`, "updated
  Ns ago" — derive from `current.timestamp`) + `ThemeToggle`. `white-space:nowrap` on the badge.
- The "Preview state" segmented control is **demo-only — delete it** in production.

### 4b. `MetricCard.jsx` (used ×4)
Props: `metric` (`temperature|humidity|light|motion`), value, unit, `quality`, `trend`, `spark`.
- Rounded `card`, `bg-bg1`, border tinted by the metric hue, `shadow-amb`, corner radial glow.
- Top row: 34px rounded icon chip (lucide icon, tinted bg) + label + **quality chip**
  (pill colored via `QUALITY_COLOR`). Motion card uses a pulsing **ring** dot instead.
- Big value in **mono** + muted unit. Trend line: `±x vs prev` (mono) + **mini sparkline**.
- **Sparkline** = small inline `<svg>` area+line, ~120×34 viewBox, hue-colored. Build the
  path from `historical.slice(-20)` — helper in §5. (You may use a tiny Recharts
  `<Sparklines>`-style chart, but inline SVG is lighter and matches the mockup.)
- Icons: Thermometer, Droplet/Droplets, Sun, Radar (or Activity) from lucide-react.

### 4c. Hero status banner (new — add to dashboard, above the cards)
- Wide rounded `hero` card, optimal-tinted gradient bg, breathing radial glow.
- Chip "All readings optimal" (✓) — text + color derived from the **worst** of the three
  `analysis` labels (all Optimal → green; if any bad, summarize + recolor).
- H1 room headline + sub. Right: mono **FEELS LIKE** (= temperature) + **COMFORT** score.
  Compute a real comfort score from the analysis (e.g. start 100, subtract per non-Optimal).

### 4d. `HistoryChart.jsx` (Recharts)
- Card with title "History / Last hour · 60 samples" + **Temp/Humidity/Light tabs**
  (segmented control, active tab colored by metric hue).
- Recharts `AreaChart`: gradient fill `stop` from hue→transparent, 2.4px line in hue, 3
  horizontal grid lines (`--line-soft`), last-point dot + a soft pulsing halo (the mockup
  uses an SMIL `<animate>`; in Recharts use an `<Customized>` dot or a CSS-animated overlay).
- Below: x-axis time labels `-60m … now`; a stat row `min / max / now` (mono, now in hue).
- Wire **`DateRangeSelector.jsx`** here as the live/1h/24h control if you want it back
  (the mockup folds range into the embed; your call — keep it consistent).

### 4e. `SummaryPanel.jsx`
- Card "Hour summary / Rolling averages". Four rows, each: a 7px tall hue bar + label +
  mono value. Use `summary.avgTemp / avgHumidity / avgLight / motionEvents`. Light bar = amber,
  temp = warm, humidity = cyan, motion = violet.
- Dashboard layout: chart + summary in a 2-col grid (`1.7fr 1fr`), collapses to 1 col < 860px.

### 4f. Motion timeline (new strip) + `MotionWidget.jsx`
- **Timeline strip** card: a flex row of ~48 vertical ticks built from `motionHistory`
  (detected = tall violet bar, else short line), labels `-60m … now`.
- `MotionWidget.jsx` (the existing floating real-time indicator): keep it, restyle to the
  violet pulsing ring used on the Movement card. Drive from `current.hasRecentMotion` /
  `motionDetected`.

### 4g. Embed snippet teaser (dashboard footer card)
- Gradient card "Embed this room on your site" + button → `/embed`. (Nice-to-have generator
  lives in the embed view, §5.)

### 4h. `ThemeToggle.jsx`
- Sun/Moon lucide icon, toggles `dark` class on `<html>` + persists to `localStorage`.
  Honor `theme=auto|light|dark` when present (embed).

---

## 5. `/embed` — `src/embed.jsx` + `EmbedWidget.jsx`

A **chrome-less, self-contained** widget. No header, no nav, no theme toggle UI.

- Read URL params: `widget`, `theme`, `range`, `bg` (see table below). Apply `theme` by
  setting `dark`/`light` on the root (`auto` → `prefers-color-scheme`). Apply `bg`:
  `transparent` → root background transparent + a subtle 1px border card; `solid` → `bg-bg1`.
- Reuse `useEnvironment()`. Must look crisp at **320×180**. Degrade gracefully offline
  (show last value + a muted "offline" dot — see §6).

| param | values | default |
|---|---|---|
| `widget` | `temperature` `humidity` `light` `motion` `summary` `all` | `temperature` |
| `theme` | `light` `dark` `auto` | `auto` |
| `range` | `live` `1h` `24h` | `1h` |
| `bg` | `transparent` `solid` | `transparent` |

- Widget variants (all in `EmbedWidget.jsx`, switch on `widget`):
  - **single** (`temperature|humidity|light`): hue dot + label + LIVE chip; big mono value +
    unit; quality chip; if `range!=='live'` show sparkline + range label ("realtime / last
    hour / last 24 hours").
  - **motion**: centered violet glowing dot + "Motion active / last … / N events".
  - **summary**: 2×2 mono grid of the four averages.
  - **all**: 2×2 mini cards (Temp, Humidity, Light, Motion).
- **Snippet generator** (in the dashboard's embed teaser, or a builder page): outputs
  ```html
  <iframe src="https://<host>/embed?widget=temperature&theme=auto&range=1h&bg=transparent"
          width="340" height="190" frameborder="0" style="border:0;border-radius:16px"
          title="Ambient Monitor"></iframe>
  ```
  with a copy button + live preview on a faux "host site" (checkerboard for transparent).
- **Deploy note (not code):** the host must allow framing — no `X-Frame-Options: DENY`; set
  CSP `frame-ancestors` to the allowed embedding origins (`*` if public).

### Sparkline path helper (shared, `src/lib/spark.js`)
```js
export function buildPath(vals, w, h, padTop=4, padBot=4){
  const min=Math.min(...vals), max=Math.max(...vals), span=(max-min)||1;
  const top=padTop, bot=h-padBot, n=vals.length;
  const pts=vals.map((v,i)=>[ n>1?(i/(n-1))*w:0, bot-((v-min)/span)*(bot-top) ]);
  const line='M'+pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' L');
  return { line, area:`${line} L${w},${h} L0,${h} Z`, last:pts[n-1], min, max };
}
```

---

## 6. States (loading / empty-offline / error) — REAL, from the hook

The mockup fakes these with a toggle; here derive them:

- **Loading**: hook hasn't delivered first snapshot → spinner card ("Connecting to sensor
  node… / subscribing to /ambient_data") + 4 shimmer skeleton cards (`animate-breathe`).
- **Empty / offline**: `current.timestamp` older than ~5 min (or all-zero first load) →
  centered "Sensor node is offline" card (muted WiFi-off icon) + "showing last known state" +
  "last seen · Nm ago". **Never render `0°C` as if real** — gate on a "has real data" check.
- **Error**: Firebase subscription error (surface a flag from the context if available, else a
  local error boundary) → warm-tinted "Couldn't reach the database" card + Retry button.

Each must exist in **dashboard** and the **embed** (compact variant) paths.

---

## 7. Responsive

- Hero grid (landing) `1.05fr .95fr` → 1 col < 860px. Hardware grid `1.25fr 1fr` → 1 col.
  Dashboard chart/summary `1.7fr 1fr` → 1 col. Embed builder `300px 1fr` → 1 col. Footer
  3-col → 2-col < 560px → matches mockup `@media` rules.
- Metric cards: `repeat(auto-fit, minmax(232px, 1fr))`.
- Hit targets ≥ 44px on mobile. Hero H1 uses `clamp()` (no overflow).

---

## 8. Landing page — `src/pages/Landing.jsx` (sections A–E, in order)

Copy is final in the mockup — reuse verbatim. Real values only; invent nothing.

- **A. Hero**: top bar (logo, theme toggle, GitHub link); badge "Live · ESP32 → Firebase →
  React"; H1 "A live window into a room's air, light & motion."; sub; CTAs **Open dashboard**
  (`/dashboard`) + **View on GitHub**; a **live temperature widget** on the right — embed the
  real `EmbedWidget` (or an `<iframe src="/embed?widget=temperature">`) so it shows live data.
- **B. What it does**: section header + 6 feature cards (hue chip + title + body):
  Real-time sensing · Environment quality · History & trends · Embeddable widgets · Dark &
  light · Open hardware. (Exact copy in mockup.)
- **C. Hardware** → build **`HardwareDiagram.jsx`** (SVG, on-brand node-and-edge, NOT a real
  EDA schematic) + connection table + **status-LED legend**. Real values:
  - DHT22 → GPIO **4** (data, 3.3V) · BH1750 → I²C **SDA 21 / SCL 22** (3.3V) · PIR → GPIO
    **13** (active-low, `!digitalRead`) · RGB LED → **R 25 / G 26 / B 27** · Power 3.3V/GND
    (PIR Vcc may need 5V). Board label **`upesy_wroom`**.
  - **LED legend** (7 chips, color + caption): green solid = System OK · blue blink =
    Connecting to WiFi · red blink = Sensor error · red/blue alternating = Firebase error ·
    green+blue = Motion detected · blue blink = PIR calibrating (30s) · white blink =
    Initializing.
  - Diagram is geometric only (rects, lines, bezier edges, text) — keep it that way.
- **D. Recreate in six steps**: accordion (one open at a time). Steps + bullets verbatim from
  mockup (BOM → Wire → Firmware/PlatformIO → Firebase → Dashboard → Embed). Repo names:
  `ambient_monitor_scripts` (firmware), `ambient-monitor-dashboard` (this app). Secrets:
  `include/secrets.example.h` → `include/secrets.h`. Data paths `/ambient_data/{ts}`,
  `/motion_events/{ts}`. Dashboard config `src/config/firebase.js`.
- **E. Footer**: two repo links, author **Kenneth · kcastilloh · GitHub Kennethch-02**,
  **teonix.dev**, tech badges (React 18, Vite 6, Tailwind 3.4, Recharts, Firebase RTDB,
  ESP32 · PlatformIO).

---

## 9. Build checklist (don't ship with any unticked)

- [ ] Confirm router + embed-entry approach with user, then `npm install react-router-dom`.
- [ ] `src/index.css` tokens + keyframes pasted; `tailwind.config.js` extended (§2).
- [ ] `darkMode:'class'`; `ThemeToggle` toggles `<html>` class + `localStorage`; default dark.
- [ ] `src/lib/quality.js`, `src/lib/spark.js` helpers added.
- [ ] Routing: `/` landing, `/dashboard` app, `/embed` (separate `embed.html` entry).
- [ ] `Layout` shell: backdrop, header, LIVE badge from `current.timestamp`. Demo state-toggle removed.
- [ ] `MetricCard` ×4 restyled (icon, mono value, quality chip, trend, sparkline, glow).
- [ ] Hero status banner added (headline, feels-like, comfort score from `analysis`).
- [ ] `HistoryChart` Recharts: tabs, gradient area, grid, last-point halo, min/max/now.
- [ ] `SummaryPanel` rows with hue bars from `summary`.
- [ ] Motion timeline strip from `motionHistory`; `MotionWidget` restyled.
- [ ] `EmbedWidget` + `embed.jsx`: all 6 widget variants, 4 URL params, 320×180-safe.
- [ ] Snippet generator (copy + live preview) in dashboard.
- [ ] Loading / offline / error states — derived from the hook, never fake `0`.
- [ ] Responsive collapses at 860/560px; H1 `clamp`; 44px hit targets.
- [ ] Landing sections A–E with `HardwareDiagram` + LED legend + 6-step accordion + footer.
- [ ] Values on cards/hero MATCH chart "now" + summary (no animation gating displayed truth).
- [ ] `useEnvironment()` / `EnvironmentContext` untouched. UI English. No console errors.
- [ ] (Deploy) framing allowed: no `X-Frame-Options: DENY`; CSP `frame-ancestors` set.

---

## 10. Reference

Open `Ambient Monitor.dc.html` in a browser for the pixel reference. The bottom pill switches
Landing / Dashboard / Embed; the dashboard's "Preview state" row shows the four data states;
the top-right toggle switches light/dark. Everything you need to match — spacing, copy, hues,
component anatomy — is in there.
