'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart2,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Database,
  ExternalLink,
  FilePlus2,
  FileText,
  Image,
  Key,
  LayoutDashboard,
  LayoutTemplate,
  MenuSquare,
  MessageSquare,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Settings2,
  Shield,
  SquareDashedBottom,
  Tag,
  Users,
} from 'lucide-react';
import { type ElementType, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { getCollectionsByGroup, getGroupedCollections } from '@/lib/collections-data';
import adminConfig from '@/admin.config';
import type { NextPressAdminSidebarLinkConfig } from '@/core/types';

// ── Icon registry ─────────────────────────────────────────────────────────
// Maps Lucide icon names (PascalCase) to their components.
// Add new icons here when you use new names in admin.config.ts.
const ICON_REGISTRY: Record<string, ElementType> = {
  BarChart2,
  BookOpen,
  Database,
  FileText,
  Image,
  Key,
  LayoutDashboard,
  LayoutTemplate,
  MenuSquare,
  MessageSquare,
  Palette,
  Settings,
  Settings2,
  Shield,
  SquareDashedBottom,
  Tag,
  Users,
  default: Database,
};

function resolveIcon(name: string | undefined): ElementType | undefined {
  if (!name) return undefined;
  return ICON_REGISTRY[name];
}

// resolveIcon with a guaranteed fallback — used only for custom sidebar links
function resolveIconWithFallback(name: string | undefined): ElementType {
  return ICON_REGISTRY[name ?? ''] ?? ICON_REGISTRY.default;
}

// ── Types ─────────────────────────────────────────────────────────────────

type CollectionItem = {
  key: string;
  label: string;
  href: string;
  icon: ElementType | undefined;
  children: { label: string; href: string }[];
  /** Collections nested under this one in the sidebar */
  subCollections: CollectionItem[];
};

type GroupItem = {
  key: string;
  label: string;
  icon: ElementType | undefined;
  collections: CollectionItem[];
};

// ── Nav builder ───────────────────────────────────────────────────────────

function buildNavGroups(): GroupItem[] {
  const sidebarCfg = adminConfig.sidebar ?? {};
  const configGroups = sidebarCfg.groups ?? [];
  const configCollections = sidebarCfg.collections ?? {};

  // Config group lookup by key
  const groupCfgMap = new Map(configGroups.map((g) => [g.key, g]));

  // Data groups (derived from collection definitions)
  const dataGroups = getGroupedCollections();
  const collectionsByGroup = getCollectionsByGroup();

  // Merge data groups with config overrides, then sort by config order
  const merged = dataGroups.map((dg) => {
    const cfg = groupCfgMap.get(dg.key);
    return {
      key: dg.key,
      label: cfg?.label ?? dg.label,
      icon: resolveIcon(cfg?.icon),
      order: cfg?.order ?? dg.order,
    };
  });
  merged.sort((a, b) => a.order - b.order);

  // Slugs that are configured as children of another collection
  const childSlugs = new Set(
    Object.entries(configCollections)
      .filter(([, cfg]) => cfg.parent)
      .map(([slug]) => slug)
  );

  // Helper: build a CollectionItem for a given collection slug + definition
  function buildItem(col: { slug: string; labels: { plural: string } }): CollectionItem {
    const colCfg = configCollections[col.slug] ?? {};
    const showAddNew = colCfg.showAddNew !== false;
    return {
      key: col.slug,
      label: colCfg.label ?? col.labels.plural,
      href: `/admin/${col.slug}`,
      icon: resolveIcon(colCfg.icon ?? undefined),
      children: [
        { label: `All ${col.labels.plural}`, href: `/admin/${col.slug}` },
        ...(showAddNew ? [{ label: 'Add New', href: `/admin/${col.slug}/new` }] : []),
      ],
      subCollections: [],
    };
  }

  // Build ALL collection items (keyed by slug) — needed to resolve parents
  const allItems = new Map<string, CollectionItem>();
  for (const [, collections] of collectionsByGroup) {
    for (const col of collections) {
      if (!configCollections[col.slug]?.hidden) {
        allItems.set(col.slug, buildItem(col));
      }
    }
  }

  // Attach child collections to their configured parents
  for (const [slug, cfg] of Object.entries(configCollections)) {
    if (!cfg.parent) continue;
    const child = allItems.get(slug);
    const parent = allItems.get(cfg.parent);
    if (child && parent) {
      parent.subCollections.push(child);
    }
  }

  // Build groups — exclude collections that are nested under a parent
  return merged
    .map(({ key, label, icon }) => {
      const collections = collectionsByGroup.get(key) ?? [];

      const visibleCollections = collections
        .filter((col) => !configCollections[col.slug]?.hidden && !childSlugs.has(col.slug))
        .map((col) => allItems.get(col.slug)!)
        .filter(Boolean);

      if (visibleCollections.length === 0) return null;
      return { key, label, icon, collections: visibleCollections } satisfies GroupItem;
    })
    .filter((g): g is GroupItem => g !== null);
}

// ── Helpers ───────────────────────────────────────────────────────────────

function isPathActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function colIsActive(pathname: string, col: CollectionItem): boolean {
  return (
    isPathActive(pathname, col.href) ||
    col.subCollections.some((sub) => isPathActive(pathname, sub.href))
  );
}

function getInitialGroupState(
  navGroups: GroupItem[],
  pathname: string
): Record<string, boolean> {
  const state: Record<string, boolean> = {};
  for (const group of navGroups) {
    state[group.key] = group.collections.some((c) => colIsActive(pathname, c));
  }
  return state;
}

function getInitialCollectionState(
  navGroups: GroupItem[],
  pathname: string
): Record<string, boolean> {
  const state: Record<string, boolean> = {};
  for (const group of navGroups) {
    for (const col of group.collections) {
      // Auto-expand parent if a sub-collection is active
      state[col.key] = colIsActive(pathname, col);
      for (const sub of col.subCollections) {
        state[sub.key] = isPathActive(pathname, sub.href);
      }
    }
  }
  return state;
}

// ── Sidebar link (custom top/footer links) ────────────────────────────────

function SidebarLink({
  link,
  pathname,
}: {
  link: NextPressAdminSidebarLinkConfig;
  pathname: string;
}) {
  const Icon = resolveIconWithFallback(link.icon);
  const isActive = isPathActive(pathname, link.href);
  return (
    <Link
      href={link.href}
      target={link.external ? '_blank' : undefined}
      rel={link.external ? 'noreferrer' : undefined}
      className={cn(
        'flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors',
        isActive
          ? 'bg-primary/10 font-medium text-primary'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="truncate">{link.label}</span>
      {link.external && (
        <ExternalLink className="h-3 w-3 ml-auto shrink-0 text-muted-foreground" />
      )}
    </Link>
  );
}

// ── AdminSidebar ──────────────────────────────────────────────────────────

export function AdminSidebar() {
  const pathname = usePathname();
  const navGroups = useMemo(() => buildNavGroups(), []);
  const [mobileOpen, setMobileOpen] = useState(false);

  const topLinks = adminConfig.sidebar?.topLinks ?? [];
  const footerLinks = adminConfig.sidebar?.footerLinks ?? [];

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    getInitialGroupState(navGroups, pathname)
  );
  const [openCollections, setOpenCollections] = useState<Record<string, boolean>>(() =>
    getInitialCollectionState(navGroups, pathname)
  );

  // Auto-expand groups / collections when the route changes
  useEffect(() => {
    setOpenGroups((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const group of navGroups) {
        const isActive = group.collections.some((c) => colIsActive(pathname, c));
        if (isActive && !next[group.key]) { next[group.key] = true; changed = true; }
      }
      return changed ? next : prev;
    });
    setOpenCollections((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const group of navGroups) {
        for (const col of group.collections) {
          if (colIsActive(pathname, col) && !next[col.key]) {
            next[col.key] = true; changed = true;
          }
          for (const sub of col.subCollections) {
            if (isPathActive(pathname, sub.href) && !next[sub.key]) {
              next[sub.key] = true; changed = true;
            }
          }
        }
      }
      return changed ? next : prev;
    });
  }, [pathname, navGroups]);

  // Restore collapsed/expanded state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('adminSidebarOpenGroups');
      if (raw) setOpenGroups((p) => ({ ...(JSON.parse(raw) as Record<string, boolean>), ...p }));
    } catch { /* ignore */ }
    try {
      const raw = localStorage.getItem('adminSidebarOpenCollections');
      if (raw) setOpenCollections((p) => ({ ...(JSON.parse(raw) as Record<string, boolean>), ...p }));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem('adminSidebarOpenGroups', JSON.stringify(openGroups));
  }, [openGroups]);

  useEffect(() => {
    localStorage.setItem('adminSidebarOpenCollections', JSON.stringify(openCollections));
  }, [openCollections]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        type="button"
        onClick={() => setMobileOpen((prev) => !prev)}
        className="fixed left-2 top-1.5 z-[70] flex h-7 w-7 items-center justify-center rounded border border-border bg-background/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-secondary md:hidden"
        aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
      >
        {mobileOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
      </button>

      {/* Mobile backdrop */}
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

          {/* Scrollable nav */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2">
            <ul className="space-y-0.5">

              {/* Dashboard */}
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

              {/* Custom top links */}
              {topLinks.map((link) => (
                <li key={link.href}>
                  <SidebarLink link={link} pathname={pathname} />
                </li>
              ))}

              {/* Collection groups */}
              {navGroups.map((group) => {
                const isGroupOpen = openGroups[group.key] ?? false;
                const GroupIcon = group.icon;

                return (
                  <li key={group.key} className="pt-1">
                    {/* Group header (collapsible) */}
                    <button
                      type="button"
                      onClick={() =>
                        setOpenGroups((prev) => ({ ...prev, [group.key]: !isGroupOpen }))
                      }
                      className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-secondary"
                    >
                      <span className="flex min-w-0 items-center gap-1.5">
                        {GroupIcon && <GroupIcon className="h-3.5 w-3.5 shrink-0" />}
                        <span className="truncate">{group.label}</span>
                      </span>
                      {isGroupOpen
                        ? <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                        : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
                    </button>

                    {isGroupOpen && (
                      <ul className="mt-0.5 space-y-0.5 pl-1.5">
                        {group.collections.map((col) => {
                          const isColOpen = openCollections[col.key] ?? false;
                          const isColActive = isPathActive(pathname, col.href);
                          const ColIcon = col.icon;

                          // Single-item collection: render as a direct link, no sub-menu toggle
                          const isSingleItem =
                            col.children.length === 1 && col.subCollections.length === 0;

                          return (
                            <li key={col.key}>
                              {isSingleItem ? (
                                <Link
                                  href={col.href}
                                  className={cn(
                                    'flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors',
                                    isColActive
                                      ? 'bg-primary/10 text-primary'
                                      : 'hover:bg-secondary'
                                  )}
                                >
                                  {ColIcon && <ColIcon className="h-4 w-4 shrink-0" />}
                                  <span className="truncate">{col.label}</span>
                                </Link>
                              ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenCollections((prev) => ({
                                    ...prev,
                                    [col.key]: !isColOpen,
                                  }))
                                }
                                className={cn(
                                  'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition-colors',
                                  isColActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'hover:bg-secondary'
                                )}
                              >
                                <span className="flex min-w-0 items-center gap-1.5">
                                  {ColIcon && <ColIcon className="h-4 w-4 shrink-0" />}
                                  <span className="truncate">{col.label}</span>
                                </span>
                                {isColOpen
                                  ? <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                                  : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
                              </button>
                              )}

                              {!isSingleItem && isColOpen && (
                                <ul className="mt-0.5 space-y-0.5 pl-5">
                                  {/* Direct links: All X, Add New */}
                                  {col.children.map((child) => (
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
                                        {child.label === 'Add New' && (
                                          <FilePlus2 className="h-3.5 w-3.5" />
                                        )}
                                        <span className="truncate">{child.label}</span>
                                      </Link>
                                    </li>
                                  ))}

                                  {/* Sub-collections nested under this collection */}
                                  {col.subCollections.map((sub) => {
                                    const isSubOpen = openCollections[sub.key] ?? false;
                                    const isSubActive = isPathActive(pathname, sub.href);
                                    const SubIcon = sub.icon;
                                    const isSubSingle = sub.children.length === 1;

                                    return (
                                      <li key={sub.key}>
                                        {isSubSingle ? (
                                          <Link
                                            href={sub.href}
                                            className={cn(
                                              'flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors',
                                              isSubActive
                                                ? 'bg-primary/10 text-primary'
                                                : 'hover:bg-secondary'
                                            )}
                                          >
                                            {SubIcon && <SubIcon className="h-3.5 w-3.5 shrink-0" />}
                                            <span className="truncate">{sub.label}</span>
                                          </Link>
                                        ) : (
                                          <>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setOpenCollections((prev) => ({
                                                  ...prev,
                                                  [sub.key]: !isSubOpen,
                                                }))
                                              }
                                              className={cn(
                                                'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition-colors',
                                                isSubActive
                                                  ? 'bg-primary/10 text-primary'
                                                  : 'hover:bg-secondary'
                                              )}
                                            >
                                              <span className="flex min-w-0 items-center gap-1.5">
                                                {SubIcon && <SubIcon className="h-3.5 w-3.5 shrink-0" />}
                                                <span className="truncate">{sub.label}</span>
                                              </span>
                                              {isSubOpen
                                                ? <ChevronDown className="h-3 w-3 shrink-0" />
                                                : <ChevronRight className="h-3 w-3 shrink-0" />}
                                            </button>

                                            {isSubOpen && (
                                              <ul className="mt-0.5 space-y-0.5 pl-4">
                                                {sub.children.map((child) => (
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
                                                      {child.label === 'Add New' && (
                                                        <FilePlus2 className="h-3 w-3" />
                                                      )}
                                                      <span className="truncate">{child.label}</span>
                                                    </Link>
                                                  </li>
                                                ))}
                                              </ul>
                                            )}
                                          </>
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
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer links */}
          <div className="border-t border-border p-2 space-y-0.5">
            <Link
              href="/"
              className="block rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              View Site
            </Link>
            {footerLinks.map((link) => (
              <SidebarLink key={link.href} link={link} pathname={pathname} />
            ))}
          </div>

        </div>
      </aside>
    </>
  );
}
