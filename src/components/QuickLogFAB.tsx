// src/components/QuickLogFAB.tsx
import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { useGoals } from '../hooks/useGoals';
import LogModal from './LogModal';
import type { AppUser } from './LogModal';
import type { UserName } from '../types/database';

export default function QuickLogFAB() {
  const [open, setOpen] = useState(false);
  const { session } = useAuth();
  const { goals } = useGoals();
  const location = useLocation();

  const UID_TO_NAME: Record<string, UserName> = {
    'a1337686-b292-4cc9-b31e-4204cb0ebd5e': 'Hung',
    '0e3139b3-1f77-4c77-8cb1-86396d2450f5': 'Nga',
  };
  const myName =
    (session?.user.user_metadata?.user_name as UserName) ??
    UID_TO_NAME[session?.user.id ?? ''] ??
    'Hung' as UserName;

  const users: AppUser[] = useMemo(() => {
    if (goals.length > 0) {
      return goals.map((g) => ({ id: g.user_id, name: g.user_name as UserName }));
    }
    return [];
  }, [goals]);

  // Hide FAB on the Log page itself (it already has a header button there)
  if (location.pathname === '/log') return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Quick log"
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full glass-btn-primary shadow-lg shadow-indigo-500/30 hover:scale-110 transition-all duration-200 cursor-pointer"
      >
        <Plus size={24} />
      </button>

      <LogModal
        open={open}
        onClose={() => setOpen(false)}
        users={users}
        initialUser={myName}
      />
    </>
  );
}
