# Claude Design Brief — Ambient Monitor Dashboard

> **How to use:** paste everything below the line into Claude (design / frontend-design mode)
> as a single prompt. It is self-contained. Goal: redesign the **visual format & UI** of the
> dashboard, and add a **landing page** + **embeddable widgets**, without changing the data layer.
> The app becomes three views: `/` (landing), `/dashboard` (live app), `/embed` (iframe widgets).

---

## ROLE
You are a senior product designer + frontend engineer. Redesign the **visual format, layout
and polish** of an existing real-time IoT dashboard. Keep it production-grade and distinctive —
avoid the generic "bootstrap admin panel" look. The aesthetic should feel **calm, ambient and
environmental** (this app visualizes the air/light/motion of a physical room).

## WHAT THE APP IS
**Ambient Monitor** is the web dashboard half of a two-part IoT product. A physical ESP32 sensor
node measures **temperature, humidity, ambient light and motion** in a room and pushes readings to
**Firebase Realtime Database**. This React dashboard subscribes live and visualizes the current
state, environment-quality analysis, history, and motion. It's a single-room, single-user,
read-only public dashboard (no login, no per-user data).

## HARD CONSTRAINTS (do not break these)
- **Stack is fixed:** React 18.3 (functional components + hooks), Vite 6, **Tailwind CSS 3.4**
  (only Tailwind for styling — no other CSS frameworks), **Recharts 2.15** for charts,
  **lucide-react** for icons. Do **not** add heavy new dependencies without asking first.
- **Do NOT touch the data layer.** All data arrives via `src/context/EnvironmentContext.jsx`
  (`useEnvironment()` hook) which subscribes to Firebase. Do not change Firebase queries, the
  Spanish→English field mapping, or the data contract. You consume `useEnvironment()`; you don't
  rewrite it.
- **UI language: English.** Code/comments: English.
- **Theme:** keep dark + light support (there is a `ThemeToggle`). Use Tailwind's `dark:` variants.
- **Windows dev environment** — any shell commands must be PowerShell-compatible (no `mkdir -p`, `&&`).

## DATA YOU CAN RENDER (shape returned by `useEnvironment()`)
```js
{
  current: {
    temperature: number,   // °C
    humidity:    number,   // %
    light:       number,   // lux
    motionDetected: bool,  // last known PIR state
    hasRecentMotion: bool, // motion in last 5 min
    timestamp:   Date
  },
  historical: [ { timestamp:Date, temperature, humidity, light } ],   // last ~60 samples (~1h)
  motionHistory: [ { timestamp:Date, detected:bool } ],
  summary: { avgTemp, avgHumidity, avgLight, motionEvents },
  analysis: {
    tempQuality:     'Optimal' | 'Normal' | 'Too Hot'  | 'Too Cold',
    humidityQuality: 'Optimal' | 'Normal' | 'Too Dry'  | 'Too Humid',
    lightQuality:    'Optimal' | 'Normal' | 'Too Dark' | 'Too Bright'
  }
}
```
Sampling: ambient every 60s, motion on state-change. Timezone UTC-6 (Costa Rica).

## CURRENT COMPONENTS (to restyle / reorganize, in `src/components/`)
- `Layout.jsx` — page shell (header, theme toggle, container)
- `MetricCard.jsx` — single metric tile (used ×4: Temperature, Humidity, Light, Movement)
- `EnvironmentAnalysis.jsx` — quality labels per metric
- `HistoryChart.jsx` — Recharts line chart of historical readings
- `SummaryPanel.jsx` — averages + motion event count
- `MotionWidget.jsx` — floating real-time motion indicator
- `ThemeToggle.jsx` — dark/light switch
- `DateRangeSelector.jsx` — **currently orphaned/unused** (you may wire it into the design or drop it)

## DESIGN GOALS
1. **Distinctive ambient aesthetic** — a cohesive color system that *encodes* the quality state
   (e.g. optimal = calm green/teal, too hot = warm, too cold = cool blue, too dark = muted). Tie
   colors to the `analysis` labels so the room's state is readable at a glance.
2. **Clear hierarchy & "live" feel** — make it obvious data is real-time (subtle pulse / "live"
   badge / last-updated relative time). Hero the current state; history and summary secondary.
3. **Polished components** — refined `MetricCard`s (icon, value, unit, trend vs. previous,
   quality chip), a beautiful chart, a tasteful motion indicator.
4. **States** — design **loading**, **empty/no-data** (sensor offline), and **error** states.
   On first load all values are 0 / arrays empty — handle gracefully, don't show "0°C" as if real.
5. **Responsive** — great on mobile (single column) → tablet → desktop (multi-column grid).
6. **Accessible** — sufficient contrast in both themes, semantic structure, not color-only signals.
7. **Define a design system** in `tailwind.config.js` (color tokens, spacing, type scale, radius,
   shadows) so the look is consistent and easy to maintain.

## EMBED MODE (REQUIRED — new capability to design for)
The dashboard must support **live, embeddable widgets that other websites incrust via `<iframe>`**,
configured through the **URL**. Design a **chrome-less embed layout** (no app header/nav, no theme
toggle, transparent or configurable background) that renders a single self-contained widget reading
the same live Firebase data.

