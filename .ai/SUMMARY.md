# SUMMARY — Ambient Monitor

High-level project summary + architecture snapshot. Keep short.

## What it is
IoT environmental monitoring system: a physical ESP32 sensor node publishes
temperature, humidity, light and motion to Firebase Realtime Database; a React
web dashboard reads that data live and visualizes it.

Two repos, one product:
- **Firmware** — `C:\Users\TeoPC\Desktop\ambient_monitor_scripts` (ESP32 / PlatformIO / C++)
- **Dashboard** — `C:\Users\TeoPC\Desktop\ambient-monitor-dashboard` (React / Vite) ← this repo

## Architecture
```
[ESP32 + DHT22 + BH1750 + PIR]
        │ writes (UserAuth device account)
        ▼
[Firebase Realtime DB  project: ambientmonitor-e059c]
   /ambient_data/{YYYYMMDDHHMMSS}  { temperatura, humedad, luz, timestamp }
   /motion_events/{YYYYMMDDHHMMSS} { detectado }
        │ reads (anonymous auth, read-only)
        ▼
[React dashboard]  EnvironmentContext (onValue, limitToLast 60)
   → MetricCard ×4, EnvironmentAnalysis, HistoryChart, SummaryPanel, MotionWidget
```

## Stack snapshot
- Dashboard: React 18.3 · Vite 6 · Tailwind 3.4 · Firebase 11 (RTDB + Auth) · Recharts · lucide-react
- Firmware: PlatformIO · espressif32 · board `upesy_wroom` · Arduino · libs: DHT, Adafruit Unified Sensor, BH1750 (claws), FirebaseClient (mobizt)

## Status
MVP working end-to-end (sensor → DB → live dashboard). Pre-portfolio: not yet
deployed under teonix.dev. See STATE.md for current work.
