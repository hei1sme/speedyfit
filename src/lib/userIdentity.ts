import type { Session } from '@supabase/supabase-js';
import type { UserName } from '../types/database';

export const USER_ID_TO_NAME: Record<string, UserName> = {
  'a1337686-b292-4cc9-b31e-4204cb0ebd5e': 'Hung',
  '0e3139b3-1f77-4c77-8cb1-86396d2450f5': 'Nga',
};

export interface UserPalette {
  badge: string;
  filterActive: string;
  line: string;
}

const USER_PALETTE: Record<UserName, UserPalette> = {
  Hung: {
    badge: 'bg-indigo-100 text-indigo-700',
    filterActive: 'bg-indigo-600 text-white',
    line: '#6366f1',
  },
  Nga: {
    badge: 'bg-emerald-100 text-emerald-700',
    filterActive: 'bg-emerald-600 text-white',
    line: '#10b981',
  },
};

export function getUserNameFromSession(session: Session | null): UserName {
  const metaName = session?.user.user_metadata?.user_name as UserName | undefined;
  if (metaName === 'Hung' || metaName === 'Nga') return metaName;

  const fromMap = USER_ID_TO_NAME[session?.user.id ?? ''];
  if (fromMap) return fromMap;

  return 'Hung';
}

export function getUserPalette(name: UserName): UserPalette {
  return USER_PALETTE[name];
}
