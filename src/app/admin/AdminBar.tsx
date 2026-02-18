import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { Menu, Home, Plus, Users, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/admin/ThemeSwitcher';

export async function AdminBar() {
  const session = await auth();
  const displayName = session?.user?.name ?? session?.user?.email ?? 'User';

  return (
    <div className="w-full bg-gray-900 text-white flex items-center justify-between px-6 py-2 shadow-sm">
      <div className="flex items-center gap-6">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-lg hover:text-blue-200">
          <Menu className="w-5 h-5" /> NextPress
        </Link>
        <Link href="/" className="flex items-center gap-2 text-sm hover:text-blue-200">
          <Home className="w-4 h-4" /> View Site
        </Link>
        <Link href="/admin/media/new" className="flex items-center gap-2 text-sm hover:text-blue-200">
          <Plus className="w-4 h-4" /> New
        </Link>
        <Link href="/admin/users" className="flex items-center gap-2 text-sm hover:text-blue-200">
          <Users className="w-4 h-4" /> Users
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-3 bg-gray-800 px-3 py-1 rounded text-sm">
          <span>Howdy, {displayName}</span>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/auth/signin' });
            }}
          >
            <button
              type="submit"
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
