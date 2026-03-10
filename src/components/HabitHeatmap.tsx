// src/components/HabitHeatmap.tsx
import { subDays, format, parseISO, startOfDay } from 'date-fns';
import { Dumbbell } from 'lucide-react';

import type { DailyLog } from '../types/database';

interface HabitHeatmapProps {
  logs: DailyLog[];
  days?: number;
}

function sleepColor(score: number): string {
  if (score >= 9) return 'bg-green-600';
  if (score >= 7) return 'bg-green-400';
  if (score >= 5) return 'bg-green-200';
  if (score >= 3) return 'bg-yellow-200';
  return 'bg-red-200';
}

export default function HabitHeatmap({ logs, days = 30 }: HabitHeatmapProps) {
  const today = startOfDay(new Date());
  const dateRange: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    dateRange.push(format(subDays(today, i), 'yyyy-MM-dd'));
  }

  const logByDate = new Map(logs.map((l) => [l.date, l]));

  return (
    <div className="rounded-2xl glass p-4 md:p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Habit Heatmap</h3>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-green-600" />
          <span>Sleep 9–10</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-green-400" />
          <span>Sleep 7–8</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-green-200" />
          <span>Sleep 5–6</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-yellow-200" />
          <span>Sleep 3–4</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-200" />
          <span>Sleep 1–2</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Dumbbell size={12} className="text-blue-700" />
          <span>Gym day</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Day-of-week headers */}
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div
            key={d}
            className="text-xs text-gray-400 text-center font-medium py-1"
          >
            {d}
          </div>
        ))}

        {/* Offset empty cells so first date aligns to correct weekday */}
        {(() => {
          const firstDate = parseISO(dateRange[0]);
          // getDay: 0=Sun…6=Sat. We want Mon=0, so adjust.
          const dayOfWeek = (firstDate.getDay() + 6) % 7;
          return Array.from({ length: dayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ));
        })()}

        {dateRange.map((dateStr) => {
          const log = logByDate.get(dateStr);
          const isToday = dateStr === format(today, 'yyyy-MM-dd');

          if (!log) {
            return (
              <div
                key={dateStr}
                className={`aspect-square rounded-md bg-gray-100 flex items-center justify-center ${
                  isToday ? 'ring-2 ring-blue-400' : ''
                }`}
                title={format(parseISO(dateStr), 'MMM d')}
              />
            );
          }

          return (
            <div
              key={dateStr}
              className={`aspect-square rounded-md ${sleepColor(log.sleep_score ?? 0)} flex items-center justify-center relative cursor-pointer transition-transform duration-150 hover:scale-110 ${
                isToday ? 'ring-2 ring-blue-400' : ''
              }`}
              title={`${format(parseISO(dateStr), 'MMM d')} — Sleep: ${log.sleep_score != null ? `${log.sleep_score}/10` : '—'}${log.gym_checkin ? ' | Gym ✓' : ''}${(log.water_liters ?? 0) >= 2.0 ? ' | Water ✓' : ''}`}
            >
              {log.gym_checkin && (
                <Dumbbell size={14} className="text-blue-700" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
