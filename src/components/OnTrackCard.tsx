import { Target } from 'lucide-react';

interface OnTrackCardProps {
  title: string;
  status: 'on-track' | 'mixed' | 'off-track';
  detail: string;
  weeklyDelta: number | null;
  progress: number;
  labels: {
    onTrack: string;
    mixed: string;
    offTrack: string;
    weeklyDelta: string;
    progress: string;
  };
}

export default function OnTrackCard({ title, status, detail, weeklyDelta, progress, labels }: OnTrackCardProps) {
  const statusLabel =
    status === 'on-track' ? labels.onTrack : status === 'mixed' ? labels.mixed : labels.offTrack;

  const toneClass =
    status === 'on-track'
      ? 'border-green-200/60 bg-green-50/40 text-green-700'
      : status === 'mixed'
      ? 'border-amber-200/60 bg-amber-50/40 text-amber-700'
      : 'border-red-200/60 bg-red-50/40 text-red-700';

  return (
    <div className="rounded-2xl glass border border-white/40 p-4 md:p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <Target size={18} className="text-gray-400" />
      </div>

      <div className={`inline-flex mt-2 px-2.5 py-1 rounded-full text-xs font-semibold border ${toneClass}`}>
        {statusLabel}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-500">{labels.weeklyDelta}</p>
          <p className="text-xl font-bold text-gray-900">
            {weeklyDelta === null ? '--' : `${weeklyDelta > 0 ? '+' : ''}${weeklyDelta.toFixed(1)} kg`}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">{labels.progress}</p>
          <p className="text-xl font-bold text-gray-900">{progress.toFixed(0)}%</p>
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-3">{detail}</p>
    </div>
  );
}
