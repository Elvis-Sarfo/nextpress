'use client';

import { useEffect, useState } from 'react';
import { File, ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';

interface MediaSelectorProps {
  /** Currently selected media. `id` is optional for URL-only sources (e.g. block image fields). */
  value: { id?: string; url: string } | null;
  onChange: (media: { id: string; url: string } | null) => void;
  /** When true the component renders as a compact row (no tall thumbnail). Default false. */
  compact?: boolean;
}

const IMAGE_EXTS = /\.(jpe?g|png|gif|webp|avif|svg|bmp|ico)(\?.*)?$/i;

function isImageUrl(url: string): boolean {
  return IMAGE_EXTS.test(url);
}

function filename(url: string): string {
  return decodeURIComponent(url.split('/').pop() ?? url).split('?')[0];
}

export function MediaSelector({ value, onChange, compact = false }: MediaSelectorProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Reset image error whenever the URL changes
  useEffect(() => {
    setImgError(false);
  }, [value?.url]);

  const url = value?.url ?? null;
  const showImage = url && isImageUrl(url) && !imgError;
  const name = url ? filename(url) : null;

  return (
    <>
      <div className={compact ? 'flex items-center gap-3' : 'flex items-start gap-3'}>
        {/* Thumbnail / placeholder */}
        <div
          className={
            compact
              ? 'flex h-10 w-14 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground overflow-hidden'
              : 'flex h-24 w-36 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground overflow-hidden'
          }
        >
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={name ?? 'Selected media'}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />
          ) : url ? (
            <File className={compact ? 'h-4 w-4' : 'h-8 w-8'} />
          ) : (
            <ImageIcon className={compact ? 'h-4 w-4' : 'h-8 w-8'} />
          )}
        </div>

        {/* Controls */}
        <div className="flex min-w-0 flex-col gap-1.5 pt-0.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPickerOpen(true)}
          >
            {url ? 'Change' : 'Select file'}
          </Button>

          {url && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="justify-start text-muted-foreground hover:text-foreground"
                onClick={() => onChange(null)}
              >
                <X className="mr-1 h-3 w-3" />
                Remove
              </Button>

              {name && (
                <p className="max-w-[140px] truncate text-xs text-muted-foreground" title={name}>
                  {name}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(media) => {
          onChange(media);
          setImgError(false);
        }}
      />
    </>
  );
}
