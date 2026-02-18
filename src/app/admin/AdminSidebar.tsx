'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  Database,
  FileText,
  Image,
  Users,
  Shield,
  Key,
  Settings,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { getGroupedCollections, getCollectionsByGroup } from '@/lib/collections-data';

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
  isGroupHeader?: boolean;
};

function getCollectionIcon(slug: string): React.ElementType {
  return collectionIcons[slug] || collectionIcons.default;
}

function buildNavItems(): NavItem[] {
  const items: NavItem[] = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  ];

  const groups = getGroupedCollections();
  const collectionsByGroup = getCollectionsByGroup();

  for (const group of groups) {
    const collections = collectionsByGroup.get(group.key);
    if (!collections || collections.length === 0) continue;

    items.push({ label: group.label, href: '#', icon: Database, isGroupHeader: true });

    for (const collection of collections) {
      const Icon = getCollectionIcon(collection.slug);
      items.push({
        label: collection.labels.plural,
        href: `/admin/${collection.slug}`,
        icon: Icon,
        children: [
          { label: `All ${collection.labels.plural}`, href: `/admin/${collection.slug}` },
          { label: 'Add New', href: `/admin/${collection.slug}/new` },
        ],
      });
    }
  }

  return items;
}

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();

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
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
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

export function AdminSidebar() {
  const navItems = buildNavItems();

  return (
    <aside className="w-64 border-r border-border bg-secondary/30 flex flex-col">
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.isGroupHeader ? `group-${item.label}` : item.href}
              item={item}
            />
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-border">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          View Site
        </Link>
      </div>
    </aside>
  );
}
