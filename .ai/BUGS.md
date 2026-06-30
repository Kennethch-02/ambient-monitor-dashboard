# BUGS — append-only log (symptom → root cause → fix)

> Read before debugging so the same bug isn't fixed twice.

- **2026-06-29 — Firmware build failed: legacy FirebaseClient API.**
  Symptom: `pio run` errors `'RealtimeDatabase' does not name a type`, `'UserAuth' was not declared`,
  `'DefaultNetwork'`/`getNetwork` not found. Root cause: `main.cpp` was written for FirebaseClient
  **1.x** but the installed/pinned version is **2.2.10** (the user's "lost/outdated code"). In 2.x,
  `DefaultNetwork`/`getNetwork()` were removed and modules are gated behind `ENABLE_*` macros.
  Fix: add `#define ENABLE_USER_AUTH` + `#define ENABLE_DATABASE` before `#include <FirebaseClient.h>`,
  and change `AsyncClientClass aClient(ssl_client, getNetwork(network))` → `aClient(ssl_client)`
  (drop `DefaultNetwork network;`). Everything else was already 2.x-compatible. Build SUCCESS
  (Flash 74.3%, RAM 15.1%). Commit `4d94193`.

## Watch-list (potential issues, not yet confirmed bugs)
- `EnvironmentContext` reads `data.summary.motionEvents` inside the ambient `onValue` closure
  (line ~105) via stale `data` from the outer scope rather than `prev` — possible stale-value
  read. Verify before relying on the ambient-side motion count.
- `DateRangeSelector.jsx` is orphaned (not imported) — dead code until wired or removed.

### Firmware (`../ambient_monitor_scripts/src/main.cpp`) — review 2026-06-29, NOT yet fixed
- **No WiFi/Firebase reconnect in `loop()`** — if WiFi drops post-`setup()`, device stays dead
  until physical reset. Needs periodic `WiFi.status()` check + retry.
- **`getTimeStamp()` invalid fallback** — on NTP failure returns `String(millis())`, which is not
  `YYYYMMDDHHMMSS`; creates malformed RTDB keys and breaks dashboard motion-timestamp parsing
  (`key.substring()` → NaN). Should skip the write instead.
- `ssl_client.setInsecure()` disables TLS cert validation (accepts any server). OK for hobby; pin CA ideally.
- `FIREBASE_PROJECT_ID` defined but never used. `initTime()` failure mislabels state as `FIREBASE_ERROR`.
