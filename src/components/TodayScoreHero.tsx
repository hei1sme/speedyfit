import { Activity, ArrowRight } from 'lucide-react';

interface TodayScoreHeroProps {
  title: string;
  score: number;
  statusLabel: string;
  summary: string;
  onQuickLog: () => void;
  ctaLabel: string;
}

export default function TodayScoreHero({ title, score, statusLabel, summary, onQuickLog, ctaLabel }: TodayScoreHeroProps) {
  const tone = score >= 75 ? 'good' : score >= 45 ? 'mid' : 'low';
  const toneClass =
    tone === 'good'
      ? 'from-green-100/70 to-emerald-100/70 border-green-200/70'
      : tone === 'mid'
      ? 'from-amber-100/70 to-yellow-100/70 border-amber-200/70'
      : 'from-rose-100/70 to-orange-100/70 border-rose-200/70';

  return (
    <div className={`rounded-2xl glass border bg-gradient-to-br p-4 md:p-5 ${toneClass}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
            <Activity size={14} />
            <span>{title}</span>
          </div>
          <div className="flex items-end gap-2 mt-1">
            <p className="text-4xl font-black text-gray-900 leading-none">{score}</p>
            <p className="text-sm text-gray-500 pb-1">/100</p>
          </div>
          <p className="text-sm font-semibold text-gray-800 mt-2">{statusLabel}</p>
          <p className="text-xs text-gray-600 mt-1">{summary}</p>
        </div>

        <button
          onClick={onQuickLog}
          className="inline-flex items-center gap-1.5 glass-btn-primary px-3 py-2 rounded-xl text-sm font-semibold cursor-pointer"
        >
          {ctaLabel}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
