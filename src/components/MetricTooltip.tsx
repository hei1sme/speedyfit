import { useState } from 'react';
import { Info } from 'lucide-react';

interface MetricTooltipProps {
  label: string;
  content: string;
}

export default function MetricTooltip({ label, content }: MetricTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        aria-label={label}
        onClick={() => setOpen((prev) => !prev)}
        onBlur={() => setOpen(false)}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-white/70 transition-colors cursor-pointer"
      >
        <Info size={14} />
      </button>
      {open && (
        <div className="absolute top-7 right-0 z-30 w-56 rounded-xl border border-white/60 bg-white/95 shadow-lg p-2.5 text-xs text-gray-600">
          {content}
        </div>
      )}
    </div>
  );
}
