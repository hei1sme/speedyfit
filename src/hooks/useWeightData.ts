// src/hooks/useWeightData.ts
import { useEffect, useState, useCallback } from 'react';
import { subDays } from 'date-fns';

import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';
import type { DailyLog } from '../types/database';

interface UseWeightDataReturn {
  logs: DailyLog[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useWeightData(rangeDays?: number): UseWeightDataReturn {
  const { session } = useAuth();
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!session) {
      setLogs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: true });

      if (rangeDays) {
        const fromDate = subDays(new Date(), rangeDays)
          .toISOString()
          .split('T')[0];
        query = query.gte('date', fromDate);
      }

      const { data, error: dbError } = await query;

      if (dbError) {
        if (dbError.message?.includes('JWT expired')) {
          setError('Session expired. Please log in again.');
          await supabase.auth.signOut();
        } else if (dbError.code === 'PGRST116') {
          // No rows — not an error, just empty
          setLogs([]);
        } else {
          setError('Something went wrong. Please try again.');
          console.error('Fetch logs error:', dbError);
        }
      } else {
        setLogs(data ?? []);
      }
    } catch (err) {
      setError('No connection. Please check your internet.');
      console.error('Network error:', err);
    } finally {
      setLoading(false);
    }
  }, [session, rangeDays]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, error, refetch: fetchLogs };
}
