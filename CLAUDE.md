# CLAUDE.md — Ambient Monitor Dashboard (live IoT environmental monitoring web app)

> Session context protocol for Claude Code. Read this fully before any task.
> Author/owner: **kcastilloh** (Kenneth) · GitHub: `Kennethch-02`

---

## 0. Teonix portfolio (global memory)

This app is part of **Kenneth's Teonix app portfolio** (brand/domain **teonix.dev**). The
cross-project source of truth is the **global user memory at `~/.claude/CLAUDE.md`**
(`C:\Users\TeoPC\.claude\CLAUDE.md`), which Claude Code loads in every project.

- **Read that global file** for brand/portfolio context and shared infra.
- **Register this app** in the global Portfolio Registry and **keep its row up to date** whenever
  location/URL/subdomain/stack/deploy target/status changes — in the same session.
- This app will be published under **teonix.dev** (subdomain: **TBD**; currently dev-only / not deployed).
- **Email:** `teonix.dev` is connected in **Resend**, but there is **no async email-sending
  infrastructure yet**. This app does not send email today; if it ever needs to, that async sender
  must be built first.

---

## Claude Code Session Persistence (token-saving memory)

> **Project-agnostic operating rule — read first.**

To avoid re-reading the whole codebase and repeating mistakes, Claude Code maintains a small set of living context files under `/.ai/`. **At the start of every session, read these first. At the end of every session, update them.** This is mandatory and is the primary token-saving mechanism for development.

### Files under `/.ai/`

```
/.ai/SUMMARY.md       // High-level project summary + current architecture snapshot.
/.ai/STATE.md         // CURRENT state: built / in progress / next. The "where are we" file.
/.ai/GLOSSARY.md      // Project vocabulary: domain terms, naming conventions, key file paths.
/.ai/DECISIONS.md     // Append-only log of decisions + WHY. Never silently reverse one.
/.ai/BUGS.md          // Append-only log of bugs + root cause + fix. Read before debugging.
/.ai/SESSIONS.md      // Append-only short journal: date, what was done, files touched, follow-ups.
```

### Session protocol
**On start:** read SUMMARY, STATE, GLOSSARY; skim DECISIONS + BUGS. Don't re-scan the repo if these answer it.
**During:** bug → BUGS.md; architectural/product choice → DECISIONS.md; new term → GLOSSARY.md.
**On end:** update STATE.md; append to SESSIONS.md; update SUMMARY.md only if architecture changed.

### Rules
- Keep these files concise. DECISIONS/BUGS are append-only. Create a missing file on first use.
  On Windows create the folder with `New-Item -ItemType Directory .ai -Force` (PowerShell) — no `mkdir -p`.

---

## 1. Project Overview

**Ambient Monitor** is an IoT environmental monitoring system. A physical **ESP32 sensor node**
measures temperature, humidity, ambient light and motion, and publishes them to **Firebase Realtime
Database**. This repo is the **React web dashboard** that subscribes to that data in real time and
visualizes it (current metrics, environment-quality analysis, history chart, motion widget).

It is one half of a two-repo product:
- **Firmware:** `C:\Users\TeoPC\Desktop\ambient_monitor_scripts` (ESP32 / PlatformIO / C++) — the data *producer*.
- **Dashboard:** this repo — the data *consumer*.

Status: **MVP working end-to-end** (sensor → DB → live dashboard). Not yet deployed under teonix.dev.

---

## 2. Tech Stack (mandatory)

### Dashboard (this repo)
| Layer | Tech | Version | Notes |
|-------|------|---------|-------|
| Frontend | React | 18.3 | functional components + hooks |
| Build | Vite | 6 | plugin `@vitejs/plugin-react-swc` |
| Styling | Tailwind CSS | 3.4 | dark/light theme via `ThemeToggle` |
| Data/Realtime | Firebase Realtime Database | 11 | `onValue` subscriptions |
| Auth | Firebase Auth | 11 | **anonymous**, read-only |
| Charts | Recharts | 2.15 | history chart |
| Icons | lucide-react | 0.468 | |
| Lang | — | — | Code/comments **English**; UI copy **English** (some Spanish in firmware). |

### Firmware (sibling repo `ambient_monitor_scripts`)
- PlatformIO · platform `espressif32` · board `upesy_wroom` · Arduino framework · C++
- Libs: `adafruit/DHT sensor library`, `adafruit/Adafruit Unified Sensor`, `claws/BH1750`, `mobizt/FirebaseClient`
- Pins: DHT22 → 4 · RGB LED → 25/26/27 · PIR → 13 · I²C (BH1750) → SDA 21 / SCL 22
- Timing: ambient every 60s · motion sampled every 1s (writes on change only) · PIR calibration 30s · NTP UTC-6

### 2.x Environment & structure (Windows)
- Developer hosts on **Windows 11** → all shell commands **cmd/PowerShell-compatible** (no `mkdir -p`, `&&`, `rm -rf`, `touch`).
- Dashboard structure: `src/{config,context,components}`, plus `/.ai/` memory.

---

## 3. Core Domain Model

Firebase Realtime Database, project **`ambientmonitor-e059c`**:

```
/ambient_data/{YYYYMMDDHHMMSS}   → { temperatura, humedad, luz, timestamp:"YYYY-MM-DD HH:MM:SS" }
/motion_events/{YYYYMMDDHHMMSS}  → { detectado: bool }
```

- **Keys are `YYYYMMDDHHMMSS`** → ordering via `orderByKey()`; motion timestamps derived from the key.
- **Field-name contract is Spanish** (`temperatura/humedad/luz/detectado`); the dashboard maps to
  English (`temperature/humidity/light/detected`) in `src/context/EnvironmentContext.jsx` — the single
  mapping point. Do not change the on-wire contract without updating the firmware too.
- **Access model:** firmware writes with a device `UserAuth` account; dashboard reads with anonymous
  auth (read-only). Firebase security rules are **not yet documented in-repo** (backlog).

---

## 4. Data flow & key files

- `src/config/firebase.js` — Firebase init + `signInAnonymously`.
- `src/context/EnvironmentContext.jsx` — the heart: subscribes to `ambient_data` & `motion_events`
  (`limitToLast(60)`), maps fields, computes averages, environment quality, and 5-min recent-motion.
- `src/App.jsx` — Dashboard layout: MetricCard ×4 (temp/humidity/light/movement), EnvironmentAnalysis,
  HistoryChart, SummaryPanel, MotionWidget.
- `src/components/DateRangeSelector.jsx` — **orphaned** (not imported); a date-range filter UI that is
  not wired to the context. Decide: wire it (query by date range) or remove it.

---

## 5. Conventions
- **Author username everywhere:** `kcastilloh` (GitHub `Kennethch-02`).
- Code, comments, commit messages, docs: **English**.
- **Windows shell only: cmd/PowerShell-compatible commands, no bash-isms.**
- Components: functional + hooks. Keep the Firebase↔English field mapping centralized in `EnvironmentContext`.
- Firmware secrets live in blank `#define ""` placeholders — filled locally, **never commit real creds**.

---

## 6. Notes for Claude
- When generating code, deliver **complete, ready-to-deploy files**, not fragments.
- Any Firebase security-rule change: deliver as a clearly labeled file for review/deploy — never silent auto-execution.
- Ask before introducing dependencies outside the stack above.
- Keep `/.ai/` files updated each session (this is the token-saving memory).
