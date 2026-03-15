# Plan 2 - Dashboard UI/Chart Enhancement (High-Visibility Layer)

## 1. Objective
Upgrade Dashboard visual communication so users can understand status in 3 seconds:
- What to do today
- Am I on track this week
- Which habits are driving outcomes

This plan is optimized for a 2-user-only internal product (Hung/Nga), focusing on high signal, low interaction cost.

## 2. UI/UX Principles for This Product
1. Action first, analytics second.
2. User identity consistency (Hung indigo, Nga emerald).
3. Lightweight visual hierarchy (no enterprise complexity).
4. Fast readability on mobile and desktop.

## 3. Codebase Research Summary (Where to Implement)

### 3.1 Main composition layer
- File: src/pages/Dashboard.tsx
- Existing building blocks:
  - KPICard
  - WeightChart
  - HabitHeatmap
  - WeeklySummaryBar
  - GoalRing
  - DateRangePicker
  - ViewToggle
- Existing computed metrics reusable for advanced UI:
  - weeklyDelta
  - progress
  - eta
  - consistencyScore
  - avgEnergy
  - todayTip
  - gymStreak / waterStreak

### 3.2 Chart components available
- src/components/WeightChart.tsx
- src/components/HabitHeatmap.tsx
- src/components/WeeklySummaryBar.tsx

### 3.3 Existing translation infrastructure
- src/lib/i18n.ts

## 4. Scope of Plan 2

### In scope
1. Today Score hero card.
2. On-track status card.
3. 7-day momentum mini charts.
4. Weekly compliance grid chart.
5. Formula tooltips for trust and explainability.
6. Mobile quick actions strip.

### Out of scope
- AI model integration inside dashboard.
- New backend endpoints.
- Medical recommendation claims.

## 5. Feature Design Details

### 5.1 Today Score Hero (new)
Location:
- top of Dashboard content area

Formula (local only, deterministic):
- Weight logged today: 25 points
- Water >= target: 25 points
- Gym check-in: 25 points
- Sleep logged and >= target: 25 points

UI:
- Large score (0-100)
- Status text: Strong / Fair / Needs Focus
- Primary CTA: Quick Log

Implementation options:
- Add component: src/components/TodayScoreHero.tsx
- Wire in src/pages/Dashboard.tsx

### 5.2 On-track Status Card (new)
Purpose:
- communicate weekly trajectory with one semantic color

Inputs:
- weeklyDelta
- progress
- eta (null = off-track signal)

Status bands:
- Green: on-track (weeklyDelta <= 0 and eta exists)
- Amber: mixed (flat trend, weak consistency)
- Red: off-track (weeklyDelta > 0 or eta null for cut goal)

Component:
- src/components/OnTrackCard.tsx

### 5.3 7-day Momentum mini charts (new)
Metrics:
- Weight trend
- Water trend
- Sleep trend
- Energy trend

Rendering:
- compact sparkline cards
- use Recharts AreaChart/LineChart with minimal axes

Component:
- src/components/MomentumMiniCharts.tsx

Data source:
- reuse kpiLogs/focusedLogs in src/pages/Dashboard.tsx

### 5.4 Weekly Compliance Grid (new chart)
Concept:
- matrix of day-level completion score for core habits:
  - gym
  - water target
  - sleep target

Display:
- 0/1/2/3 intensity per day
- week-by-week grouping

Component:
- src/components/WeeklyComplianceGrid.tsx

This complements HabitHeatmap (sleep-centric) by adding multi-habit compliance view.

### 5.5 Explainability tooltips (upgrade)
Targets:
- ETA card
- Consistency score
- Goal progress

Behavior:
- small info icon + popover
- concise formula text

Implementation:
- Add tiny reusable helper component (optional): src/components/MetricTooltip.tsx
- Use in Dashboard KPI sections

### 5.6 Mobile Quick Actions Strip (new)
Placement:
- fixed bottom safe area on Dashboard only

Actions:
- Log Morning
- Log Evening
- Export CSV

Notes:
- respect existing QuickLogFAB behavior to avoid duplicate confusion
- hide strip on /log page similar to current FAB logic

## 6. Implementation Map by File

### Must update
- src/pages/Dashboard.tsx
- src/lib/i18n.ts

### New UI components (recommended)
- src/components/TodayScoreHero.tsx
- src/components/OnTrackCard.tsx
- src/components/MomentumMiniCharts.tsx
- src/components/WeeklyComplianceGrid.tsx
- src/components/MetricTooltip.tsx (optional)

### Related flow alignment
- src/components/QuickLogFAB.tsx
- src/pages/Log.tsx (for export handoff if needed)

## 7. Visual System (2-user only)

### User semantic tokens
- Hung:
  - line: #6366f1
  - badge bg: indigo-100
  - badge text: indigo-700
- Nga:
  - line: #10b981
  - badge bg: emerald-100
  - badge text: emerald-700

### Status tokens
- Success: green family
- Warning: amber family
- Risk: red family
- Neutral info: slate/gray family

## 8. Delivery Sequence
1. Build TodayScoreHero + OnTrackCard.
2. Add MomentumMiniCharts.
3. Add WeeklyComplianceGrid.
4. Add metric tooltips.
5. Add mobile quick actions strip.
6. Polish spacing and typography in Dashboard sections.
7. Update i18n and run regression.

## 9. Acceptance Criteria
- Dashboard top section communicates day status without scrolling.
- All new cards render correctly for Hung, Nga, and Both focus modes.
- Charts do not crash on sparse/empty datasets.
- Color mapping is consistent across all user indicators.
- Mobile viewport (375px) remains readable, no horizontal overflow.
- Build passes with no new TS errors.

## 10. Risks and Mitigations
- Risk: too many visual blocks may clutter dashboard.
  - Mitigation: gate advanced blocks behind existing view mode (simple/advanced).
- Risk: KPI overlap with current cards.
  - Mitigation: keep existing KPIs but position new cards as summary layer.
- Risk: interaction conflict with FAB.
  - Mitigation: show quick strip only on Dashboard and keep CTA hierarchy clear.

## 11. Effort Estimate
- Engineering: medium-high (UI-heavy but local frontend only).
- Expected payoff: high, because daily readability improves immediately for both users.

## 12. Deliverables
- New dashboard hero + status components.
- Additional trend/compliance visualizations.
- Explainability enhancements for key metrics.
- Mobile-first quick action access.
