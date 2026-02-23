'use client';

import { Globe } from 'lucide-react';
import { useAdminLocale } from '@/components/providers/AdminLocaleProvider';

const LOCALE_LABELS: Record<string, string> = {
  en: 'EN',
  fr: 'FR',
  de: 'DE',
  es: 'ES',
};

export function LocaleSwitcher() {
  const { locale, setLocale, supportedLocales } = useAdminLocale();

  return (
    <div className="flex items-center gap-1">
      <Globe className="h-3.5 w-3.5 shrink-0 text-gray-400" />
      {supportedLocales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          title={`Switch to ${l.toUpperCase()}`}
          className={`h-7 rounded px-1.5 text-xs font-medium transition-colors ${
            locale === l
              ? 'bg-white/20 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          {LOCALE_LABELS[l] ?? l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
