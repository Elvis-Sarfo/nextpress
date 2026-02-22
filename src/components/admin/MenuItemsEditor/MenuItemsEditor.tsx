'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Pencil, Trash2, Plus, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface MenuItem {
  id: string;
  label: string;
  type: 'page' | 'custom' | 'section';
  pageId?: string;
  slugsByLocale?: Record<string, string>;
  url?: string;
  target?: '_self' | '_blank';
  children?: MenuItem[];
}

interface PageOption {
  id: string;
  title: string;
}

// ============================================================================
// PURE TREE HELPERS (no mutation)
// ============================================================================

function updateItemInTree(items: MenuItem[], id: string, patch: Partial<MenuItem>): MenuItem[] {
  return items.map((item) => {
    if (item.id === id) return { ...item, ...patch };
    if (item.children?.length) {
      return { ...item, children: updateItemInTree(item.children, id, patch) };
    }
    return item;
  });
}

function deleteItemFromTree(items: MenuItem[], id: string): MenuItem[] {
  return items
    .filter((item) => item.id !== id)
    .map((item) =>
      item.children?.length
        ? { ...item, children: deleteItemFromTree(item.children, id) }
        : item
    );
}

function moveItemInList(items: MenuItem[], id: string, dir: 'up' | 'down'): MenuItem[] {
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) {
    // not at this level — recurse
    return items.map((item) =>
      item.children?.length
        ? { ...item, children: moveItemInList(item.children, id, dir) }
        : item
    );
  }
  const newItems = [...items];
  const target = dir === 'up' ? idx - 1 : idx + 1;
  if (target < 0 || target >= newItems.length) return newItems;
  [newItems[idx], newItems[target]] = [newItems[target], newItems[idx]];
  return newItems;
}

function addChildToItem(items: MenuItem[], parentId: string, child: MenuItem): MenuItem[] {
  return items.map((item) => {
    if (item.id === parentId) {
      return { ...item, children: [...(item.children ?? []), child] };
    }
    if (item.children?.length) {
      return { ...item, children: addChildToItem(item.children, parentId, child) };
    }
    return item;
  });
}

function newItem(): MenuItem {
  return {
    id: crypto.randomUUID(),
    label: 'New Item',
    type: 'custom',
    url: '',
    target: '_self',
    children: [],
  };
}

// ============================================================================
// PAGE PICKER
// ============================================================================

function PagePicker({ value, onChange }: { value: string; onChange: (id: string, title: string) => void }) {
  const [pages, setPages] = useState<PageOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/collections/pages?limit=200')
      .then((r) => r.json())
      .then((data) => {
        const docs = (data.docs ?? []) as Array<Record<string, unknown>>;
        setPages(
          docs.map((d) => {
            const titleField = d.title as Record<string, string> | string | null;
            const title =
              typeof titleField === 'object' && titleField !== null
                ? titleField['en'] ?? titleField[Object.keys(titleField)[0]] ?? String(d.id)
                : String(titleField ?? d.id);
            return { id: String(d.id), title };
          })
        );
      })
      .catch(() => setPages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => {
        const found = pages.find((p) => p.id === e.target.value);
        onChange(e.target.value, found?.title ?? '');
      }}
      disabled={loading}
      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <option value="">— Select a page —</option>
      {pages.map((p) => (
        <option key={p.id} value={p.id}>
          {p.title}
        </option>
      ))}
    </select>
  );
}

// ============================================================================
// ITEM EDIT FORM
// ============================================================================

interface ItemFormProps {
  item: MenuItem;
  onSave: (patch: Partial<MenuItem>) => void;
  onCancel: () => void;
}

