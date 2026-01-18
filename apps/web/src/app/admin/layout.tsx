'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Newspaper,
  Menu,
  Link2,
  MessageSquare,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
};

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Pages',
    href: '/admin/pages',
    icon: FileText,
    children: [
      { label: 'All Pages', href: '/admin/pages' },
      { label: 'Add New', href: '/admin/pages/new' },
    ],
  },
  {
    label: 'Posts',
    href: '/admin/posts',
    icon: BookOpen,
    children: [
      { label: 'All Posts', href: '/admin/posts' },
      { label: 'Add New', href: '/admin/posts/new' },
    ],
  },
  {
    label: 'News',
    href: '/admin/news',
    icon: Newspaper,
    children: [
      { label: 'All News', href: '/admin/news' },
      { label: 'Add New', href: '/admin/news/new' },
    ],
  },
  {
    label: 'Menus',
    href: '/admin/menus',
    icon: Menu,
  },
  {
    label: 'Links',
    href: '/admin/links',
    icon: Link2,
  },
  {
    label: 'Comments',
    href: '/admin/comments',
    icon: MessageSquare,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(
    item.children?.some((child) => pathname.startsWith(child.href)) ?? false
  );

  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
  const Icon = item.icon;

  if (item.children) {
    return (
      <li>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors',
            isActive ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'
          )}
        >
          <span className="flex items-center gap-3">
            <Icon className="w-5 h-5" />
            {item.label}
          </span>
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        {isOpen && (
          <ul className="ml-8 mt-1 space-y-1">
            {item.children.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className={cn(
                    'block px-3 py-1.5 rounded-lg text-sm transition-colors',
                    pathname === child.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
          isActive ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'
        )}
      >
        <Icon className="w-5 h-5" />
        {item.label}
      </Link>
    </li>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-secondary/30 flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/admin/dashboard" className="text-xl font-bold">
            NextPress
          </Link>
          <p className="text-sm text-muted-foreground mt-1">Content Management</p>
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-border">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
