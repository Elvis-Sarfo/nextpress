'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProviderClient({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent flash of wrong theme on hydration
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
