import { getBlocksByIds, queryCollection } from '@/lib/cms';
import { getLocale } from '@/lib/locale-utils';
import { getBlockComponent, getBlockManifest } from '@/core/blocks/registry';
import type { BlockDataSourceSpec, CollectionQueryParams } from '@/core/blocks/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlockRef {
  blockId: string;
  order: number;
}

interface Column {
  id: string;
  width?: string;
  offset?: string;
  blocks: BlockRef[];
}

interface Section {
  id: string;
  name: string;
  templateName?: string;
  settings?: Record<string, unknown>;
  columns: Column[];
}

interface BlockRow {
  id: string;
  name: string;
  content: Record<string, Record<string, unknown>>;
  dataSource?: unknown;
}

interface DataFetchEntry {
  blockId: string;
  collection: string;
  params: CollectionQueryParams;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/**
 * Merges a manifest's defaultParams with admin-stored params.
 * Used as fallback when a block's dataSource was configured via the manifest spec
 * rather than the DataSourceBuilder (no collection key in stored params).
 */
function buildManifestParams(
  spec: BlockDataSourceSpec,
  stored: Record<string, unknown> | null,
): CollectionQueryParams {
  const merged: CollectionQueryParams = { ...(spec.defaultParams ?? {}) };
  if (!stored) return merged;

  if (typeof stored.limit === 'number') merged.limit = stored.limit;
  if (isRecord(stored.where)) merged.where = { ...(merged.where ?? {}), ...stored.where };
  if (isRecord(stored.orderBy)) merged.orderBy = stored.orderBy as Record<string, 'asc' | 'desc'>;

  return merged;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Renders a page's sections → columns → blocks.
 * Pre-loads all referenced blocks in a single DB query to avoid N+1.
 *
 * Data source resolution (in priority order):
 *   1. block.dataSource.collection (DB-stored, set via DataSourceBuilder)
 *   2. manifest.definition.dataSource.collection (manifest-declared, legacy)
 */
export async function PageRenderer({
  sections,
  locale,
}: {
  sections: Section[];
  locale: string;
}) {
  // Collect all block IDs referenced across all sections/columns
  const blockIds = sections.flatMap((s) =>
    s.columns.flatMap((c) => c.blocks.map((b) => b.blockId))
  );

  const blockRows = blockIds.length > 0 ? await getBlocksByIds(blockIds) : [];
  const blockMap = new Map<string, BlockRow>(
    blockRows.map((b: BlockRow) => [b.id, b])
  );

  // Determine which blocks need live data fetching
  const dataFetchEntries: DataFetchEntry[] = [];

  for (const row of blockRows as BlockRow[]) {
    const stored = isRecord(row.dataSource) ? row.dataSource : null;

    // Priority 1: DataSourceBuilder — collection stored in DB record
    if (typeof stored?.collection === 'string' && stored.collection) {
      dataFetchEntries.push({
        blockId: row.id,
        collection: stored.collection,
        params: {
          limit: typeof stored.limit === 'number' ? stored.limit : undefined,
          where: isRecord(stored.where) ? stored.where : undefined,
          orderBy: isRecord(stored.orderBy) ? (stored.orderBy as Record<string, 'asc' | 'desc'>) : undefined,
        },
      });
      continue;
    }

    // Priority 2: Manifest-declared dataSource (legacy / spec-constrained approach)
    const manifest = getBlockManifest(row.name);
    if (manifest?.definition.dataSource) {
      dataFetchEntries.push({
        blockId: row.id,
        collection: manifest.definition.dataSource.collection,
        params: buildManifestParams(manifest.definition.dataSource, stored),
      });
    }
  }

  // Run all data fetches in parallel
  const dataMap = new Map<string, unknown[]>();
  if (dataFetchEntries.length > 0) {
    const results = await Promise.all(
      dataFetchEntries.map(({ collection, params }) => queryCollection(collection, params))
    );
    dataFetchEntries.forEach(({ blockId }, i) => {
      dataMap.set(blockId, results[i]);
    });
  }

  return (
    <>
      {sections.map((section) => (
        <section
          key={section.id}
          data-section={section.name}
          data-template={section.templateName}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap">
              {section.columns.map((column) => (
                <div
                  key={column.id}
                  className={[column.width, column.offset].filter(Boolean).join(' ')}
                >
                  {column.blocks
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((ref) => {
                      const block = blockMap.get(ref.blockId);
                      if (!block) return null;

                      const Component = getBlockComponent(block.name);
                      if (!Component) {
                        return (
                          <div
                            key={ref.blockId}
                            className="p-4 border border-destructive text-destructive text-sm rounded"
                          >
                            Unknown block: <code>{block.name}</code>
                          </div>
                        );
                      }

                      const content = getLocale(block.content, locale) ?? {};
                      const data = dataMap.get(ref.blockId);

                      return (
                        <Component key={ref.blockId} content={content} data={data} />
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
