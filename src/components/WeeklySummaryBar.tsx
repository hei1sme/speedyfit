// src/components/WeeklySummaryBar.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { startOfISOWeek, endOfISOWeek, subWeeks, format, parseISO } from 'date-fns';

import type { DailyLog } from '../types/database';

interface WeeklySummaryBarProps {
  logs: DailyLog[];
  weeksToShow?: number;
}

interface WeekData {
  label: string;
  gymDays: number;
  avgWater: number;
  cheatMeals: number;
  avgSleep: number;
  weightDelta: number;
}

function computeWeekSummary(logs: DailyLog[], weekStart: Date, weekEnd: Date, label: string): WeekData | null {
  const weekLogs = logs.filter((l) => {
    const d = parseISO(l.date);
    return d >= weekStart && d <= weekEnd;
  });

  if (weekLogs.length === 0) return null;

  const sorted = [...weekLogs].sort((a, b) => a.date.localeCompare(b.date));

  const gymDays = weekLogs.filter((l) => l.gym_checkin).length;
  const avgWater = parseFloat(
    (weekLogs.reduce((s, l) => s + (l.water_liters ?? 0), 0) / weekLogs.length).toFixed(1)
  );
  const cheatMeals = weekLogs.filter((l) => l.cheat_meal).length;
  const avgSleep = parseFloat(
    (weekLogs.reduce((s, l) => s + (l.sleep_score ?? 0), 0) / weekLogs.length).toFixed(1)
  );
  const weightDelta = parseFloat(
    (sorted[sorted.length - 1].weight_kg - sorted[0].weight_kg).toFixed(1)
  );

  return { label, gymDays, avgWater, cheatMeals, avgSleep, weightDelta };
}

export default function WeeklySummaryBar({ logs, weeksToShow = 4 }: WeeklySummaryBarProps) {
  const today = new Date();
  const weeks: WeekData[] = [];

  for (let i = weeksToShow - 1; i >= 0; i--) {
    const refDate = subWeeks(today, i);
    const weekStart = startOfISOWeek(refDate);
    const weekEnd = endOfISOWeek(refDate);
    const label = i === 0 ? 'This week' : i === 1 ? 'Last week' : format(weekStart, 'MMM d');
    const summary = computeWeekSummary(logs, weekStart, weekEnd, label);
    if (summary) weeks.push(summary);
  }

  if (weeks.length === 0) {
    return (
      <div className="rounded-2xl glass p-4 md:p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Weekly Summary</h3>
        <p className="text-gray-500 text-sm">No data available for recent weeks.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass p-4 md:p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Weekly Summary</h3>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[400px]">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeks} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                stroke="#d1d5db"
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                stroke="#d1d5db"
                width={35}
              />
              <Tooltip
                contentStyle={{
                  fontSize: '13px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(12px)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Bar dataKey="gymDays" name="Gym Days" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="avgWater" name="Avg Water (L)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cheatMeals" name="Cheat Meals" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="avgSleep" name="Avg Sleep" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabular fallback for weight delta */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {weeks.map((w) => (
          <div key={w.label} className="text-center">
            <p className="text-xs text-gray-400">{w.label}</p>
            <p
              className={`text-sm font-semibold ${
                w.weightDelta <= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {w.weightDelta > 0 ? '+' : ''}
              {w.weightDelta} kg
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
