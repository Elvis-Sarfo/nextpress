import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { ThemeProviderClient } from '@/components/providers/ThemeProviderClient';
import { AdminLocaleProvider } from '@/components/providers/AdminLocaleProvider';
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
      <AdminLocaleProvider>
        <div className="h-screen overflow-hidden bg-background [--admin-topbar-height:2.5rem] [--admin-sidebar-width:12rem] xl:[--admin-sidebar-width:13rem]">
          <AdminBar />
          <AdminSidebar />
          <main className="fixed right-0 bottom-0 left-0 top-[var(--admin-topbar-height)] z-10 overflow-y-auto md:left-[var(--admin-sidebar-width)]">
            <div className="px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
              {children}
            </div>
          </main>
        </div>
      </AdminLocaleProvider>
    </ThemeProviderClient>
  );
}
