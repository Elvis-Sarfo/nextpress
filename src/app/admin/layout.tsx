import { ThemeProviderClient } from '@/components/providers/ThemeProviderClient';
import { AdminBar } from './AdminBar';
import { AdminSidebar } from './AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
