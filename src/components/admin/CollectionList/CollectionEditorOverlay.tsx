'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, Maximize2, Minimize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CollectionMeta } from '@/lib/collections-data';
import { CollectionEdit } from '@/components/admin/CollectionEdit';

interface CollectionEditorOverlayProps {
  collection: CollectionMeta;
  open: boolean;
  editorView: 'page' | 'modal' | 'slider';
  editorIntent: 'create' | 'edit';
  editorDocId: string | null;
  editorExpanded: boolean;
  onClose: () => void;
  onToggleExpanded: () => void;
  onOpenInPage: () => void;
  onSaved: () => Promise<void>;
  onDeleted: () => Promise<void>;
}

export function CollectionEditorOverlay({
  collection,
  open,
  editorView,
  editorIntent,
  editorDocId,
  editorExpanded,
  onClose,
  onToggleExpanded,
  onOpenInPage,
  onSaved,
  onDeleted,
}: CollectionEditorOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!open || editorView === 'page') return null;
  if (!mounted) return null;

  const title =
    editorIntent === 'create'
      ? `Create ${collection.labels.singular}`
      : `Edit ${collection.labels.singular}`;

  const editProps = {
    collection,
    documentId: editorIntent === 'edit' ? (editorDocId ?? undefined) : undefined,
    onCancel: onClose,
    onSaved,
    onDeleted,
  } as const;

  const overlay = (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        className="absolute inset-0 bg-black/35"
        onClick={onClose}
        aria-label="Close editor"
      />

      {editorView === 'modal' ? (
        <div
          className={cn(
            'absolute left-1/2 top-[calc(var(--admin-topbar-height)+0.5rem)] max-h-[calc(100vh-var(--admin-topbar-height)-1rem)] -translate-x-1/2 overflow-y-auto rounded-lg border bg-background shadow-xl',
            editorExpanded ? 'w-[min(98vw,96rem)]' : 'w-[min(96vw,72rem)]'
          )}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 py-2">
            <h2 className="text-sm font-semibold">{title}</h2>
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="sm" onClick={onOpenInPage} title="Open in page">
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Open in page</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onToggleExpanded}
                title={editorExpanded ? 'Restore size' : 'Expand size'}
              >
                {editorExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className={cn('p-4', editorExpanded && 'px-5 pb-5')}>
            <CollectionEdit {...editProps} mode="modal" />
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'absolute right-0 top-[var(--admin-topbar-height)] h-[calc(100vh-var(--admin-topbar-height))] w-full overflow-y-auto border-l bg-background shadow-xl',
            editorExpanded ? 'max-w-[min(98vw,88rem)]' : 'max-w-[min(94vw,56rem)]'
          )}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 py-2">
            <h2 className="text-sm font-semibold">{title}</h2>
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="sm" onClick={onOpenInPage} title="Open in page">
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Open in page</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onToggleExpanded}
                title={editorExpanded ? 'Restore size' : 'Expand size'}
              >
                {editorExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className={cn('p-4', editorExpanded && 'px-5 pb-5')}>
            <CollectionEdit {...editProps} mode="slider" />
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(overlay, document.body);
}
