# SpeedyFit — Agent Implementation Package

Internal fitness tracking dashboard for Hưng and Nga.  
**Stack:** React 18 + Vite + Tailwind + Supabase + Vercel

---

## How to Use These Docs

### With Claude (claude.ai)
1. Start a new conversation
2. Paste the full contents of `01-agent-system-prompt.md` as your first message
3. Then say: *"Here are the supporting docs"* and paste whichever docs are relevant to the task
4. For every new session, always re-paste DOC 1 + the current file tree

### With GitHub Copilot / Cursor
1. Put this entire `docs/` folder inside your repo
2. Reference docs by name in your Copilot Chat: `@docs/02-schema-contract.md`
3. Or open the relevant doc in a split pane while coding

---

## Document Index

| File | What it covers |
|---|---|
| `01-agent-system-prompt.md` | Role, hard constraints, stack reference — **inject every session** |
| `02-schema-contract.md` | Supabase tables, TypeScript interfaces, RLS policies, query patterns |
| `03-analytics-logic.md` | Exact formulas: moving average, ETA projection, streaks, goal % |
| `04-component-library.md` | All components, prop interfaces, color system, layout rules |
| `05-error-handling.md` | Error codes → user messages, loading states, empty states, validation |
| `06-seed-dataset.md` | 90-day synthetic data generator + edge case test matrix |
| `07-project-structure.md` | File tree, Vercel config, Supabase setup order, branch strategy |
| `08-acceptance-checklist.md` | Manual QA checklist + out-of-scope list |

---

## Key Decisions (read before starting)

- **No gym progression** — removed from scope. Users track gym elsewhere.
- **Web app, not a phone app** — mobile-responsive UI but no PWA, no service worker, no offline mode.
- **Internal tool** — no analytics, no error reporting services, no GDPR flows. Keep it simple.
- **Two users only** — Hung (95.4 → 80.0 kg) and Nga (60.2 → 55.2 kg). No multi-tenant logic.
