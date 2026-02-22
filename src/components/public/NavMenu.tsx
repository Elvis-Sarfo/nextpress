/**
 * NavMenu — public navigation component (RSC).
 *
 * Renders a menu tree fetched from the DB. Supports:
 * - Horizontal (default) or vertical orientation
 * - CSS-only dropdowns for nested items (group-hover, no JS)
 * - Three item types: page (resolved URL), custom URL, section header
 */

import Link from 'next/link';
import type { MenuWithItems, MenuItem } from '@/lib/cms';

interface NavMenuProps {
  menu: MenuWithItems | null;
  locale: string;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

function resolveUrl(item: MenuItem, locale: string): string {
  if (item.type === 'custom') return item.url ?? '#';
  if (item.type === 'page') {
    const slug =
      item.slugsByLocale?.[locale] ??
      item.slugsByLocale?.['en'] ??
      '';
    return slug ? `/${locale}/${slug}` : '#';
  }
  return '#';
}

interface NavItemProps {
  item: MenuItem;
  locale: string;
  depth: number;
  orientation: 'horizontal' | 'vertical';
}

function NavItem({ item, locale, depth, orientation }: NavItemProps) {
  const hasChildren = (item.children?.length ?? 0) > 0;
  const url = resolveUrl(item, locale);
  const isRoot = depth === 0;

  const linkClass =
    isRoot && orientation === 'horizontal'
      ? 'text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1'
      : 'block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors';

  return (
    <li className={isRoot && orientation === 'horizontal' ? 'relative group' : 'relative group'}>
      {item.type === 'section' ? (
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 block">
          {item.label}
        </span>
      ) : (
        <Link
          href={url}
          target={item.target === '_blank' ? '_blank' : undefined}
          rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
          className={linkClass}
        >
          {item.label}
        </Link>
      )}

      {hasChildren && (
        <ul
          className={
            isRoot && orientation === 'horizontal'
              ? // Desktop dropdown: appears on hover below the parent
                'absolute top-full left-0 z-50 hidden group-hover:flex flex-col bg-background border rounded-lg shadow-md min-w-44 py-1 mt-1'
              : // Nested vertical: indented
                'ml-3 mt-0.5 border-l border-border pl-3 space-y-0.5'
          }
        >
          {item.children!.map((child) => (
            <NavItem
              key={child.id}
              item={child}
              locale={locale}
              depth={depth + 1}
              orientation={orientation}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function NavMenu({ menu, locale, className, orientation = 'horizontal' }: NavMenuProps) {
  if (!menu || menu.items.length === 0) return null;

  return (
    <nav className={className} aria-label={menu.name}>
      <ul
        className={
          orientation === 'horizontal'
            ? 'flex items-center gap-6'
            : 'flex flex-col gap-1'
        }
      >
        {menu.items.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            locale={locale}
            depth={0}
            orientation={orientation}
          />
        ))}
      </ul>
    </nav>
  );
}
