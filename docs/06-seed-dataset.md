# DOC 6 — Seed Dataset

> Use this to populate the development Supabase project with realistic test data.  
> Replace `<HUNG_USER_ID>` and `<NGA_USER_ID>` with real UUIDs from `auth.users`.

---

## 6.1 Insert User Goals

```sql
INSERT INTO user_goals (user_id, user_name, start_weight_kg, target_weight_kg, start_date, goal_type)
VALUES
  ('<HUNG_USER_ID>', 'Hung', 95.4, 80.0, '2026-01-01', 'cut'),
  ('<NGA_USER_ID>',  'Nga',  60.2, 55.2, '2026-01-01', 'cut');
```

---

## 6.2 Seed Generator Script

Save as `scripts/generate-seed.js` and run:

```bash
node scripts/generate-seed.js > scripts/seed.sql
```

```js
// scripts/generate-seed.js
const HUNG_ID = '<HUNG_USER_ID>';
const NGA_ID  = '<NGA_USER_ID>';

const startDate = new Date('2025-12-09');
const rows = [];

let hungWeight = 95.4;
let ngaWeight  = 60.2;

for (let i = 0; i < 90; i++) {
  const d = new Date(startDate);
  d.setDate(d.getDate() + i);
  const dateStr  = d.toISOString().split('T')[0];
  const isSat    = d.getDay() === 6;
  const isGymDay = [1, 2, 3, 4, 6].includes(d.getDay()); // Mon–Fri + Sat

  // Gradual downward trend with realistic daily noise
  hungWeight -= (Math.random() * 0.12 - 0.03); // ~0.5 kg/week
  ngaWeight  -= (Math.random() * 0.08 - 0.02); // ~0.35 kg/week

  const hungRow = {
    user_id:      HUNG_ID,
    user_name:    'Hung',
    date:         dateStr,
    weight_kg:    +hungWeight.toFixed(1),
    gym_checkin:  isGymDay,
    water_liters: +(1.5 + Math.random() * 1.5).toFixed(1),
    cheat_meal:   isSat,
    sleep_score:  Math.floor(5 + Math.random() * 5),
    notes:        null,
  };

  const ngaRow = {
    user_id:      NGA_ID,
    user_name:    'Nga',
    date:         dateStr,
    weight_kg:    +ngaWeight.toFixed(1),
    gym_checkin:  isGymDay && Math.random() > 0.2, // slightly less consistent
    water_liters: +(1.0 + Math.random() * 2.0).toFixed(1),
    cheat_meal:   isSat && Math.random() > 0.4,
    sleep_score:  Math.floor(6 + Math.random() * 4),
    notes:        null,
  };

  rows.push(hungRow, ngaRow);
}

// Print as SQL INSERT
const cols = 'user_id,user_name,date,weight_kg,gym_checkin,water_liters,cheat_meal,sleep_score,notes';
console.log(`INSERT INTO daily_logs (${cols}) VALUES`);
const values = rows.map(r =>
  `  ('${r.user_id}','${r.user_name}','${r.date}',${r.weight_kg},${r.gym_checkin},${r.water_liters},${r.cheat_meal},${r.sleep_score},${r.notes === null ? 'NULL' : `'${r.notes}'`})`
);
console.log(values.join(',\n') + ';');
```

---

## 6.3 Edge Cases to Verify After Seeding

| Edge Case | How to Test | Expected Result |
|---|---|---|
| Missing day in sequence | Delete one row from seed | Chart gap; MA adjusts gracefully |
| Weight goes up for 5 days | Manually edit rows 60–65 higher | MA shows uptick; ETA recalculates |
| Fewer than 7 logs | Use a fresh account, log 3 days | MA returns null; raw line only |
| Goal already reached | Set `weight_kg` = `target_weight_kg` | GoalRing shows 100%; ETA shows "Goal reached!" |
| Same-day double submit | Submit log form twice on same date | Upsert updates silently; toast: "Log updated" |
