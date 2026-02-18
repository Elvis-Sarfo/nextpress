import type { Metadata } from 'next';
import './globals.css';
import { auth } from '@/auth';
import { SessionProviderClient } from '@/components/providers/SessionProviderClient';

// Initialize NextPress collections from config
import { initializeNextPress } from '../lib/nextpress';

// Initialize on server start
initializeNextPress();

export const metadata: Metadata = {
  title: 'CMS Platform',
  description: 'A modern content management system',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        <SessionProviderClient session={session}>
          {children}
        </SessionProviderClient>
      </body>
    </html>
  );
}
