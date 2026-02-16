'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Menu,
  Settings,
  ChevronDown,
  ChevronRight,
  Bell,
  User,
  Home,
  Plus,
  Database,
  FileText,
  Image,
  Users,
  Shield,
  Key,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { getGroupedCollections, getCollectionsByGroup } from '@/lib/collections-data';
import { ThemeSwitcher } from '@/components/admin/ThemeSwitcher';
import { ThemeProviderClient } from '@/components/providers/ThemeProviderClient';

// Icon mapping for collections
const collectionIcons: Record<string, React.ElementType> = {
  users: Users,
  roles: Shield,
  permissions: Key,
  media: Image,
  pages: FileText,
  settings: Settings,
  default: Database,
};

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
  /** If true, this is a group header, not a link */
  isGroupHeader?: boolean;
};

function getCollectionIcon(slug: string): React.ElementType {
  return collectionIcons[slug] || collectionIcons.default;
}

function buildNavItems(): NavItem[] {
  const items: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
  ];

  // Get grouped collections
  const groups = getGroupedCollections();
  const collectionsByGroup = getCollectionsByGroup();
  
  // Add groups with their collections
  for (const group of groups) {
    const collections = collectionsByGroup.get(group.key);
    if (!collections || collections.length === 0) continue;
    
    // Add group header
    items.push({
      label: group.label,
      href: '#',
      icon: Database,
      isGroupHeader: true,
    });
    
    // Add collections under this group
    for (const collection of collections) {
      const Icon = getCollectionIcon(collection.slug);
      items.push({
        label: collection.labels.plural,
        href: `/admin/${collection.slug}`,
        icon: Icon,
        children: [
          { label: `All ${collection.labels.plural}`, href: `/admin/${collection.slug}` },
          { label: `Add New`, href: `/admin/${collection.slug}/new` },
        ],
      });
    }
  }

  return items;
}

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  
  // Group headers are not clickable
  if (item.isGroupHeader) {
    return (
      <li className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {item.label}
      </li>
    );
  }
  
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

function AdminBar() {
  return (
    <div className="w-full bg-gray-900 text-white flex items-center justify-between px-6 py-2 shadow-sm">
      <div className="flex items-center gap-6">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-lg hover:text-blue-200">
          <Menu className="w-5 h-5" /> NextPress
        </Link>
        <Link href="/" className="flex items-center gap-2 text-sm hover:text-blue-200">
          <Home className="w-4 w-4" /> View Site
        </Link>
        <Link href="/admin/media/new" className="flex items-center gap-2 text-sm hover:text-blue-200">
          <Plus className="w-4 w-4" /> New
        </Link>
        <Link href="/admin/users" className="flex items-center gap-2 text-sm hover:text-blue-200">
          <Users className="w-4 w-4" /> Users
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
        <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded text-sm">
          <User className="w-4 w-4" />
          <span>Howdy, admin</span>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ navItems }: { navItems: NavItem[] }) {
  return (
    <aside className="w-64 border-r border-border bg-secondary/30 flex flex-col">
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item, index) => (
            <NavLink key={item.isGroupHeader ? `group-${item.label}` : item.href} item={item} />
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
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = buildNavItems();

  return (
    <ThemeProviderClient>
      <div className="flex flex-col min-h-screen">
        <AdminBar />
        <div className="flex min-h-screen">
          <Sidebar navItems={navItems} />
          <main className="flex-1 overflow-y-auto">
            <div className="p-8">{children}</div>
          </main>
        </div>
      </div>
    </ThemeProviderClient>
  );
}
