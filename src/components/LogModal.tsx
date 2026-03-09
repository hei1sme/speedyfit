// src/components/LogModal.tsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

interface LogModalProps {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

interface FormState {
  date: string;
  weight_kg: string;
  gym_checkin: boolean;
  water_liters: string;
  cheat_meal: boolean;
  sleep_score: string;
  notes: string;
}

interface FormErrors {
  date?: string;
  weight_kg?: string;
  water_liters?: string;
  sleep_score?: string;
  notes?: string;
}

const initialForm: FormState = {
  date: format(new Date(), 'yyyy-MM-dd'),
  weight_kg: '',
  gym_checkin: false,
  water_liters: '',
  cheat_meal: false,
  sleep_score: '',
  notes: '',
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.date) {
    errors.date = 'Date is required.';
  } else if (form.date > format(new Date(), 'yyyy-MM-dd')) {
    errors.date = 'Date cannot be in the future.';
  }

  const w = parseFloat(form.weight_kg);
  if (!form.weight_kg) {
    errors.weight_kg = 'Weight is required.';
  } else if (isNaN(w) || w < 30 || w > 200) {
    errors.weight_kg = 'Weight must be 30.0–200.0 kg.';
  }

  const wl = parseFloat(form.water_liters);
  if (!form.water_liters) {
    errors.water_liters = 'Water intake is required.';
  } else if (isNaN(wl) || wl < 0 || wl > 10) {
    errors.water_liters = 'Water must be 0.0–10.0 L.';
  }

  const ss = parseInt(form.sleep_score, 10);
  if (!form.sleep_score) {
    errors.sleep_score = 'Sleep score is required.';
  } else if (isNaN(ss) || ss < 1 || ss > 10) {
    errors.sleep_score = 'Sleep score must be 1–10.';
  }

  if (form.notes.length > 500) {
    errors.notes = 'Notes must be 500 characters or less.';
  }

  return errors;
}

export default function LogModal({ open, onClose, onSaved }: LogModalProps) {
  const { session } = useAuth();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  // Reset form when opening
  useEffect(() => {
    if (open) {
      setForm({ ...initialForm, date: format(new Date(), 'yyyy-MM-dd') });
      setErrors({});
      setTouched(new Set());
    }
  }, [open]);

  const handleBlur = (field: string) => {
    setTouched((prev) => new Set(prev).add(field));
    setErrors(validate(form));
  };

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    if (touched.has(key)) {
      setErrors(validate(updated));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allErrors = validate(form);
    setErrors(allErrors);
    setTouched(new Set(Object.keys(form)));

    if (Object.keys(allErrors).length > 0) return;
    if (!session) {
      toast.error('Session expired. Please log in again.');
      return;
    }

    setSubmitting(true);

    try {
      // Determine user_name from profile (we infer from the session email or metadata)
      const userName = session.user.user_metadata?.user_name as 'Hung' | 'Nga' | undefined;

      const payload = {
        date: form.date,
        user_id: session.user.id,
        user_name: userName || 'Hung',
        weight_kg: parseFloat(parseFloat(form.weight_kg).toFixed(1)),
        gym_checkin: form.gym_checkin,
        water_liters: parseFloat(parseFloat(form.water_liters).toFixed(1)),
        cheat_meal: form.cheat_meal,
        sleep_score: parseInt(form.sleep_score, 10),
        notes: form.notes.trim() || null,
      };

      const { error } = await supabase
        .from('daily_logs')
        .upsert(payload, { onConflict: 'date,user_id' });

      if (error) {
        if (error.code === '23514') {
          toast.error('Value out of range. Please check your input.');
        } else if (error.code === '23505') {
          toast('Already logged today — updating instead.', { icon: 'ℹ️' });
        } else {
          toast.error('Error saving. Please try again.');
        }
        console.error('Upsert error:', error);
      } else {
        toast.success('Log saved!');
        onSaved?.();
        onClose();
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
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
          className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Daily Log</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors duration-150 cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                max={format(new Date(), 'yyyy-MM-dd')}
                onChange={(e) => updateField('date', e.target.value)}
                onBlur={() => handleBlur('date')}
                className={`w-full min-h-12 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldError('date') ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {fieldError('date') && (
                <p className="text-xs text-red-600 mt-1">{fieldError('date')}</p>
              )}
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="200"
                placeholder="e.g. 85.3"
                value={form.weight_kg}
                onChange={(e) => updateField('weight_kg', e.target.value)}
                onBlur={() => handleBlur('weight_kg')}
                className={`w-full min-h-12 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldError('weight_kg') ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {fieldError('weight_kg') && (
                <p className="text-xs text-red-600 mt-1">{fieldError('weight_kg')}</p>
              )}
            </div>

            {/* Water */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Water (liters)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                placeholder="e.g. 2.5"
                value={form.water_liters}
                onChange={(e) => updateField('water_liters', e.target.value)}
                onBlur={() => handleBlur('water_liters')}
                className={`w-full min-h-12 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldError('water_liters') ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {fieldError('water_liters') && (
                <p className="text-xs text-red-600 mt-1">{fieldError('water_liters')}</p>
              )}
            </div>

            {/* Sleep Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sleep Score (1–10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                step="1"
                placeholder="e.g. 7"
                value={form.sleep_score}
                onChange={(e) => updateField('sleep_score', e.target.value)}
                onBlur={() => handleBlur('sleep_score')}
                className={`w-full min-h-12 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldError('sleep_score') ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {fieldError('sleep_score') && (
                <p className="text-xs text-red-600 mt-1">{fieldError('sleep_score')}</p>
              )}
            </div>

            {/* Gym Check-in */}
            <label className="flex items-center gap-3 min-h-12 cursor-pointer">
              <input
                type="checkbox"
                checked={form.gym_checkin}
                onChange={(e) => updateField('gym_checkin', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-700 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700">Gym check-in today</span>
            </label>

            {/* Cheat Meal */}
            <label className="flex items-center gap-3 min-h-12 cursor-pointer">
              <input
                type="checkbox"
                checked={form.cheat_meal}
                onChange={(e) => updateField('cheat_meal', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-700 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700">Cheat meal today</span>
            </label>

            {/* Notes */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Notes (optional)
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
                placeholder="How did today go?"
                value={form.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                onBlur={() => handleBlur('notes')}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  fieldError('notes') ? 'border-red-400' : 'border-gray-300'
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
              className="w-full min-h-12 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? 'Saving…' : 'Save Log'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
