// src/pages/Dashboard.tsx
import { useState, useMemo } from 'react';
import { addDays, parseISO, format, subDays, startOfISOWeek, endOfISOWeek } from 'date-fns';
import {
  Scale,
  TrendingDown,
  Dumbbell,
  Droplets,
  Calendar,
  Target,
} from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { useWeightData } from '../hooks/useWeightData';
import { useGoals } from '../hooks/useGoals';
import type { DailyLog, UserName } from '../types/database';

import KPICard from '../components/KPICard';
import WeightChart from '../components/WeightChart';
import GoalRing from '../components/GoalRing';
import HabitHeatmap from '../components/HabitHeatmap';
import WeeklySummaryBar from '../components/WeeklySummaryBar';
import DayDetailSheet from '../components/DayDetailSheet';
import ViewToggle from '../components/ViewToggle';
import DateRangePicker from '../components/DateRangePicker';
import LoadingSkeleton from '../components/LoadingSkeleton';

// ---- Analytics helpers (DOC 03) ----

function calcStreak(logs: DailyLog[], field: 'gym_checkin' | 'water_liters'): number {
  const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  for (const log of sorted) {
    const pass =
      field === 'gym_checkin' ? log.gym_checkin : log.water_liters >= 2.0;
    if (pass) streak++;
    else break;
  }
  return streak;
}

function goalProgress(currentKg: number, startKg: number, targetKg: number): number {
  const totalToLose = startKg - targetKg;
  const lost = startKg - currentKg;
  if (totalToLose <= 0) return 0;
  return Math.min(100, Math.max(0, parseFloat(((lost / totalToLose) * 100).toFixed(1))));
}

function projectGoalDate(logs: DailyLog[], targetKg: number): Date | null {
  const recent = logs.slice(-30);
  if (recent.length < 7) return null;

  const n = recent.length;
  const xMean = (n - 1) / 2;
  const yMean = recent.reduce((s, l) => s + l.weight_kg, 0) / n;

  let num = 0;
  let den = 0;
  recent.forEach((l, i) => {
    num += (i - xMean) * (l.weight_kg - yMean);
    den += (i - xMean) ** 2;
  });

  const slope = den === 0 ? 0 : num / den;
  if (slope >= 0) return null;

  const latestWeight = recent[recent.length - 1].weight_kg;
  const daysNeeded = (latestWeight - targetKg) / Math.abs(slope);
  return addDays(parseISO(recent[recent.length - 1].date), Math.ceil(daysNeeded));
}

function getWeeklySummary(logs: DailyLog[]) {
  const today = new Date();
  let weekStart = startOfISOWeek(today);
  let weekEnd = endOfISOWeek(today);
  let label = 'This week';

  let weekLogs = logs.filter((l) => {
    const d = parseISO(l.date);
    return d >= weekStart && d <= weekEnd;
  });

  // Fallback to last week if no logs this week
  if (weekLogs.length === 0) {
    weekStart = startOfISOWeek(subDays(today, 7));
    weekEnd = endOfISOWeek(subDays(today, 7));
    weekLogs = logs.filter((l) => {
      const d = parseISO(l.date);
      return d >= weekStart && d <= weekEnd;
    });
    label = 'Last week';
  }

  if (weekLogs.length === 0) return null;

  const sorted = [...weekLogs].sort((a, b) => a.date.localeCompare(b.date));

  return {
    label,
    gymDays: weekLogs.filter((l) => l.gym_checkin).length,
    avgWater: parseFloat(
      (weekLogs.reduce((s, l) => s + l.water_liters, 0) / weekLogs.length).toFixed(1)
    ),
    cheatMeals: weekLogs.filter((l) => l.cheat_meal).length,
    avgSleep: parseFloat(
      (weekLogs.reduce((s, l) => s + l.sleep_score, 0) / weekLogs.length).toFixed(1)
    ),
    weightDelta: parseFloat(
      (sorted[sorted.length - 1].weight_kg - sorted[0].weight_kg).toFixed(1)
    ),
  };
}

// ---- Date range filter ----

const RANGE_DAYS: Record<string, number | null> = {
  '7D': 7,
  '30D': 30,
  '90D': 90,
  All: null,
};

function filterLogsByRange(logs: DailyLog[], range: '7D' | '30D' | '90D' | 'All'): DailyLog[] {
  const days = RANGE_DAYS[range];
  if (!days) return logs;
  const from = format(subDays(new Date(), days), 'yyyy-MM-dd');
  return logs.filter((l) => l.date >= from);
}

// ---- Component ----

