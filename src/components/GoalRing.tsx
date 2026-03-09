// src/components/GoalRing.tsx
import type { UserName } from '../types/database';

export interface GoalRingProps {
  userName: UserName;
  currentKg: number;
  startKg: number;
  targetKg: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { container: 'w-24 h-24', radius: 38, stroke: 6, text: 'text-lg', label: 'text-xs' },
  md: { container: 'w-32 h-32', radius: 52, stroke: 7, text: 'text-2xl', label: 'text-xs' },
  lg: { container: 'w-40 h-40', radius: 64, stroke: 8, text: 'text-3xl', label: 'text-sm' },
};

const userColor: Record<UserName, string> = {
  Hung: '#6366f1', // indigo-500
  Nga: '#10b981',  // emerald-500
};

function goalProgress(currentKg: number, startKg: number, targetKg: number): number {
  const totalToLose = startKg - targetKg;
  const lost = startKg - currentKg;
  if (totalToLose <= 0) return 0;
  return Math.min(100, Math.max(0, parseFloat(((lost / totalToLose) * 100).toFixed(1))));
}

export default function GoalRing({
  userName,
  currentKg,
  startKg,
  targetKg,
  size = 'md',
}: GoalRingProps) {
  const progress = goalProgress(currentKg, startKg, targetKg);
  const { container, radius, stroke, text, label } = sizeMap[size];
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const color = userColor[userName];
  const center = radius + stroke;
  const viewBox = `0 0 ${center * 2} ${center * 2}`;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`relative ${container}`}>
        <svg viewBox={viewBox} className="w-full h-full -rotate-90">
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={stroke}
          />
          {/* Progress arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${text} font-bold text-gray-900`}>
            {progress >= 100 ? '100' : progress.toFixed(0)}%
          </span>
        </div>
      </div>
      <span className={`${label} text-gray-500 font-medium`}>{userName}</span>
      <span className="text-xs text-gray-400">
        {currentKg.toFixed(1)} → {targetKg.toFixed(1)} kg
      </span>
    </div>
  );
}
