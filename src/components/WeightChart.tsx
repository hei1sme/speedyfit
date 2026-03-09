// src/components/WeightChart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { MessageSquare } from 'lucide-react';

import type { DailyLog, UserName } from '../types/database';

export interface WeightChartProps {
  hungLogs: DailyLog[];
  ngaLogs: DailyLog[];
  hungGoal: number;       // 80.0
  ngaGoal: number;        // 55.2
  range: '7D' | '30D' | '90D' | 'All';
  showAdvanced?: boolean; // show MA curve + goal line
  onDayClick?: (date: string, user: UserName) => void;
}

interface ChartPoint {
  date: string;
  hungWeight: number | null;
  ngaWeight: number | null;
  hungMA: number | null;
  ngaMA: number | null;
  hungNote: string | null;
  ngaNote: string | null;
}

const MA_WINDOWS: Record<string, number> = {
  '7D': 3,
  '30D': 7,
  '90D': 14,
  'All': 21,
};

function computeMA(logs: DailyLog[], windowDays: number): Map<string, number | null> {
  const result = new Map<string, number | null>();
  logs.forEach((log, i) => {
    const window = logs.slice(Math.max(0, i - windowDays + 1), i + 1);
    if (window.length < 3) {
      result.set(log.date, null);
    } else {
      const avg = window.reduce((s, l) => s + l.weight_kg, 0) / window.length;
      result.set(log.date, parseFloat(avg.toFixed(2)));
    }
  });
  return result;
}

function formatXTick(dateStr: string, range: string): string {
  try {
    const d = parseISO(dateStr);
    if (range === '7D') return format(d, 'EEE');       // Mon, Tue…
    if (range === '30D') return format(d, 'MMM d');     // Mar 5
    if (range === '90D') return format(d, 'MMM d');     // Mar 5
    return format(d, 'MMM yyyy');                       // Mar 2026
  } catch {
    return dateStr;
  }
}

