# DOC 8 — Acceptance Checklist

> All items below must pass before considering the build complete.  
> Internal tool — no formal QA process needed, just work through this list manually.

---

## Authentication

- [ ] Login with email/password works for Hung
- [ ] Login with email/password works for Nga
- [ ] Failed login shows correct error toast (DOC 5)
- [ ] Logout clears session and redirects to `/login`
- [ ] Refreshing the page keeps the user logged in (Supabase persists session)
- [ ] Each user can only see their own data (RLS working)

---

## Data Entry (`/log`)

- [ ] Daily log form submits all 7 fields to `daily_logs`
- [ ] Same-day resubmission triggers upsert — no duplicate row
- [ ] Form validates: weight 30–200, water 0–10, sleep 1–10
- [ ] Date field defaults to today and blocks future dates
- [ ] Notes field shows character counter (max 500)
- [ ] Toast "Log saved!" on success
- [ ] Toast "Error saving" on Supabase failure
- [ ] **No gym progression tab exists** (confirmed removed)

---

## Dashboard (`/dashboard`)

- [ ] KPI row: current weight (both users), weekly change, gym streak
- [ ] GoalRing shows % progress toward goal for each user
- [ ] Projected ETA card shows calculated goal date
- [ ] Weight chart renders both users' lines in correct colors (Hung = indigo, Nga = emerald)
- [ ] 7-day MA curve only renders when ≥ 3 data points exist
- [ ] Goal line renders at correct kg value per user
- [ ] Date range toggle (7D / 30D / 90D / All) updates the chart
- [ ] Clicking a chart data point opens DayDetailSheet
- [ ] DayDetailSheet shows all fields for that day's log
- [ ] ViewToggle "Simple" hides WeeklySummaryBar and HabitHeatmap
- [ ] ViewToggle preference is remembered on next visit (localStorage)

---

## Habit Heatmap

- [ ] 30-day grid renders with color intensity based on sleep score
- [ ] Gym days show a distinct visual marker
- [ ] Days with no log show as muted gray — no crash or error

---

## Responsive / Mobile-friendly

- [ ] All pages render correctly at 375px viewport width (iPhone SE)
- [ ] Navigation is accessible on mobile (hamburger menu or equivalent)
- [ ] Charts scroll horizontally on narrow screens — not clipped
- [ ] Log form inputs are large enough for touch (`min-h-12`)
- [ ] No horizontal page overflow at any breakpoint

---

## Out-of-Scope — Do NOT Implement

- Gym progression tracking (users use external app)
- PWA install prompt or service worker
- Offline write queue
- Push / email notifications
- Calorie or macro tracking
- Social features or public sharing
- Admin panel or third user
- External error reporting (Sentry etc.)
- Analytics tracking (Google Analytics etc.)

---

## Performance (rough targets — internal tool, not strict)

| Metric | Target |
|---|---|
| Page load on decent WiFi | < 2 seconds |
| Bundle size (gzip) | < 300 KB |
| Supabase query | < 500ms |
| Chart render (90-day data) | No visible lag |
