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

## Redesign IMPLEMENTED & building (commit 9f797c8)
- Auth: email/password read account (`firebase.js` signInWithEmailAndPassword via `VITE_FIREBASE_AUTH_*`).
  User committed it ("Auth Email"). **Password still blank in .env** → live data won't load until filled;
  dashboard correctly shows loading→offline states meanwhile.
- 3 views via react-router-dom: `/` Landing (domain root), `/dashboard`, `/embed` (builder).
  Lean iframe widget = separate Vite entry `embed.html` → `src/embed.jsx`. Snippet points to `/embed.html`.
- Design system: `src/index.css` (OKLCH tokens, dark default + `.light`), Space Grotesk + JetBrains Mono;
  helpers `src/lib/{spark,quality,format,theme}.js`. Components: Layout, MetricCard, HeroStatus, HistoryChart,
  SummaryPanel, MotionTimeline, MotionWidget, ThemeToggle, EmbedTeaser, HardwareDiagram, EmbedWidget; pages
  Landing/Dashboard/EmbedBuilder. Old orphans (EnvironmentAnalysis, DateRangeSelector) deleted.
- Deploy: `vercel.json` (SPA rewrite + `/embed.html` frame-ancestors *) and `public/_redirects`/`_headers`
  (Cloudflare Pages/Netlify). **Host not confirmed** — both provided.
- VERIFIED: `npm run build` GREEN (both entries); lint shows only style issues (prop-types / unused React
  import) — no undefined refs; dev server serves /, /dashboard, /embed, /embed.html (all 200). No browser
  tool available → no screenshots; visual review is the user's.
- Build chunk: main 92KB + shared 499KB (firebase+recharts) — consider code-splitting later. recharts is
  installed but the chart was done as inline SVG (matches mockup); recharts now unused (could remove).

## Dashboard repo re-initialized (fresh git)
- `git init -b main` done; initial commit `66f35f0`. `.env` verified ignored & NOT committed.
- `npm install` (437 pkgs; 19 npm-audit vulns, not auto-fixed). `npm run build` GREEN. `npm run dev` on :5173.
- **Design delivered:** `Redesign/` folder has the Claude Design output (HTML + screenshots: landing w/
  hardware + steps, dashboard, embed). NEXT: implement it into React (keep `EnvironmentContext`/data layer).
- Pre-public TODO: decide if `Redesign/` and `.ai/` (internal notes) belong in the public repo.

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
