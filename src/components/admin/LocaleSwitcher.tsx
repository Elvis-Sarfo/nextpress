'use client';

import { ChevronDown, Globe } from 'lucide-react';
import { useAdminLocale } from '@/components/providers/AdminLocaleProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LOCALE_LABELS: Record<string, string> = {
  en: 'EN',
  fr: 'FR',
  de: 'DE',
  es: 'ES',
};

export function LocaleSwitcher() {
  const { locale, setLocale, supportedLocales } = useAdminLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-7 rounded-lg border border-white/10 bg-white/[0.04] px-2 text-[11px] font-medium text-slate-100 hover:bg-white/[0.08] hover:text-white"
        >
          <Globe className="mr-1.5 h-3.5 w-3.5 shrink-0" />
          {LOCALE_LABELS[locale] ?? locale.toUpperCase()}
          <ChevronDown className="ml-1.5 h-3 w-3 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-32 rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.18)]"
      >
        {supportedLocales.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLocale(l)}
            className="rounded-lg px-2.5 py-2 text-[13px] font-medium focus:bg-slate-100"
          >
            <span className="flex w-full items-center justify-between gap-3">
              <span>{LOCALE_LABELS[l] ?? l.toUpperCase()}</span>
              {locale === l ? <span className="text-[11px] text-slate-500">Active</span> : null}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
