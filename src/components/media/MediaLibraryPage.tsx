'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Film,
  Grid3X3,
  List,
  Loader2,
  Pencil,
  Scissors,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MediaRecord } from '@/lib/media/types';
import { useMediaLibrary } from './useMediaLibrary';
import { MediaDropzone } from './MediaDropzone';

type ViewMode = 'grid' | 'list';

interface ImageEditState {
  rotate: string;
  cropX: string;
  cropY: string;
  cropWidth: string;
  cropHeight: string;
  resizeWidth: string;
  resizeHeight: string;
}

interface TrimEditState {
  startSec: string;
  endSec: string;
}

export function MediaLibraryPage() {
  const media = useMediaLibrary();
  const [view, setView] = useState<ViewMode>('grid');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [form, setForm] = useState({ altText: '', title: '', description: '' });
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editBusy, setEditBusy] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [imageEdit, setImageEdit] = useState<ImageEditState>({
    rotate: '0',
    cropX: '0',
    cropY: '0',
    cropWidth: '',
    cropHeight: '',
    resizeWidth: '',
    resizeHeight: '',
  });
  const [trimEdit, setTrimEdit] = useState<TrimEditState>({
    startSec: '0',
    endSec: '',
  });

  const selected = selectedIndex !== null ? media.items[selectedIndex] ?? null : null;
  const selectedAbsoluteUrl = selected ? toAbsoluteUrl(selected.url) : '';
  const isImage = selected?.kind === 'image';
  const isVideoOrAudio = !!selected && (selected.kind === 'video' || selected.type.startsWith('audio/'));

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
    setImageEdit({
      rotate: '0',
      cropX: '0',
      cropY: '0',
      cropWidth: selected.width ? String(selected.width) : '',
      cropHeight: selected.height ? String(selected.height) : '',
      resizeWidth: selected.width ? String(selected.width) : '',
      resizeHeight: selected.height ? String(selected.height) : '',
    });
    const trim = (selected.metadata as Record<string, unknown> | null)?.trim as
      | { startSec?: number; endSec?: number | null }
      | undefined;
    setTrimEdit({
      startSec: typeof trim?.startSec === 'number' ? String(trim.startSec) : '0',
      endSec: typeof trim?.endSec === 'number' ? String(trim.endSec) : '',
    });
    setEditOpen(false);
    setEditError(null);
  }, [selected?.id]);

  useEffect(() => {
    if (selectedIndex === null) return;
    if (media.items.length === 0) {
      setSelectedIndex(null);
      return;
    }
    if (selectedIndex > media.items.length - 1) {
      setSelectedIndex(media.items.length - 1);
    }
  }, [media.items, selectedIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (selectedIndex === null) return;

      if (event.key === 'Escape') {
        setSelectedIndex(null);
      }
      if (event.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev === null ? prev : Math.max(0, prev - 1)));
      }
      if (event.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev === null ? prev : Math.min(media.items.length - 1, prev + 1)));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedIndex, media.items.length]);

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

  const openItemAt = (index: number) => {
    setSelectedIndex(index);
    setCopyStatus(null);
  };

  const copyUrl = async () => {
    if (!selectedAbsoluteUrl) return;

    try {
      await navigator.clipboard.writeText(selectedAbsoluteUrl);
      setCopyStatus('URL copied');
      setTimeout(() => setCopyStatus(null), 1500);
    } catch {
      setCopyStatus('Copy failed');
      setTimeout(() => setCopyStatus(null), 1500);
    }
  };

  const saveMetadata = async () => {
    if (!selected) return;
    const updated = await media.updateMetadata(selected.id, form);
    const idx = media.items.findIndex((item) => item.id === updated.id);
    if (idx >= 0) setSelectedIndex(idx);
  };

  const downloadEditedImage = async () => {
    if (!selected || !isImage) return;
    setEditBusy(true);
    setEditError(null);

    try {
      const result = await createEditedImageBlob(selectedAbsoluteUrl, imageEdit, {
        fallbackWidth: selected.width || undefined,
        fallbackHeight: selected.height || undefined,
      });

      const fileName = buildEditedFilename(selected.filename, 'png');
      const url = URL.createObjectURL(result.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setEditError(error instanceof Error ? error.message : 'Could not process image.');
    } finally {
      setEditBusy(false);
    }
  };

  const saveEditedImageAsNewMedia = async () => {
    if (!selected || !isImage) return;
    setEditBusy(true);
    setEditError(null);

    try {
      const result = await createEditedImageBlob(selectedAbsoluteUrl, imageEdit, {
        fallbackWidth: selected.width || undefined,
        fallbackHeight: selected.height || undefined,
      });

      const fileName = buildEditedFilename(selected.filename, 'png');
      const file = new File([result.blob], fileName, { type: 'image/png' });

      await media.uploadFile(file, {
        title: form.title || buildTitleFromFilename(fileName),
        altText: form.altText,
        description: form.description,
      });

      await media.loadMedia({ page: 1 });
      setSelectedIndex(0);
      setEditOpen(false);
    } catch (error) {
      setEditError(error instanceof Error ? error.message : 'Could not save edited image.');
    } finally {
      setEditBusy(false);
    }
  };

  const saveTrimMetadata = async () => {
    if (!selected || !isVideoOrAudio) return;
    setEditBusy(true);
    setEditError(null);

    try {
      const startSec = Number(trimEdit.startSec || '0');
      const endSec = trimEdit.endSec.trim() ? Number(trimEdit.endSec) : null;

      if (!Number.isFinite(startSec) || startSec < 0) {
        throw new Error('Trim start must be a number greater than or equal to 0.');
      }
      if (endSec !== null && (!Number.isFinite(endSec) || endSec <= startSec)) {
        throw new Error('Trim end must be greater than trim start.');
      }

      const metadata: Record<string, unknown> = {
        ...(selected.metadata || {}),
        trim: {
          startSec,
          endSec,
          updatedAt: new Date().toISOString(),
        },
      };

      const updated = await media.updateMetadata(selected.id, {
        ...form,
        metadata,
      });

      const idx = media.items.findIndex((item) => item.id === updated.id);
      if (idx >= 0) setSelectedIndex(idx);
    } catch (error) {
      setEditError(error instanceof Error ? error.message : 'Could not save trim metadata.');
    } finally {
      setEditBusy(false);
    }
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

      <MediaDropzone
        onFilesSelected={onFiles}
        uploadState={media.uploadState}
        dropLabel="Drag and drop files here, or click to browse"
      />

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
          {media.items.map((item, index) => (
            <button
              key={item.id}
              className="group overflow-hidden rounded-xl border bg-card text-left"
              onClick={() => openItemAt(index)}
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
              {media.items.map((item, index) => (
                <tr key={item.id} className="cursor-pointer border-t hover:bg-muted/30" onClick={() => openItemAt(index)}>
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
                  <td className="p-3">{formatDateTime(item.uploadedAt)}</td>
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

      {selected && selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/65 p-3 md:p-6">
          <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col overflow-hidden rounded-xl border bg-background shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-lg font-semibold">Attachment Details</h2>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
                  disabled={selectedIndex <= 0}
                  title="Previous"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedIndex(Math.min(media.items.length - 1, selectedIndex + 1))}
                  disabled={selectedIndex >= media.items.length - 1}
                  title="Next"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setSelectedIndex(null)} title="Close">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="grid min-h-0 flex-1 gap-0 md:grid-cols-[2fr_1fr]">
              <div className="relative min-h-[260px] border-b bg-muted md:min-h-0 md:border-b-0 md:border-r">
                <MediaPreview item={selected} />
              </div>

              <div className="min-h-0 overflow-y-auto p-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><span className="text-foreground">Uploaded:</span> {formatDateTime(selected.uploadedAt)}</p>
                  <p><span className="text-foreground">File name:</span> {selected.filename}</p>
                  <p><span className="text-foreground">Original name:</span> {selected.originalFilename || selected.filename}</p>
                  <p><span className="text-foreground">Type:</span> {selected.type}</p>
                  <p><span className="text-foreground">Kind:</span> {selected.kind}</p>
                  <p><span className="text-foreground">Extension:</span> {selected.extension || '-'}</p>
                  <p><span className="text-foreground">File size:</span> {formatBytes(selected.size)}</p>
                  <p><span className="text-foreground">Dimensions:</span> {selected.width && selected.height ? `${selected.width} x ${selected.height}` : '-'}</p>
                  <p><span className="text-foreground">Provider:</span> {selected.storageProvider}</p>
                  <p className="break-all"><span className="text-foreground">Storage key:</span> {selected.storageKey || '-'}</p>
                  <p><span className="text-foreground">ID:</span> {selected.id}</p>
                  <p><span className="text-foreground">Created:</span> {selected.createdAt ? formatDateTime(selected.createdAt) : '-'}</p>
                  <p><span className="text-foreground">Updated:</span> {selected.updatedAt ? formatDateTime(selected.updatedAt) : '-'}</p>
                </div>

                <div className="my-4 h-px bg-border" />

                <label className="mb-3 block space-y-1 text-sm">
                  <span className="text-muted-foreground">Alternative Text</span>
                  <input
                    className="w-full rounded-md border bg-background px-3 py-2"
                    value={form.altText}
                    onChange={(e) => setForm((prev) => ({ ...prev, altText: e.target.value }))}
                  />
                </label>

                <label className="mb-3 block space-y-1 text-sm">
                  <span className="text-muted-foreground">Title</span>
                  <input
                    className="w-full rounded-md border bg-background px-3 py-2"
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </label>

                <label className="mb-3 block space-y-1 text-sm">
                  <span className="text-muted-foreground">Description / Caption</span>
                  <textarea
                    className="min-h-24 w-full rounded-md border bg-background px-3 py-2"
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </label>

                <label className="mb-2 block space-y-1 text-sm">
                  <span className="text-muted-foreground">File URL</span>
                  <input readOnly value={selectedAbsoluteUrl} className="w-full rounded-md border bg-muted px-3 py-2 text-xs" />
                </label>

                {copyStatus && <p className="mb-2 text-xs text-blue-600">{copyStatus}</p>}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={saveMetadata}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setEditOpen((v) => !v)}>
                    <Pencil className="mr-2 h-4 w-4" /> {editOpen ? 'Hide Editor' : 'Edit Media'}
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={selectedAbsoluteUrl} download={selected.filename}>
                      <Download className="mr-2 h-4 w-4" /> Download
                    </a>
                  </Button>
                  <Button variant="outline" onClick={copyUrl}>
                    <Copy className="mr-2 h-4 w-4" /> Copy URL
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={selectedAbsoluteUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> View
                    </a>
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      await media.deleteMedia(selected.id);
                      if (media.items.length <= 1) {
                        setSelectedIndex(null);
                      } else if (selectedIndex >= media.items.length - 1) {
                        setSelectedIndex(media.items.length - 2);
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>

                {editOpen && (
                  <div className="mt-4 rounded-lg border p-3">
                    <h3 className="mb-2 text-sm font-semibold">Media Editor</h3>

                    {isImage && (
                      <div className="space-y-3">
                        <p className="text-xs text-muted-foreground">
                          Crop, resize, and rotate the image. Save as a new media asset to preserve original.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <label className="space-y-1">
                            <span>Rotate (deg)</span>
                            <input className="w-full rounded border px-2 py-1" type="number" value={imageEdit.rotate} onChange={(e) => setImageEdit((s) => ({ ...s, rotate: e.target.value }))} />
                          </label>
                          <label className="space-y-1">
                            <span>Crop X</span>
                            <input className="w-full rounded border px-2 py-1" type="number" value={imageEdit.cropX} onChange={(e) => setImageEdit((s) => ({ ...s, cropX: e.target.value }))} />
                          </label>
                          <label className="space-y-1">
                            <span>Crop Y</span>
                            <input className="w-full rounded border px-2 py-1" type="number" value={imageEdit.cropY} onChange={(e) => setImageEdit((s) => ({ ...s, cropY: e.target.value }))} />
                          </label>
                          <label className="space-y-1">
                            <span>Crop Width</span>
                            <input className="w-full rounded border px-2 py-1" type="number" value={imageEdit.cropWidth} onChange={(e) => setImageEdit((s) => ({ ...s, cropWidth: e.target.value }))} />
                          </label>
                          <label className="space-y-1">
                            <span>Crop Height</span>
                            <input className="w-full rounded border px-2 py-1" type="number" value={imageEdit.cropHeight} onChange={(e) => setImageEdit((s) => ({ ...s, cropHeight: e.target.value }))} />
                          </label>
                          <label className="space-y-1">
                            <span>Resize Width</span>
                            <input className="w-full rounded border px-2 py-1" type="number" value={imageEdit.resizeWidth} onChange={(e) => setImageEdit((s) => ({ ...s, resizeWidth: e.target.value }))} />
                          </label>
                          <label className="space-y-1">
                            <span>Resize Height</span>
                            <input className="w-full rounded border px-2 py-1" type="number" value={imageEdit.resizeHeight} onChange={(e) => setImageEdit((s) => ({ ...s, resizeHeight: e.target.value }))} />
                          </label>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" onClick={downloadEditedImage} disabled={editBusy}>
                            <Download className="mr-2 h-4 w-4" /> Download Edited
                          </Button>
                          <Button onClick={saveEditedImageAsNewMedia} disabled={editBusy}>
                            {editBusy ? 'Saving...' : 'Save as New Media'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {isVideoOrAudio && (
                      <div className="space-y-3">
                        <p className="text-xs text-muted-foreground">
                          Set trim range metadata for playback. Physical transcoding/cutting requires a server media pipeline.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <label className="space-y-1">
                            <span>Trim Start (seconds)</span>
                            <input className="w-full rounded border px-2 py-1" type="number" min="0" step="0.1" value={trimEdit.startSec} onChange={(e) => setTrimEdit((s) => ({ ...s, startSec: e.target.value }))} />
                          </label>
                          <label className="space-y-1">
                            <span>Trim End (seconds, optional)</span>
                            <input className="w-full rounded border px-2 py-1" type="number" min="0" step="0.1" value={trimEdit.endSec} onChange={(e) => setTrimEdit((s) => ({ ...s, endSec: e.target.value }))} />
                          </label>
                        </div>
                        <Button onClick={saveTrimMetadata} disabled={editBusy}>
                          <Scissors className="mr-2 h-4 w-4" /> Save Trim Metadata
                        </Button>
                      </div>
                    )}

                    {!isImage && !isVideoOrAudio && (
                      <p className="text-xs text-muted-foreground">No advanced editor is available for this file type.</p>
                    )}

                    {editError && <p className="mt-2 text-xs text-red-600">{editError}</p>}
                  </div>
                )}

                {selected.metadata && (
                  <details className="mt-4 rounded-md border p-2 text-xs">
                    <summary className="cursor-pointer font-medium">Raw Metadata JSON</summary>
                    <pre className="mt-2 max-h-36 overflow-auto whitespace-pre-wrap break-all rounded bg-muted p-2">
                      {JSON.stringify(selected.metadata, null, 2)}
                    </pre>
                  </details>
                )}
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
    return <video controls className="h-full w-full object-contain" src={item.url} />;
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <FileText className="h-10 w-10 text-muted-foreground" />
      <a href={toAbsoluteUrl(item.url)} target="_blank" rel="noreferrer" className="text-sm underline">
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

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function toAbsoluteUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (typeof window === 'undefined') return url;
  return new URL(url, window.location.origin).toString();
}

function buildEditedFilename(original: string, extension: string): string {
  const base = original.replace(/\.[^/.]+$/, '');
  return `${base}-edited.${extension}`;
}

function buildTitleFromFilename(filename: string): string {
  const withoutExt = filename.replace(/\.[^/.]+$/, '');
  return withoutExt.replace(/[_-]+/g, ' ').trim();
}

async function createEditedImageBlob(
  imageUrl: string,
  state: ImageEditState,
  fallback: { fallbackWidth?: number; fallbackHeight?: number }
): Promise<{ blob: Blob; width: number; height: number }> {
  const sourceBlob = await fetch(imageUrl).then((res) => {
    if (!res.ok) throw new Error('Unable to fetch source image.');
    return res.blob();
  });

  const sourceImage = await createImageBitmap(sourceBlob);
  const sourceWidth = sourceImage.width;
  const sourceHeight = sourceImage.height;

  const cropX = clampNumber(parseNumber(state.cropX, 0), 0, sourceWidth - 1);
  const cropY = clampNumber(parseNumber(state.cropY, 0), 0, sourceHeight - 1);
  const cropWidth = clampNumber(parseNumber(state.cropWidth, fallback.fallbackWidth || sourceWidth), 1, sourceWidth - cropX);
  const cropHeight = clampNumber(parseNumber(state.cropHeight, fallback.fallbackHeight || sourceHeight), 1, sourceHeight - cropY);

  const resizedWidth = clampNumber(parseNumber(state.resizeWidth, cropWidth), 1, 10000);
  const resizedHeight = clampNumber(parseNumber(state.resizeHeight, cropHeight), 1, 10000);

  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = Math.round(cropWidth);
  cropCanvas.height = Math.round(cropHeight);
  const cropCtx = cropCanvas.getContext('2d');
  if (!cropCtx) throw new Error('Could not initialize canvas context.');
  cropCtx.drawImage(
    sourceImage,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropCanvas.width,
    cropCanvas.height
  );

  const resizeCanvas = document.createElement('canvas');
  resizeCanvas.width = Math.round(resizedWidth);
  resizeCanvas.height = Math.round(resizedHeight);
  const resizeCtx = resizeCanvas.getContext('2d');
  if (!resizeCtx) throw new Error('Could not initialize resize context.');
  resizeCtx.drawImage(cropCanvas, 0, 0, resizeCanvas.width, resizeCanvas.height);

  const rotateDeg = parseNumber(state.rotate, 0);
  const rotateRad = (rotateDeg * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rotateRad));
  const cos = Math.abs(Math.cos(rotateRad));

  const rotatedWidth = Math.round(resizeCanvas.width * cos + resizeCanvas.height * sin);
  const rotatedHeight = Math.round(resizeCanvas.width * sin + resizeCanvas.height * cos);

  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = Math.max(1, rotatedWidth);
  finalCanvas.height = Math.max(1, rotatedHeight);
  const finalCtx = finalCanvas.getContext('2d');
  if (!finalCtx) throw new Error('Could not initialize final canvas context.');

  finalCtx.translate(finalCanvas.width / 2, finalCanvas.height / 2);
  finalCtx.rotate(rotateRad);
  finalCtx.drawImage(resizeCanvas, -resizeCanvas.width / 2, -resizeCanvas.height / 2);

  const blob = await canvasToBlob(finalCanvas, 'image/png');
  return {
    blob,
    width: finalCanvas.width,
    height: finalCanvas.height,
  };
}

function parseNumber(value: string, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return parsed;
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Could not create image blob.'));
        return;
      }
      resolve(blob);
    }, type, 0.92);
  });
}
