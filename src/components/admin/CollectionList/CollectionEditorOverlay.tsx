'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, Maximize2, Minimize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminSurfaceHeader } from '@/components/admin/AdminSurfaceHeader';
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
  const [sliderVisible, setSliderVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open || editorView === 'page') {
      setSliderVisible(false);
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setSliderVisible(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open, editorView]);

  useEffect(() => {
    if (!open || editorView === 'page') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, editorView, onClose]);

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
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            className={cn(
              'flex h-[min(90vh,64rem)] w-full flex-col overflow-hidden rounded-2xl border bg-background shadow-xl',
              editorExpanded ? 'max-w-[min(96vw,96rem)]' : 'max-w-[min(92vw,72rem)]'
            )}
          >
            <AdminSurfaceHeader
              sticky
              title={<span className="text-sm">{title}</span>}
              actions={
                <>
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
                </>
              }
            />
            <div className={cn('min-h-0 flex-1 overflow-y-auto p-4', editorExpanded && 'px-5 pb-5')}>
              <CollectionEdit {...editProps} mode="modal" />
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'absolute right-0 top-[var(--admin-topbar-height)] flex h-screen w-full flex-col overflow-y-auto border-l bg-background shadow-xl transition-transform duration-300 ease-out will-change-transform',
            sliderVisible ? 'translate-x-0' : 'translate-x-full',
            editorExpanded ? 'max-w-[min(98vw,88rem)]' : 'max-w-[min(94vw,56rem)]'
          )}
        >
          <div className="min-h-0 flex-1 overflow-y-auto">
            <CollectionEdit
              {...editProps}
              mode="slider"
              sliderChrome={{
                expanded: editorExpanded,
                onClose,
                onOpenInPage,
                onToggleExpanded,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(overlay, document.body);
}
