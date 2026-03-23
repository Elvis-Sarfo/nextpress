'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaSelector } from '@/components/admin/MediaSelector';

type ProductMediaItem = {
  type?: 'image' | 'video';
  mediaFileId?: string | null;
  url?: string | null;
  videoUrl?: string | null;
  videoCoverId?: string | null;
  coverUrl?: string | null;
  isCover?: boolean;
  alt?: string | null;
};

interface ProductMediaEditorProps {
  value: unknown;
  onChange: (items: ProductMediaItem[]) => void;
}

function normalizeItems(value: unknown): ProductMediaItem[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const entry = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
    return {
      type: entry.type === 'video' ? 'video' : 'image',
      mediaFileId: typeof entry.mediaFileId === 'string' ? entry.mediaFileId : null,
      url: typeof entry.url === 'string' ? entry.url : null,
      videoUrl: typeof entry.videoUrl === 'string' ? entry.videoUrl : null,
      videoCoverId: typeof entry.videoCoverId === 'string' ? entry.videoCoverId : null,
      coverUrl: typeof entry.coverUrl === 'string' ? entry.coverUrl : null,
      isCover: Boolean(entry.isCover),
      alt: typeof entry.alt === 'string' ? entry.alt : null,
    };
  });
}

export function ProductMediaEditor({ value, onChange }: ProductMediaEditorProps) {
  const items = normalizeItems(value);

  const updateItem = (index: number, patch: Partial<ProductMediaItem>) => {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  const addItem = (type: 'image' | 'video') => {
    onChange([
      ...items,
      type === 'image'
        ? { type, mediaFileId: null, url: null, isCover: items.length === 0, alt: null }
        : { type, videoUrl: null, videoCoverId: null, coverUrl: null, isCover: false, alt: null },
    ]);
  };

  return (
    <div className="space-y-3 rounded-md border bg-muted/20 p-3">
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No gallery items added yet.</p>
      ) : (
        items.map((item, index) => (
          <div key={index} className="rounded-md border bg-background p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <select
                title='select'
                  value={item.type ?? 'image'}
                  onChange={(e) => updateItem(index, { type: e.target.value === 'video' ? 'video' : 'image' })}
                  className="flex h-9 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={Boolean(item.isCover)}
                    onChange={(e) => {
                      const next = items.map((entry, itemIndex) => ({
                        ...entry,
                        isCover: itemIndex === index ? e.target.checked : false,
                      }));
                      onChange(next);
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-primary"
                  />
                  Cover item
                </label>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            {item.type === 'video' ? (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Video URL</label>
                  <input
                    type="url"
                    value={item.videoUrl ?? ''}
                    onChange={(e) => updateItem(index, { videoUrl: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Video cover image</label>
                  <MediaSelector
                    value={item.coverUrl ? { id: item.videoCoverId ?? undefined, url: item.coverUrl } : null}
                    onChange={(media) =>
                      updateItem(index, {
                        videoCoverId: media?.id ?? null,
                        coverUrl: media?.url ?? null,
                      })
                    }
                    compact
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Image</label>
                <MediaSelector
                  value={item.url ? { id: item.mediaFileId ?? undefined, url: item.url } : null}
                  onChange={(media) =>
                    updateItem(index, {
                      mediaFileId: media?.id ?? null,
                      url: media?.url ?? null,
                    })
                  }
                  compact
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Alt text</label>
              <input
                title='Alt text'
                type="text"
                value={item.alt ?? ''}
                onChange={(e) => updateItem(index, { alt: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        ))
      )}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => addItem('image')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Image
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => addItem('video')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Video
        </Button>
      </div>
    </div>
  );
}
