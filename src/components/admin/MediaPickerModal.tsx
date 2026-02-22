'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaLibraryPage } from '@/components/media/MediaLibraryPage';

interface MediaPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (media: { id: string; url: string }) => void;
}

export function MediaPickerModal({ open, onClose, onSelect }: MediaPickerModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSelect = (media: { id: string; url: string }) => {
    onSelect(media);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/60"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative mx-auto mt-8 mb-4 flex h-[calc(100vh-4rem)] w-full max-w-6xl flex-col overflow-hidden rounded-xl border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Select Media</h2>
          <Button variant="ghost" size="icon" onClick={onClose} type="button">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <MediaLibraryPage pickerMode onPickerSelect={handleSelect} />
        </div>
      </div>
    </div>
  );
}
