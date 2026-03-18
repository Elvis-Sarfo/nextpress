import type { LucideIcon } from 'lucide-react';
import {
  Bolt,
  Cog,
  Globe,
  Handshake,
  MapPin,
  Package,
  Search,
  Star,
  Tractor,
  User,
  Wheat,
  Wrench,
} from 'lucide-react';

export type BlockElementRecord = Record<string, unknown>;

const iconMap: Record<string, LucideIcon> = {
  bolt: Bolt,
  cog: Cog,
  globe: Globe,
  handshake: Handshake,
  mapPin: MapPin,
  package: Package,
  search: Search,
  star: Star,
  tractor: Tractor,
  user: User,
  wheat: Wheat,
  wrench: Wrench,
};

export function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

export function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

export function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true';
  return fallback;
}

export function asNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

export function asElements(value: unknown): BlockElementRecord[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (element): element is BlockElementRecord =>
      typeof element === 'object' && element !== null && !Array.isArray(element),
  );
}

export function parseJsonArray<T>(value: unknown): T[] | undefined {
  if (Array.isArray(value)) return value as T[];
  if (typeof value !== 'string' || !value.trim()) return undefined;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : undefined;
  } catch {
    return undefined;
  }
}

export function resolveItems<T>(items: T[], fallbackItems: T[]): T[] {
  return items.length > 0 ? items : fallbackItems;
}

export function resolveLink(
  label: unknown,
  href: unknown,
  fallbackLabel?: string,
  fallbackHref?: string,
): { label: string; href: string } | null {
  const finalLabel = asOptionalString(label) ?? fallbackLabel;
  const finalHref = asOptionalString(href) ?? fallbackHref;

  if (!finalLabel || !finalHref) return null;

  return {
    label: finalLabel,
    href: finalHref,
  };
}

export function getNamedIcon(name: unknown): LucideIcon {
  if (typeof name === 'string' && iconMap[name]) {
    return iconMap[name];
  }

  return Star;
}
