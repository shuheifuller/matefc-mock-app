import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Lang, LocalizedText } from '../types/domain';
import { strings } from './strings';

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  /** Dot-path lookup into the UI string dictionary, e.g. t('nav.home'). */
  t: (path: string) => string;
  /** Localize a LocalizedText data object. */
  tl: (text: LocalizedText | undefined) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function lookup(path: string, lang: Lang): string {
  const parts = path.split('.');
  let node: unknown = strings[lang];
  for (const p of parts) {
    if (node && typeof node === 'object' && p in (node as Record<string, unknown>)) {
      node = (node as Record<string, unknown>)[p];
    } else {
      return path; // fall back to the key so missing strings are obvious
    }
  }
  return typeof node === 'string' ? node : path;
}

export function I18nProvider({
  children,
  initialLang = 'en',
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLang] = useState<Lang>(initialLang);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang((l) => (l === 'en' ? 'ja' : 'en')),
      t: (path: string) => lookup(path, lang),
      tl: (text) => (text ? text[lang] : ''),
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
