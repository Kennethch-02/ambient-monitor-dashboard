# STATE — where are we

_Updated: 2026-06-29_

## Product
IoT ambient monitor: ESP32 sensor node → Firebase RTDB → React dashboard. **Domain confirmed:
`ambient.teonix.dev`** (landing at the root). Two repos (both GitHub `Kennethch-02`, pushed):
- Firmware `ambient_monitor_scripts` — HEAD `bbc2460`
- Dashboard `ambient-monitor-dashboard` — HEAD `aee3d7a`

## Done
- **Firmware** (flashed & running on the ESP32 via COM7): DHT22 (temp/hum), BH1750 (light), PIR (motion),
  **battery on GPIO35**; RGB status LED; NTP UTC-6. Pushes `/ambient_data` every 60s (now incl.
  `bateria_v`/`bateria_pct`) + motion state-changes. FirebaseClient 2.x, secrets in gitignored `secrets.h`,
  hardened `database.rules.json`, README with pinout.
- **Dashboard**: full Claude Design redesign — 3 views via react-router-dom: `/` landing, `/dashboard`,
  `/embed` (builder); lean iframe widget = separate entry `embed.html`. OKLCH design system, Space Grotesk +
  JetBrains Mono. `EnvironmentContext`/data layer intact; auth = email/password read account from `.env`.
- **SEO / static**: landing is **prerendered SSG** — `npm run build` = client build + SSR build
  (`src/entry-server.jsx`) + `prerender.js` → static HTML for `/`, `/dashboard`, `/embed` (root populated),
  hydrated on the client. Full meta/OG/Twitter/JSON-LD/canonical/robots/sitemap/favicon; per-route `<title>`.
- **Battery (front)**: `BatteryIndicator` chip in the dashboard header — hidden until a real battery is wired.
- Deploy config present: `vercel.json` + `public/_redirects`/`_headers` (SPA fallback + embed framing).

## Blocked on user / hardware
- **Battery wiring**: GPIO35 reads ~0.28 V (floating). Wire battery+ → 2:1 divider → GPIO35 (or give the
  module's sense pin → change `BATTERY_ADC_PIN`), then reflash. % is meaningless until wired.
- **`VITE_FIREBASE_AUTH_PASSWORD`** blank in `.env` → no live data yet (dashboard shows loading/offline).
- **Firebase console**: replace `REPLACE_WITH_DEVICE_UID` in `database.rules.json` with the real device UID,
  publish the rules, restrict the API key (HTTP referrers), set a budget alert; App Check optional.

## Next / backlog
- Deploy to **ambient.teonix.dev** (host TBD — Vercel or Cloudflare Pages; both configs provided).
- `og.png` 1200×630 (the SVG OG works for Google, not for social scrapers).
- Decide if `Redesign/` + `.ai/` (internal notes) belong in the public repo.
- Optional: remove unused `recharts`; code-split the 499 KB firebase chunk; firmware robustness
  (WiFi/Firebase reconnect, drop writes on invalid NTP timestamp — see BUGS.md).
