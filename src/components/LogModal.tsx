// src/components/LogModal.tsx
import { useState, useEffect, useCallback } from 'react';
import { X, ChevronDown, ChevronUp, Sun, Moon } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { useLang } from '../contexts/LangContext';
import type { TranslationKey } from '../lib/i18n';
import type { UserName } from '../types/database';

export interface AppUser {
  id: string;
  name: UserName;
}

interface LogModalProps {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
  users: AppUser[];
  initialDate?: string;
  initialUser?: UserName;
}

interface FormState {
  date: string;
  weight_kg: string;
  gym_checkin: boolean;
  water_liters: string;
  cheat_meal: boolean;
  sleep_score: string;
  energy_level: string;
  waist_cm: string;
  belly_cm: string;
  hip_cm: string;
  thigh_cm: string;
  notes: string;
}

interface FormErrors {
  date?: string;
  weight_kg?: string;
  water_liters?: string;
  sleep_score?: string;
  energy_level?: string;
  waist_cm?: string;
  belly_cm?: string;
  hip_cm?: string;
  thigh_cm?: string;
  notes?: string;
}

const initialForm: FormState = {
  date: format(new Date(), 'yyyy-MM-dd'),
  weight_kg: '',
  gym_checkin: false,
  water_liters: '',
  cheat_meal: false,
  sleep_score: '',
  energy_level: '',
  waist_cm: '',
  belly_cm: '',
  hip_cm: '',
  thigh_cm: '',
  notes: '',
};

function validate(form: FormState, t: (k: TranslationKey) => string): FormErrors {
  const errors: FormErrors = {};

  if (!form.date) {
    errors.date = t('modal.validDateRequired');
  } else if (form.date > format(new Date(), 'yyyy-MM-dd')) {
    errors.date = t('modal.validDateFuture');
  }

  const w = parseFloat(form.weight_kg);
  if (!form.weight_kg) {
    errors.weight_kg = t('modal.validWeightRequired');
  } else if (isNaN(w) || w < 30 || w > 200) {
    errors.weight_kg = t('modal.validWeightRange');
  }

  // Water & sleep are optional (morning-first flow)
  if (form.water_liters) {
    const wl = parseFloat(form.water_liters);
    if (isNaN(wl) || wl < 0 || wl > 10) {
      errors.water_liters = t('modal.validWaterRange');
    }
  }

  if (form.sleep_score) {
    const ss = parseInt(form.sleep_score, 10);
    if (isNaN(ss) || ss < 1 || ss > 10) {
      errors.sleep_score = t('modal.validSleepRange');
    }
  }

  if (form.notes.length > 500) {
    errors.notes = t('modal.validNotesLength');
  }

  if (form.energy_level) {
    const el = parseInt(form.energy_level, 10);
    if (isNaN(el) || el < 1 || el > 10) {
      errors.energy_level = t('modal.validEnergyRange');
    }
  }

  const measureFields = ['waist_cm', 'belly_cm', 'hip_cm', 'thigh_cm'] as const;
  for (const mf of measureFields) {
    if (form[mf]) {
      const v = parseFloat(form[mf]);
      if (isNaN(v) || v < 20 || v > 200) {
        errors[mf] = t('modal.validMeasureRange');
      }
    }
  }

  return errors;
}

