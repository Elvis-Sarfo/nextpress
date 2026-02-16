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
        className={`h-9 w-9 rounded-md ${theme === 'light' ? 'bg-accent' : ''}`}
        title="Light"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme('dark')}
        className={`h-9 w-9 rounded-md ${theme === 'dark' ? 'bg-accent' : ''}`}
        title="Dark"
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme('system')}
        className={`h-9 w-9 rounded-md ${theme === 'system' ? 'bg-accent' : ''}`}
        title="System"
      >
        <Monitor className="h-4 w-4" />
      </Button>
    </div>
  );
}
