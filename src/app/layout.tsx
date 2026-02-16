import type { Metadata } from 'next';
import './globals.css';

// Initialize NextPress collections from config
import { initializeNextPress } from '../lib/nextpress';

// Initialize on server start
initializeNextPress();

export const metadata: Metadata = {
  title: 'CMS Platform',
  description: 'A modern content management system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">{children}</body>
    </html>
  );
}