export default function LogModal({ open, onClose, onSaved, users, initialDate, initialUser }: LogModalProps) {
  const { session } = useAuth();
  const { t } = useLang();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [measureOpen, setMeasureOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Default to logged-in user
  const myName = (session?.user.user_metadata?.user_name as UserName) ?? 'Hung';
  const [logFor, setLogFor] = useState<UserName>(myName);

  // Fetch existing log for the selected date+user to pre-populate
  const fetchExistingLog = useCallback(async (date: string, userName: UserName) => {
    if (!session) return;
    const targetUser = users.find((u) => u.name === userName);
    const userId = targetUser?.id ?? session.user.id;

    const { data } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('date', date)
      .eq('user_id', userId)
      .maybeSingle();

    if (data) {
      setIsEditing(true);
      setForm({
        date: data.date,
        weight_kg: data.weight_kg?.toString() ?? '',
        gym_checkin: data.gym_checkin ?? false,
        water_liters: data.water_liters?.toString() ?? '',
        cheat_meal: data.cheat_meal ?? false,
        sleep_score: data.sleep_score?.toString() ?? '',
        energy_level: data.energy_level?.toString() ?? '',
        waist_cm: data.waist_cm?.toString() ?? '',
        belly_cm: data.belly_cm?.toString() ?? '',
        hip_cm: data.hip_cm?.toString() ?? '',
        thigh_cm: data.thigh_cm?.toString() ?? '',
        notes: data.notes ?? '',
      });
    } else {
      setIsEditing(false);
    }
  }, [session, users]);

  // Reset form when opening
  useEffect(() => {
    if (open) {
      const startDate = initialDate ?? format(new Date(), 'yyyy-MM-dd');
      const startUser = initialUser ?? myName;
      setForm({ ...initialForm, date: startDate });
      setErrors({});
      setTouched(new Set());
      setLogFor(startUser);
      setIsEditing(false);
      fetchExistingLog(startDate, startUser);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]); // intentionally only re-run when open changes

  // Re-fetch when date or user changes
  const handleDateChange = (newDate: string) => {
    setForm(() => ({ ...initialForm, date: newDate }));
    setErrors({});
    setTouched(new Set());
    setIsEditing(false);
    if (newDate && newDate <= format(new Date(), 'yyyy-MM-dd')) {
      fetchExistingLog(newDate, logFor);
    }
  };

  const handleUserChange = (newUser: UserName) => {
    setLogFor(newUser);
    setForm((p) => ({ ...initialForm, date: p.date }));
    setErrors({});
    setTouched(new Set());
    setIsEditing(false);
    fetchExistingLog(form.date, newUser);
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => new Set(prev).add(field));
    setErrors(validate(form, t));
  };

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    if (touched.has(key)) {
      setErrors(validate(updated, t));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allErrors = validate(form, t);
    setErrors(allErrors);
    setTouched(new Set(Object.keys(form)));

    if (Object.keys(allErrors).length > 0) return;
    if (!session) {
      toast.error(t('modal.errSession'));
      return;
    }

    setSubmitting(true);

    try {
      const targetUser = users.find((u) => u.name === logFor);
      const userId = targetUser?.id ?? session.user.id;

      const payload = {
        date: form.date,
        user_id: userId,
        user_name: logFor,
        weight_kg: parseFloat(parseFloat(form.weight_kg).toFixed(1)),
        gym_checkin: form.gym_checkin,
        water_liters: form.water_liters ? parseFloat(parseFloat(form.water_liters).toFixed(1)) : null,
        cheat_meal: form.cheat_meal,
        sleep_score: form.sleep_score ? parseInt(form.sleep_score, 10) : null,
        energy_level: form.energy_level ? parseInt(form.energy_level, 10) : null,
        waist_cm: form.waist_cm ? parseFloat(parseFloat(form.waist_cm).toFixed(1)) : null,
        belly_cm: form.belly_cm ? parseFloat(parseFloat(form.belly_cm).toFixed(1)) : null,
        hip_cm: form.hip_cm ? parseFloat(parseFloat(form.hip_cm).toFixed(1)) : null,
        thigh_cm: form.thigh_cm ? parseFloat(parseFloat(form.thigh_cm).toFixed(1)) : null,
        notes: form.notes.trim() || null,
      };

      const { error } = await supabase
        .from('daily_logs')
        .upsert(payload, { onConflict: 'date,user_id' });

      if (error) {
        if (error.code === '23514') {
          toast.error(t('modal.errRange'));
        } else if (error.code === '23505') {
          toast(t('modal.alreadyLogged'), { icon: 'ℹ️' });
        } else {
          toast.error(t('modal.errSave'));
        }
        console.error('Upsert error:', error);
      } else {
        toast.success(isEditing ? t('modal.updated') : t('modal.saved'));
        onSaved?.();
        onClose();
      }
    } catch (err) {
      toast.error(t('modal.errGeneric'));
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const fieldError = (field: keyof FormErrors) =>
    touched.has(field) && errors[field] ? errors[field] : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="glass-strong rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/20">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{t('modal.title')}</h2>
              {isEditing && (
                <p className="text-xs text-amber-600 font-medium mt-0.5">
                  ✏️ {t('modal.editingExisting')}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/30 text-gray-500 transition-colors duration-150 cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
            {/* Log for user picker */}
            {users.length >= 2 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('modal.logFor')}
                </label>
                <div className="flex gap-2">
                  {users.map((u) => (
                    <button
                      key={u.name}
                      type="button"
                      onClick={() => handleUserChange(u.name)}
                      className={`flex-1 min-h-10 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer border ${
                        logFor === u.name
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-md'
                          : 'glass text-gray-700 border-white/30 hover:border-indigo-300/50'
                      }`}
                    >
                      {u.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('modal.date')}
              </label>
              <input
                type="date"
                value={form.date}
                max={format(new Date(), 'yyyy-MM-dd')}
                onChange={(e) => handleDateChange(e.target.value)}
                onBlur={() => handleBlur('date')}
                className={`w-full min-h-12 px-3 py-2 rounded-xl text-sm glass-input focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  fieldError('date') ? 'border-red-400' : ''
                }`}
              />
              {fieldError('date') && (
                <p className="text-xs text-red-600 mt-1">{fieldError('date')}</p>
              )}
            </div>

            {/* ══════ Morning Section ══════ */}
            <div className="border border-amber-200/50 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50/40">
                <Sun size={16} className="text-amber-500" />
                <div>
                  <span className="text-sm font-semibold text-gray-800">{t('modal.morningSection')}</span>
                  <span className="text-xs text-gray-400 ml-2">{t('modal.morningSub')}</span>
                </div>
              </div>
              <div className="px-4 py-3 space-y-3">
                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('modal.weight')} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="200"
                    placeholder={t('modal.weightPlaceholder')}
                    value={form.weight_kg}
                    onChange={(e) => updateField('weight_kg', e.target.value)}
                    onBlur={() => handleBlur('weight_kg')}
                    className={`w-full min-h-12 px-3 py-2 rounded-xl text-sm glass-input focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                      fieldError('weight_kg') ? 'border-red-400' : ''
                    }`}
                  />
                  {fieldError('weight_kg') && (
                    <p className="text-xs text-red-600 mt-1">{fieldError('weight_kg')}</p>
                  )}
                </div>

                {/* Sleep Score */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('modal.sleep')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="1"
                    placeholder={t('modal.sleepPlaceholder')}
                    value={form.sleep_score}
                    onChange={(e) => updateField('sleep_score', e.target.value)}
                    onBlur={() => handleBlur('sleep_score')}
                    className={`w-full min-h-12 px-3 py-2 rounded-xl text-sm glass-input focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                      fieldError('sleep_score') ? 'border-red-400' : ''
                    }`}
                  />
                  {fieldError('sleep_score') && (
                    <p className="text-xs text-red-600 mt-1">{fieldError('sleep_score')}</p>
                  )}
                </div>
              </div>
            </div>

            {/* ══════ Evening Section ══════ */}
            <div className="border border-indigo-200/50 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50/40">
                <Moon size={16} className="text-indigo-500" />
                <div>
                  <span className="text-sm font-semibold text-gray-800">{t('modal.eveningSection')}</span>
                  <span className="text-xs text-gray-400 ml-2">{t('modal.eveningSub')}</span>
                </div>
              </div>
              <div className="px-4 py-3 space-y-3">
                {/* Water */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('modal.water')}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder={t('modal.waterPlaceholder')}
                    value={form.water_liters}
                    onChange={(e) => updateField('water_liters', e.target.value)}
                    onBlur={() => handleBlur('water_liters')}
                    className={`w-full min-h-12 px-3 py-2 rounded-xl text-sm glass-input focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                      fieldError('water_liters') ? 'border-red-400' : ''
                    }`}
                  />
                  {fieldError('water_liters') && (
                    <p className="text-xs text-red-600 mt-1">{fieldError('water_liters')}</p>
                  )}
                </div>

                {/* Energy Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('modal.energy')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="1"
                    placeholder={t('modal.energyPlaceholder')}
                    value={form.energy_level}
                    onChange={(e) => updateField('energy_level', e.target.value)}
                    onBlur={() => handleBlur('energy_level')}
                    className={`w-full min-h-12 px-3 py-2 rounded-xl text-sm glass-input focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                      fieldError('energy_level') ? 'border-red-400' : ''
                    }`}
                  />
                  {fieldError('energy_level') && (
                    <p className="text-xs text-red-600 mt-1">{fieldError('energy_level')}</p>
                  )}
                </div>

                {/* Gym Check-in */}
                <label className="flex items-center gap-3 min-h-10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.gym_checkin}
                    onChange={(e) => updateField('gym_checkin', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">{t('modal.gym')}</span>
                </label>

                {/* Cheat Meal */}
                <label className="flex items-center gap-3 min-h-10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.cheat_meal}
                    onChange={(e) => updateField('cheat_meal', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-amber-400 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">{t('modal.cheat')}</span>
                </label>
              </div>
            </div>

            {/* Body Measurements (collapsible) */}
            <div className="border border-white/30 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setMeasureOpen(!measureOpen)}
                className="w-full flex items-center justify-between px-4 py-3 glass-subtle hover:bg-white/40 transition-colors cursor-pointer"
              >
                <div>
                  <span className="text-sm font-medium text-gray-700">{t('modal.bodyMeasurements')}</span>
                  <span className="text-xs text-gray-400 ml-2">{t('modal.bodyMeasurementsSub')}</span>
                </div>
                {measureOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>
              {measureOpen && (
                <div className="px-4 py-3 space-y-3 border-t border-white/20">
                  {([
                    ['waist_cm', t('modal.waist')] as const,
                    ['belly_cm', t('modal.belly')] as const,
                    ['hip_cm', t('modal.hip')] as const,
                    ['thigh_cm', t('modal.thigh')] as const,
                  ]).map(([field, label]) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                      <input
                        type="number"
                        step="0.1"
                        min="20"
                        max="200"
                        placeholder={t('modal.cmPlaceholder')}
                        value={form[field]}
                        onChange={(e) => updateField(field, e.target.value)}
                        onBlur={() => handleBlur(field)}
                        className={`w-full min-h-10 px-3 py-1.5 rounded-xl text-sm glass-input focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                          fieldError(field) ? 'border-red-400' : ''
                        }`}
                      />
                      {fieldError(field) && (
                        <p className="text-xs text-red-600 mt-0.5">{fieldError(field)}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  {t('modal.notes')}
                </label>
                <span
                  className={`text-xs ${
                    form.notes.length > 500 ? 'text-red-600' : 'text-gray-400'
                  }`}
                >
                  {form.notes.length}/500
                </span>
              </div>
              <textarea
                rows={3}
                placeholder={t('modal.notesPlaceholder')}
                value={form.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                onBlur={() => handleBlur('notes')}
                className={`w-full px-3 py-2 rounded-xl text-sm glass-input focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none ${
                  fieldError('notes') ? 'border-red-400' : ''
                }`}
              />
              {fieldError('notes') && (
                <p className="text-xs text-red-600 mt-1">{fieldError('notes')}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-12 glass-btn-primary rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? t('modal.saving') : t('modal.save')}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
