# DOC 3 — Analytics Logic Spec

> All computed metrics must follow these exact formulas.  
> Do not invent alternative calculations or use third-party stats libraries.

---

## 3.1 7-Day Moving Average

```ts
// Average weight_kg over the current day + the 6 preceding days.
// Return null if fewer than 3 points exist in the window — don't plot nulls.

interface MovingAvgPoint { date: string; ma: number | null; }

function movingAverage(logs: DailyLog[], windowDays = 7): MovingAvgPoint[] {
  return logs.map((log, i) => {
    const window = logs.slice(Math.max(0, i - windowDays + 1), i + 1);
    if (window.length < 3) return { date: log.date, ma: null };
    const avg = window.reduce((s, l) => s + l.weight_kg, 0) / window.length;
    return { date: log.date, ma: parseFloat(avg.toFixed(2)) };
  });
}
```

---

## 3.2 Projected Goal Date (ETA)

```ts
// Linear regression on the last 30 data points.
// If slope >= 0 (not losing weight), return null → display "Check your trend"

function projectGoalDate(logs: DailyLog[], targetKg: number): Date | null {
  const recent = logs.slice(-30);
  if (recent.length < 7) return null;

  const n = recent.length;
  const xMean = (n - 1) / 2;
  const yMean = recent.reduce((s, l) => s + l.weight_kg, 0) / n;

  let num = 0, den = 0;
  recent.forEach((l, i) => {
    num += (i - xMean) * (l.weight_kg - yMean);
    den += (i - xMean) ** 2;
  });

  const slope = den === 0 ? 0 : num / den;
  if (slope >= 0) return null;

  const latestWeight = recent[recent.length - 1].weight_kg;
  const daysNeeded = (latestWeight - targetKg) / Math.abs(slope);
  return addDays(parseISO(recent[recent.length - 1].date), Math.ceil(daysNeeded));
}
```

---

## 3.3 Streak Counter

```ts
// Gym streak: consecutive days (backward from most recent log) with gym_checkin = true
// Water streak: consecutive days with water_liters >= 2.0

function calcStreak(logs: DailyLog[], field: 'gym_checkin' | 'water_liters'): number {
  const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  for (const log of sorted) {
    const pass = field === 'gym_checkin'
      ? log.gym_checkin
      : log.water_liters >= 2.0;
    if (pass) streak++;
    else break;
  }
  return streak;
}
```

---

## 3.4 % Goal Achieved

```ts
// Percentage of total target weight lost so far.
// Capped 0–100. Never negative.

function goalProgress(currentKg: number, startKg: number, targetKg: number): number {
  const totalToLose = startKg - targetKg;
  const lost = startKg - currentKg;
  if (totalToLose <= 0) return 0;
  return Math.min(100, Math.max(0, parseFloat(((lost / totalToLose) * 100).toFixed(1))));
}
```

---

## 3.5 Weekly Summary (current ISO week, Mon–Sun)

| Metric | Calculation |
|---|---|
| `gymDays` | Count of `gym_checkin = true` |
| `avgWater` | Mean `water_liters`, 1 decimal |
| `cheatMeals` | Count of `cheat_meal = true` |
| `avgSleep` | Mean `sleep_score`, 1 decimal |
| `weightDelta` | Last log weight − first log weight of the week |

---

## 3.6 Chart Date Range Presets

| Label | Data Range | MA Window | X-axis ticks |
|---|---|---|---|
| 7D | Last 7 days | 3-day | Daily |
| 30D | Last 30 days | 7-day | Every 5 days |
| 90D | Last 90 days | 14-day | Weekly |
| All | Full history | 21-day | Monthly |
