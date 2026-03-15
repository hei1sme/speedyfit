import { eachDayOfInterval, endOfDay, format, startOfDay, subDays } from 'date-fns';
import type { DailyLog } from '../types/database';

interface WeeklyComplianceGridProps {
  title: string;
  logs: DailyLog[];
  waterTarget: number;
  sleepTarget: number;
}

function scoreDay(log: DailyLog | undefined, waterTarget: number, sleepTarget: number) {
  if (!log) return 0;
  let score = 0;
  if (log.gym_checkin) score += 1;
  if ((log.water_liters ?? 0) >= waterTarget) score += 1;
  if ((log.sleep_score ?? 0) >= sleepTarget) score += 1;
  return score;
}

function tone(score: number) {
  if (score === 3) return 'bg-emerald-500/80';
  if (score === 2) return 'bg-lime-400/80';
  if (score === 1) return 'bg-amber-300/80';
  return 'bg-slate-200/70';
}

export default function WeeklyComplianceGrid({ title, logs, waterTarget, sleepTarget }: WeeklyComplianceGridProps) {
  const end = endOfDay(new Date());
  const start = startOfDay(subDays(end, 27));
  const days = eachDayOfInterval({ start, end });

  const byDate = new Map(logs.map((l) => [l.date, l]));

  return (
    <div className="rounded-2xl glass border border-white/40 p-4 md:p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const score = scoreDay(byDate.get(dateKey), waterTarget, sleepTarget);

          return (
            <div
              key={dateKey}
              title={`${format(day, 'MMM d')}: ${score}/3`}
              className={`h-8 rounded-md border border-white/50 ${tone(score)}`}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
        <span>0</span>
        <span className="w-4 h-2 rounded bg-slate-200/70" />
        <span className="w-4 h-2 rounded bg-amber-300/80" />
        <span className="w-4 h-2 rounded bg-lime-400/80" />
        <span className="w-4 h-2 rounded bg-emerald-500/80" />
        <span>3 habits/day</span>
      </div>
    </div>
  );
}
