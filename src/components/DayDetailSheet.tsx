// src/components/DayDetailSheet.tsx
import { format, parseISO } from 'date-fns';
import { X, Dumbbell, Droplets, Moon, UtensilsCrossed, StickyNote, Scale } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { DailyLog } from '../types/database';

export interface DayDetailSheetProps {
  log: DailyLog | null;   // null = closed
  onClose: () => void;
}

function DetailRow({
  icon: Icon,
  label,
  value,
  color = 'text-gray-900',
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0">
      <Icon size={18} className="text-gray-400 shrink-0" />
      <span className="text-sm text-gray-500 w-28 shrink-0">{label}</span>
      <span className={`text-sm font-medium ${color}`}>{value}</span>
    </div>
  );
}

export default function DayDetailSheet({ log, onClose }: DayDetailSheetProps) {
  if (!log) return null;

  const dateLabel = (() => {
    try {
      return format(parseISO(log.date), 'EEEE, MMMM d, yyyy');
    } catch {
      return log.date;
    }
  })();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sheet panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{log.user_name}</h3>
            <p className="text-sm text-gray-500">{dateLabel}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors duration-150 cursor-pointer"
            aria-label="Close detail"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <DetailRow
            icon={Scale}
            label="Weight"
            value={`${log.weight_kg.toFixed(1)} kg`}
          />
          <DetailRow
            icon={Dumbbell}
            label="Gym"
            value={log.gym_checkin ? 'Yes ✓' : 'No'}
            color={log.gym_checkin ? 'text-green-600' : 'text-gray-400'}
          />
          <DetailRow
            icon={Droplets}
            label="Water"
            value={`${log.water_liters.toFixed(1)} L`}
            color={log.water_liters >= 2.0 ? 'text-green-600' : 'text-gray-900'}
          />
          <DetailRow
            icon={UtensilsCrossed}
            label="Cheat Meal"
            value={log.cheat_meal ? 'Yes' : 'No'}
            color={log.cheat_meal ? 'text-amber-600' : 'text-gray-400'}
          />
          <DetailRow
            icon={Moon}
            label="Sleep Score"
            value={`${log.sleep_score} / 10`}
            color={
              log.sleep_score >= 7
                ? 'text-green-600'
                : log.sleep_score >= 5
                  ? 'text-yellow-600'
                  : 'text-red-600'
            }
          />

          {log.notes && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1.5">
                <StickyNote size={14} className="text-gray-400" />
                <span className="text-xs text-gray-500 font-medium">Notes</span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{log.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Slide-in animation */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.25s ease-out;
        }
      `}</style>
    </>
  );
}
