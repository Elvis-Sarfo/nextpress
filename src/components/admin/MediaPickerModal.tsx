'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Grid3X3, List, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminSurfaceHeader } from '@/components/admin/AdminSurfaceHeader';
import type { MediaValue } from '@/components/admin/MediaSelector';
import { MediaLibraryPage } from '@/components/media/MediaLibraryPage';

interface MediaPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (media: MediaValue) => void;
}

export function MediaPickerModal({ open, onClose, onSelect }: MediaPickerModalProps) {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

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
      <div className="relative flex h-[min(92vh,68rem)] w-full max-w-7xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
        <AdminSurfaceHeader
          title={<span className="text-lg text-slate-950">Choose from your library</span>}
          description={<span className="text-xs text-slate-500">Search, filter, upload, and select a file.</span>}
          className="border-slate-200 bg-white"
          bodyClassName="px-5 py-3"
          actions={
            <>
              <div className="relative min-w-[180px] flex-1 sm:w-auto">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, title, alt text..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs outline-none transition-colors focus:border-slate-300 focus:bg-white"
                />
              </div>
              <select
                aria-label="Type filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-10 min-w-[120px] rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none transition-colors focus:border-slate-300"
              >
                <option value="all">All types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="application">Documents</option>
                <option value="text">Text</option>
              </select>
              <Button
                variant={view === 'grid' ? 'default' : 'outline'}
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => setView('grid')}
                type="button"
              >
                <Grid3X3 className="mr-1.5 h-3.5 w-3.5" /> Grid
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'outline'}
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => setView('list')}
                type="button"
              >
                <List className="mr-1.5 h-3.5 w-3.5" /> List
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} type="button">
                <X className="h-4.5 w-4.5" />
              </Button>
            </>
          }
        />

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/50">
          <MediaLibraryPage
            pickerMode
            hidePickerHeader
            hideSearchControl
            hideTypeFilterControl
            queryValue={query}
            onQueryChange={setQuery}
            typeFilterValue={typeFilter}
            onTypeFilterChange={setTypeFilter}
            viewMode={view}
            onViewModeChange={setView}
            onPickerSelect={handleSelect}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
