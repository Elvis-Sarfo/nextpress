'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlockPickerModal } from './BlockPickerModal';

// ── Types ──────────────────────────────────────────────────────────────────────
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
  name?: string;
  templateName?: string;
  columns: Column[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function parseSections(value: unknown): Section[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (s): s is Section =>
      typeof s === 'object' && s !== null && 'id' in s && Array.isArray((s as Section).columns)
  );
}

const WIDTH_OPTIONS = [
  { label: 'Full', value: 'w-full' },
  { label: '1/2', value: 'w-1/2' },
  { label: '1/3', value: 'w-1/3' },
  { label: '2/3', value: 'w-2/3' },
  { label: '1/4', value: 'w-1/4' },
];

// ── Component ─────────────────────────────────────────────────────────────────
interface PageSectionsEditorProps {
  value: unknown;
  onChange: (sections: Section[]) => void;
}

export function PageSectionsEditor({ value, onChange }: PageSectionsEditorProps) {
  const [sections, setSections] = useState<Section[]>(() => parseSections(value));
  const [blockNames, setBlockNames] = useState<Map<string, { name: string; type: string }>>(new Map());
  const [pickerSectionId, setPickerSectionId] = useState<string | null>(null);
  const [pickerColumnId, setPickerColumnId] = useState<string | null>(null);

  // Keep blockNames map in sync
  useEffect(() => {
    fetch('/api/admin/collections/blocks?limit=200')
      .then((r) => r.json())
      .then((data) => {
        const map = new Map<string, { name: string; type: string }>();
        for (const b of (data.docs as Array<{ id: string; name: string; type: string }>) ?? []) {
          map.set(b.id, { name: b.name, type: b.type });
        }
        setBlockNames(map);
      })
      .catch(console.error);
  }, []);

  // Notify parent whenever sections change
  const update = (next: Section[]) => {
    setSections(next);
    onChange(next);
  };

  // ── Section operations ───────────────────────────────────────────────────────
  const addSection = () => {
    update([
      ...sections,
      { id: uid(), name: '', columns: [{ id: uid(), width: 'w-full', blocks: [] }] },
    ]);
  };

  const removeSection = (sectionId: string) => {
    update(sections.filter((s) => s.id !== sectionId));
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const next = [...sections];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    update(next);
  };

  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    const next = [...sections];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    update(next);
  };

  const updateSectionName = (sectionId: string, name: string) => {
    update(sections.map((s) => (s.id === sectionId ? { ...s, name } : s)));
  };

  // ── Column operations ────────────────────────────────────────────────────────
  const addColumn = (sectionId: string) => {
    update(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, columns: [...s.columns, { id: uid(), width: 'w-full', blocks: [] }] }
          : s
      )
    );
  };

  const removeColumn = (sectionId: string, columnId: string) => {
    update(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, columns: s.columns.filter((c) => c.id !== columnId) }
          : s
      )
    );
  };

  const updateColumnWidth = (sectionId: string, columnId: string, width: string) => {
    update(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              columns: s.columns.map((c) => (c.id === columnId ? { ...c, width } : c)),
            }
          : s
      )
    );
  };

  // ── Block operations ─────────────────────────────────────────────────────────
  const addBlock = (sectionId: string, columnId: string, blockId: string) => {
    update(
      sections.map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          columns: s.columns.map((c) => {
            if (c.id !== columnId) return c;
            const next: BlockRef = { blockId, order: c.blocks.length };
            return { ...c, blocks: [...c.blocks, next] };
          }),
        };
      })
    );
  };

  const removeBlock = (sectionId: string, columnId: string, blockIndex: number) => {
    update(
      sections.map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          columns: s.columns.map((c) => {
            if (c.id !== columnId) return c;
            const next = c.blocks.filter((_, i) => i !== blockIndex).map((b, i) => ({ ...b, order: i }));
            return { ...c, blocks: next };
          }),
        };
      })
    );
  };

  const moveBlockUp = (sectionId: string, columnId: string, blockIndex: number) => {
    if (blockIndex === 0) return;
    update(
      sections.map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          columns: s.columns.map((c) => {
            if (c.id !== columnId) return c;
            const next = [...c.blocks];
            [next[blockIndex - 1], next[blockIndex]] = [next[blockIndex], next[blockIndex - 1]];
            return { ...c, blocks: next.map((b, i) => ({ ...b, order: i })) };
          }),
        };
      })
    );
  };

  const moveBlockDown = (sectionId: string, columnId: string, blockIndex: number, total: number) => {
    if (blockIndex === total - 1) return;
    update(
      sections.map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          columns: s.columns.map((c) => {
            if (c.id !== columnId) return c;
            const next = [...c.blocks];
            [next[blockIndex], next[blockIndex + 1]] = [next[blockIndex + 1], next[blockIndex]];
            return { ...c, blocks: next.map((b, i) => ({ ...b, order: i })) };
          }),
        };
      })
    );
  };

  const openPicker = (sectionId: string, columnId: string) => {
    setPickerSectionId(sectionId);
    setPickerColumnId(columnId);
  };

  const closePicker = () => {
    setPickerSectionId(null);
    setPickerColumnId(null);
  };

  const handlePickerSelect = (blockId: string) => {
    if (pickerSectionId && pickerColumnId) {
      addBlock(pickerSectionId, pickerColumnId, blockId);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {sections.length === 0 && (
        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          No sections yet. Add your first section below.
        </p>
      )}

      {sections.map((section, sectionIndex) => (
        <div key={section.id} className="rounded-lg border bg-card">
          {/* Section header */}
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <input
              type="text"
              value={section.name ?? ''}
              onChange={(e) => updateSectionName(section.id, e.target.value)}
              placeholder="Section name (optional)"
              className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => moveSectionUp(sectionIndex)}
              disabled={sectionIndex === 0}
              title="Move section up"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => moveSectionDown(sectionIndex)}
              disabled={sectionIndex === sections.length - 1}
              title="Move section down"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeSection(section.id)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              title="Remove section"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Columns */}
          <div className="flex flex-wrap gap-3 p-4">
            {section.columns.map((column) => (
              <div
                key={column.id}
                className="min-w-[200px] flex-1 rounded-md border border-dashed bg-muted/20 p-3 space-y-2"
              >
                {/* Column controls */}
                <div className="flex items-center gap-2">
                  <select
                    aria-label="Column width"
                    value={column.width ?? 'w-full'}
                    onChange={(e) => updateColumnWidth(section.id, column.id, e.target.value)}
                    className="flex-1 rounded border border-input bg-background px-2 py-1 text-xs"
                  >
                    {WIDTH_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {section.columns.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColumn(section.id, column.id)}
                      className="text-red-400 hover:text-red-600"
                      title="Remove column"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Blocks */}
                {column.blocks.length === 0 && (
                  <p className="text-center text-xs text-muted-foreground py-2">No blocks</p>
                )}
                {column.blocks.map((blockRef, blockIndex) => {
                  const meta = blockNames.get(blockRef.blockId);
                  return (
                    <div
                      key={`${blockRef.blockId}-${blockIndex}`}
                      className="flex items-center gap-1.5 rounded bg-background border px-2 py-1.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">
                          {meta?.name ?? blockRef.blockId}
                        </p>
                        {meta?.type && (
                          <p className="text-xs text-muted-foreground">{meta.type}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => moveBlockUp(section.id, column.id, blockIndex)}
                        disabled={blockIndex === 0}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                        title="Move block up"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlockDown(section.id, column.id, blockIndex, column.blocks.length)}
                        disabled={blockIndex === column.blocks.length - 1}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                        title="Move block down"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(section.id, column.id, blockIndex)}
                        className="text-red-400 hover:text-red-600"
                        title="Remove block"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}

                {/* Add block button */}
                <button
                  type="button"
                  onClick={() => openPicker(section.id, column.id)}
                  className="flex w-full items-center justify-center gap-1 rounded border border-dashed border-input py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus className="h-3 w-3" /> Add Block
                </button>
              </div>
            ))}

            {/* Add column button */}
            {section.columns.length < 4 && (
              <button
                type="button"
                onClick={() => addColumn(section.id)}
                className="flex min-w-[80px] flex-col items-center justify-center gap-1 rounded-md border border-dashed border-input px-4 py-6 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Column
              </button>
            )}
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addSection} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Section
      </Button>

      <BlockPickerModal
        open={pickerSectionId !== null}
        onClose={closePicker}
        onSelect={handlePickerSelect}
      />
    </div>
  );
}