function MenuItemForm({ item, onSave, onCancel }: ItemFormProps) {
  const [label, setLabel] = useState(item.label);
  const [type, setType] = useState<MenuItem['type']>(item.type);
  const [pageId, setPageId] = useState(item.pageId ?? '');
  const [pageLabel, setPageLabel] = useState('');
  const [url, setUrl] = useState(item.url ?? '');
  const [target, setTarget] = useState<'_self' | '_blank'>(item.target ?? '_self');

  const handleSave = () => {
    const patch: Partial<MenuItem> = { label, type, target };
    if (type === 'page') {
      patch.pageId = pageId;
      // preserve existing slugsByLocale — will be resolved at query time
    } else if (type === 'custom') {
      patch.url = url;
      patch.pageId = undefined;
    } else {
      patch.pageId = undefined;
      patch.url = undefined;
    }
    onSave(patch);
  };

  const inputBase =
    'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

  return (
    <div className="mt-2 rounded-lg border bg-muted/30 p-4 space-y-3">
      {/* Label */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className={inputBase}
          placeholder="Menu item label"
          autoFocus
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">Type</label>
        <div className="flex gap-4">
          {(['page', 'custom', 'section'] as const).map((t) => (
            <label key={t} className="flex items-center gap-1.5 cursor-pointer text-sm">
              <input
                type="radio"
                name={`type-${item.id}`}
                value={t}
                checked={type === t}
                onChange={() => setType(t)}
                className="h-3.5 w-3.5"
              />
              {t === 'page' ? 'Page' : t === 'custom' ? 'Custom URL' : 'Section Header'}
            </label>
          ))}
        </div>
      </div>

      {/* Conditional fields */}
      {type === 'page' && (
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Page</label>
          <PagePicker
            value={pageId}
            onChange={(id, title) => {
              setPageId(id);
              setPageLabel(title);
              if (!label || label === 'New Item') setLabel(title);
            }}
          />
          {pageLabel && <p className="mt-1 text-xs text-muted-foreground">Selected: {pageLabel}</p>}
        </div>
      )}

      {type === 'custom' && (
        <>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={inputBase}
              placeholder="https://example.com or /relative-path"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Open in</label>
            <div className="flex gap-4">
              {([['_self', 'Same tab'], ['_blank', 'New tab']] as const).map(([val, lbl]) => (
                <label key={val} className="flex items-center gap-1.5 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name={`target-${item.id}`}
                    value={val}
                    checked={target === val}
                    onChange={() => setTarget(val)}
                    className="h-3.5 w-3.5"
                  />
                  {lbl}
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button type="button" size="sm" onClick={handleSave}>
          Save
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// ITEM ROW
// ============================================================================

interface MenuItemRowProps {
  item: MenuItem;
  isFirst: boolean;
  isLast: boolean;
  depth: number;
  onUpdate: (id: string, patch: Partial<MenuItem>) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onAddChild: (parentId: string) => void;
}

function MenuItemRow({
  item,
  isFirst,
  isLast,
  depth,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddChild,
}: MenuItemRowProps) {
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const hasChildren = (item.children?.length ?? 0) > 0;

  const typeBadge: Record<MenuItem['type'], string> = {
    page: 'bg-blue-100 text-blue-700',
    custom: 'bg-gray-100 text-gray-600',
    section: 'bg-amber-100 text-amber-700',
  };

  return (
    <li className="select-none">
      {/* Row */}
      <div
        className={cn(
          'group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/40 transition-colors',
          editing && 'bg-muted/40'
        )}
      >
        {/* Expand toggle */}
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className={cn(
            'h-5 w-5 flex-shrink-0 rounded text-muted-foreground hover:text-foreground transition-colors',
            !hasChildren && 'invisible'
          )}
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Drag handle (visual only) */}
        <GripVertical className="h-4 w-4 flex-shrink-0 text-muted-foreground/40" />

        {/* Label */}
        <span className="flex-1 text-sm font-medium truncate">{item.label}</span>

        {/* Type badge */}
        <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0', typeBadge[item.type])}>
          {item.type}
        </span>

        {/* Controls (visible on hover) */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onMoveUp(item.id)}
            disabled={isFirst}
            title="Move up"
          >
            <ArrowUp className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onMoveDown(item.id)}
            disabled={isLast}
            title="Move down"
          >
            <ArrowDown className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setEditing((e) => !e)}
            title="Edit"
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => {
              if (confirm(`Delete "${item.label}"${hasChildren ? ' and all its children' : ''}?`))
                onDelete(item.id);
            }}
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground"
            onClick={() => {
              onAddChild(item.id);
              setExpanded(true);
            }}
            title="Add child item"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Inline edit form */}
      {editing && (
        <div className={cn('pl-10', depth > 0 && 'pl-12')}>
          <MenuItemForm
            item={item}
            onSave={(patch) => {
              onUpdate(item.id, patch);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        </div>
      )}

      {/* Children */}
      {hasChildren && expanded && (
        <MenuItemList
          items={item.children!}
          depth={depth + 1}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onAddChild={onAddChild}
        />
      )}
    </li>
  );
}

// ============================================================================
// ITEM LIST
// ============================================================================

interface MenuItemListProps {
  items: MenuItem[];
  depth: number;
  onUpdate: (id: string, patch: Partial<MenuItem>) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onAddChild: (parentId: string) => void;
}

function MenuItemList({ items, depth, onUpdate, onDelete, onMoveUp, onMoveDown, onAddChild }: MenuItemListProps) {
  return (
    <ul className={cn('space-y-0.5', depth > 0 && 'ml-6 border-l border-border pl-2 mt-0.5')}>
      {items.map((item, idx) => (
        <MenuItemRow
          key={item.id}
          item={item}
          isFirst={idx === 0}
          isLast={idx === items.length - 1}
          depth={depth}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onAddChild={onAddChild}
        />
      ))}
    </ul>
  );
}

// ============================================================================
// MAIN EDITOR
// ============================================================================

interface MenuItemsEditorProps {
  value: MenuItem[] | null;
  onChange: (items: MenuItem[]) => void;
}

export function MenuItemsEditor({ value, onChange }: MenuItemsEditorProps) {
  const [items, setItems] = useState<MenuItem[]>(value ?? []);

  // Sync outward whenever items change
  const update = (next: MenuItem[]) => {
    setItems(next);
    onChange(next);
  };

  const handleUpdate = (id: string, patch: Partial<MenuItem>) =>
    update(updateItemInTree(items, id, patch));

  const handleDelete = (id: string) =>
    update(deleteItemFromTree(items, id));

  const handleMoveUp = (id: string) =>
    update(moveItemInList(items, id, 'up'));

  const handleMoveDown = (id: string) =>
    update(moveItemInList(items, id, 'down'));

  const handleAddChild = (parentId: string) =>
    update(addChildToItem(items, parentId, newItem()));

  const handleAddRoot = () =>
    update([...items, newItem()]);

  return (
    <div className="rounded-lg border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/30">
        <span className="text-sm font-medium text-muted-foreground">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </span>
        <Button type="button" size="sm" variant="outline" onClick={handleAddRoot}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add item
        </Button>
      </div>

      {/* Tree */}
      <div className="p-3">
        {items.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            <p>No items yet.</p>
            <button
              type="button"
              onClick={handleAddRoot}
              className="mt-2 text-primary hover:underline text-sm"
            >
              Add your first item
            </button>
          </div>
        ) : (
          <MenuItemList
            items={items}
            depth={0}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onAddChild={handleAddChild}
          />
        )}
      </div>
    </div>
  );
}
