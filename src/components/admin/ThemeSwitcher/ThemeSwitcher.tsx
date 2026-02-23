'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';
import { Button } from '@/components/ui/button';

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme('light')}
        className={`h-7 w-7 rounded ${theme === 'light' ? 'bg-accent' : ''}`}
        title="Light"
      >
        <Sun className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme('dark')}
        className={`h-7 w-7 rounded ${theme === 'dark' ? 'bg-accent' : ''}`}
        title="Dark"
      >
        <Moon className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme('system')}
        className={`h-7 w-7 rounded ${theme === 'system' ? 'bg-accent' : ''}`}
        title="System"
      >
        <Monitor className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
