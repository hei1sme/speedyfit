// src/hooks/useGoals.ts
import { useEffect, useState, useCallback } from 'react';

import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';
import type { UserGoal } from '../types/database';

interface UseGoalsReturn {
  goals: UserGoal[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  updateGoal: (goalId: string, updates: Partial<Pick<UserGoal, 'target_weight_kg' | 'start_weight_kg' | 'goal_type' | 'water_target_l' | 'sleep_target' | 'gym_target_week'>>) => Promise<boolean>;
}

export function useGoals(): UseGoalsReturn {
  const { session } = useAuth();
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!session) {
      setGoals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from('user_goals')
        .select('*');

      if (dbError) {
        if (dbError.code === 'PGRST116') {
          setGoals([]);
        } else {
          setError('Failed to load goal data.');
          console.error('Fetch goal error:', dbError);
        }
      } else {
        // Apply defaults for settings columns that may be NULL in older rows
        const withDefaults = (data ?? []).map(g => ({
          ...g,
          water_target_l: g.water_target_l ?? 2.0,
          sleep_target: g.sleep_target ?? 7,
          gym_target_week: g.gym_target_week ?? 5,
        }));
        setGoals(withDefaults);
      }
    } catch (err) {
      setError('No connection. Please check your internet.');
      console.error('Network error:', err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  const updateGoal = useCallback(async (goalId: string, updates: Partial<Pick<UserGoal, 'target_weight_kg' | 'start_weight_kg' | 'goal_type' | 'water_target_l' | 'sleep_target' | 'gym_target_week'>>): Promise<boolean> => {
    const { error } = await supabase
      .from('user_goals')
      .update(updates)
      .eq('id', goalId);

    if (error) {
      console.error('Update goal error:', error);
      return false;
    }
    await fetchGoals();
    return true;
  }, [fetchGoals]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return { goals, loading, error, refetch: fetchGoals, updateGoal };
}
