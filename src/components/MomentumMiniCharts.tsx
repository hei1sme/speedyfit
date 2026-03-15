import { ResponsiveContainer, AreaChart, Area } from 'recharts';

interface MomentumPoint {
  date: string;
  weight?: number;
  water?: number;
  sleep?: number;
  energy?: number;
}

interface MomentumMiniChartsProps {
  title: string;
  data: MomentumPoint[];
  labels: {
    weight: string;
    water: string;
    sleep: string;
    energy: string;
  };
}

export default function MomentumMiniCharts({ title, data, labels }: MomentumMiniChartsProps) {
  const charts = [
    { key: 'weight', label: labels.weight, color: '#6366f1' },
    { key: 'water', label: labels.water, color: '#06b6d4' },
    { key: 'sleep', label: labels.sleep, color: '#8b5cf6' },
    { key: 'energy', label: labels.energy, color: '#f59e0b' },
  ] as const;

  return (
    <div className="rounded-2xl glass border border-white/40 p-4 md:p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {charts.map((chart) => (
          <div key={chart.key} className="rounded-xl border border-white/40 bg-white/40 p-2.5">
            <p className="text-xs font-medium text-gray-600 mb-1.5">{chart.label}</p>
            <div className="h-14">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <Area
                    type="monotone"
                    dataKey={chart.key}
                    stroke={chart.color}
                    strokeWidth={2}
                    fill={chart.color}
                    fillOpacity={0.12}
                    dot={false}
                    connectNulls
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
