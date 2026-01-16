import Link from 'next/link';
import { LayoutDashboard, FileText, Settings, Layers } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-secondary/30">
        <div className="p-6">
          <h1 className="text-xl font-bold">CMS Admin</h1>
        </div>
        <nav className="px-3">
          <ul className="space-y-1">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/content"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <FileText className="w-5 h-5" />
                Content
              </Link>
            </li>
            <li>
              <Link
                href="/schemas"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <Layers className="w-5 h-5" />
                Schemas
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <Settings className="w-5 h-5" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
