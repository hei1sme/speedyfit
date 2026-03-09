# DOC 4 — Component Library Spec

> All reusable components are defined here before generation.  
> Do not create duplicate components or rename existing ones mid-project.

---

## 4.1 Component File Map

| Component | File Path | Purpose |
|---|---|---|
| `KPICard` | `src/components/KPICard.tsx` | Single metric tile (weight, streak, %, ETA) |
| `WeightChart` | `src/components/WeightChart.tsx` | Line chart + MA curve + goal line |
| `HabitHeatmap` | `src/components/HabitHeatmap.tsx` | 30-day calendar heatmap for gym/water/sleep |
| `WeeklySummaryBar` | `src/components/WeeklySummaryBar.tsx` | Grouped bar: week-over-week habit comparison |
| `GoalRing` | `src/components/GoalRing.tsx` | Radial progress ring (% goal achieved) |
| `DayDetailSheet` | `src/components/DayDetailSheet.tsx` | Side panel / bottom sheet: full log for a clicked date |
| `LogModal` | `src/components/LogModal.tsx` | Modal form — Daily Log tab only (no gym tab) |
| `ViewToggle` | `src/components/ViewToggle.tsx` | Simplified ↔ Advanced toggle (persisted in localStorage) |
| `DateRangePicker` | `src/components/DateRangePicker.tsx` | Segmented control: 7D / 30D / 90D / All |
| `LoadingSkeleton` | `src/components/LoadingSkeleton.tsx` | Skeleton placeholders for cards and charts |

> **Note:** No BottomNav component. This is a web app with a standard top navbar, not a mobile app shell.

---

## 4.2 Component Prop Interfaces

### KPICard
```ts
interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;        // positive = green arrow up, negative = red arrow down
  icon?: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  loading?: boolean;
}
```

### WeightChart
```ts
interface WeightChartProps {
  hungLogs: DailyLog[];
  ngaLogs: DailyLog[];
  hungGoal: number;       // 80.0
  ngaGoal: number;        // 55.2
  range: '7D' | '30D' | '90D' | 'All';
  showAdvanced?: boolean; // show MA curve + goal line
  onDayClick?: (date: string, user: UserName) => void;
}
```

### GoalRing
```ts
interface GoalRingProps {
  userName: UserName;
  currentKg: number;
  startKg: number;
  targetKg: number;
  size?: 'sm' | 'md' | 'lg';
}
```

### DayDetailSheet
```ts
interface DayDetailSheetProps {
  log: DailyLog | null;   // null = closed
  onClose: () => void;
}
```

### ViewToggle
```ts
interface ViewToggleProps {
  value: 'simple' | 'advanced';
  onChange: (v: 'simple' | 'advanced') => void;
}
```

---

## 4.3 Color System

| Role | Tailwind Class | Purpose |
|---|---|---|
| Primary | `text-blue-700` / `bg-blue-700` | Buttons, active links, headings |
| Hung's line | `stroke-indigo-500` / `text-indigo-500` | All Hung data visualizations |
| Nga's line | `stroke-emerald-500` / `text-emerald-500` | All Nga data visualizations |
| Goal line | `stroke-amber-400` | Target weight line on chart |
| Success | `text-green-600` / `bg-green-50` | Positive delta, streaks, met goals |
| Danger | `text-red-600` / `bg-red-50` | Negative delta, missed habits |
| Surface | `bg-white` / `bg-gray-50` | Card backgrounds |
| Border | `border-gray-200` | Card and table borders |
| Muted text | `text-gray-400` | Labels, units, captions |

---

## 4.4 Typography Scale

| Role | Tailwind | Notes |
|---|---|---|
| Page title | `text-2xl font-bold` | One per page |
| Section heading | `text-xl font-semibold` | Card or section titles |
| KPI value | `text-3xl font-bold` | Large metric display |
| Card label | `text-sm text-gray-500` | Above or below KPI value |
| Body text | `text-base` | General content |
| Caption / unit | `text-xs text-gray-400` | Units, sub-labels |

---

## 4.5 Layout Rules

- **Navbar:** Standard top horizontal nav for desktop. Collapses to hamburger menu on mobile (`md:` breakpoint).
- **Page container:** `max-w-5xl mx-auto px-4 md:px-6 py-6`
- **KPI grid:** `grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4`
- **Card padding:** `p-4 md:p-6`
- **Chart container:** `w-full overflow-x-auto` — charts scroll horizontally on narrow screens rather than being cut off.
- **Advanced view only** components: `WeeklySummaryBar`, `HabitHeatmap`, correlation cards — hide with `hidden` when ViewToggle = `'simple'`.
