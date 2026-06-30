# STATE — where are we

_Updated: 2026-06-29_

## Done
- ESP32 firmware reads DHT22 (temp/humidity), BH1750 (light), PIR (motion); RGB status LED; NTP UTC-6.
- Firmware pushes ambient data every 60s and motion state-changes (1s sampling) to Firebase RTDB.
- Dashboard: live subscription via `EnvironmentContext` (limitToLast 60), metric cards,
  environment quality analysis, history chart, summary panel, floating motion widget, dark/light theme.
- Firebase anonymous auth for read-only dashboard access.

- Firmware secrets now extracted to `include/secrets.h` (gitignored) + `secrets.example.h` template
  + `.gitignore`. `main.cpp` uses `#include "secrets.h"`. Git history verified clean (no leaked keys).
- Firmware repo hardened: secrets filled by user; `lib_deps` pinned (FirebaseClient 2.2.10 etc);
  `database.rules.json` added; firmware `README.md` written; committed to scripts `main` (`a345006`, not pushed).
- Claude Design brief written: `docs/CLAUDE_DESIGN_BRIEF.md` (UI redesign + embed-mode + **landing page**).
  App will become 3 views: `/` landing, `/dashboard` app, `/embed` widgets (needs a router — spec'd, not added).
  Landing covers: hero w/ live widget, app review, **hardware wiring diagram + pinout + LED legend**, recreate guide, footer.

- **Firmware flashed & running on the ESP32** (build green, FirebaseClient 2.x). Hardware live.

## In progress
- **UI redesign** — brief handed to Claude Design (`docs/CLAUDE_DESIGN_BRIEF.md`). **User will deliver
  the new designed frontend for us to implement** (landing + dashboard + embed). Awaiting that handoff.

## ⚠️ Dashboard repo git was DELETED (user restarted from scratch) — needs `git init` again.
- When re-initializing: `.gitignore` already ignores `.env` (real config) + keeps `.env.example`. Verify
  `.env` is NOT staged before the first commit.

## Security — before making the dashboard repo public (in progress)
- DONE: `database.rules.json` hardened (public read, write only `auth.uid === '<DEVICE_UID>'`, field validation).
- DONE: Firebase config moved to `.env` (`VITE_FIREBASE_*`); `firebase.js` reads `import.meta.env`,
  exports only `db`; anon auth removed from code; `.env.example` added; `firebase.template.js` deleted.
  Not build-verified yet (no node_modules — run `npm install && npm run build`).
- TODO (Firebase console, user): replace `REPLACE_WITH_DEVICE_UID` with the device account's real UID
  (Auth → Users), **publish** the rules, **disable the Anonymous provider**, restrict the API key
  (HTTP referrers), set a budget alert; App Check optional.
- TODO (code, when ready): remove `signInAnonymously()` from `src/config/firebase.js` (reads are public now).
- Note: Firebase web config in `firebase.js` is public-by-design, safe in a public repo. Git history clean.

## Next / backlog
- **Implement embed mode** — live iframe widgets via URL (`/embed?widget=&theme=&range=&bg=`).
  Currently SPEC-ONLY (in the design brief); app has no router yet. See DECISIONS 2026-06-29.
- **Firmware robustness fixes (reviewed, not applied):** WiFi/Firebase reconnect in `loop()`;
  drop writes when timestamp is invalid (see BUGS.md). User to confirm before editing firmware logic.
- **DateRangeSelector is orphaned** — wire it (history by date range) or remove it.
- Decide & document Firebase RTDB security rules (currently relying on anonymous read).
- Deploy layer must allow iframe framing (no `X-Frame-Options: DENY`; set CSP `frame-ancestors`).
- Assign teonix.dev subdomain + deploy target (TBD).

## Open questions
- Where to host the dashboard (Vercel? Cloudflare Pages?) and which teonix.dev subdomain.
