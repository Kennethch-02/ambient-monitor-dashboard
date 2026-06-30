# SESSIONS — append-only journal

## 2026-06-29 — Context load + Teonix protocol init
- Read global `~/.claude/CLAUDE.md`, local template `CLAUDE.md`, full dashboard repo, and the
  firmware repo (`ambient_monitor_scripts`). Mapped the end-to-end architecture (ESP32 → RTDB → React).
- Initialized `/.ai/` memory files (SUMMARY, STATE, GLOSSARY, DECISIONS, BUGS, SESSIONS).
- Filled the local `CLAUDE.md` (was the unfilled template).
- Registered the app in the global Portfolio Registry (§3).
- Findings: `DateRangeSelector` is orphaned; possible stale-`data` read in ambient `onValue`.
- Files touched: `.ai/*`, `CLAUDE.md`, `~/.claude/CLAUDE.md`.
- Follow-ups: decide wire-vs-remove DateRangeSelector; Firebase security rules; teonix.dev subdomain + host.

## 2026-06-29 — Firmware review + secrets refactor + embed spec + design brief
- **Reviewed firmware** (`../ambient_monitor_scripts/src/main.cpp`): functional end-to-end; flagged
  no WiFi reconnect, invalid `getTimeStamp()` fallback, `setInsecure()` TLS, unused PROJECT_ID,
  mislabeled NTP-error state. Logged to BUGS.md (not yet fixed — awaiting user go-ahead).
- **Secrets refactor** (scripts repo, public): created `include/secrets.h` (gitignored, empty),
  `include/secrets.example.h` (template), `.gitignore`; replaced inline `#define` block in
  `main.cpp` with `#include "secrets.h"`. Verified git history clean (no leaked keys).
- **Embed mode decided** (with user): live iframe widgets via URL params; spec-only for now.
- **Wrote Claude Design brief** `docs/CLAUDE_DESIGN_BRIEF.md` — full context + constraints + data
  shape + embed-mode requirement, ready to paste into Claude design mode.
- Files touched: scripts `include/secrets.h`, `include/secrets.example.h`, `.gitignore`, `src/main.cpp`;
  dashboard `docs/CLAUDE_DESIGN_BRIEF.md`, `.ai/{STATE,DECISIONS,BUGS,SESSIONS}.md`.
- Follow-ups: implement embed mode after design pass; apply firmware robustness fixes; security rules.

## 2026-06-29 — Firmware repo hardening (user filled secrets)
- User filled real values into `include/secrets.h` (gitignored) themselves.
- Pinned `lib_deps` to known-good build: DHT 1.4.7, Adafruit Unified Sensor 1.1.15, BH1750 1.3.0,
  **FirebaseClient 2.2.10** (installed version; app uses the v2.x API). ESP_SSLClient 3.1.3 is transitive.
- Added `database.rules.json` (public read, authenticated write) — **still must be published in the
  Firebase console by the user**.
- Wrote firmware `README.md` (BOM, pinout, LED legend, Firebase+secrets setup, build/flash, data schema).
- Committed to scripts repo `main` (commit `a345006`), **not pushed**. `secrets.h` & `.vscode/` excluded.
- Still pending: publish RTDB rules in console; firmware robustness fixes (WiFi reconnect, NTP fallback).

## 2026-06-29 — Firmware build green (FirebaseClient 2.x port)
- Ran `pio run` (PlatformIO at `~/.platformio/penv/Scripts/pio`). First build FAILED: code used the
  legacy 1.x FirebaseClient API vs pinned 2.2.10. See BUGS.md for root cause + fix.
- Ported main.cpp to 2.x (ENABLE_* macros + drop DefaultNetwork/getNetwork). **Build SUCCESS**
  (Flash 74.3%, RAM 15.1%, firmware.bin created). Committed `4d94193` to scripts `main` (not pushed).
- Verified 2.x API compatibility against installed examples (UserAuth.ino, RealtimeDatabase.ino) and
  RealtimeDatabase.h (set() await returns bool; loop() exists).
- **User flashed the firmware to the ESP32** — hardware now live.
- NEXT SESSION: user will provide the new frontend designed via Claude Design (from
  `docs/CLAUDE_DESIGN_BRIEF.md`) for us to implement (landing + dashboard + embed; keep `EnvironmentContext`/data layer).

## 2026-06-29 — Re-init dashboard repo + run
- User had deleted the dashboard git + node_modules to restart. Moved Firebase config to `.env`
  (VITE_*), removed anon auth from `firebase.js` (exports only `db`), added `.env.example`, deleted
  `firebase.template.js`, hardened `.gitignore` (ignores `.env`, keeps `.env.example`).
- `npm install` (437 pkgs) → `npm run build` GREEN (env wiring works) → `npm run dev` on :5173.
- `git init -b main` + initial commit `66f35f0`; verified `.env` ignored & not staged.
- Noticed `Redesign/` = the Claude Design front (HTML + screenshots) is now in the project, ready to implement.
