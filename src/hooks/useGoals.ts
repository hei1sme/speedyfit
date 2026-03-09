// src/hooks/useGoals.ts
import { useEffect, useState, useCallback } from 'react';

import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';
import type { UserGoal } from '../types/database';

interface UseGoalsReturn {
  goal: UserGoal | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGoals(): UseGoalsReturn {
  const { session } = useAuth();
  const [goal, setGoal] = useState<UserGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoal = useCallback(async () => {
    if (!session) {
      setGoal(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (dbError) {
        if (dbError.code === 'PGRST116') {
          // No goal row — not an error
          setGoal(null);
        } else {
          setError('Failed to load goal data.');
          console.error('Fetch goal error:', dbError);
        }
      } else {
        setGoal(data);
      }
    } catch (err) {
      setError('No connection. Please check your internet.');
      console.error('Network error:', err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchGoal();
  }, [fetchGoal]);

  return { goal, loading, error, refetch: fetchGoal };
}
