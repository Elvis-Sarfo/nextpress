'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MediaValue } from '@/components/admin/MediaSelector';
import { MediaLibraryPage } from '@/components/media/MediaLibraryPage';

interface MediaPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (media: MediaValue) => void;
}

export function MediaPickerModal({ open, onClose, onSelect }: MediaPickerModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;
  if (!mounted) return null;

  const handleSelect = (media: MediaValue) => {
    onSelect(media);
    onClose();
  };

  const modal = (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex h-[min(90vh,64rem)] w-full max-w-7xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              <ImagePlus className="h-3.5 w-3.5" />
              Media Library
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">Select Media</h2>
            <p className="mt-1 text-sm text-slate-500">Choose an existing asset or upload something new.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} type="button">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/70">
          <MediaLibraryPage pickerMode onPickerSelect={handleSelect} />
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
