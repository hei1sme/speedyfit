// src/pages/Rulebook.tsx
import { useMemo } from 'react';
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
import type { LucideIcon } from 'lucide-react';

import { useLang } from '../contexts/LangContext';

const RULE_COLORS = [
  'text-blue-700 bg-blue-50/50',
  'text-indigo-600 bg-indigo-50/50',
  'text-cyan-600 bg-cyan-50/50',
  'text-purple-600 bg-purple-50/50',
  'text-amber-600 bg-amber-50/50',
  'text-green-600 bg-green-50/50',
] as const;

const RULE_ICONS: LucideIcon[] = [Scale, Dumbbell, Droplets, Moon, UtensilsCrossed, TrendingDown];

const GOALS_META = [
  { name: 'Hưng', start: '95.4 kg', target: '80.0 kg', type: 'Cut', color: 'border-indigo-500 glass bg-indigo-50/20', textColor: 'text-indigo-700' },
  { name: 'Nga',  start: '60.2 kg', target: '55.2 kg', type: 'Cut', color: 'border-emerald-500 glass bg-emerald-50/20', textColor: 'text-emerald-700' },
];

export default function Rulebook() {
  const { t } = useLang();

  const rules = useMemo(() => [
    { icon: RULE_ICONS[0], title: t('rule.r1Title'), description: t('rule.r1Desc'), color: RULE_COLORS[0] },
    { icon: RULE_ICONS[1], title: t('rule.r2Title'), description: t('rule.r2Desc'), color: RULE_COLORS[1] },
    { icon: RULE_ICONS[2], title: t('rule.r3Title'), description: t('rule.r3Desc'), color: RULE_COLORS[2] },
    { icon: RULE_ICONS[3], title: t('rule.r4Title'), description: t('rule.r4Desc'), color: RULE_COLORS[3] },
    { icon: RULE_ICONS[4], title: t('rule.r5Title'), description: t('rule.r5Desc'), color: RULE_COLORS[4] },
    { icon: RULE_ICONS[5], title: t('rule.r6Title'), description: t('rule.r6Desc'), color: RULE_COLORS[5] },
  ], [t]);

  const tips = useMemo(() => [
    t('rule.tip1'), t('rule.tip2'), t('rule.tip3'),
    t('rule.tip4'), t('rule.tip5'), t('rule.tip6'),
  ], [t]);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={24} className="text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900">{t('rule.title')}</h1>
      </div>

      {/* Goals overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('rule.ourGoals')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GOALS_META.map((g) => (
            <div key={g.name} className={`rounded-lg border-l-4 p-5 ${g.color}`}>
              <h3 className={`text-lg font-bold ${g.textColor}`}>{g.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Target size={14} className="text-gray-400" />
                  <span>
                    <span className="font-medium">{g.start}</span> →{' '}
                    <span className="font-medium">{g.target}</span>
                  </span>
                </div>
                <p className="text-xs text-gray-500">{t('rule.goalType')} {g.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('rule.dailyRules')}</h2>
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.title}
              className="rounded-2xl glass glass-hover p-4 md:p-5 flex items-start gap-4"
            >
              <div className={`shrink-0 p-2.5 rounded-lg ${rule.color}`}>
                <rule.icon size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">{rule.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{rule.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 glass-subtle rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('rule.quickTips')}</h2>
        <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
          {tips.map((tip, i) => <li key={i}>{tip}</li>)}
        </ul>
      </div>
    </div>
  );
}
