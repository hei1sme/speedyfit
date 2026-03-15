# Plan 1 - UX Foundation and Core Flow Reliability

## 1. Objective
Stabilize the daily tracking experience for a 2-user internal app (Hung, Nga) by reducing friction, removing duplicated identity logic, and improving action-oriented flow from Dashboard -> Log -> Export.

## 2. Why This Plan Exists
Current codebase already has strong analytics, but the core user journey still has optimization gaps:
- Identity mapping is duplicated across multiple files.
- Log flow is still a single long form despite morning-first behavior.
- CSV export currently lacks time-scope presets for AI review workflows.
- App route loading is monolithic (no lazy route split).

For a 2-user-only product, speed of input and clarity of "what to do today" matter more than enterprise complexity.

## 3. Codebase Research Summary (Execution Anchors)

### 3.1 Dashboard state and analytics center
- File: src/pages/Dashboard.tsx
- Key anchors:
  - calcStreak(...)
  - goalProgress(...)
  - projectGoalDate(...)
  - focusUser state
  - kpiLogs / weeklySummary / consistencyScore / todayTip
- Existing insight candidates already computed and reusable:
  - consistencyScore
  - weeklyDelta
  - avgEnergy
  - todayTip

### 3.2 Log entry and export flow
- File: src/pages/Log.tsx
- Key anchors:
  - filterUser state
  - handleExportCsv(scope)
  - users derivation from goals
  - LogModal + DayDetailSheet wiring

### 3.3 Modal behavior and morning-first readiness
- File: src/components/LogModal.tsx
- Key anchors:
  - validate(form, t)
  - optional water/sleep fields
  - form sections already hinting morning/evening
  - upsert with onConflict date,user_id

### 3.4 Identity/session source of truth
- File: src/hooks/useAuth.ts
- Related duplication sites:
  - src/pages/Dashboard.tsx
  - src/pages/Log.tsx
  - src/components/LogModal.tsx
  - src/components/QuickLogFAB.tsx
  - src/pages/Settings.tsx
- Pattern currently duplicated:
  - session.user.user_metadata.user_name fallback via hardcoded UID map

### 3.5 Routing and performance
- File: src/App.tsx
- Key anchors:
  - all pages imported eagerly
  - ProtectedRoute wrapper already centralized

### 3.6 Copy and localization
- File: src/lib/i18n.ts
- Note:
  - already includes keys for export and dashboard labels
  - future changes should append keys, avoid hardcoded copy

## 4. Scope of Plan 1

### In scope
1. Unify user identity helper.
2. Dashboard checklist panel (today actionable tasks).
3. Auto insight cards using existing metrics.
4. Log modal two-step flow (Morning/Evening).
5. CSV export date scopes (last 30d, all).
6. Consistent Hung/Nga visual tokens.
7. Lazy-load heavy routes in App shell.

### Out of scope
- Database schema changes.
- External analytics services.
- Multi-tenant abstraction.
- Complex notification systems.

## 5. Technical Design

### 5.1 Shared identity utility (single source of truth)
Create new module:
- src/lib/userIdentity.ts

Exports:
- getUserNameFromSession(session): UserName
- getUserColor(name): { line: string; badge: string; surface: string }
- USER_ID_TO_NAME (one central map)

Refactor call sites to consume this utility:
- src/pages/Dashboard.tsx
- src/pages/Log.tsx
- src/components/LogModal.tsx
- src/components/QuickLogFAB.tsx
- src/pages/Settings.tsx

Expected outcome:
- No duplicated UID map blocks.
- Consistent fallback behavior if metadata is missing.

### 5.2 Dashboard "Today Checklist" panel
File:
- src/pages/Dashboard.tsx

Add top panel with 4 quick checks:
- Weight logged today
- Water target hit
- Gym check-in done
- Sleep logged

Computation source:
- allLogs filtered by today and focus user.
- targets from useGoals (water_target_l, sleep_target).

UX behavior:
- If focus = Both, checklist reflects current user (myName) to keep actionability.

### 5.3 Auto insight cards
File:
- src/pages/Dashboard.tsx

Use already available metrics:
- weeklyDelta
- consistencyScore
- avgEnergy
- todayTip

Generate 2-3 short insights with severity levels:
- success
- warning
- neutral

Example logic:
- consistencyScore < 50 -> warning insight.
- weeklyDelta > 0 while target is cut -> warning insight.
- avgEnergy >= 7 + gym streak > 2 -> success insight.

### 5.4 Two-step Log modal
File:
- src/components/LogModal.tsx

Split into:
- Step 1: Morning (date, weight, sleep)
- Step 2: Evening (gym, water, energy, notes, optional measurements)

Behavior:
- Keep single submit payload and same upsert endpoint.
- Preserve edit-existing logic.
- Validate only currently visible required fields per step, then full validation on final submit.

### 5.5 CSV export time scope
File:
- src/pages/Log.tsx

Current:
- scope by user only (Hung/Nga/Both)

Extend:
- add date scope presets:
  - Last 30 days
  - All data

Filename format:
- speedyfit-logs-{scope}-{range}-{yyyy-mm-dd}.csv

### 5.6 Visual consistency for two users
Files:
- src/pages/Dashboard.tsx
- src/pages/Log.tsx
- src/components/WeightChart.tsx
- any user badge areas in components

Standard tokens:
- Hung = indigo family
- Nga = emerald family

### 5.7 Route-level code splitting
File:
- src/App.tsx

Convert page imports to React.lazy for:
- Dashboard
- Log
- Guides
- Rulebook
- Settings

Keep Login eager.
Add Suspense fallback skeleton around route elements.

## 6. Step-by-Step Delivery Sequence
1. Implement userIdentity utility and replace duplicated mapping in all call sites.
2. Add Dashboard checklist panel and insight cards.
3. Refactor LogModal to two-step UX while preserving existing payload.
4. Extend CSV export with date presets.
5. Standardize user color tokens and apply in charts/cards.
6. Add lazy loading for heavy routes.
7. Update i18n keys for new labels/messages.
8. Run full validation and manual regression.

## 7. Test & Acceptance Criteria

### Functional
- Dashboard shows checklist and insights without breaking existing KPIs/charts.
- Log modal can complete both steps and still upsert correctly.
- CSV export works for all combinations:
  - Hung + 30d
  - Nga + 30d
  - Both + 30d
  - Hung + all
  - Nga + all
  - Both + all
- User badges/lines are consistent in color throughout app.
- Routes still protected and loading fallback works.

### Technical
- npm run build passes.
- No new TypeScript errors.
- No regression in auth redirect behavior.

## 8. Risks and Mitigations
- Risk: two-step modal increases state complexity.
  - Mitigation: keep one canonical form state object, add step index only.
- Risk: lazy loading can cause perceived delay on first page open.
  - Mitigation: provide clear skeleton fallback.
- Risk: identity helper refactor may alter fallback user behavior.
  - Mitigation: unit-test helper with null metadata and known UIDs.

## 9. Effort Estimate
- Engineering: medium (1 focused sprint).
- Regression risk: medium-low if done in sequence above.

## 10. Deliverables
- Updated UX flow in Dashboard and Log.
- Centralized identity logic.
- Enhanced CSV export controls.
- Route-level performance improvement.
- Updated translations and stable build.
