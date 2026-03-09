# DOC 5 — Error Handling

> Internal tool — keep error handling practical, not enterprise-grade.  
> No external error reporting services (Sentry, Datadog, etc.). `console.error` is fine for MVP.

---

## 5.1 Supabase Error Map

| Error / Code | User-facing Toast Message | Recovery |
|---|---|---|
| `auth/invalid-credentials` | "Incorrect email or password." | Stay on login, highlight fields |
| `auth/email-not-confirmed` | "Please verify your email first." | Show resend link |
| `PGRST116` (no rows returned) | *(no toast — show empty state UI)* | Render empty state component |
| `23505` (unique violation) | "Already logged today — updating instead." | Auto-switch to upsert |
| `23514` (check constraint) | "Value out of range. Please check your input." | Highlight the invalid field |
| `JWT expired` | "Session expired. Please log in again." | Call `supabase.auth.signOut()`, redirect `/login` |
| Network error / offline | "No connection. Please check your internet." | Show inline warning, no retry queue needed |
| Generic 500 | "Something went wrong. Please try again." | Show retry button |

---

## 5.2 Loading States

- All data-fetching components render `<LoadingSkeleton>` while awaiting Supabase.
- Skeleton must visually match the loaded content (same height, column count).
- Use `animate-pulse bg-gray-200 rounded` for placeholder blocks.

---

## 5.3 Empty States

| Screen | Empty Condition | What to Show |
|---|---|---|
| Weight chart | 0 logs | Friendly message + "Log your first weigh-in" button |
| Habit heatmap | 0 logs | Render empty muted grid — no error message |
| Weekly summary | No logs this week | Show last week's data with "(Last week)" label |
| KPI cards | No logs | Show `—` as the value, no crash |

---

## 5.4 Form Validation (client-side)

| Field | Rule |
|---|---|
| `weight_kg` | Required, numeric, 30.0–200.0 |
| `water_liters` | Required, numeric, 0.0–10.0 |
| `sleep_score` | Required, integer, 1–10 |
| `date` | Required, defaults to today, must not be in the future |
| `notes` | Optional, max 500 characters — show live counter |

Show inline field errors on blur. Do not allow form submission if any required field is invalid.

---

## 5.5 Error Boundary

```tsx
// src/components/ErrorBoundary.tsx
// Wrap the entire <App> in this.
// Fallback: centered card with error icon, message, and "Reload page" button.
// Log to console.error — no external service needed for internal tool.
```
