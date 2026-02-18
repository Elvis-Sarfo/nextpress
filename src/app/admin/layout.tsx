import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { ThemeProviderClient } from '@/components/providers/ThemeProviderClient';
import { AdminBar } from './AdminBar';
import { AdminSidebar } from './AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <ThemeProviderClient>
      <div className="flex flex-col min-h-screen">
        <AdminBar />
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="p-8">{children}</div>
          </main>
        </div>
      </div>
    </ThemeProviderClient>
  );
}
