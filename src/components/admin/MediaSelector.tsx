'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, File, ImageIcon, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';
import type { MediaRecord } from '@/lib/media/types';

export type MediaValue = Partial<MediaRecord> & { url: string; [key: string]: unknown };

interface MediaSelectorProps {
  /** Currently selected media. `id` is optional for URL-only sources (e.g. block image fields). */
  value: MediaValue | null;
  onChange: (media: MediaValue | null) => void;
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

function readableBytes(bytes: unknown): string | null {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes <= 0) return null;
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / Math.pow(1024, index);
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[index]}`;
}

function readableType(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  return value;
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
  const name = typeof value?.filename === 'string' && value.filename.trim() ? value.filename : url ? filename(url) : null;
  const mediaType = readableType(value?.type);
  const mediaSize = readableBytes(value?.size);

  return (
    <>
      <div
        className={
          compact
            ? 'flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5'
            : 'flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'
        }
      >
        <div
          className={
            compact
              ? 'relative flex h-14 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-slate-500'
              : 'relative flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] text-slate-500'
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
            <File className={compact ? 'h-4 w-4' : 'h-10 w-10'} />
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-sm">
                <ImageIcon className={compact ? 'h-4 w-4' : 'h-6 w-6'} />
              </div>
              {!compact && <span className="text-xs font-medium text-slate-500">No media selected</span>}
            </div>
          )}

          {!compact && url && (
            <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-slate-600 shadow-sm">
              <Sparkles className="h-3 w-3" />
              Selected
            </div>
          )}
        </div>

        <div className={compact ? 'min-w-0 flex-1' : 'min-w-0 flex-1 space-y-2'}>
          {!compact && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-900">{url ? 'Media attached' : 'Choose media'}</p>
              <p className="text-[11px] text-slate-500">
                {url ? 'Replace or remove the current asset.' : 'Browse the library or upload something new.'}
              </p>
            </div>
          )}

          {url && name && (
            <div className={compact ? 'min-w-0' : 'min-w-0'}>
              <p className="truncate text-sm text-slate-900" title={name}>
                <span className="font-medium">Filename:</span> {name}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                {mediaType && <span><span className="font-medium text-slate-700">Type:</span> {mediaType}</span>}
                {mediaSize && <span>{mediaSize}</span>}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" size="sm" className="h-5 rounded px-1.5 text-[10px]" onClick={() => setPickerOpen(true)}>
              {url ? 'Change media' : 'Select media'}
            </Button>

            {url && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-5 rounded px-1.5 text-[10px]"
                  onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Preview
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-5 rounded px-1.5 text-[10px] text-slate-500 hover:text-slate-900"
                  onClick={() => onChange(null)}
                >
                  <X className="mr-1 h-3 w-3" />
                  Remove
                </Button>
              </>
            )}
          </div>
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
