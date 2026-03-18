import { getBlocksByIds, queryCollection } from '@/lib/cms';
import { getLocale } from '@/lib/locale-utils';
import { getBlockComponent, getBlockManifest } from '@/core/blocks/registry';
import type { BlockDataSourceSpec, CollectionQueryParams } from '@/core/blocks/types';
import { AgbonProductNavProvider } from '@/contexts/agbon-product-nav-context';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlockRef {
  blockId: string;
  order: number;
}

interface Column {
  id: string;
  width?: string;
  customClassName?: string;
  customStyle?: string;
  offset?: string;
  blocks: BlockRef[];
}

interface Section {
  id: string;
  name: string;
  templateName?: string;
  customClassName?: string;
  customStyle?: string;
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

function isFullBleedColumn(column: Column): boolean {
  return !column.customClassName && column.width === 'full-bleed';
}

function parseInlineStyle(style: string | undefined): Record<string, string> | undefined {
  if (!style?.trim()) return undefined;

  const entries = style
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const idx = part.indexOf(':');
      if (idx === -1) return null;
      const key = part.slice(0, idx).trim();
      const value = part.slice(idx + 1).trim();
      if (!key || !value) return null;
      const camelKey = key.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
      return [camelKey, value] as const;
    })
    .filter((entry): entry is readonly [string, string] => entry !== null);

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

function getColumnClassName(column: Column, fallbackClassName?: string): string | undefined {
  if (column.customClassName) return column.customClassName;
  return [fallbackClassName, isFullBleedColumn(column) ? 'w-full' : column.width, column.offset]
    .filter(Boolean)
    .join(' ');
}

function getColumnStyle(column: Column): Record<string, string> | undefined {
  return parseInlineStyle(column.customStyle);
}

function getSectionClassName(section: Section, fallbackClassName?: string): string | undefined {
  return section.customClassName || fallbackClassName;
}

function getSectionStyle(section: Section): Record<string, string> | undefined {
  return parseInlineStyle(section.customStyle);
}

function renderColumnBlocks(
  column: Column,
  blockMap: Map<string, BlockRow>,
  locale: string,
  dataMap: Map<string, unknown[]>,
) {
  return column.blocks
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

      return <Component key={ref.blockId} content={content} data={data} />;
    });
}

function renderCatalogSection(
  section: Section,
  blockMap: Map<string, BlockRow>,
  locale: string,
  dataMap: Map<string, unknown[]>,
) {
  const sidebarColumn = section.columns[0];
  const mainColumns = section.columns.slice(1);
  const productNavMode =
    section.settings?.productNavMode === 'navigation' ? 'navigation' : 'filter';
  const syncWithUrl = Boolean(section.settings?.syncWithUrl);

  return (
    <AgbonProductNavProvider
      mode={productNavMode}
      syncWithUrl={syncWithUrl}
      locale={locale}
    >
      <div
        className={getSectionClassName(section, 'max-w-[90rem] mx-auto px-2 md:px-4 py-6')}
        style={getSectionStyle(section)}
      >
        <div className="flex items-start gap-2 md:gap-4">
          {sidebarColumn && (
            <div
              className={getColumnClassName(
                sidebarColumn,
                'w-16 md:w-64 lg:w-72 shrink-0 sticky top-5 self-start',
              )}
              style={getColumnStyle(sidebarColumn)}
            >
              {renderColumnBlocks(sidebarColumn, blockMap, locale, dataMap)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {mainColumns.length <= 1 ? (
              mainColumns[0] ? (
                <div className="flex flex-col space-y-6 md:space-y-8">
                  {renderColumnBlocks(mainColumns[0], blockMap, locale, dataMap)}
                </div>
              ) : null
            ) : (
              <div className="flex flex-wrap gap-4">
                {mainColumns.map((column) => (
                  <div
                    key={column.id}
                    className={getColumnClassName(column, 'w-full')}
                    style={getColumnStyle(column)}
                  >
                    <div className="flex flex-col space-y-6 md:space-y-8">
                      {renderColumnBlocks(column, blockMap, locale, dataMap)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AgbonProductNavProvider>
  );
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
        <section key={section.id} data-section={section.name} data-template={section.templateName}>
          {section.templateName === 'agbon-catalog' ? (
            renderCatalogSection(section, blockMap, locale, dataMap)
          ) : section.columns.every(isFullBleedColumn) ? (
            <div
              className={getSectionClassName(section, 'flex flex-wrap')}
              style={getSectionStyle(section)}
            >
              {section.columns.map((column) => (
                <div
                  key={column.id}
                  className={getColumnClassName(column)}
                  style={getColumnStyle(column)}
                >
                  {renderColumnBlocks(column, blockMap, locale, dataMap)}
                </div>
              ))}
            </div>
          ) : (
            <div
              className={getSectionClassName(section, 'container mx-auto px-4')}
              style={getSectionStyle(section)}
            >
              <div className="flex flex-wrap">
                {section.columns.map((column) => (
                  <div
                    key={column.id}
                    className={getColumnClassName(column)}
                    style={getColumnStyle(column)}
                  >
                    {renderColumnBlocks(column, blockMap, locale, dataMap)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ))}
    </>
  );
}
