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
        setGoals(data ?? []);
      }
    } catch (err) {
      setError('No connection. Please check your internet.');
      console.error('Network error:', err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return { goals, loading, error, refetch: fetchGoals };
}
