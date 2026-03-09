// src/types/database.ts

export interface DailyLog {
  id: string;
  created_at: string;
  date: string;           // 'YYYY-MM-DD'
  user_id: string;
  user_name: 'Hung' | 'Nga';
  weight_kg: number;
  gym_checkin: boolean;
  water_liters: number;
  cheat_meal: boolean;
  sleep_score: number;    // 1–10
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
}

export type UserName = 'Hung' | 'Nga';
