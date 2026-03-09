# DOC 7 — Project Structure & Deployment

> Internal tool on Vercel. Keep setup minimal — no CI pipelines, no Docker, no staging environments needed.

---

## 7.1 Repository File Tree

```
speedyfit/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/        # All reusable components (see doc 04)
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useWeightData.ts
│   │   └── useGoals.ts
│   ├── lib/
│   │   └── supabaseClient.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Log.tsx
│   │   ├── Rulebook.tsx
│   │   └── Login.tsx
│   ├── types/
│   │   └── database.ts     # from DOC 2
│   └── main.tsx
├── scripts/
│   └── generate-seed.js    # from DOC 6
├── .env                    # gitignored
├── .env.example            # committed — placeholder values only
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── docs/                   # this folder
```

---

## 7.2 supabaseClient.ts

```ts
// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

---

## 7.3 Vercel Settings

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |
| Node.js version | 20.x |
| Root directory | `/` (repo root) |

Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in **Vercel → Settings → Environment Variables** for Production and Preview environments.

---

## 7.4 Supabase Setup Order

Run these steps in order:

1. Enable extension: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
2. Create `daily_logs` table (schema from DOC 2)
3. Create `user_goals` table (schema from DOC 2)
4. Apply RLS policies (SQL from DOC 2 Section 2.4)
5. Create auth users for Hung and Nga via Supabase Auth dashboard (Email/Password)
6. Run seed script from DOC 6 with their real UUIDs

---

## 7.5 Branch Strategy (simple, internal)

| Branch | Purpose |
|---|---|
| `main` | Live production — only push working code |
| `dev` | Day-to-day development — merge here first |
| `feat/*` | Optional feature branches for bigger changes |

No PR review process required — this is internal. Just don't push broken code directly to `main`.
