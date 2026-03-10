-- Migration: Allow partial daily logs (morning-first flow) + add user settings
-- Run this in Supabase SQL Editor

-- 1. Allow NULL for water_liters and sleep_score (morning check-in only logs weight)
ALTER TABLE daily_logs ALTER COLUMN water_liters DROP NOT NULL;
ALTER TABLE daily_logs ALTER COLUMN sleep_score DROP NOT NULL;

-- 2. Add user-configurable targets to user_goals
ALTER TABLE user_goals
  ADD COLUMN IF NOT EXISTS water_target_l   numeric(3,1) DEFAULT 2.0 CHECK (water_target_l >= 0.5 AND water_target_l <= 10.0),
  ADD COLUMN IF NOT EXISTS sleep_target     smallint     DEFAULT 7   CHECK (sleep_target >= 1 AND sleep_target <= 10),
  ADD COLUMN IF NOT EXISTS gym_target_week  smallint     DEFAULT 5   CHECK (gym_target_week >= 1 AND gym_target_week <= 7);
