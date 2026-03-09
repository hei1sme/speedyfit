// src/components/KPICard.tsx
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;        // positive = green arrow up, negative = red arrow down
  icon?: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  loading?: boolean;
}

const variantStyles: Record<string, string> = {
  default: 'bg-white border-gray-200',
  success: 'bg-green-50 border-green-200',
  warning: 'bg-amber-50 border-amber-200',
  danger: 'bg-red-50 border-red-200',
};

export default function KPICard({
  label,
  value,
  unit,
  delta,
  icon: Icon,
  variant = 'default',
  loading = false,
}: KPICardProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 md:p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-8 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border p-4 md:p-6 ${variantStyles[variant]}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-500">{label}</span>
        {Icon && <Icon size={18} className="text-gray-400" />}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {unit && <span className="text-xs text-gray-400">{unit}</span>}
      </div>

      {delta !== undefined && delta !== 0 && (
        <div
          className={`flex items-center gap-0.5 mt-1.5 text-sm font-medium ${
            delta > 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {delta > 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          <span>{Math.abs(delta).toFixed(1)}</span>
        </div>
      )}
    </div>
  );
}
