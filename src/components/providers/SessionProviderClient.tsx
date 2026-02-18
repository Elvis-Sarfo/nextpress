'use client';

import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

interface SessionProviderClientProps {
  children: React.ReactNode;
  session: Session | null;
}

export function SessionProviderClient({ children, session }: SessionProviderClientProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
