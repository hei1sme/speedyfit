// src/components/ViewToggle.tsx
import { BarChart3, Sparkles } from 'lucide-react';

export interface ViewToggleProps {
  value: 'simple' | 'advanced';
  onChange: (v: 'simple' | 'advanced') => void;
}

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
      <button
        onClick={() => onChange('simple')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer ${
          value === 'simple'
            ? 'bg-white text-blue-700 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Sparkles size={14} />
        Simple
      </button>
      <button
        onClick={() => onChange('advanced')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer ${
          value === 'advanced'
            ? 'bg-white text-blue-700 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <BarChart3 size={14} />
        Advanced
      </button>
    </div>
  );
}
