'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

const SUPPORTED_LOCALES = ['en', 'fr', 'de', 'es'] as const;
type SupportedLocale = typeof SUPPORTED_LOCALES[number];
const DEFAULT_LOCALE: SupportedLocale = 'en';
const STORAGE_KEY = 'nextpress-admin-locale';

interface AdminLocaleContextValue {
  locale: string;
  setLocale: (locale: string) => void;
  supportedLocales: readonly string[];
}

const AdminLocaleContext = createContext<AdminLocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  supportedLocales: SUPPORTED_LOCALES,
});

export function AdminLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<string>(DEFAULT_LOCALE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (SUPPORTED_LOCALES as readonly string[]).includes(saved)) {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
  };

  if (!mounted) return <>{children}</>;

  return (
    <AdminLocaleContext.Provider value={{ locale, setLocale, supportedLocales: SUPPORTED_LOCALES }}>
      {children}
    </AdminLocaleContext.Provider>
  );
}

export function useAdminLocale() {
  return useContext(AdminLocaleContext);
}
