// src/pages/Log.tsx
import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Plus, Scale, Dumbbell, Droplets, Moon, UtensilsCrossed, Zap } from 'lucide-react';

import { useWeightData } from '../hooks/useWeightData';
import { useGoals } from '../hooks/useGoals';
import { supabase } from '../lib/supabaseClient';
import LogModal from '../components/LogModal';
import type { AppUser } from '../components/LogModal';
import DayDetailSheet from '../components/DayDetailSheet';
import LoadingSkeleton from '../components/LoadingSkeleton';
import type { DailyLog, UserName } from '../types/database';
import { useLang } from '../contexts/LangContext';

export default function Log() {
  const { t } = useLang();
  const { logs, loading, error, refetch } = useWeightData();
  const { goals } = useGoals();
  const [modalOpen, setModalOpen] = useState(false);
  const [detailLog, setDetailLog] = useState<DailyLog | null>(null);

  // Derive users from goals — always has both users regardless of log history
  const users: AppUser[] = useMemo(() => {
    if (goals.length > 0) {
      return goals.map((g) => ({ id: g.user_id, name: g.user_name as UserName }));
    }
    // Fallback: derive from logs
    const map = new Map<string, UserName>();
    for (const l of logs) {
      if (!map.has(l.user_id)) map.set(l.user_id, l.user_name);
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [goals, logs]);

  const handleDelete = async (id: string) => {
    await supabase.from('daily_logs').delete().eq('id', id);
    refetch();
  };

  // Display logs in reverse chronological order
  const sortedLogs = useMemo(
    () => [...logs].sort((a, b) => b.date.localeCompare(a.date)),
    [logs]
  );

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-28 bg-gray-200 rounded animate-pulse" />
        </div>
        <LoadingSkeleton variant="card" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer"
          >
            {t('log.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('log.title')}</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-colors duration-200 cursor-pointer min-h-12"
        >
          <Plus size={18} />
          {t('log.newLog')}
        </button>
      </div>

      {/* Empty state */}
      {sortedLogs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Scale size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium mb-1">{t('log.emptyTitle')}</p>
          <p className="text-sm text-gray-400 mb-4">{t('log.emptyDesc')}</p>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors cursor-pointer"
          >
            {t('log.emptyBtn')}
          </button>
        </div>
      ) : (
        /* Log entries list */
        <div className="space-y-2">
          {sortedLogs.map((log) => (
            <button
              key={log.id}
              onClick={() => setDetailLog(log)}
              className="w-full bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-150 cursor-pointer text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">
                  {(() => {
                    try {
                      return format(parseISO(log.date), 'EEE, MMM d, yyyy');
                    } catch {
                      return log.date;
                    }
                  })()}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      log.user_name === 'Hung'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {log.user_name}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                  {log.weight_kg.toFixed(1)}
                  <span className="text-xs text-gray-400 ml-0.5">kg</span>
                </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                <span
                  className={`flex items-center gap-1 ${
                    log.gym_checkin ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  <Dumbbell size={13} />
                  {log.gym_checkin ? t('log.gym') : t('log.rest')}
                </span>
                <span
                  className={`flex items-center gap-1 ${
                    log.water_liters >= 2.0 ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <Droplets size={13} />
                  {log.water_liters.toFixed(1)}L
                </span>
                <span className="flex items-center gap-1">
                  <Moon size={13} />
                  {t('log.sleep')} {log.sleep_score}/10
                </span>
                {log.energy_level != null && (
                  <span className={`flex items-center gap-1 ${
                    log.energy_level >= 7 ? 'text-yellow-500' : 'text-gray-400'
                  }`}>
                    <Zap size={13} />
                    {t('log.energy')} {log.energy_level}/10
                  </span>
                )}
                {log.cheat_meal && (
                  <span className="flex items-center gap-1 text-amber-600">
                    <UtensilsCrossed size={13} />
                    {t('log.cheat')}
                  </span>
                )}
                {log.notes && (
                  <span className="text-gray-400 truncate max-w-[150px]">
                    📝 {log.notes}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Log Modal */}
      <LogModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={refetch}
        users={users}
      />

      {/* Day Detail Sheet */}
      <DayDetailSheet log={detailLog} onClose={() => setDetailLog(null)} onDelete={handleDelete} />
    </div>
  );
}
