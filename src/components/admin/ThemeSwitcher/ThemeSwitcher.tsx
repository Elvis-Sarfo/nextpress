'use client';

import { ChevronDown, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const activeTheme = theme ?? 'system';
  const ActiveIcon =
    activeTheme === 'light'
      ? Sun
      : activeTheme === 'dark'
        ? Moon
        : Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-7 rounded-lg border border-white/10 bg-white/[0.04] px-2 text-[11px] font-medium text-slate-100 hover:bg-white/[0.08] hover:text-white"
        >
          <ActiveIcon className="mr-1.5 h-3.5 w-3.5" />
          Theme
          <ChevronDown className="ml-1.5 h-3 w-3 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.18)]"
      >
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="rounded-lg px-2.5 py-2 text-[13px] font-medium focus:bg-slate-100"
        >
          <Sun className="mr-2 h-3.5 w-3.5" />
          <span className="flex w-full items-center justify-between gap-3">
            <span>Light</span>
            {activeTheme === 'light' ? <span className="text-[11px] text-slate-500">Active</span> : null}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="rounded-lg px-2.5 py-2 text-[13px] font-medium focus:bg-slate-100"
        >
          <Moon className="mr-2 h-3.5 w-3.5" />
          <span className="flex w-full items-center justify-between gap-3">
            <span>Dark</span>
            {activeTheme === 'dark' ? <span className="text-[11px] text-slate-500">Active</span> : null}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="rounded-lg px-2.5 py-2 text-[13px] font-medium focus:bg-slate-100"
        >
          <Monitor className="mr-2 h-3.5 w-3.5" />
          <span className="flex w-full items-center justify-between gap-3">
            <span>System</span>
            {activeTheme === 'system' ? <span className="text-[11px] text-slate-500">Active</span> : null}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
