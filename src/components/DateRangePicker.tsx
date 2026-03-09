// src/components/DateRangePicker.tsx

type DateRange = '7D' | '30D' | '90D' | 'All';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const options: DateRange[] = ['7D', '30D', '90D', 'All'];

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer ${
            value === opt
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
