// src/contexts/LangContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';
import { getT, type Lang, type TranslationKey } from '../lib/i18n';

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem('speedyfit-lang');
    return stored === 'vi' ? 'vi' : 'en';
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('speedyfit-lang', l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: getT(lang) }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LangProvider');
  return ctx;
}