- **Route/entry:** `/embed` (e.g. `embed.html` Vite entry or a routed view — propose the cleanest
  approach; the app currently has **no router**, so call out what you'd add).
- **URL params to support:**
  - `widget=temperature | humidity | light | motion | summary | all`
  - `theme=light | dark | auto`
  - `range=live | 1h | 24h` (optional history sparkline)
  - `bg=transparent | solid` (so it blends into host sites)
- **Requirements:** must look great at small sizes (e.g. 320×180), be fully self-contained,
  reuse `useEnvironment()`, and degrade gracefully when offline. Keep the embed bundle lean.
- Nice-to-have: a small **"Embed" snippet generator** in the main dashboard that outputs a
  ready-to-paste `<iframe>` with the chosen params.
- Note for later (not your job, just design with it in mind): the host/deploy layer must allow
  framing (no `X-Frame-Options: DENY`; set CSP `frame-ancestors` appropriately).

## LANDING PAGE (REQUIRED — new public page)
Design a **landing / project page** as the public front door (route `/`, with the live app at
`/dashboard` and the iframe widgets at `/embed`). This means the app now has **three views**
(landing, dashboard, embed) — propose the routing approach (the app currently has **no router**;
call out what you'd add, e.g. `react-router-dom`, before adding it). The landing should tell the
whole story of the product — beautiful, scroll-driven, in the same ambient design language — with
these sections:

### A. Hero
- Product name **Ambient Monitor**, one-line pitch ("A live window into a room's air, light and
  motion"), a **live preview** (embed one of the real `/embed` widgets so the hero shows real data),
  and CTAs: **"Open dashboard"** → `/dashboard`, **"View on GitHub"**.

### B. App review / overview ("What it does")
A general review of the app: it's an IoT system where a physical **ESP32 sensor node** measures a
room and streams to **Firebase Realtime Database**; the React dashboard visualizes it live and can
be **embedded into other sites**. Highlight the features as cards/sections:
- Real-time **temperature, humidity, ambient light, and motion**.
- **Environment quality analysis** (Optimal / Too Hot / Too Dry / Too Dark…) tuned for a good
  place to work.
- **History chart**, **summary averages**, **motion timeline**, **dark/light theme**.
- **Embeddable live widgets** for other websites.

### C. Hardware schematic / wiring
Render a clear, **stylized wiring diagram** (an SVG/React component is great — it does NOT need to
be a real EDA schematic) plus a **connection table**, from these REAL values (ESP32 board:
`upesy_wroom`). Make the diagram on-brand, not a generic Fritzing screenshot.

| Component | Connects to ESP32 | Notes |
|-----------|-------------------|-------|
| **DHT22** (temp + humidity) | GPIO **4** (data) | 3.3V, data line |
| **BH1750** (ambient light) | I²C — SDA **GPIO 21**, SCL **GPIO 22** | 3.3V |
| **PIR** motion sensor | GPIO **13** | active-low in firmware (`!digitalRead`) |
| **RGB status LED** | R=**25**, G=**26**, B=**27** | onboard status indicator |
| Power | 3.3V / GND rails | PIR may need 5V Vcc; output is 3.3V-logic |

Also show the **status-LED legend** (great visual content):
green = OK · blue blink = connecting WiFi · red blink = sensor error · red/blue alternating =
Firebase error · green+blue = motion detected · blue blink = PIR calibrating (30s) · white blink =
initializing.

### D. How to recreate this project (step-by-step)
A clean, numbered guide (use tabs or an accordion). Real content:
1. **Bill of materials** — ESP32 dev board (`upesy_wroom` / generic WROOM-32), DHT22, BH1750
   (GY-302), PIR (e.g. HC-SR501), common RGB LED + 3×220Ω resistors, breadboard + jumper wires,
   USB cable. *(Flag the PIR/LED exact models as substitutable.)*
2. **Wire it** per the diagram above.
3. **Firmware (PlatformIO):** clone `ambient_monitor_scripts`, copy `include/secrets.example.h` →
   `include/secrets.h`, fill WiFi + Firebase creds; `lib_deps` already lists DHT, Adafruit Unified
   Sensor, BH1750, FirebaseClient; build & upload to the ESP32.
4. **Firebase:** create a project, enable **Realtime Database**, enable **Email/Password** auth
   (device account used by the firmware) and **Anonymous** auth (dashboard read-only); set DB rules.
   Data lands at `/ambient_data/{YYYYMMDDHHMMSS}` and `/motion_events/{YYYYMMDDHHMMSS}`.
5. **Dashboard:** clone `ambient-monitor-dashboard`, set the Firebase web config in
   `src/config/firebase.js`, `npm install`, `npm run dev` (or `npm run build`).
6. **Embed (optional):** drop an `<iframe src=".../embed?widget=temperature&theme=auto">` into any site.

### E. Footer
Two repos (firmware + dashboard), author **Kenneth (kcastilloh / GitHub Kennethch-02)**, part of
the **teonix.dev** portfolio, tech-stack badges.

> Keep the landing copy in **English**, concise and confident. Pull real numbers from this brief —
> don't invent specs.

## DELIVERABLES
- Updated component files (complete, ready-to-paste — not fragments) + any new ones.
- An updated `tailwind.config.js` with the design tokens.
- **Routing** for the three views (`/` landing, `/dashboard` app, `/embed` widgets) — propose the
  router and confirm before adding it.
- The **landing page** (sections A–E above), including the **hardware wiring diagram** component
  and the **status-LED legend**.
- The `/embed` layout + a minimal widget set honoring the URL params above.
- A short note of any new dependency or router you propose, and why, **before** adding it.

## TONE / QUALITY BAR
Calm, modern, "instrument panel for a living space" — think a beautiful weather/air-quality app,
not a finance terminal. Restrained motion, good whitespace, confident typography. Make it something
worth embedding on someone else's site.
