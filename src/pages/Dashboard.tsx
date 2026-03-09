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
import { useAuth } from '../hooks/useAuth';
import { useLang } from '../contexts/LangContext';
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
  let label = 'this-week';

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
    label = 'last-week';
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
  const { session } = useAuth();
  const { t } = useLang();

  // Persisted view preference — default to 'simple'
  const [view, setView] = useState<'simple' | 'advanced'>(() => {
    const stored = localStorage.getItem('speedyfit-view');
    return stored === 'advanced' ? 'advanced' : 'simple';
  });

  const [range, setRange] = useState<'7D' | '30D' | '90D' | 'All'>('30D');
  const [detailLog, setDetailLog] = useState<DailyLog | null>(null);

  const { logs: allLogs, loading: logsLoading, error: logsError } = useWeightData();
  const { goals, loading: goalLoading } = useGoals();

  // Current user's name
  const myName: UserName = (session?.user.user_metadata?.user_name as UserName) ?? 'Hung';

  // User focus filter — defaults to logged-in user
  const [focusUser, setFocusUser] = useState<'Hung' | 'Nga' | 'Both'>(myName);

  // Split logs by user
  const hungAllLogs = useMemo(() => allLogs.filter((l) => l.user_name === 'Hung'), [allLogs]);
  const ngaAllLogs  = useMemo(() => allLogs.filter((l) => l.user_name === 'Nga'),  [allLogs]);

  // Logs scoped to the focus selection (for KPIs, streaks, heatmap, etc.)
  const focusedLogs = useMemo(() => {
    if (focusUser === 'Both') return allLogs;
    return allLogs.filter((l) => l.user_name === focusUser);
  }, [allLogs, focusUser]);

  // Goals per user
  const hungGoal = useMemo(() => goals.find((g) => g.user_name === 'Hung') ?? null, [goals]);
  const ngaGoal  = useMemo(() => goals.find((g) => g.user_name === 'Nga')  ?? null, [goals]);
  const focusedGoal = focusUser === 'Hung' ? hungGoal : focusUser === 'Nga' ? ngaGoal : null;
  // For ETA / remaining we need a single goal; fall back to logged-in user when 'Both'
  const myGoal = focusUser === 'Both'
    ? (myName === 'Hung' ? hungGoal : ngaGoal)
    : focusedGoal;

  const handleViewChange = (v: 'simple' | 'advanced') => {
    setView(v);
    localStorage.setItem('speedyfit-view', v);
  };

  const isAdvanced = view === 'advanced';

  // KPI computations — always off the focused logs
  // When 'Both' is selected we show the logged-in user's single-stat KPIs
  const kpiLogs = focusUser === 'Both'
    ? allLogs.filter((l) => l.user_name === myName)
    : focusedLogs;

  const latestLog  = kpiLogs.length > 0 ? kpiLogs[kpiLogs.length - 1] : null;
  const focusLabel: string = focusUser === 'Both' ? myName : focusUser;
  const currentWeight = latestLog?.weight_kg ?? null;

  const weeklyDelta = useMemo(() => {
    if (kpiLogs.length < 2) return null;
    const sevenDaysAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');
    const weekAgoLog = [...kpiLogs].reverse().find((l) => l.date <= sevenDaysAgo);
    if (!weekAgoLog || !latestLog) return null;
    return parseFloat((latestLog.weight_kg - weekAgoLog.weight_kg).toFixed(1));
  }, [kpiLogs, latestLog]);

  const gymStreak   = useMemo(() => calcStreak(kpiLogs, 'gym_checkin'),  [kpiLogs]);
  const waterStreak = useMemo(() => calcStreak(kpiLogs, 'water_liters'), [kpiLogs]);

  const progress = useMemo(() => {
    if (!myGoal || !currentWeight) return 0;
    return goalProgress(currentWeight, myGoal.start_weight_kg, myGoal.target_weight_kg);
  }, [myGoal, currentWeight]);

  const eta = useMemo(() => {
    if (!myGoal) return null;
    return projectGoalDate(kpiLogs, myGoal.target_weight_kg);
  }, [kpiLogs, myGoal]);

  const weeklySummary = useMemo(() => getWeeklySummary(focusedLogs), [focusedLogs]);

  // Scatter data: weight vs gym (advanced only) — use focused user's data
  const scatterData = useMemo(() => {
    if (!isAdvanced) return [];
    return kpiLogs.map((l) => ({
      gym: l.gym_checkin ? 1 : 0,
      weight: l.weight_kg,
      date: l.date,
    }));
  }, [kpiLogs, isAdvanced]);

  // Chart lines — respect focus filter
  const hungLogs = useMemo(
    () => focusUser === 'Nga' ? [] : filterLogsByRange(hungAllLogs, range),
    [hungAllLogs, range, focusUser],
  );
  const ngaLogs = useMemo(
    () => focusUser === 'Hung' ? [] : filterLogsByRange(ngaAllLogs, range),
    [ngaAllLogs, range, focusUser],
  );

  const handleDayClick = (date: string, user: UserName) => {
    const log = allLogs.find((l) => l.date === date && l.user_name === user)
      ?? allLogs.find((l) => l.date === date);
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
            {t('dash.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">{t('dash.title')}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          {/* User focus filter */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm font-medium">
            {(['Hung', 'Nga', 'Both'] as const).map((u) => (
              <button
                key={u}
                onClick={() => setFocusUser(u)}
                className={`px-3 py-1.5 transition-colors duration-150 cursor-pointer ${
                  focusUser === u
                    ? u === 'Hung'
                      ? 'bg-indigo-600 text-white'
                      : u === 'Nga'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-700 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
          <ViewToggle value={view} onChange={handleViewChange} />
          {isAdvanced && (
            <DateRangePicker value={range} onChange={setRange} />
          )}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <KPICard
          label={`${focusLabel}'s ${t('dash.weight')}`}
          value={currentWeight !== null ? currentWeight.toFixed(1) : '—'}
          unit="kg"
          icon={Scale}
          delta={isAdvanced ? (weeklyDelta ?? undefined) : undefined}
        />
        <KPICard
          label={t('dash.goalProgress')}
          value={myGoal ? `${progress.toFixed(0)}%` : '—'}
          icon={Target}
          variant={progress >= 100 ? 'success' : 'default'}
        />
        <KPICard
          label={t('dash.gymStreak')}
          value={gymStreak}
          unit={t('dash.days')}
          icon={Dumbbell}
          variant={gymStreak >= 5 ? 'success' : 'default'}
        />
        {isAdvanced ? (
          <KPICard
            label={t('dash.waterStreak')}
            value={waterStreak}
            unit={t('dash.days')}
            icon={Droplets}
            variant={waterStreak >= 3 ? 'success' : 'default'}
          />
        ) : (
          <KPICard
            label={t('dash.weeklyChange')}
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

      {/* Goal Rings — respect focus filter */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('dash.goalSection')}</h3>
        <div className="flex items-center justify-center gap-10 flex-wrap">
          {(focusUser === 'Hung' || focusUser === 'Both') && hungGoal && (() => {
            const hungLatest = hungAllLogs.length > 0 ? hungAllLogs[hungAllLogs.length - 1] : null;
            return hungLatest && (
              <GoalRing
                userName="Hung"
                currentKg={hungLatest.weight_kg}
                startKg={hungGoal.start_weight_kg}
                targetKg={hungGoal.target_weight_kg}
                size="lg"
              />
            );
          })()}
          {(focusUser === 'Nga' || focusUser === 'Both') && ngaGoal && (() => {
            const ngaLatest = ngaAllLogs.length > 0 ? ngaAllLogs[ngaAllLogs.length - 1] : null;
            return ngaLatest && (
              <GoalRing
                userName="Nga"
                currentKg={ngaLatest.weight_kg}
                startKg={ngaGoal.start_weight_kg}
                targetKg={ngaGoal.target_weight_kg}
                size="lg"
              />
            );
          })()}
          {/* Fallback if no goals */}
          {!hungGoal && !ngaGoal && myGoal && currentWeight !== null && (
            <GoalRing
              userName={focusLabel as UserName}
              currentKg={currentWeight}
              startKg={myGoal.start_weight_kg}
              targetKg={myGoal.target_weight_kg}
              size="lg"
            />
          )}
        </div>

        {/* ETA */}
        {isAdvanced && (
          <div className="mt-4 text-center">
            {progress >= 100 ? (
              <p className="text-green-600 font-semibold">{t('dash.goalReached')}</p>
            ) : eta ? (
              <div className="text-sm text-gray-600">
                <span className="font-medium">{t('dash.projectedDate')} </span>
                <span className="text-blue-700 font-semibold">
                  {format(eta, 'MMMM d, yyyy')}
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  {t('dash.regressionNote')}
                </p>
              </div>
            ) : (
              <p className="text-sm text-amber-600 font-medium">
                {t('dash.checkTrend')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Simple view: weekly summary as plain numbers */}
      {!isAdvanced && weeklySummary && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {weeklySummary.label === 'this-week' ? t('dash.thisWeek') : t('dash.lastWeek')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{weeklySummary.gymDays}</p>
              <p className="text-sm text-gray-500">{t('dash.gymDays')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{weeklySummary.avgWater}L</p>
              <p className="text-sm text-gray-500">{t('dash.avgWater')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{weeklySummary.cheatMeals}</p>
              <p className="text-sm text-gray-500">{t('dash.cheatMeals')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{weeklySummary.avgSleep}</p>
              <p className="text-sm text-gray-500">{t('dash.avgSleep')}</p>
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
          hungGoal={hungGoal?.target_weight_kg ?? 80.0}
          ngaGoal={ngaGoal?.target_weight_kg ?? 55.2}
          range={range}
          showAdvanced={isAdvanced}
          onDayClick={handleDayClick}
        />
      </div>

      {/* Advanced-only sections */}
      {isAdvanced && (
        <>
          {/* Habit Heatmap */}
          <HabitHeatmap logs={focusedLogs} days={30} />

          {/* Weekly Summary Bar (week-over-week comparison) */}
          <WeeklySummaryBar logs={focusedLogs} weeksToShow={4} />

          {/* Scatter plot: Weight vs Gym Check-in Correlation */}
          {scatterData.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('dash.scatter')}
              </h3>
              <p className="text-xs text-gray-400 mb-3">
                {t('dash.scatterSub')}
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
                        fill={focusUser === 'Nga' ? '#10b981' : '#6366f1'}
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
              {t('dash.etaTitle')}
            </h3>
            {progress >= 100 ? (
              <div className="text-center py-4">
                <p className="text-2xl font-bold text-green-600">{t('dash.goalReached')}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {t('dash.congrats')} {focusLabel}! 🎉
                </p>
              </div>
            ) : eta ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('dash.targetWeight')}</span>
                  <span className="font-medium text-gray-900">
                    {myGoal?.target_weight_kg.toFixed(1)} kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('dash.currentWeight')}</span>
                  <span className="font-medium text-gray-900">
                    {currentWeight?.toFixed(1)} kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('dash.remaining')}</span>
                  <span className="font-medium text-gray-900">
                    {myGoal && currentWeight
                      ? (currentWeight - myGoal.target_weight_kg).toFixed(1)
                      : '—'}{' '}
                    kg
                  </span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('dash.projectedDateLabel')}</span>
                  <span className="font-semibold text-blue-700">
                    {format(eta, 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="text-xs text-gray-400 pt-1">
                  {t('dash.regressionSub')}
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-amber-600 font-medium">{t('dash.notOnTrack')}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {t('dash.notEnoughData')}
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
