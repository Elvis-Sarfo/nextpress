import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { Menu, Home, Plus, Users, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/admin/ThemeSwitcher';
import { LocaleSwitcher } from '@/components/admin/LocaleSwitcher';

export async function AdminBar() {
  const session = await auth();
  const displayName = session?.user?.name ?? session?.user?.email ?? 'User';

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] flex h-[var(--admin-topbar-height)] items-center justify-between bg-gray-900 px-2.5 text-white shadow-sm md:px-3">
      <div className="flex items-center gap-2.5 pl-8 md:pl-0">
        <Link href="/admin" className="flex items-center gap-1.5 text-base font-semibold leading-none hover:text-blue-200 md:text-sm">
          <Menu className="hidden h-4 w-4 md:block" /> <span className="hidden sm:inline">NextPress</span>
        </Link>
        <Link href="/" className="hidden items-center gap-1 text-xs hover:text-blue-200 lg:flex">
          <Home className="h-3.5 w-3.5" /> <span>View Site</span>
        </Link>
        <Link href="/admin/media/new" className="hidden items-center gap-1 text-xs hover:text-blue-200 lg:flex">
          <Plus className="h-3.5 w-3.5" /> <span>New</span>
        </Link>
        <Link href="/admin/users" className="hidden items-center gap-1 text-xs hover:text-blue-200 lg:flex">
          <Users className="h-3.5 w-3.5" /> <span>Users</span>
        </Link>
      </div>

      <div className="flex items-center gap-0.5">
        <LocaleSwitcher />
        <div className="mx-1 h-3 w-px bg-gray-700" />
        <ThemeSwitcher />
        <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-gray-700">
          <Bell className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-gray-700">
          <Settings className="h-3.5 w-3.5" />
        </Button>

        <div className="ml-1.5 flex items-center gap-1.5 rounded bg-gray-800 px-2 py-0.5 text-xs">
          <span className="hidden md:inline max-w-32 truncate">{displayName}</span>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/auth/signin' });
            }}
          >
            <button
              type="submit"
              className="text-xs text-gray-400 transition-colors hover:text-white"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
