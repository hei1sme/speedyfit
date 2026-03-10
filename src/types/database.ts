// src/types/database.ts

export interface DailyLog {
  id: string;
  created_at: string;
  date: string;           // 'YYYY-MM-DD'
  user_id: string;
  user_name: 'Hung' | 'Nga';
  weight_kg: number;
  gym_checkin: boolean;
  water_liters: number | null;  // nullable for morning-first flow
  cheat_meal: boolean;
  sleep_score: number | null;   // 1–10, nullable for morning-first flow
  energy_level: number | null;  // 1–10, optional
  waist_cm: number | null;      // optional bi-weekly
  belly_cm: number | null;      // optional bi-weekly
  hip_cm: number | null;        // optional bi-weekly
  thigh_cm: number | null;      // optional bi-weekly
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
  water_target_l: number;      // default 2.0
  sleep_target: number;        // default 7
  gym_target_week: number;     // default 5
}

export type UserName = 'Hung' | 'Nga';
