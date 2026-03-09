-- Migration: Add optional bio-feedback & body measurement columns to daily_logs
-- Run this in Supabase SQL Editor

ALTER TABLE daily_logs
  ADD COLUMN IF NOT EXISTS energy_level smallint CHECK (energy_level >= 1 AND energy_level <= 10),
  ADD COLUMN IF NOT EXISTS waist_cm     numeric(5,1) CHECK (waist_cm  >= 20 AND waist_cm  <= 200),
  ADD COLUMN IF NOT EXISTS belly_cm     numeric(5,1) CHECK (belly_cm  >= 20 AND belly_cm  <= 200),
  ADD COLUMN IF NOT EXISTS hip_cm       numeric(5,1) CHECK (hip_cm    >= 20 AND hip_cm    <= 200),
  ADD COLUMN IF NOT EXISTS thigh_cm     numeric(5,1) CHECK (thigh_cm  >= 20 AND thigh_cm  <= 200);
