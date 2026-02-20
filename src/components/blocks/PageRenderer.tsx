import { getBlocksByIds } from '@/lib/cms';
import { getLocale } from '@/lib/locale-utils';
import { getBlockComponent } from './registry';

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
  type: string;
  content: Record<string, Record<string, unknown>>;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Renders a page's sections → columns → blocks.
 * Pre-loads all referenced blocks in a single DB query to avoid N+1.
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
                  className={[column.width, column.offset]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {column.blocks
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((ref) => {
                      const block = blockMap.get(ref.blockId);
                      if (!block) return null;

                      const Component = getBlockComponent(block.type);
                      if (!Component) {
                        return (
                          <div
                            key={ref.blockId}
                            className="p-4 border border-destructive text-destructive text-sm rounded"
                          >
                            Unknown block type: <code>{block.type}</code>
                          </div>
                        );
                      }

                      const content =
                        getLocale(block.content, locale) ?? {};

                      return (
                        <Component key={ref.blockId} content={content} />
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
