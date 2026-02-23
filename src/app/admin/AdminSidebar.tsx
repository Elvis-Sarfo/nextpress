'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  Database,
  FilePlus2,
  FileText,
  Image,
  Key,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
} from 'lucide-react';
import { type ElementType, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { getCollectionsByGroup, getGroupedCollections } from '@/lib/collections-data';

const collectionIcons: Record<string, ElementType> = {
  users: Users,
  roles: Shield,
  permissions: Key,
  media: Image,
  pages: FileText,
  settings: Settings,
  default: Database,
};

type CollectionItem = {
  key: string;
  label: string;
  href: string;
  icon: ElementType;
  children: { label: string; href: string }[];
};

type GroupItem = {
  key: string;
  label: string;
  collections: CollectionItem[];
};

function getCollectionIcon(slug: string): ElementType {
  return collectionIcons[slug] || collectionIcons.default;
}

function buildNavGroups(): GroupItem[] {
  const groups = getGroupedCollections();
  const collectionsByGroup = getCollectionsByGroup();

  return groups
    .map((group) => {
      const collections = collectionsByGroup.get(group.key) ?? [];
      if (collections.length === 0) return null;

      return {
        key: group.key,
        label: group.label,
        collections: collections.map((collection) => ({
          key: collection.slug,
          label: collection.labels.plural,
          href: `/admin/${collection.slug}`,
          icon: getCollectionIcon(collection.slug),
          children: [
            { label: `All ${collection.labels.plural}`, href: `/admin/${collection.slug}` },
            { label: 'Add New', href: `/admin/${collection.slug}/new` },
          ],
        })),
      } satisfies GroupItem;
    })
    .filter((group): group is GroupItem => group !== null);
}

function isPathActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getInitialGroupState(navGroups: GroupItem[], pathname: string): Record<string, boolean> {
  const state: Record<string, boolean> = {};
  for (const group of navGroups) {
    state[group.key] = group.collections.some((collection) => isPathActive(pathname, collection.href));
  }
  return state;
}

function getInitialCollectionState(navGroups: GroupItem[], pathname: string): Record<string, boolean> {
  const state: Record<string, boolean> = {};
  for (const group of navGroups) {
    for (const collection of group.collections) {
      state[collection.key] = isPathActive(pathname, collection.href);
    }
  }
  return state;
}

export function AdminSidebar() {
  const pathname = usePathname();
  const navGroups = useMemo(() => buildNavGroups(), []);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    getInitialGroupState(navGroups, pathname)
  );
  const [openCollections, setOpenCollections] = useState<Record<string, boolean>>(() =>
    getInitialCollectionState(navGroups, pathname)
  );

  useEffect(() => {
    setOpenGroups((prev) => {
      let changed = false;
      const next = { ...prev };

      for (const group of navGroups) {
        const isActive = group.collections.some((collection) => isPathActive(pathname, collection.href));
        if (isActive && !next[group.key]) {
          next[group.key] = true;
          changed = true;
        }
      }

      return changed ? next : prev;
    });

    setOpenCollections((prev) => {
      let changed = false;
      const next = { ...prev };

      for (const group of navGroups) {
        for (const collection of group.collections) {
          if (isPathActive(pathname, collection.href) && !next[collection.key]) {
            next[collection.key] = true;
            changed = true;
          }
        }
      }

      return changed ? next : prev;
    });
  }, [pathname, navGroups]);

  useEffect(() => {
    const rawGroups = localStorage.getItem('adminSidebarOpenGroups');
    const rawCollections = localStorage.getItem('adminSidebarOpenCollections');

    if (rawGroups) {
      try {
        const savedGroups = JSON.parse(rawGroups) as Record<string, boolean>;
        setOpenGroups((prev) => ({ ...savedGroups, ...prev }));
      } catch {
        // Ignore malformed localStorage value.
      }
    }

    if (rawCollections) {
      try {
        const savedCollections = JSON.parse(rawCollections) as Record<string, boolean>;
        setOpenCollections((prev) => ({ ...savedCollections, ...prev }));
      } catch {
        // Ignore malformed localStorage value.
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('adminSidebarOpenGroups', JSON.stringify(openGroups));
  }, [openGroups]);

  useEffect(() => {
    localStorage.setItem('adminSidebarOpenCollections', JSON.stringify(openCollections));
  }, [openCollections]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen((prev) => !prev)}
        className="fixed left-2 top-1.5 z-[70] flex h-7 w-7 items-center justify-center rounded border border-border bg-background/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-secondary md:hidden"
        aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
      >
        {mobileOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
      </button>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={cn(
          'fixed bottom-0 left-0 top-[var(--admin-topbar-height)] z-50 w-[min(85vw,16rem)] border-r border-border bg-background/95 shadow-xl backdrop-blur transition-transform md:z-40 md:w-[var(--admin-sidebar-width)] md:shadow-none',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
      <div className="flex h-full flex-col">
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2">
          <ul className="space-y-0.5">
            <li>
              <Link
                href="/admin"
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors',
                  pathname === '/admin'
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'hover:bg-secondary'
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </li>

            {navGroups.map((group) => {
              const isGroupOpen = openGroups[group.key] ?? false;

              return (
                <li key={group.key} className="pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenGroups((prev) => ({ ...prev, [group.key]: !isGroupOpen }))
                    }
                    className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-secondary"
                  >
                    <span className="truncate">{group.label}</span>
                    {isGroupOpen ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </button>

                  {isGroupOpen && (
                    <ul className="mt-0.5 space-y-0.5 pl-1.5">
                      {group.collections.map((collection) => {
                        const isCollectionOpen = openCollections[collection.key] ?? false;
                        const isCollectionActive = isPathActive(pathname, collection.href);
                        const Icon = collection.icon;

                        return (
                          <li key={collection.key}>
                            <button
                              type="button"
                              onClick={() =>
                                setOpenCollections((prev) => ({
                                  ...prev,
                                  [collection.key]: !isCollectionOpen,
                                }))
                              }
                              className={cn(
                                'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition-colors',
                                isCollectionActive
                                  ? 'bg-primary/10 text-primary'
                                  : 'hover:bg-secondary'
                              )}
                            >
                              <span className="flex min-w-0 items-center gap-1.5">
                                <Icon className="h-4 w-4 shrink-0" />
                                <span className="truncate">{collection.label}</span>
                              </span>
                              {isCollectionOpen ? (
                                <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                              ) : (
                                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                              )}
                            </button>

                            {isCollectionOpen && (
                              <ul className="mt-0.5 space-y-0.5 pl-5">
                                {collection.children.map((child) => (
                                  <li key={child.href}>
                                    <Link
                                      href={child.href}
                                      className={cn(
                                        'flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors',
                                        pathname === child.href
                                          ? 'bg-primary/10 text-primary'
                                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                      )}
                                    >
                                      {child.label === 'Add New' && <FilePlus2 className="h-3.5 w-3.5" />}
                                      <span className="truncate">{child.label}</span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-2">
          <Link
            href="/"
            className="block rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            View Site
          </Link>
        </div>
      </div>
      </aside>
    </>
  );
}