export default function Dashboard() {
  // Persisted view preference — default to 'simple'
  const [view, setView] = useState<'simple' | 'advanced'>(() => {
    const stored = localStorage.getItem('speedyfit-view');
    return stored === 'advanced' ? 'advanced' : 'simple';
  });

  const [range, setRange] = useState<'7D' | '30D' | '90D' | 'All'>('30D');
  const [detailLog, setDetailLog] = useState<DailyLog | null>(null);

  const { logs: allLogs, loading: logsLoading, error: logsError } = useWeightData();
  const { goal, loading: goalLoading } = useGoals();

  const handleViewChange = (v: 'simple' | 'advanced') => {
    setView(v);
    localStorage.setItem('speedyfit-view', v);
  };

  const isAdvanced = view === 'advanced';

  // Filtered logs for chart
  const filteredLogs = useMemo(() => filterLogsByRange(allLogs, range), [allLogs, range]);

  // Latest log
  const latestLog = allLogs.length > 0 ? allLogs[allLogs.length - 1] : null;
  const userName: UserName = latestLog?.user_name ?? 'Hung';

  // KPI computations
  const currentWeight = latestLog?.weight_kg ?? null;
  const weeklyDelta = useMemo(() => {
    if (allLogs.length < 2) return null;
    const sevenDaysAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');
    const weekAgoLog = [...allLogs]
      .reverse()
      .find((l) => l.date <= sevenDaysAgo);
    if (!weekAgoLog || !latestLog) return null;
    return parseFloat((latestLog.weight_kg - weekAgoLog.weight_kg).toFixed(1));
  }, [allLogs, latestLog]);

  const gymStreak = useMemo(() => calcStreak(allLogs, 'gym_checkin'), [allLogs]);
  const waterStreak = useMemo(() => calcStreak(allLogs, 'water_liters'), [allLogs]);

  const progress = useMemo(() => {
    if (!goal || !currentWeight) return 0;
    return goalProgress(currentWeight, goal.start_weight_kg, goal.target_weight_kg);
  }, [goal, currentWeight]);

  const eta = useMemo(() => {
    if (!goal) return null;
    return projectGoalDate(allLogs, goal.target_weight_kg);
  }, [allLogs, goal]);

  const weeklySummary = useMemo(() => getWeeklySummary(allLogs), [allLogs]);

  // Scatter data: weight vs gym (advanced only)
  const scatterData = useMemo(() => {
    if (!isAdvanced) return [];
    return allLogs.map((l) => ({
      gym: l.gym_checkin ? 1 : 0,
      weight: l.weight_kg,
      date: l.date,
    }));
  }, [allLogs, isAdvanced]);

  // Chart props — RLS means we only have logged-in user's data
  const hungLogs = userName === 'Hung' ? filteredLogs : [];
  const ngaLogs = userName === 'Nga' ? filteredLogs : [];

  const handleDayClick = (date: string, _user: UserName) => {
    const log = allLogs.find((l) => l.date === date);
    if (log) setDetailLog(log);
  };

  // Loading state
  if (logsLoading || goalLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">
        <LoadingSkeleton variant="kpi" count={4} />
        <LoadingSkeleton variant="chart" />
        <LoadingSkeleton variant="heatmap" />
      </div>
    );
  }

  // Error state
  if (logsError) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{logsError}</p>
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
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <ViewToggle value={view} onChange={handleViewChange} />
          {isAdvanced && (
            <DateRangePicker value={range} onChange={setRange} />
          )}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <KPICard
          label="Current Weight"
          value={currentWeight !== null ? currentWeight.toFixed(1) : '—'}
          unit="kg"
          icon={Scale}
          delta={isAdvanced ? (weeklyDelta ?? undefined) : undefined}
        />
        <KPICard
          label="Goal Progress"
          value={goal ? `${progress.toFixed(0)}%` : '—'}
          icon={Target}
          variant={progress >= 100 ? 'success' : 'default'}
        />
        <KPICard
          label="Gym Streak"
          value={gymStreak}
          unit="days"
          icon={Dumbbell}
          variant={gymStreak >= 5 ? 'success' : 'default'}
        />
        {isAdvanced ? (
          <KPICard
            label="Water Streak"
            value={waterStreak}
            unit="days"
            icon={Droplets}
            variant={waterStreak >= 3 ? 'success' : 'default'}
          />
        ) : (
          <KPICard
            label="Weekly Change"
            value={weeklyDelta !== null ? `${weeklyDelta > 0 ? '+' : ''}${weeklyDelta}` : '—'}
            unit="kg"
            icon={TrendingDown}
            variant={
              weeklyDelta !== null
                ? weeklyDelta <= 0
                  ? 'success'
                  : 'danger'
                : 'default'
            }
          />
        )}
      </div>

      {/* Goal Rings */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Goal Progress</h3>
        <div className="flex items-center justify-center gap-10">
          {goal && currentWeight !== null && (
            <GoalRing
              userName={userName}
              currentKg={currentWeight}
              startKg={goal.start_weight_kg}
              targetKg={goal.target_weight_kg}
              size="lg"
            />
          )}
        </div>

        {/* ETA */}
        {isAdvanced && (
          <div className="mt-4 text-center">
            {progress >= 100 ? (
              <p className="text-green-600 font-semibold">🎉 Goal reached!</p>
            ) : eta ? (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Projected goal date: </span>
                <span className="text-blue-700 font-semibold">
                  {format(eta, 'MMMM d, yyyy')}
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  Based on linear regression of last 30 data points
                </p>
              </div>
            ) : (
              <p className="text-sm text-amber-600 font-medium">
                Check your trend — not currently on track to lose weight
              </p>
            )}
          </div>
        )}
      </div>

      {/* Simple view: weekly summary as plain numbers */}
      {!isAdvanced && weeklySummary && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {weeklySummary.label === 'This week' ? 'This Week' : 'Last Week'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{weeklySummary.gymDays}</p>
              <p className="text-sm text-gray-500">Gym days</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{weeklySummary.avgWater}L</p>
              <p className="text-sm text-gray-500">Avg water</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{weeklySummary.cheatMeals}</p>
              <p className="text-sm text-gray-500">Cheat meals</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{weeklySummary.avgSleep}</p>
              <p className="text-sm text-gray-500">Avg sleep</p>
            </div>
          </div>
        </div>
      )}

      {/* Weight Chart */}
      <div>
        {!isAdvanced && (
          <div className="mb-3">
            <DateRangePicker value={range} onChange={setRange} />
          </div>
        )}
        <WeightChart
          hungLogs={hungLogs}
          ngaLogs={ngaLogs}
          hungGoal={80.0}
          ngaGoal={55.2}
          range={range}
          showAdvanced={isAdvanced}
          onDayClick={handleDayClick}
        />
      </div>

      {/* Advanced-only sections */}
      {isAdvanced && (
        <>
          {/* Habit Heatmap */}
          <HabitHeatmap logs={allLogs} days={30} />

          {/* Weekly Summary Bar (week-over-week comparison) */}
          <WeeklySummaryBar logs={allLogs} weeksToShow={4} />

          {/* Scatter plot: Weight vs Gym Check-in Correlation */}
          {scatterData.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Weight vs Gym Correlation
              </h3>
              <p className="text-xs text-gray-400 mb-3">
                X = Gym (0 = rest, 1 = gym day) · Y = Weight (kg)
              </p>
              <div className="w-full overflow-x-auto">
                <div className="min-w-[400px]">
                  <ResponsiveContainer width="100%" height={240}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="gym"
                        type="number"
                        domain={[-0.2, 1.2]}
                        ticks={[0, 1]}
                        tickFormatter={(v: number) => (v === 0 ? 'Rest' : 'Gym')}
                        tick={{ fontSize: 12, fill: '#9ca3af' }}
                        stroke="#d1d5db"
                        name="Gym"
                      />
                      <YAxis
                        dataKey="weight"
                        type="number"
                        tick={{ fontSize: 12, fill: '#9ca3af' }}
                        stroke="#d1d5db"
                        name="Weight"
                        unit=" kg"
                        width={55}
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => {
                          if (name === 'Gym') return value === 1 ? 'Yes' : 'No';
                          return `${value} kg`;
                        }}
                        contentStyle={{
                          fontSize: '13px',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                        }}
                      />
                      <Scatter
                        data={scatterData}
                        fill={userName === 'Hung' ? '#6366f1' : '#10b981'}
                        fillOpacity={0.6}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Projected ETA card (detailed) */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              <Calendar size={20} className="inline mr-2 text-gray-400" />
              Projected ETA Detail
            </h3>
            {progress >= 100 ? (
              <div className="text-center py-4">
                <p className="text-2xl font-bold text-green-600">Goal reached!</p>
                <p className="text-sm text-gray-500 mt-1">
                  Congratulations, {userName}! 🎉
                </p>
              </div>
            ) : eta ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Target weight</span>
                  <span className="font-medium text-gray-900">
                    {goal?.target_weight_kg.toFixed(1)} kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Current weight</span>
                  <span className="font-medium text-gray-900">
                    {currentWeight?.toFixed(1)} kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Remaining</span>
                  <span className="font-medium text-gray-900">
                    {goal && currentWeight
                      ? (currentWeight - goal.target_weight_kg).toFixed(1)
                      : '—'}{' '}
                    kg
                  </span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between">
                  <span className="text-gray-500">Projected date</span>
                  <span className="font-semibold text-blue-700">
                    {format(eta, 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="text-xs text-gray-400 pt-1">
                  Linear regression on last 30 data points. Recalculates daily.
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-amber-600 font-medium">Check your trend</p>
                <p className="text-xs text-gray-400 mt-1">
                  Not enough data or weight is not trending down.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Day Detail Sheet */}
      <DayDetailSheet log={detailLog} onClose={() => setDetailLog(null)} />
    </div>
  );
}
