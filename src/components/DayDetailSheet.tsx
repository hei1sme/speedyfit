import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { X, Dumbbell, Droplets, Moon, UtensilsCrossed, StickyNote, Scale, Trash2, Zap, Ruler } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { DailyLog } from '../types/database';
import { useLang } from '../contexts/LangContext';

export interface DayDetailSheetProps {
  log: DailyLog | null;   // null = closed
  onClose: () => void;
  onDelete?: (id: string) => Promise<void>;
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

export default function DayDetailSheet({ log, onClose, onDelete }: DayDetailSheetProps) {
  const { t } = useLang();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!log) return null;

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    await onDelete(log.id);
    setDeleting(false);
    setConfirmDelete(false);
    onClose();
  };

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
            label={t('detail.weight')}
            value={`${log.weight_kg.toFixed(1)} kg`}
          />
          <DetailRow
            icon={Dumbbell}
            label={t('detail.gym')}
            value={log.gym_checkin ? t('detail.gymYes') : t('detail.gymNo')}
            color={log.gym_checkin ? 'text-green-600' : 'text-gray-400'}
          />
          <DetailRow
            icon={Droplets}
            label={t('detail.water')}
            value={`${log.water_liters.toFixed(1)} L`}
            color={log.water_liters >= 2.0 ? 'text-green-600' : 'text-gray-900'}
          />
          <DetailRow
            icon={UtensilsCrossed}
            label={t('detail.cheat')}
            value={log.cheat_meal ? t('detail.cheatYes') : t('detail.cheatNo')}
            color={log.cheat_meal ? 'text-amber-600' : 'text-gray-400'}
          />
          <DetailRow
            icon={Moon}
            label={t('detail.sleep')}
            value={`${log.sleep_score} / 10`}
            color={
              log.sleep_score >= 7
                ? 'text-green-600'
                : log.sleep_score >= 5
                  ? 'text-yellow-600'
                  : 'text-red-600'
            }
          />
          {log.energy_level != null && (
            <DetailRow
              icon={Zap}
              label={t('detail.energy')}
              value={`${log.energy_level} / 10`}
              color={
                log.energy_level >= 7
                  ? 'text-green-600'
                  : log.energy_level >= 5
                    ? 'text-yellow-600'
                    : 'text-red-600'
              }
            />
          )}

          {/* Body measurements (show section only if any present) */}
          {(log.waist_cm != null || log.belly_cm != null || log.hip_cm != null || log.thigh_cm != null) && (
            <div className="mt-4 mb-2">
              <div className="flex items-center gap-1.5 mb-2">
                <Ruler size={14} className="text-gray-400" />
                <span className="text-xs text-gray-500 font-medium">{t('detail.bodyMeasure')}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {log.waist_cm != null && (
                  <div className="bg-purple-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500">{t('detail.waist')}</p>
                    <p className="text-sm font-semibold text-purple-700">{log.waist_cm} cm</p>
                  </div>
                )}
                {log.belly_cm != null && (
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500">{t('detail.belly')}</p>
                    <p className="text-sm font-semibold text-gray-800">{log.belly_cm} cm</p>
                  </div>
                )}
                {log.hip_cm != null && (
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500">{t('detail.hip')}</p>
                    <p className="text-sm font-semibold text-gray-800">{log.hip_cm} cm</p>
                  </div>
                )}
                {log.thigh_cm != null && (
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500">{t('detail.thigh')}</p>
                    <p className="text-sm font-semibold text-gray-800">{log.thigh_cm} cm</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {log.notes && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1.5">
                <StickyNote size={14} className="text-gray-400" />
                <span className="text-xs text-gray-500 font-medium">{t('detail.notes')}</span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{log.notes}</p>
            </div>
          )}
        </div>

        {/* Footer with delete */}
        {onDelete && (
          <div className="px-5 py-4 border-t border-gray-100">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className={`w-full min-h-10 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer flex items-center justify-center gap-2 ${
                confirmDelete
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-white border border-red-300 text-red-600 hover:bg-red-50'
              } disabled:opacity-50`}
            >
              <Trash2 size={15} />
              {deleting ? t('detail.deleting') : confirmDelete ? t('detail.deleteConfirm') : t('detail.delete')}
            </button>
            {confirmDelete && (
              <button
                onClick={() => setConfirmDelete(false)}
                className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {t('detail.cancel')}
              </button>
            )}
          </div>
        )}
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
