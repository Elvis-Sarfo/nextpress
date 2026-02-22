import { AdminBar } from '@/components/public/AdminBar';
import { NavMenu } from '@/components/public/NavMenu';
import { getMenuByLocation } from '@/lib/cms';
import Link from 'next/link';

// Default locale for nav URL resolution — menus are fetched without a request
// context so we default to 'en'; per-locale resolution happens in NavMenu via slugsByLocale.
const DEFAULT_LOCALE = 'en';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [primaryMenu, footerMenu] = await Promise.all([
    getMenuByLocation('primary'),
    getMenuByLocation('footer'),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <AdminBar />
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            CMS Site
          </Link>
          {primaryMenu ? (
            <NavMenu menu={primaryMenu} locale={DEFAULT_LOCALE} />
          ) : (
            <nav>
              <ul className="flex gap-6">
                <li>
                  <Link
                    href="/en"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Home
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          {footerMenu ? (
            <NavMenu
              menu={footerMenu}
              locale={DEFAULT_LOCALE}
              orientation="horizontal"
              className="flex justify-center"
            />
          ) : (
            <p className="text-center text-muted-foreground">
              &copy; {new Date().getFullYear()} CMS Platform. All rights reserved.
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
