'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminSurfaceHeader } from '@/components/admin/AdminSurfaceHeader';
import { CollectionEdit } from '@/components/admin/CollectionEdit';
import type { CollectionMeta } from '@/lib/collections-data';

interface QuickAddCollectionDialogProps {
  collection: CollectionMeta;
  open: boolean;
  onClose: () => void;
  onCreated: (doc: Record<string, unknown>) => void;
}

export function QuickAddCollectionDialog({
  collection,
  open,
  onClose,
  onCreated,
}: QuickAddCollectionDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex h-[min(90vh,64rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
        <AdminSurfaceHeader
          title={<span className="text-base">Quick Add {collection.labels.singular}</span>}
          description="Create a related record without leaving this editor."
          actions={
            <Button type="button" variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          }
        />
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <CollectionEdit
            collection={collection}
            mode="modal"
            onCancel={onClose}
            onSaved={(doc) => {
              onCreated(doc);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