function getTickInterval(range: string, totalPoints: number): number {
  if (range === '7D') return 0;                        // every day
  if (range === '30D') return Math.max(1, Math.floor(totalPoints / 6));
  if (range === '90D') return Math.max(1, Math.floor(totalPoints / 12));
  return Math.max(1, Math.floor(totalPoints / 10));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function CustomTooltip({
  active,
  payload,
  label,
}: any) {
  if (!active || !payload || !payload.length) return null;

  const dateLabel = (() => {
    try {
      return format(parseISO(label), 'EEEE, MMM d, yyyy');
    } catch {
      return label;
    }
  })();

  const point = payload[0]?.payload as ChartPoint | undefined;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm max-w-xs">
      <p className="font-semibold text-gray-900 mb-1.5">{dateLabel}</p>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-medium text-gray-900">
            {entry.value != null ? `${entry.value} kg` : '—'}
          </span>
        </div>
      ))}
      {point?.hungNote && (
        <div className="mt-2 flex items-start gap-1.5 text-indigo-600">
          <MessageSquare size={12} className="mt-0.5 shrink-0" />
          <span className="text-xs">Hung: {point.hungNote}</span>
        </div>
      )}
      {point?.ngaNote && (
        <div className="mt-1 flex items-start gap-1.5 text-emerald-600">
          <MessageSquare size={12} className="mt-0.5 shrink-0" />
          <span className="text-xs">Nga: {point.ngaNote}</span>
        </div>
      )}
    </div>
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function WeightChart({
  hungLogs,
  ngaLogs,
  hungGoal,
  ngaGoal,
  range,
  showAdvanced = false,
  onDayClick,
}: WeightChartProps) {
  // Build merged dataset by date
  const allDates = new Set<string>();
  hungLogs.forEach((l) => allDates.add(l.date));
  ngaLogs.forEach((l) => allDates.add(l.date));

  const sortedDates = Array.from(allDates).sort();

  if (sortedDates.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500 mb-3">No weight data yet.</p>
        <a
          href="/log"
          className="inline-block bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors duration-200 cursor-pointer"
        >
          Log your first weigh-in
        </a>
      </div>
    );
  }

  const maWindow = MA_WINDOWS[range];
  const hungMAMap = computeMA(hungLogs, maWindow);
  const ngaMAMap = computeMA(ngaLogs, maWindow);

  const hungByDate = new Map(hungLogs.map((l) => [l.date, l]));
  const ngaByDate = new Map(ngaLogs.map((l) => [l.date, l]));

  const data: ChartPoint[] = sortedDates.map((date) => ({
    date,
    hungWeight: hungByDate.get(date)?.weight_kg ?? null,
    ngaWeight: ngaByDate.get(date)?.weight_kg ?? null,
    hungMA: hungMAMap.get(date) ?? null,
    ngaMA: ngaMAMap.get(date) ?? null,
    hungNote: hungByDate.get(date)?.notes ?? null,
    ngaNote: ngaByDate.get(date)?.notes ?? null,
  }));

  const tickInterval = getTickInterval(range, data.length);

  // Compute Y-axis domain with padding
  const allWeights = data
    .flatMap((d) => [d.hungWeight, d.ngaWeight])
    .filter((v): v is number => v !== null);
  const goals = [hungGoal, ngaGoal];
  const allValues = [...allWeights, ...(showAdvanced ? goals : [])];
  const yMin = Math.floor(Math.min(...allValues) - 2);
  const yMax = Math.ceil(Math.max(...allValues) + 2);

  const handleClick = (point: ChartPoint, user: UserName) => {
    if (onDayClick) onDayClick(point.date, user);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Weight Trend</h3>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[500px]">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={data}
              onClick={(e) => {
                if (e?.activePayload?.[0]?.payload) {
                  const pt = e.activePayload[0].payload as ChartPoint;
                  // Determine which user based on which data exists
                  if (pt.hungWeight !== null) handleClick(pt, 'Hung');
                  else if (pt.ngaWeight !== null) handleClick(pt, 'Nga');
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => formatXTick(v, range)}
                interval={tickInterval}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                stroke="#d1d5db"
              />
              <YAxis
                domain={[yMin, yMax]}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                stroke="#d1d5db"
                tickFormatter={(v) => `${v}`}
                width={45}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '13px', paddingTop: '8px' }}
              />

              {/* Hung's weight line */}
              <Line
                type="monotone"
                dataKey="hungWeight"
                name="Hung"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 3, fill: '#6366f1' }}
                activeDot={{ r: 5, cursor: 'pointer' }}
                connectNulls
              />

              {/* Nga's weight line */}
              <Line
                type="monotone"
                dataKey="ngaWeight"
                name="Nga"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3, fill: '#10b981' }}
                activeDot={{ r: 5, cursor: 'pointer' }}
                connectNulls
              />

              {/* Advanced: MA curves */}
              {showAdvanced && (
                <Line
                  type="monotone"
                  dataKey="hungMA"
                  name="Hung MA"
                  stroke="#6366f1"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                  connectNulls
                />
              )}
              {showAdvanced && (
                <Line
                  type="monotone"
                  dataKey="ngaMA"
                  name="Nga MA"
                  stroke="#10b981"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                  connectNulls
                />
              )}

              {/* Advanced: Goal reference lines */}
              {showAdvanced && (
                <ReferenceLine
                  y={hungGoal}
                  stroke="#fbbf24"
                  strokeDasharray="8 4"
                  label={{
                    value: `Hung goal: ${hungGoal}`,
                    position: 'right',
                    fill: '#f59e0b',
                    fontSize: 11,
                  }}
                />
              )}
              {showAdvanced && (
                <ReferenceLine
                  y={ngaGoal}
                  stroke="#fbbf24"
                  strokeDasharray="8 4"
                  label={{
                    value: `Nga goal: ${ngaGoal}`,
                    position: 'right',
                    fill: '#f59e0b',
                    fontSize: 11,
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
