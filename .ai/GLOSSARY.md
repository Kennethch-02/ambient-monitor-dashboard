# GLOSSARY — project vocabulary

## Domain terms
- **Ambient data** — temperature, humidity, light reading sampled every 60s.
- **Motion event** — a PIR state *change* (started / ended), sampled every 1s; only changes are written.
- **Calibration** — 30s PIR warm-up at boot before motion is trusted.
- **Quality / analysis** — derived labels per metric: `Optimal`, `Normal`, `Too Hot/Cold`,
  `Too Dry/Humid`, `Too Dark/Bright`. Thresholds tuned for a "good place to work" (e.g. temp 20-25°C optimal).
- **Recent motion** — any motion=true in the last 5 minutes (drives the Movement metric card).

## Field name mapping (Firebase ⇄ dashboard)
Firmware writes Spanish keys; the dashboard maps them to English in `EnvironmentContext`:
| Firebase (RTDB) | Dashboard |
|-----------------|-----------|
| `temperatura`   | `temperature` |
| `humedad`       | `humidity` |
| `luz`           | `light` |
| `detectado`     | `detected` |
| `timestamp`     | `timestamp` (string `YYYY-MM-DD HH:MM:SS`) |

RTDB **keys** are `YYYYMMDDHHMMSS` (used for ordering via `orderByKey` and to derive motion timestamps).

## Key paths
- Firebase init: `src/config/firebase.js` (project `ambientmonitor-e059c`)
- Live data: `src/context/EnvironmentContext.jsx`
- UI root: `src/App.jsx` → `src/components/*`
- Firmware: `../ambient_monitor_scripts/src/main.cpp`

## Conventions
- Code/comments: English. Some firmware logs + comments are Spanish.
- Windows shell: cmd/PowerShell only (no bash-isms).
- Timezone: UTC-6 (Costa Rica), no DST.
