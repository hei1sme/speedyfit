// src/pages/Log.tsx
import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Plus, Scale, Dumbbell, Droplets, Moon, UtensilsCrossed } from 'lucide-react';

import { useWeightData } from '../hooks/useWeightData';
import LogModal from '../components/LogModal';
import DayDetailSheet from '../components/DayDetailSheet';
import LoadingSkeleton from '../components/LoadingSkeleton';
import type { DailyLog } from '../types/database';

export default function Log() {
  const { logs, loading, error, refetch } = useWeightData();
  const [modalOpen, setModalOpen] = useState(false);
  const [detailLog, setDetailLog] = useState<DailyLog | null>(null);

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
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Daily Logs</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-colors duration-200 cursor-pointer min-h-12"
        >
          <Plus size={18} />
          New Log
        </button>
      </div>

      {/* Empty state */}
      {sortedLogs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Scale size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium mb-1">No logs yet</p>
          <p className="text-sm text-gray-400 mb-4">
            Start tracking by logging your first weigh-in.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors cursor-pointer"
          >
            Log your first weigh-in
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
                <span className="text-lg font-bold text-gray-900">
                  {log.weight_kg.toFixed(1)}
                  <span className="text-xs text-gray-400 ml-0.5">kg</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                <span
                  className={`flex items-center gap-1 ${
                    log.gym_checkin ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  <Dumbbell size={13} />
                  {log.gym_checkin ? 'Gym ✓' : 'Rest'}
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
                  Sleep {log.sleep_score}/10
                </span>
                {log.cheat_meal && (
                  <span className="flex items-center gap-1 text-amber-600">
                    <UtensilsCrossed size={13} />
                    Cheat
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
      />

      {/* Day Detail Sheet */}
      <DayDetailSheet log={detailLog} onClose={() => setDetailLog(null)} />
    </div>
  );
}
