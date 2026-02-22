import { auth } from '@/auth';
import Link from 'next/link';
import { AdminBarPageInfo } from './AdminBarPageInfo';

/**
 * WordPress-style admin bar rendered on public pages.
 * Visible only when the visitor has an active admin session.
 *
 * Auth check is done server-side here. Page-specific title and edit link
 * are handled by the AdminBarPageInfo client component, which uses
 * usePathname() so it updates on every client-side navigation.
 */
export async function AdminBar() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-[9999] h-9 bg-[#23282d] text-white/90 text-xs flex items-center gap-3 px-4 shadow-md">
        {/* Dashboard link */}
        <Link
          href="/admin"
          className="text-[#00b9eb] hover:text-white transition-colors font-medium shrink-0"
        >
          ← Dashboard
        </Link>

        {/* Page title + Edit Page link — updates on every client-side nav */}
        <AdminBarPageInfo />

        {/* Right side: user name */}
        <span className="ml-auto text-white/50 shrink-0 truncate max-w-[160px]">
          {session.user.name ?? session.user.email}
        </span>
      </div>

      {/* Spacer — keeps content from hiding under the fixed bar */}
      <div className="h-9" aria-hidden="true" />
    </>
  );
}
