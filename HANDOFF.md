# TriageGuard — Frontend Handoff

Everything your teammate needs to clone, run, understand, and extend the UI.

---

## 1. Source Code Location

```
C:\Users\Joaquin\Documents\Qoder\2026-10-07\9387303b\
```

**Git commit:** `8e9e849` on branch `master`  
**No remote repo yet** — zip the folder (excluding `node_modules/` and `dist/`) or push to GitHub.

---

## 2. Installation & Start

```bash
# Requires Node.js >= 22.12.0 (we patched check-node.mjs to also accept 23+/24+)
# The bundled Qoder Node is v24.21.0 and works fine.

npm install          # install dependencies (uses package-lock.json)
npm run dev          # start dev server → http://127.0.0.1:5173
npm run build        # production build → ./dist/
npm run preview      # preview production build locally
```

**Note:** The `engines` field in package.json says `<23` but `scripts/check-node.mjs` has been patched to accept Node 23+. If someone gets a version error, just run with `--ignore-scripts` or edit `check-node.mjs`.

---

## 3. Required Node.js Version

**Minimum:** 22.12.0  
**Tested on:** 24.21.0 (Qoder bundled)  
**npm:** 11.19.0

---

## 4. Key Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts, engine constraints |
| `package-lock.json` | Exact dependency versions (committed) |
| `vite.config.ts` | Alias `@/` → project root, dev proxy to backend |
| `tsconfig.json` | TypeScript config, path aliases |
| `.env.example` | Shows the one env var (`VITE_API_URL`) |
| `.gitignore` | Excludes `node_modules/`, `dist/`, `.env`, `*.qoder.site` |
| `index.html` | Entry point — loads Inter font from Google Fonts |

---

## 5. .env.example

```
VITE_API_URL=http://127.0.0.1:8000
```

The frontend currently uses a **built-in demo triage engine** (`lib/triage-engine.ts`) that does keyword matching — no real API calls. When Seth's Qwen backend is ready, the proxy in `vite.config.ts` forwards `/functions/v1/app` to `VITE_API_URL`. In production on Qoder Sites, the Function endpoint handles this.

---

## 6. Pages / Routes

Hash-based routing (SPA, single `index.html`). The store reads `window.location.hash` on load and syncs on navigation.

| Hash | Page | Component |
|------|------|-----------|
| (none) | Dashboard | `src/pages/Dashboard.tsx` |
| `#submit` | Report New Incident | `src/pages/Submit.tsx` |
| `#review/INC-2026-002` | Review Incident (by ID) | `src/pages/Review.tsx` |
| `#audit` | System Audit Log | `src/pages/AuditLog.tsx` |

**Direct links work.** You can send someone `https://triageguard-ai-6npvo6evsn1.qoder.website/#review/INC-2026-002` and they'll land on the critical incident review.

---

## 7. Brand Assets

### Logo
No separate logo file. The logo is rendered inline in `components/Layout.tsx` as:
- `ShieldCheck` icon from lucide-react (teal/emerald color)
- "TriageGuard" text in white, bold

### Font
**Inter** — loaded from Google Fonts in `index.html`  
Weights: 400, 500, 600, 700  
Fallback: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

### Colors (from `src/globals.css`)

**Light mode:**
| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#f8fafc` | Page background |
| `--foreground` | `#0f172a` | Primary text |
| `--primary` | `#1e40af` | Buttons, links |
| `--card` | `#ffffff` | Card surfaces |
| `--muted` | `#f1f5f9` | Secondary surfaces |
| `--muted-foreground` | `#64748b` | Secondary text |
| `--destructive` | `#dc2626` | Error states |
| `--border` | `#e2e8f0` | Borders |
| `--ring` | `#3b82f6` | Focus rings |
| `--sidebar` | `#0f172a` | Sidebar bg (dark always) |

**Dark mode:**
| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#0f172a` | Page background |
| `--foreground` | `#e2e8f0` | Primary text |
| `--primary` | `#3b82f6` | Buttons, links |
| `--card` | `#1e293b` | Card surfaces |
| `--muted` | `#334155` | Secondary surfaces |
| `--muted-foreground` | `#94a3b8` | Secondary text |
| `--destructive` | `#ef4444` | Error states |

**Severity badge colors** (from `Dashboard.tsx` and `Review.tsx`):
| Severity | Color | Hex |
|----------|-------|-----|
| Critical | Red | `bg-red-600` |
| High | Orange | `bg-orange-500` |
| Medium | Yellow | `bg-yellow-400` (black text) |
| Low | Blue | `bg-blue-500` |

### Icons
**lucide-react** — used throughout. Key icons:
- `ShieldCheck` (brand logo)
- `LayoutDashboard`, `FileWarning`, `ClipboardList` (nav)
- `Sun`, `Moon`, `Monitor` (theme toggle)
- `Upload`, `X`, `FileVideo`, `ImageIcon` (file attachments)

---

## 8. Desktop & Mobile Status

**Desktop (≥768px):** Fully working. Fixed 256px dark sidebar, table-based incident list, full review tabs, sticky action bar.

**Mobile (<768px):** Fully working. Top header bar with hamburger + theme toggle, bottom tab navigation (Dashboard / Report / Audit Log), card-based incident list instead of table, stacked action buttons.

