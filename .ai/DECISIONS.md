# DECISIONS — append-only log (with WHY)

> Never silently reverse a logged decision.

- **2026-06-29** — Firmware↔dashboard contract uses **Spanish RTDB keys**
  (`temperatura/humedad/luz/detectado`); dashboard maps to English internally.
  WHY: firmware was written first in Spanish; mapping kept in one place (`EnvironmentContext`)
  rather than renaming the data contract.
- **2026-06-29** — Dashboard uses **anonymous Firebase auth** for read-only access.
  WHY: public read-only dashboard with no per-user accounts needed.
- **2026-06-29** — Live query uses **`limitToLast(60)`** (last ~60 samples ≈ 1h of ambient data).
  WHY: lightweight real-time view; full historical/date-range querying not yet wired.
- **2026-06-29** — Motion writes only on **state change**, not every sample.
  WHY: avoid flooding RTDB; reconstruct intervals from edges.
- **2026-06-29** — Initialized Teonix `/.ai/` memory protocol + filled local `CLAUDE.md`
  + registered app in global Portfolio Registry. WHY: project had only the unfilled template.
- **2026-06-29** — Firmware secrets extracted to `include/secrets.h` (gitignored) with a
  committed `include/secrets.example.h` template; `main.cpp` now `#include "secrets.h"`.
  WHY: scripts repo is **public**; keep real WiFi/Firebase creds out of git. History was clean
  (single commit, defines always empty) — no key rotation needed.
- **2026-06-29** — Embed strategy decided: **live iframe widgets configured via URL**
  (`/embed?widget=&theme=&range=&bg=`), chrome-less layout, reusing `useEnvironment()`.
  Scope: **spec-only for now** (designed in the Claude Design brief, not yet implemented).
  WHY: user wants other websites to incrust live previews; implementation deferred to the
  design pass. NOT chosen: OG social cards / oEmbed (can revisit later).
- **2026-06-29** — Security model for going public: **public read, no anonymous auth, write
  restricted to the device UID.** Firebase web config (apiKey etc.) is intentionally public — it is
  NOT a secret; the real boundary is RTDB rules + (optional) App Check + API-key restrictions.
  `database.rules.json` hardened: `.read: true`, `.write: auth.uid === '<DEVICE_UID>'` + `.validate`
  on field shape. Plan: disable the Anonymous provider in console and drop `signInAnonymously()` from
  the dashboard (reads need no auth). WHY: anon auth + `auth != null` write let anyone overwrite the
  DB once the config is public. NOT chosen (for now): keep-anon+AppCheck, public-read+AppCheck.
- **2026-06-29** — Firebase web config moved to **`.env` (`VITE_FIREBASE_*`)**; `firebase.js` stays
  committed and reads `import.meta.env`. `.env` gitignored, `.env.example` committed. Removed
  `signInAnonymously`/`getAuth` from `firebase.js` (nothing imports `auth`; reads are public) — now
  exports only `db`. Deleted `firebase.template.js`. WHY: chosen over the template-file pattern —
  firebase.js can't leak (not ignored), it's the Vite standard, and config leaves the bundle anyway.
  REMINDER: env vars do NOT make the config secret (still in the built bundle); security = RTDB rules.
