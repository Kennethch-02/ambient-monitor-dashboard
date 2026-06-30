# Ambient Monitor — Dashboard

A live web dashboard for a room's **temperature, humidity, ambient light and motion**. A physical
**ESP32** sensor node streams readings to **Firebase Realtime Database**, and this React app
visualizes them in real time — with a public landing page and **embeddable live widgets**.

**Live demo:** https://ambient.teonix.dev

This is the **consumer** half of a two-repo product:

- **Dashboard** (this repo) — React + Vite · the live UI
- **Firmware** — [`ambient_monitor_scripts`](https://github.com/Kennethch-02/ambient_monitor_scripts) · ESP32 / PlatformIO

---

## Features

- **Real-time readings** — temperature, humidity, ambient light and motion, live from Firebase.
- **Environment quality** — automatic `Optimal / Too Hot / Too Dry / Too Dark…` analysis with a comfort score.
- **History & trends** — a rolling one-hour chart, summary averages and a motion timeline.
- **Embeddable widgets** — drop a live widget into any site with one `<iframe>`; configurable by URL.
- **Dark & light** — a calm, ambient theme in both modes (dark by default).
- **Resilient states** — real loading / offline / error states derived from the data, never fake zeros.

## Tech stack

React 18 · Vite 6 · Tailwind CSS 3.4 · React Router · Firebase Realtime Database (+ Auth) · Recharts · lucide-react.
Fonts: Space Grotesk + JetBrains Mono.

## Architecture

```
[ESP32 + DHT22 + BH1750 + PIR]
        │ writes (device account)
        ▼
[Firebase Realtime Database]
   /ambient_data/{YYYYMMDDHHMMSS}  { temperatura, humedad, luz, timestamp }
   /motion_events/{YYYYMMDDHHMMSS} { detectado }
        │ reads (dedicated read-only account)
        ▼
[This React app]  EnvironmentContext → live views
```

## Views (routes)

| Route        | What                                                            |
|--------------|----------------------------------------------------------------|
| `/`          | Landing page (the public front door / domain root)             |
| `/dashboard` | The live dashboard                                             |
| `/embed`     | Embed builder — configure a widget and copy its `<iframe>`      |
| `/embed.html`| The lean, chrome-less widget that gets embedded (separate entry)|

## Getting started

```bash
git clone https://github.com/Kennethch-02/ambient-monitor-dashboard.git
cd ambient-monitor-dashboard
npm install
cp .env.example .env   # then fill it in (PowerShell: Copy-Item .env.example .env)
npm run dev            # http://localhost:5173
```

### Environment (`.env`)

The Firebase **web config is not secret** (it ships in the client bundle); it lives in `.env` only
to keep the repo project-agnostic. Real security is enforced by the Realtime Database **rules**.

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DB_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
# Dedicated read-only account the dashboard signs in with:
VITE_FIREBASE_AUTH_EMAIL=
VITE_FIREBASE_AUTH_PASSWORD=
```

## Build

```bash
npm run build     # outputs dist/ (index.html + embed.html entries)
npm run preview   # serve the production build locally
```

## Embedding

```html
<iframe
  src="https://ambient.teonix.dev/embed.html?widget=temperature&theme=auto&range=1h&bg=transparent"
  width="340" height="190" frameborder="0"
  style="border:0;border-radius:16px" title="Ambient Monitor"></iframe>
```

URL params: `widget` (`temperature|humidity|light|motion|summary|all`), `theme` (`light|dark|auto`),
`range` (`live|1h|24h`), `bg` (`transparent|solid`).

## Deploy

A static SPA with a second entry for the embed widget. Config is included for both hosts:

- **Vercel** — `vercel.json` (SPA rewrite + `frame-ancestors *` on `/embed.html`).
- **Cloudflare Pages / Netlify** — `public/_redirects` + `public/_headers`.

The embed must be framable (no `X-Frame-Options: DENY`; set CSP `frame-ancestors`). The lean widget
is served at `/embed.html`; real static files are served before the SPA fallback.

## Project structure

```
src/
  pages/        Landing, Dashboard, EmbedBuilder
  components/   Layout, MetricCard, HeroStatus, HistoryChart, SummaryPanel,
                MotionTimeline, MotionWidget, ThemeToggle, EmbedTeaser,
                HardwareDiagram, EmbedWidget
  context/      EnvironmentContext (the Firebase subscription + data shape)
  config/       firebase.js
  lib/          spark, quality, format, theme, seo
  main.jsx      SPA entry (BrowserRouter)
  embed.jsx     lean widget entry (embed.html)
```

## Author

Kenneth · [kcastilloh](https://github.com/Kennethch-02) · part of the **[teonix.dev](https://teonix.dev)** portfolio.