**Breakpoint:** `md:` (768px) — Tailwind default.

---

## 9. Known Issues / Unfinished Features

1. **No real AI backend yet** — `lib/triage-engine.ts` uses keyword matching with a 1.5s fake delay. Needs to be wired to Seth's Qwen endpoint at `/functions/v1/app`.

2. **No persistent storage** — all data is in-memory React state. Page refresh resets to the 3 sample incidents. Production would need a database.

3. **File attachments are base64 data URLs** — they work for the demo but are stored in memory and lost on refresh. Production would upload to cloud storage.

4. **No real authentication** — "Demo User" / "Current User" are hardcoded. The Qoder Sites auth integration is available but not wired up.

5. **Sidebar doesn't collapse on desktop** — it's always 256px. No toggle to minimize it.

6. **Audit log table isn't paginated** — fine for 6 demo entries, would need pagination for production volume.

7. **No search/filter on dashboard** — you can only sort by the existing table order. No severity filter or text search yet.

---

## 10. Planned Screenshots

Already captured in `screenshots/` — 16 total. The five key ones for the submission:

| # | Filename | What it shows |
|---|----------|---------------|
| 1 | `triageguard-desktop-dashboard-light.png` | Main dashboard with severity badges, stats, incident table |
| 2 | `triageguard-desktop-submit-light.png` | Submission form with drag-and-drop zone and demo scenarios |
| 3 | `triageguard-desktop-review-critical-light.png` | Critical incident review: red banner, extracted fields, action bar |
| 4 | `triageguard-desktop-audit-dark.png` | Audit log in dark mode showing full event timeline |
| 5 | `triageguard-mobile-dashboard-dark.png` | Mobile responsive view: bottom tabs, card layout, dark mode |

Re-capture anytime with: `node scripts/screenshots.mjs` (requires Playwright: `npx playwright install chromium`)

---

## 11. Backend URL the Frontend Expects

**Dev:** Vite proxies `/functions/v1/app` → `http://127.0.0.1:8000` (configured in `vite.config.ts`)

**Production (Qoder Sites):** The `functions/index.ts` edge function handles `/functions/v1/app` natively — no proxy needed.

**Currently:** The frontend does NOT call the backend at all. `lib/triage-engine.ts` runs entirely client-side. To wire up Seth's Qwen backend, replace or extend `triageIncident()` in that file to `fetch("/functions/v1/app", ...)`.

---

## 12. Project Structure

```
├── index.html                    # Entry HTML (loads Inter font)
├── package.json                  # Dependencies & scripts
├── package-lock.json             # Lock file (committed)
├── vite.config.ts                # Vite config (alias, proxy)
├── tsconfig.json                 # TypeScript config
├── postcss.config.mjs            # PostCSS → Tailwind v4
├── .env.example                  # Env var template
├── .gitignore                    # Excludes node_modules, dist, .env
├── types.ts                      # All TypeScript interfaces
│
├── src/
│   ├── main.tsx                  # React entry point
│   ├── App.tsx                   # Router → Layout → page components
│   ├── globals.css               # Theme tokens (light + dark)
│   ├── vite-env.d.ts             # Vite type declarations
│   └── pages/
│       ├── Dashboard.tsx          # Stats cards + incident table/cards
│       ├── Submit.tsx             # Form + drag-drop + demo scenarios
│       ├── Review.tsx             # Tabs: Report/Policy/Raw/Audit + action bar
│       └── AuditLog.tsx           # Combined audit entries from all incidents
│
├── components/
│   ├── Layout.tsx                 # Responsive shell: sidebar + mobile tabs + theme
│   └── ui/                        # shadcn/ui components (60+ files, don't edit)
│
├── lib/
│   ├── store.tsx                  # React Context + useReducer + hash routing
│   ├── triage-engine.ts           # Demo AI: keyword extraction + classification
│   └── utils.ts                   # cn() helper for Tailwind class merging
│
├── hooks/
│   ├── use-theme.ts               # Light/dark/system toggle, localStorage persist
│   └── use-mobile.ts              # Responsive breakpoint hook
│
├── data/
│   ├── policies.ts                # 7 compliance policy documents
│   └── sample-incidents.ts        # 3 pre-loaded demo incidents
│
├── functions/                     # Qoder Sites edge function (Deno)
│   ├── index.ts                   # Entry point
│   └── handler.ts                 # Request handler
│
├── scripts/
│   ├── build.mjs                  # Production build script
│   ├── check-node.mjs             # Node version check (patched for 23+)
│   └── screenshots.mjs            # Playwright automated screenshot capture
│
├── screenshots/                   # 16 captured PNGs (desktop/mobile × light/dark)
├── vendor/                        # Bundled shadcn Tailwind v4 theme CSS
└── TriageGuard-Product-Overview.html  # Polished product overview page
```

---

## 13. Live Deployment

**URL:** https://triageguard-ai-6npvo6evsn1.qoder.website  
**Host:** Qoder Sites  
**Project ID:** `01a112f1-67bd-7080-a270-7ec93bdd340f`  
**Site ID:** `01a112f1-67bf-7517-9625-50e7ddd7cbd0`  
**Output dir:** `dist/` (static, no SSR)

To redeploy after changes: `npm run build` then use Qoder Sites `prepare_site` → `publish_site`.
