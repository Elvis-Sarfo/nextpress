'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart2,
  BookOpen,
  BriefcaseBusiness,
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
  Mail,
  Map as MapIcon,
  MenuSquare,
  MessageSquare,
  Package,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Settings2,
  Shield,
  ShoppingBag,
  SlidersHorizontal,
  SquareDashedBottom,
  Tag,
  Users,
} from 'lucide-react';
import { type ElementType, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { getCollections } from '@/lib/collections-data';
import adminConfig from '@/admin.config';
import type { NextPressAdminSidebarLinkConfig } from '@/core/types';

// ── Icon registry ─────────────────────────────────────────────────────────
// Maps Lucide icon names (PascalCase) to their components.
// Add new icons here when you use new names in admin.config.ts.
const ICON_REGISTRY: Record<string, ElementType> = {
  BarChart2,
  BookOpen,
  BriefcaseBusiness,
  Database,
  FileText,
  Image,
  Key,
  LayoutDashboard,
  LayoutTemplate,
  Mail,
  Map: MapIcon,
  MenuSquare,
  MessageSquare,
  Package,
  Palette,
  Settings,
  Settings2,
  Shield,
  ShoppingBag,
  SlidersHorizontal,
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

type StandaloneEntry = {
  kind: 'standalone';
  key: string;
  order: number;
  collection: CollectionItem;
};

type GroupEntry = {
  kind: 'group';
  key: string;
  order: number;
  group: GroupItem;
};

type NavEntry = StandaloneEntry | GroupEntry;

// ── Nav builder ───────────────────────────────────────────────────────────

function buildNav(): { entries: NavEntry[] } {
  const sidebarCfg = adminConfig.sidebar ?? {};
  const configGroups = sidebarCfg.groups ?? [];
  const configCollections = sidebarCfg.collections ?? {};
  const collections = getCollections();

  function getFallbackGroupKey(
    group: (typeof collections)[number]['admin']['group']
  ): string {
    if (typeof group === 'object' && group !== null && group.key) {
      return group.key;
    }
    if (typeof group === 'string' && group.trim()) {
      return group.toLowerCase();
    }
    return 'content';
  }

  function getFallbackGroupLabel(
    collection: (typeof collections)[number]
  ): string {
    if (typeof collection.admin.group === 'object' && collection.admin.group !== null) {
      return collection.admin.group.label || collection.admin.group.key;
    }
    if (typeof collection.admin.group === 'string' && collection.admin.group.trim()) {
      return collection.admin.group;
    }
    return 'Content';
  }

  function getFallbackGroupOrder(
    collection: (typeof collections)[number]
  ): number {
    if (typeof collection.admin.group === 'object' && collection.admin.group !== null) {
      return collection.admin.group.order ?? 99;
    }
    return 99;
  }

  function buildItem(col: (typeof collections)[number]): CollectionItem {
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

  const visibleCollections = collections.filter((collection) => !configCollections[collection.slug]?.hidden);
  const allItems = new Map(visibleCollections.map((collection) => [collection.slug, buildItem(collection)]));
  const standaloneSlugs = new Set(
    visibleCollections
      .filter((collection) => configCollections[collection.slug]?.standalone)
      .map((collection) => collection.slug)
  );

  const childSlugs = new Set<string>();
  for (const collection of visibleCollections) {
    const parentSlug = configCollections[collection.slug]?.parent;
    if (!parentSlug) continue;
    const parent = allItems.get(parentSlug);
    const child = allItems.get(collection.slug);
    if (parent && child) {
      parent.subCollections.push(child);
      childSlugs.add(collection.slug);
    }
  }

  const groupDefinitions = new Map<
    string,
    { key: string; label: string; icon: ElementType | undefined; order: number; items?: string[] }
  >();

  for (const group of configGroups) {
    groupDefinitions.set(group.key, {
      key: group.key,
      label: group.label ?? group.key,
      icon: resolveIcon(group.icon),
      order: group.order ?? 99,
      items: group.items,
    });
  }

  for (const collection of visibleCollections) {
    const colCfg = configCollections[collection.slug] ?? {};
    const groupKey = colCfg.group ?? getFallbackGroupKey(collection.admin.group);
    if (groupDefinitions.has(groupKey)) continue;
    groupDefinitions.set(groupKey, {
      key: groupKey,
      label: getFallbackGroupLabel(collection),
      icon: undefined,
      order: getFallbackGroupOrder(collection),
    });
  }

  const sortedGroups = Array.from(groupDefinitions.values()).sort((a, b) => a.order - b.order);

  const standaloneEntries = visibleCollections
    .filter((collection) => standaloneSlugs.has(collection.slug) && !childSlugs.has(collection.slug))
    .sort((a, b) => {
      const groupKeyA = configCollections[a.slug]?.group ?? getFallbackGroupKey(a.admin.group);
      const groupKeyB = configCollections[b.slug]?.group ?? getFallbackGroupKey(b.admin.group);
      const groupOrderA = groupDefinitions.get(groupKeyA)?.order ?? getFallbackGroupOrder(a);
      const groupOrderB = groupDefinitions.get(groupKeyB)?.order ?? getFallbackGroupOrder(b);
      if (groupOrderA !== groupOrderB) return groupOrderA - groupOrderB;
      const orderA = configCollections[a.slug]?.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = configCollections[b.slug]?.order ?? Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) return orderA - orderB;
      return a.labels.plural.localeCompare(b.labels.plural);
    })
    .map((collection) => {
      const item = allItems.get(collection.slug);
      if (!item) return null;
      const groupKey = configCollections[collection.slug]?.group ?? getFallbackGroupKey(collection.admin.group);
      const groupOrder = groupDefinitions.get(groupKey)?.order ?? getFallbackGroupOrder(collection);
      const itemOrder = configCollections[collection.slug]?.order ?? Number.MAX_SAFE_INTEGER;
      return {
        kind: 'standalone',
        key: collection.slug,
        order: groupOrder * 1000 + itemOrder,
        collection: item,
      } satisfies StandaloneEntry;
    })
    .filter((entry): entry is StandaloneEntry => Boolean(entry));

  const groupEntries = sortedGroups
    .map((group) => {
      const explicitItems = (group.items ?? [])
        .map((slug) => allItems.get(slug))
        .filter((item): item is CollectionItem => Boolean(item))
        .filter((item) => !childSlugs.has(item.key) && !standaloneSlugs.has(item.key));

      const configuredSlugs = new Set(group.items ?? []);
      const fallbackItems = visibleCollections
        .filter((collection) => {
          const colCfg = configCollections[collection.slug] ?? {};
          const groupKey = colCfg.group ?? getFallbackGroupKey(collection.admin.group);
          return (
            groupKey === group.key &&
            !childSlugs.has(collection.slug) &&
            !configuredSlugs.has(collection.slug) &&
            !standaloneSlugs.has(collection.slug)
          );
        })
        .sort((a, b) => {
          const orderA = configCollections[a.slug]?.order ?? Number.MAX_SAFE_INTEGER;
          const orderB = configCollections[b.slug]?.order ?? Number.MAX_SAFE_INTEGER;
          if (orderA !== orderB) return orderA - orderB;
          return a.labels.plural.localeCompare(b.labels.plural);
        })
        .map((collection) => allItems.get(collection.slug))
        .filter((item): item is CollectionItem => Boolean(item));

      const groupCollections = [...explicitItems, ...fallbackItems];
      if (groupCollections.length === 0) return null;

      return {
        kind: 'group',
        key: group.key,
        order: group.order * 1000,
        group: {
          key: group.key,
          label: group.label,
          icon: group.icon,
          collections: groupCollections,
        },
      } satisfies GroupEntry;
    })
    .filter((entry): entry is GroupEntry => Boolean(entry));

  const entries = [...standaloneEntries, ...groupEntries].sort((a, b) => a.order - b.order);
  return { entries };
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
  collections: CollectionItem[],
  pathname: string
): Record<string, boolean> {
  const state: Record<string, boolean> = {};
  for (const col of collections) {
    state[col.key] = colIsActive(pathname, col);
    for (const sub of col.subCollections) {
      state[sub.key] = isPathActive(pathname, sub.href);
    }
  }
  return state;
}

function getAllCollectionItems(
  navEntries: NavEntry[]
): CollectionItem[] {
  return navEntries.flatMap((entry) =>
    entry.kind === 'standalone' ? [entry.collection] : entry.group.collections
  );
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
  const nav = useMemo(() => buildNav(), []);
  const navEntries = nav.entries;
  const navGroups = navEntries
    .filter((entry): entry is GroupEntry => entry.kind === 'group')
    .map((entry) => entry.group);
  const standaloneCollections = navEntries
    .filter((entry): entry is StandaloneEntry => entry.kind === 'standalone')
    .map((entry) => entry.collection);
  const navCollections = useMemo(
    () => getAllCollectionItems(navEntries),
    [navEntries]
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newContactMessagesCount, setNewContactMessagesCount] = useState(0);

  const topLinks = adminConfig.sidebar?.topLinks ?? [];
  const footerLinks = adminConfig.sidebar?.footerLinks ?? [];

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    getInitialGroupState(navGroups, pathname)
  );
  const [openCollections, setOpenCollections] = useState<Record<string, boolean>>(() =>
    getInitialCollectionState(navCollections, pathname)
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
      for (const col of navCollections) {
        if (colIsActive(pathname, col) && !next[col.key]) {
          next[col.key] = true; changed = true;
        }
        for (const sub of col.subCollections) {
          if (isPathActive(pathname, sub.href) && !next[sub.key]) {
            next[sub.key] = true; changed = true;
          }
        }
      }
      return changed ? next : prev;
    });
  }, [pathname, navCollections, navGroups]);

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

  useEffect(() => {
    let cancelled = false;

    async function loadContactNotificationCount() {
      try {
        const filters = encodeURIComponent(JSON.stringify({ status: 'new' }));
        const response = await fetch(`/api/admin/collections/contact-messages?limit=1&filters=${filters}`);
        if (!response.ok) {
          throw new Error('Failed to load contact message notifications');
        }
        const data = await response.json();
        if (!cancelled) {
          setNewContactMessagesCount(typeof data.total === 'number' ? data.total : 0);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setNewContactMessagesCount(0);
        }
      }
    }

    void loadContactNotificationCount();
    const interval = window.setInterval(() => {
      void loadContactNotificationCount();
    }, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

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

              {navEntries.map((entry) => {
                if (entry.kind === 'standalone') {
                  const col = entry.collection;
                  const isColOpen = openCollections[col.key] ?? false;
                  const isColActive = isPathActive(pathname, col.href);
                  const ColIcon = col.icon;
                  const isSingleItem =
                    col.children.length === 1 && col.subCollections.length === 0;

                  return (
                    <li key={col.key} className="pt-1">
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
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="truncate">{col.label}</span>
                            {col.key === 'contact-messages' && newContactMessagesCount > 0 ? (
                              <span className="rounded-full bg-[#FFF1EB] px-1.5 py-0.5 text-[10px] font-semibold text-[#FF6B35]">
                                {newContactMessagesCount}
                              </span>
                            ) : null}
                          </span>
                        </Link>
                      ) : (
                        <>
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
                              <span className="flex min-w-0 items-center gap-2">
                                <span className="truncate">{col.label}</span>
                                {col.key === 'contact-messages' && newContactMessagesCount > 0 ? (
                                  <span className="rounded-full bg-[#FFF1EB] px-1.5 py-0.5 text-[10px] font-semibold text-[#FF6B35]">
                                    {newContactMessagesCount}
                                  </span>
                                ) : null}
                              </span>
                            </span>
                            {isColOpen
                              ? <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                              : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
                          </button>

                          {isColOpen && (
                            <ul className="mt-0.5 space-y-0.5 pl-5">
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
                            </ul>
                          )}
                        </>
                      )}
                    </li>
                  );
                }

                const group = entry.group;
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
                                  <span className="flex min-w-0 items-center gap-2">
                                    <span className="truncate">{col.label}</span>
                                    {col.key === 'contact-messages' && newContactMessagesCount > 0 ? (
                                      <span className="rounded-full bg-[#FFF1EB] px-1.5 py-0.5 text-[10px] font-semibold text-[#FF6B35]">
                                        {newContactMessagesCount}
                                      </span>
                                    ) : null}
                                  </span>
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
                                    <span className="flex min-w-0 items-center gap-2">
                                      <span className="truncate">{col.label}</span>
                                      {col.key === 'contact-messages' && newContactMessagesCount > 0 ? (
                                        <span className="rounded-full bg-[#FFF1EB] px-1.5 py-0.5 text-[10px] font-semibold text-[#FF6B35]">
                                          {newContactMessagesCount}
                                        </span>
                                      ) : null}
                                    </span>
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
              target="_blank"
              rel="noreferrer"
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
