// src/pages/Log.tsx
import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Plus, Scale, Dumbbell, Droplets, Moon, UtensilsCrossed, Zap, Download } from 'lucide-react';
import toast from 'react-hot-toast';

import { useWeightData } from '../hooks/useWeightData';
import { useGoals } from '../hooks/useGoals';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import LogModal from '../components/LogModal';
import type { AppUser } from '../components/LogModal';
import DayDetailSheet from '../components/DayDetailSheet';
import LoadingSkeleton from '../components/LoadingSkeleton';
import type { DailyLog, UserName } from '../types/database';
import { useLang } from '../contexts/LangContext';

type ExportScope = 'Hung' | 'Nga' | 'Both';

function escapeCsvCell(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function toCsv(logs: DailyLog[]): string {
  const headers = [
    'date',
    'user_name',
    'weight_kg',
    'gym_checkin',
    'water_liters',
    'cheat_meal',
    'sleep_score',
    'energy_level',
    'waist_cm',
    'belly_cm',
    'hip_cm',
    'thigh_cm',
    'notes',
    'created_at',
    'id',
    'user_id',
  ];

  const rows = logs.map((log) => [
    log.date,
    log.user_name,
    log.weight_kg.toString(),
    log.gym_checkin ? 'true' : 'false',
    log.water_liters?.toString() ?? '',
    log.cheat_meal ? 'true' : 'false',
    log.sleep_score?.toString() ?? '',
    log.energy_level?.toString() ?? '',
    log.waist_cm?.toString() ?? '',
    log.belly_cm?.toString() ?? '',
    log.hip_cm?.toString() ?? '',
    log.thigh_cm?.toString() ?? '',
    log.notes ?? '',
    log.created_at,
    log.id,
    log.user_id,
  ]);

  const csvLines = [headers, ...rows].map((row) => row.map((v) => escapeCsvCell(v)).join(','));
  return csvLines.join('\n');
}

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function Log() {
  const { t } = useLang();
  const { logs, loading, error, refetch } = useWeightData();
  const { goals } = useGoals();
  const { session } = useAuth();
  const UID_TO_NAME: Record<string, UserName> = {
    'a1337686-b292-4cc9-b31e-4204cb0ebd5e': 'Hung',
    '0e3139b3-1f77-4c77-8cb1-86396d2450f5': 'Nga',
  };
  const myName =
    (session?.user.user_metadata?.user_name as UserName) ??
    UID_TO_NAME[session?.user.id ?? ''] ??
    'Hung' as UserName;

  const [modalOpen, setModalOpen] = useState(false);
  const [detailLog, setDetailLog] = useState<DailyLog | null>(null);
  const [editInitial, setEditInitial] = useState<{ date: string; user: UserName } | null>(null);
  const [filterUser, setFilterUser] = useState<UserName | 'Both'>(myName);
  const [exportOpen, setExportOpen] = useState(false);

  // Derive users from goals — always has both users regardless of log history
  const users: AppUser[] = useMemo(() => {
    if (goals.length > 0) {
      return goals.map((g) => ({ id: g.user_id, name: g.user_name as UserName }));
    }
    // Fallback: derive from logs
    const map = new Map<string, UserName>();
    for (const l of logs) {
      if (!map.has(l.user_id)) map.set(l.user_id, l.user_name);
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [goals, logs]);

  const handleDelete = async (id: string) => {
    await supabase.from('daily_logs').delete().eq('id', id);
    refetch();
  };

  // Display logs in reverse chronological order, filtered by selected user
  const sortedLogs = useMemo(
    () =>
      [...logs]
        .sort((a, b) => b.date.localeCompare(a.date))
        .filter((l) => filterUser === 'Both' || l.user_name === filterUser),
    [logs, filterUser]
  );

  const handleExportCsv = (scope: ExportScope) => {
    const scopedLogs = [...logs]
      .filter((l) => scope === 'Both' || l.user_name === scope)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (scopedLogs.length === 0) {
      toast(t('log.exportNoData'));
      setExportOpen(false);
      return;
    }

    const today = format(new Date(), 'yyyy-MM-dd');
    const fileTag = scope === 'Both' ? 'both' : scope.toLowerCase();
    const filename = `speedyfit-logs-${fileTag}-${today}.csv`;
    const csv = toCsv(scopedLogs);
    downloadCsv(filename, csv);
    toast.success(t('log.exportDone'));
    setExportOpen(false);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-28 bg-gray-200 rounded animate-pulse" />
        </div>
        <LoadingSkeleton variant="card" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        <div className="glass rounded-2xl border border-red-200/50 p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer"
          >
            {t('log.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">{t('log.title')}</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setExportOpen((p) => !p)}
              className="flex items-center gap-2 min-h-12 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer glass text-gray-700 hover:bg-white/70"
            >
              <Download size={18} />
              {t('log.exportCsv')}
            </button>
            {exportOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl glass-strong shadow-lg border border-white/50 p-1.5 z-20">
                <button
                  onClick={() => handleExportCsv('Hung')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer"
                >
                  {t('log.exportHung')}
                </button>
                <button
                  onClick={() => handleExportCsv('Nga')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-emerald-50 cursor-pointer"
                >
                  {t('log.exportNga')}
                </button>
                <button
                  onClick={() => handleExportCsv('Both')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  {t('log.exportBoth')}
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 glass-btn-primary px-4 py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer min-h-12"
          >
            <Plus size={18} />
            {t('log.newLog')}
          </button>
        </div>
      </div>

      {/* User filter */}
      <div className="flex items-center gap-1.5 mb-6 p-1 glass rounded-2xl w-fit">
        {(['Hung', 'Nga', 'Both'] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setFilterUser(opt)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              filterUser === opt
                ? opt === 'Hung'
                  ? 'bg-indigo-500/20 text-indigo-700 shadow-sm'
                  : opt === 'Nga'
                  ? 'bg-emerald-500/20 text-emerald-700 shadow-sm'
                  : 'bg-white/60 text-gray-800 shadow-sm'
                : 'text-gray-400 hover:text-gray-600 hover:bg-white/40'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {sortedLogs.length === 0 ? (
        <div className="rounded-2xl glass p-12 text-center">
          <Scale size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium mb-1">{t('log.emptyTitle')}</p>
          <p className="text-sm text-gray-400 mb-4">{t('log.emptyDesc')}</p>
          <button
            onClick={() => setModalOpen(true)}
            className="glass-btn-primary px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
          >
            {t('log.emptyBtn')}
          </button>
        </div>
      ) : (
        /* Log entries list */
        <div className="space-y-2">
          {sortedLogs.map((log) => (
            <button
              key={log.id}
              onClick={() => setDetailLog(log)}
              className="w-full rounded-2xl glass glass-hover p-4 transition-all duration-150 cursor-pointer text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">
                  {(() => {
                    try {
                      return format(parseISO(log.date), 'EEE, MMM d, yyyy');
                    } catch {
                      return log.date;
                    }
                  })()}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      log.user_name === 'Hung'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {log.user_name}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                  {log.weight_kg.toFixed(1)}
                  <span className="text-xs text-gray-400 ml-0.5">kg</span>
                </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                <span
                  className={`flex items-center gap-1 ${
                    log.gym_checkin ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  <Dumbbell size={13} />
                  {log.gym_checkin ? t('log.gym') : t('log.rest')}
                </span>
                <span
                  className={`flex items-center gap-1 ${
                    (log.water_liters ?? 0) >= 2.0 ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <Droplets size={13} />
                  {log.water_liters != null ? `${log.water_liters.toFixed(1)}L` : '—'}
                </span>
                <span className="flex items-center gap-1">
                  <Moon size={13} />
                  {t('log.sleep')} {log.sleep_score != null ? `${log.sleep_score}/10` : '—'}
                </span>
                {log.energy_level != null && (
                  <span className={`flex items-center gap-1 ${
                    log.energy_level >= 7 ? 'text-yellow-500' : 'text-gray-400'
                  }`}>
                    <Zap size={13} />
                    {t('log.energy')} {log.energy_level}/10
                  </span>
                )}
                {log.cheat_meal && (
                  <span className="flex items-center gap-1 text-amber-600">
                    <UtensilsCrossed size={13} />
                    {t('log.cheat')}
                  </span>
                )}
                {log.notes && (
                  <span className="text-gray-400 truncate max-w-[150px]">
                    📝 {log.notes}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Log Modal */}
      <LogModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditInitial(null); }}
        onSaved={refetch}
        users={users}
        initialDate={editInitial?.date}
        initialUser={editInitial?.user ?? myName}
      />

      {/* Day Detail Sheet */}
      <DayDetailSheet
        log={detailLog}
        onClose={() => setDetailLog(null)}
        onEdit={() => {
          if (!detailLog) return;
          setEditInitial({ date: detailLog.date, user: detailLog.user_name });
          setDetailLog(null);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}
