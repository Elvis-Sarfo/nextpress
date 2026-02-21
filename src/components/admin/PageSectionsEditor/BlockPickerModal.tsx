'use client';

import { useEffect, useState } from 'react';
import { Loader2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlockDoc {
  id: string;
  name: string;
  type: string;
}

interface BlockPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (blockId: string) => void;
}

export function BlockPickerModal({ open, onClose, onSelect }: BlockPickerModalProps) {
  const [blocks, setBlocks] = useState<BlockDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch('/api/admin/collections/blocks?limit=200')
      .then((r) => r.json())
      .then((data) => setBlocks((data.docs as BlockDoc[]) ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const filtered = query.trim()
    ? blocks.filter(
        (b) =>
          b.name.toLowerCase().includes(query.toLowerCase()) ||
          b.type.toLowerCase().includes(query.toLowerCase())
      )
    : blocks;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex h-[560px] w-full max-w-lg flex-col overflow-hidden rounded-xl border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Add Block</h2>
          <Button variant="ghost" size="icon" onClick={onClose} type="button">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="border-b px-4 py-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or type…"
              className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              {query ? 'No blocks match your search.' : 'No blocks available.'}
            </p>
          ) : (
            <ul className="divide-y">
              {filtered.map((block) => (
                <li key={block.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/40">
                  <div>
                    <p className="text-sm font-medium">{block.name}</p>
                    <p className="text-xs text-muted-foreground">{block.type}</p>
                  </div>
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => {
                      onSelect(block.id);
                      onClose();
                    }}
                  >
                    Add
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
