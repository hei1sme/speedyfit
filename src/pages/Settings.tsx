// src/pages/Settings.tsx
import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Target, Droplets, Moon, Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';

import { useGoals } from '../hooks/useGoals';
import { useAuth } from '../hooks/useAuth';
import { useLang } from '../contexts/LangContext';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getUserNameFromSession } from '../lib/userIdentity';

interface GoalForm {
  target_weight_kg: string;
  start_weight_kg: string;
  goal_type: 'cut' | 'maintain' | 'bulk';
  water_target_l: string;
  sleep_target: string;
  gym_target_week: string;
}

export default function Settings() {
  const { session } = useAuth();
  const { t } = useLang();
  const { goals, loading, updateGoal } = useGoals();
  const myName = getUserNameFromSession(session);

  const myGoal = goals.find((g) => g.user_name === myName);

  const [form, setForm] = useState<GoalForm>({
    target_weight_kg: '',
    start_weight_kg: '',
    goal_type: 'cut',
    water_target_l: '2.0',
    sleep_target: '7',
    gym_target_week: '5',
  });
  const [saving, setSaving] = useState(false);

  // Populate form when goal loads
  useEffect(() => {
    if (myGoal) {
      setForm({
        target_weight_kg: myGoal.target_weight_kg.toString(),
        start_weight_kg: myGoal.start_weight_kg.toString(),
        goal_type: myGoal.goal_type,
        water_target_l: myGoal.water_target_l.toString(),
        sleep_target: myGoal.sleep_target.toString(),
        gym_target_week: myGoal.gym_target_week.toString(),
      });
    }
  }, [myGoal]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myGoal) return;

    setSaving(true);
    const ok = await updateGoal(myGoal.id, {
      target_weight_kg: parseFloat(form.target_weight_kg),
      start_weight_kg: parseFloat(form.start_weight_kg),
      goal_type: form.goal_type,
      water_target_l: parseFloat(form.water_target_l),
      sleep_target: parseInt(form.sleep_target, 10),
      gym_target_week: parseInt(form.gym_target_week, 10),
    });
    setSaving(false);

    if (ok) {
      toast.success(t('settings.saved'));
    } else {
      toast.error(t('settings.errSave'));
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 space-y-6">
        <LoadingSkeleton variant="card" count={2} />
      </div>
    );
  }

  if (!myGoal) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        <div className="glass rounded-2xl border border-amber-200/50 p-6 text-center">
          <p className="text-amber-700 font-medium">{t('settings.noGoal')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <SettingsIcon size={24} className="text-gray-400" />
        <h1 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Goal Settings */}
        <div className="rounded-2xl glass p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Target size={18} className="text-indigo-500" />
            <h2 className="text-lg font-semibold text-gray-900">{t('settings.goalSettings')}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.startWeight')}
              </label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="200"
                value={form.start_weight_kg}
                onChange={(e) => setForm({ ...form, start_weight_kg: e.target.value })}
                className="w-full min-h-11 px-3 py-2 rounded-xl text-sm glass-input focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Target Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.targetWeight')}
              </label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="200"
                value={form.target_weight_kg}
                onChange={(e) => setForm({ ...form, target_weight_kg: e.target.value })}
                className="w-full min-h-11 px-3 py-2 rounded-xl text-sm glass-input focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Goal Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('settings.goalType')}
            </label>
            <div className="flex gap-2">
              {(['cut', 'maintain', 'bulk'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, goal_type: type })}
                  className={`flex-1 min-h-10 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer border ${
                    form.goal_type === type
                      ? type === 'cut'
                        ? 'bg-red-600 text-white border-transparent'
                        : type === 'maintain'
                        ? 'bg-blue-600 text-white border-transparent'
                        : 'bg-green-600 text-white border-transparent'
                      : 'glass text-gray-700 border-white/30 hover:border-gray-400'
                  }`}
                >
                  {t(`settings.goal${type.charAt(0).toUpperCase() + type.slice(1)}` as any)}
                </button>
              ))}
            </div>
          </div>

          {/* Start Date (read-only info) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('settings.startDate')}
            </label>
            <p className="text-sm text-gray-500 glass-subtle px-3 py-2 rounded-xl">
              {myGoal.start_date}
            </p>
          </div>
        </div>

        {/* Daily Targets */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('settings.dailyTargets')}</h2>

          {/* Water Target */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Droplets size={16} className="text-cyan-500" />
              <label className="text-sm font-medium text-gray-700">
                {t('settings.waterTarget')}
              </label>
            </div>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="10"
              value={form.water_target_l}
              onChange={(e) => setForm({ ...form, water_target_l: e.target.value })}
              className="w-full min-h-11 px-3 py-2 rounded-xl text-sm glass-input focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Sleep Target */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Moon size={16} className="text-violet-500" />
              <label className="text-sm font-medium text-gray-700">
                {t('settings.sleepTarget')}
              </label>
            </div>
            <input
              type="number"
              step="1"
              min="1"
              max="10"
              value={form.sleep_target}
              onChange={(e) => setForm({ ...form, sleep_target: e.target.value })}
              className="w-full min-h-11 px-3 py-2 rounded-xl text-sm glass-input focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Gym Target */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Dumbbell size={16} className="text-indigo-500" />
              <label className="text-sm font-medium text-gray-700">
                {t('settings.gymTarget')}
              </label>
            </div>
            <input
              type="number"
              step="1"
              min="1"
              max="7"
              value={form.gym_target_week}
              onChange={(e) => setForm({ ...form, gym_target_week: e.target.value })}
              className="w-full min-h-11 px-3 py-2 rounded-xl text-sm glass-input focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full min-h-12 glass-btn-primary rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {saving ? t('settings.saving') : t('settings.save')}
        </button>
      </form>
    </div>
  );
}
