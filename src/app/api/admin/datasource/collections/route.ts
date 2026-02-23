/**
 * GET /api/admin/datasource/collections
 *
 * Returns all queryable collections with their derived filter/sort fields.
 * Collections opt out by setting `queryable: false` in their CollectionConfig.
 * Filter and sort fields are derived automatically from each collection's
 * field definitions — no manual registration required.
 */

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { collections } from '@/collections/index';
import type { CollectionFieldMeta } from '@/lib/collections-data';

// ─── Shared types (also used by DataSourceBuilder) ────────────────────────────

export type QueryableFieldType = 'text' | 'number' | 'select' | 'relationship';

export interface QueryableFilterField {
  /** DB field name used as the key in the Prisma where clause */
  name: string;
  label: string;
  type: QueryableFieldType;
  /** For select fields */
  options?: { label: string; value: string }[];
  /** For relationship fields: the collection slug to fetch picker options from */
  relationTo?: string;
}

export interface QueryableSortField {
  name: string;
  label: string;
}

export interface QueryableCollectionMeta {
  slug: string;
  label: string;
  filterFields: QueryableFilterField[];
  sortFields: QueryableSortField[];
  defaultSort?: { field: string; direction: 'asc' | 'desc' };
}

// ─── Field derivation ─────────────────────────────────────────────────────────

function deriveFilterFields(
  fields: Array<{ name: string; type: string; label?: string; admin?: { hidden?: boolean }; localized?: boolean; options?: { label: string; value: string }[]; relationTo?: string | string[]; hasMany?: boolean }>
): QueryableFilterField[] {
  const result: QueryableFilterField[] = [];

  for (const f of fields) {
    if (f.admin?.hidden) continue;
    if (f.localized) continue; // locale-first JSON — can't do simple equality filter

    const label = f.label ?? f.name;

    if (f.type === 'select' && f.options && f.options.length > 0) {
      result.push({ name: f.name, label, type: 'select', options: f.options });
    } else if (f.type === 'relationship' && !f.hasMany && f.relationTo) {
      const target = Array.isArray(f.relationTo) ? f.relationTo[0] : f.relationTo;
      // FK column in Prisma is `${name}Id`
      result.push({ name: `${f.name}Id`, label, type: 'relationship', relationTo: target });
    } else if (f.type === 'text' || f.type === 'email') {
      result.push({ name: f.name, label, type: 'text' });
    } else if (f.type === 'number') {
      result.push({ name: f.name, label, type: 'number' });
    }
    // Skip: json, richText, array, group, upload, textarea, date, checkbox, localized
  }

  return result;
}

function deriveSortFields(
  fields: Array<{ name: string; type: string; label?: string; admin?: { hidden?: boolean }; localized?: boolean }>
): QueryableSortField[] {
  const result: QueryableSortField[] = [];

  for (const f of fields) {
    if (f.admin?.hidden) continue;
    if (f.localized) continue;

    const label = f.label ?? f.name;

    if (f.type === 'date' || f.type === 'number') {
      result.push({ name: f.name, label });
    } else if (f.type === 'text') {
      result.push({ name: f.name, label });
    }
  }

  // Always include standard timestamp fields if not already present
  if (!result.some((f) => f.name === 'createdAt')) {
    result.push({ name: 'createdAt', label: 'Created Date' });
  }
  if (!result.some((f) => f.name === 'updatedAt')) {
    result.push({ name: 'updatedAt', label: 'Updated Date' });
  }

  return result;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const queryable: QueryableCollectionMeta[] = collections
    .filter((c) => c.queryable !== false)
    .map((c) => {
      const rawFields = c.fields as Array<{
        name: string;
        type: string;
        label?: string;
        admin?: { hidden?: boolean };
        localized?: boolean;
        options?: { label: string; value: string }[];
        relationTo?: string | string[];
        hasMany?: boolean;
      }>;

      const filterFields = deriveFilterFields(rawFields);
      const sortFields = deriveSortFields(rawFields);

      return {
        slug: c.slug,
        label: c.labels?.plural ?? c.slug,
        filterFields,
        sortFields,
      };
    });

  return NextResponse.json({ collections: queryable });
}
