'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  FileText,
  Film,
  Grid3X3,
  List,
  Loader2,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MediaRecord } from '@/lib/media/types';
import { useMediaLibrary } from './useMediaLibrary';

type ViewMode = 'grid' | 'list';

export function MediaLibraryPage() {
  const media = useMediaLibrary();
  const [view, setView] = useState<ViewMode>('grid');
  const [dragActive, setDragActive] = useState(false);
  const [selected, setSelected] = useState<MediaRecord | null>(null);
  const [form, setForm] = useState({ altText: '', title: '', description: '' });

  useEffect(() => {
    media.loadMedia();
  }, [media.page, media.typeFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      media.loadMedia({ page: 1, query: media.query });
    }, 250);
    return () => clearTimeout(timer);
  }, [media.query]);

  useEffect(() => {
    if (!selected) return;
    setForm({
      altText: selected.altText || '',
      title: selected.title || '',
      description: selected.description || '',
    });
  }, [selected]);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      try {
        await media.uploadFile(file);
      } catch (error) {
        console.error(error);
      }
    }
    media.loadMedia({ page: 1 });
  };

  const typeOptions = useMemo(
    () => [
      { label: 'All types', value: 'all' },
      { label: 'Images', value: 'image' },
      { label: 'Videos', value: 'video' },
      { label: 'Documents', value: 'application' },
      { label: 'Text', value: 'text' },
    ],
    []
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Media Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage uploads and metadata in one place.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={view === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('grid')}
          >
            <Grid3X3 className="mr-2 h-4 w-4" /> Grid
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
          >
            <List className="mr-2 h-4 w-4" /> List
          </Button>
        </div>
      </header>

      <section
        className={`rounded-xl border border-dashed p-6 transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-border'}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          onFiles(e.dataTransfer.files);
        }}
      >
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Drag and drop files here, or click to browse</p>
            <p className="text-xs text-muted-foreground">Images, videos, PDF, DOC, and TXT up to 50MB</p>
          </div>
          <label className="cursor-pointer rounded-md border px-3 py-2 text-sm hover:bg-accent">
            Select files
            <input
              className="hidden"
              type="file"
              multiple
              onChange={(e) => onFiles(e.target.files)}
            />
          </label>
          {media.uploadState && (
            <div className="w-full max-w-md space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="truncate pr-2">{media.uploadState.fileName}</span>
                <span>{media.uploadState.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded bg-secondary">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${media.uploadState.progress}%` }}
                />
              </div>
              {media.uploadState.status === 'error' && media.uploadState.error && (
                <p className="text-xs text-red-600">{media.uploadState.error}</p>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={media.query}
            onChange={(e) => media.setQuery(e.target.value)}
            placeholder="Search by name, title, alt text..."
            className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm"
          />
        </div>

        <select
          value={media.typeFilter}
          onChange={(e) => {
            media.setTypeFilter(e.target.value);
            media.setPage(1);
          }}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          {typeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </section>

      {media.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {media.error}
        </div>
      )}

      {media.loading ? (
        <div className="rounded-xl border p-10 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : media.items.length === 0 ? (
        <div className="rounded-xl border p-10 text-center text-sm text-muted-foreground">
          No media found.
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {media.items.map((item) => (
            <button
              key={item.id}
              className="group overflow-hidden rounded-xl border bg-card text-left"
              onClick={() => setSelected(item)}
            >
              <div className="relative aspect-square bg-muted">
                <MediaThumb item={item} />
              </div>
              <div className="p-2">
                <p className="truncate text-sm font-medium">{item.title || item.filename}</p>
                <p className="truncate text-xs text-muted-foreground">{formatBytes(item.size)}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3">File</th>
                <th className="p-3">Type</th>
                <th className="p-3">Size</th>
                <th className="p-3">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {media.items.map((item) => (
                <tr key={item.id} className="cursor-pointer border-t hover:bg-muted/30" onClick={() => setSelected(item)}>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="relative h-10 w-10 overflow-hidden rounded bg-muted">
                        <MediaThumb item={item} compact />
                      </div>
                      <div>
                        <p className="font-medium">{item.title || item.filename}</p>
                        <p className="text-xs text-muted-foreground">{item.filename}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{item.type}</td>
                  <td className="p-3">{formatBytes(item.size)}</td>
                  <td className="p-3">{new Date(item.uploadedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{media.total} total files</p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={media.page <= 1}
            onClick={() => media.setPage(media.page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!media.hasMore}
            onClick={() => media.setPage(media.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 md:items-center">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl bg-background shadow-xl">
            <button className="absolute right-3 top-3" onClick={() => setSelected(null)}>
              <X className="h-5 w-5" />
            </button>

            <div className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                <MediaPreview item={selected} />
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-semibold">Edit Metadata</h2>
                <p className="text-xs text-muted-foreground">{selected.filename}</p>

                <label className="block space-y-1 text-sm">
                  <span>Title</span>
                  <input
                    className="w-full rounded-md border bg-background px-3 py-2"
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </label>

                <label className="block space-y-1 text-sm">
                  <span>Alt text</span>
                  <input
                    className="w-full rounded-md border bg-background px-3 py-2"
                    value={form.altText}
                    onChange={(e) => setForm((prev) => ({ ...prev, altText: e.target.value }))}
                  />
                </label>

                <label className="block space-y-1 text-sm">
                  <span>Description</span>
                  <textarea
                    className="min-h-24 w-full rounded-md border bg-background px-3 py-2"
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </label>

                <div className="flex gap-2">
                  <Button
                    onClick={async () => {
                      const updated = await media.updateMetadata(selected.id, form);
                      setSelected(updated);
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      await media.deleteMedia(selected.id);
                      setSelected(null);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MediaThumb({ item, compact = false }: { item: MediaRecord; compact?: boolean }) {
  if (item.kind === 'image') {
    return (
      <Image
        src={item.url}
        alt={item.altText || item.filename}
        fill
        sizes={compact ? '40px' : '(max-width: 768px) 50vw, 20vw'}
        className="object-cover"
      />
    );
  }

  if (item.kind === 'video') {
    return (
      <div className="flex h-full items-center justify-center">
        <Film className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <FileText className="h-8 w-8 text-muted-foreground" />
    </div>
  );
}

function MediaPreview({ item }: { item: MediaRecord }) {
  if (item.kind === 'image') {
    return (
      <Image
        src={item.url}
        alt={item.altText || item.filename}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-contain"
      />
    );
  }

  if (item.kind === 'video') {
    return <video controls className="h-full w-full" src={item.url} />;
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <FileText className="h-10 w-10 text-muted-foreground" />
      <a href={item.url} target="_blank" rel="noreferrer" className="text-sm underline">
        Open document
      </a>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[i]}`;
}
