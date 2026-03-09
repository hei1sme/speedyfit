// src/pages/Rulebook.tsx
import {
  Scale,
  Dumbbell,
  Droplets,
  Moon,
  UtensilsCrossed,
  Target,
  TrendingDown,
  BookOpen,
} from 'lucide-react';

const rules = [
  {
    icon: Scale,
    title: 'Weigh in daily',
    description:
      'Step on the scale every morning, after using the bathroom, before eating. Log your weight in the app immediately.',
    color: 'text-blue-700 bg-blue-50',
  },
  {
    icon: Dumbbell,
    title: 'Hit the gym',
    description:
      'Aim for 5–6 sessions per week. Check in when you arrive — consistency beats intensity.',
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    icon: Droplets,
    title: 'Drink 2L+ of water',
    description:
      'Track your water intake daily. 2 liters is the minimum target. More is better.',
    color: 'text-cyan-600 bg-cyan-50',
  },
  {
    icon: Moon,
    title: 'Rate your sleep',
    description:
      'Score your sleep 1–10 each morning. Aim for 7+ consistently. Sleep is recovery.',
    color: 'text-purple-600 bg-purple-50',
  },
  {
    icon: UtensilsCrossed,
    title: 'Mark cheat meals honestly',
    description:
      'No guilt — just track it. Knowing the pattern helps. Saturdays are typically cheat days.',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    icon: TrendingDown,
    title: 'Trust the moving average',
    description:
      'Daily weight fluctuates. The 7-day moving average shows the real trend. Don\'t panic over a single weigh-in.',
    color: 'text-green-600 bg-green-50',
  },
];

const goals = [
  {
    name: 'Hưng',
    start: '95.4 kg',
    target: '80.0 kg',
    type: 'Cut',
    color: 'border-indigo-500 bg-indigo-50',
    textColor: 'text-indigo-700',
  },
  {
    name: 'Nga',
    start: '60.2 kg',
    target: '55.2 kg',
    type: 'Cut',
    color: 'border-emerald-500 bg-emerald-50',
    textColor: 'text-emerald-700',
  },
];

export default function Rulebook() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={24} className="text-blue-700" />
        <h1 className="text-2xl font-bold text-gray-900">Rulebook</h1>
      </div>

      {/* Goals overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((g) => (
            <div
              key={g.name}
              className={`rounded-lg border-l-4 p-5 ${g.color}`}
            >
              <h3 className={`text-lg font-bold ${g.textColor}`}>{g.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Target size={14} className="text-gray-400" />
                  <span>
                    <span className="font-medium">{g.start}</span> →{' '}
                    <span className="font-medium">{g.target}</span>
                  </span>
                </div>
                <p className="text-xs text-gray-500">Goal type: {g.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Rules</h2>
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.title}
              className="bg-white border border-gray-200 rounded-lg p-4 md:p-5 flex items-start gap-4"
            >
              <div
                className={`shrink-0 p-2.5 rounded-lg ${rule.color}`}
              >
                <rule.icon size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  {rule.title}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {rule.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Tips</h2>
        <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
          <li>Log at the same time every day for consistent data.</li>
          <li>A 0.5–1.0 kg weekly loss is sustainable and healthy.</li>
          <li>Weight can fluctuate 1–2 kg day-to-day — that&apos;s normal.</li>
          <li>If the scale goes up for a few days, check water, sleep, and sodium.</li>
          <li>Use the notes field to track how you feel — it helps spot patterns.</li>
          <li>The gym streak counter rewards consistency, not perfection.</li>
        </ul>
      </div>
    </div>
  );
}
