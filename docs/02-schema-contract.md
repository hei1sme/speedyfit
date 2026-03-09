# DOC 2 — Data Schema Contract

> Single source of truth for all database tables, TypeScript interfaces, and query patterns.  
> Do not add, rename, or remove any field without logging it in the Migration Log below.

---

## 2.1 Tables

### `daily_logs`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | uuid | PK, default `uuid_generate_v4()` | Never set manually |
| `created_at` | timestamptz | default `now()` | Auto-managed |
| `date` | date | NOT NULL, UNIQUE per `user_id` | Format: `YYYY-MM-DD` |
| `user_id` | uuid | FK → `auth.users`, NOT NULL | RLS enforced |
| `user_name` | varchar(10) | NOT NULL, CHECK IN `('Hung','Nga')` | Display label only |
| `weight_kg` | float4 | NOT NULL, CHECK `30.0–200.0` | One decimal |
| `gym_checkin` | boolean | NOT NULL, default `false` | — |
| `water_liters` | float4 | NOT NULL, CHECK `0.0–10.0` | One decimal |
| `cheat_meal` | boolean | NOT NULL, default `false` | — |
| `sleep_score` | int2 | NOT NULL, CHECK `1–10` | 1 = terrible, 10 = perfect |
| `notes` | text | nullable, max 500 chars | Surfaces as chart tooltip annotation |

---

### `user_goals`

> Required for progress rings, projected ETA, and % goal achieved cards.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | uuid | PK, default `uuid_generate_v4()` | — |
| `user_id` | uuid | FK → `auth.users`, UNIQUE, NOT NULL | One row per user only |
| `user_name` | varchar(10) | NOT NULL | — |
| `start_weight_kg` | float4 | NOT NULL | Weight on program start date |
| `target_weight_kg` | float4 | NOT NULL | Hung: 80.0 · Nga: 55.2 |
| `start_date` | date | NOT NULL | Program start date |
| `goal_type` | varchar(20) | CHECK IN `('cut','maintain','bulk')` | Both users: `'cut'` |

---

## 2.2 TypeScript Interfaces

```ts
// src/types/database.ts

export interface DailyLog {
  id: string;
  created_at: string;
  date: string;           // 'YYYY-MM-DD'
  user_id: string;
  user_name: 'Hung' | 'Nga';
  weight_kg: number;
  gym_checkin: boolean;
  water_liters: number;
  cheat_meal: boolean;
  sleep_score: number;    // 1–10
  notes: string | null;
}

export interface UserGoal {
  id: string;
  user_id: string;
  user_name: 'Hung' | 'Nga';
  start_weight_kg: number;
  target_weight_kg: number;
  start_date: string;
  goal_type: 'cut' | 'maintain' | 'bulk';
}

export type UserName = 'Hung' | 'Nga';
```

---

## 2.3 Standard Query Patterns

```ts
// Fetch last 90 days for the logged-in user
const { data, error } = await supabase
  .from('daily_logs')
  .select('*')
  .eq('user_id', session.user.id)
  .gte('date', subDays(new Date(), 90).toISOString().split('T')[0])
  .order('date', { ascending: true });

// Upsert daily log — handles same-day resubmission silently
const { error } = await supabase
  .from('daily_logs')
  .upsert({ ...payload }, { onConflict: 'date,user_id' });

// Fetch goal for logged-in user
const { data: goal } = await supabase
  .from('user_goals')
  .select('*')
  .eq('user_id', session.user.id)
  .single();
```

---

## 2.4 RLS Policies (run in Supabase SQL editor)

```sql
-- Enable RLS
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

-- daily_logs: users can only see and modify their own rows
CREATE POLICY "Users manage own logs"
  ON daily_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_goals: same
CREATE POLICY "Users manage own goals"
  ON user_goals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## 2.5 Migration Log

| Version | Date | Change |
|---|---|---|
| v1.0 | 2026-03-09 | Initial schema: `daily_logs` |
| v1.1 | 2026-03-09 | Added `user_goals`; removed `gym_progression` (out of scope) |
| v1.1 | 2026-03-09 | Added CHECK constraints on all numeric columns |
| v1.1 | 2026-03-09 | Defined `sleep_score` scale: 1–10 |
