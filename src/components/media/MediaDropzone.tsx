'use client';

import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Upload } from 'lucide-react';
import { MEDIA_MAX_FILE_SIZE_BYTES } from '@/lib/media/constants';
import { cn } from '@/lib/utils';

interface UploadState {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

interface MediaDropzoneProps {
  onFilesSelected: (files: FileList | null) => void | Promise<void>;
  uploadState?: UploadState | null;
  variant?: 'default' | 'classic';
  buttonLabel?: string;
  dropLabel?: string;
  subLabel?: string;
  renderFooter?: (openFilePicker: () => void) => ReactNode;
}

export function MediaDropzone({
  onFilesSelected,
  uploadState,
  variant = 'default',
  buttonLabel = 'Select files',
  dropLabel = 'Drag and drop files here, or click to browse',
  subLabel = `Images, videos, PDF, DOC, and TXT up to ${Math.floor(MEDIA_MAX_FILE_SIZE_BYTES / (1024 * 1024))}MB`,
  renderFooter,
}: MediaDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <section
        className={cn(
          variant === 'classic'
            ? 'min-h-[210px] rounded-sm border-4 border-dashed p-6 transition-colors'
            : 'rounded-xl border border-dashed p-6 transition-colors',
          dragActive
            ? variant === 'classic'
              ? 'border-slate-400 bg-slate-100'
              : 'border-primary bg-primary/5'
            : variant === 'classic'
              ? 'border-slate-300 bg-slate-50'
              : 'border-border'
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          void onFilesSelected(e.dataTransfer.files);
        }}
      >
        <div
          className={cn(
            variant === 'classic'
              ? 'flex min-h-[170px] flex-col items-center justify-center gap-2 text-center'
              : 'flex flex-col items-center justify-center gap-3 text-center'
          )}
        >
          {variant === 'classic' ? (
            <p className="text-4xl text-slate-500">+</p>
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}

          <div>
            <p className={cn(variant === 'classic' ? 'text-3xl font-medium text-slate-700' : 'text-sm font-medium')}>
              {dropLabel}
            </p>
            {variant === 'classic' ? (
              <p className="text-xl text-slate-600">or</p>
            ) : (
              <p className="text-xs text-muted-foreground">{subLabel}</p>
            )}
          </div>

          <button
            type="button"
            onClick={openFilePicker}
            className={cn(
              variant === 'classic'
                ? 'rounded border border-blue-500 bg-white px-4 py-2 text-blue-600 hover:bg-blue-50'
                : 'rounded-md border px-3 py-2 text-sm hover:bg-accent'
            )}
          >
            {buttonLabel}
          </button>

          <input
            ref={inputRef}
            className="hidden"
            type="file"
            multiple
            onChange={(e) => void onFilesSelected(e.target.files)}
          />

          {uploadState && (
            <div className="w-full max-w-md space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="truncate pr-2">{uploadState.fileName}</span>
                <span>{uploadState.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded bg-secondary">
                <div className="h-full bg-primary transition-all" style={{ width: `${uploadState.progress}%` }} />
              </div>
              {uploadState.status === 'error' && uploadState.error && (
                <p className="text-xs text-red-600">{uploadState.error}</p>
              )}
            </div>
          )}
        </div>
      </section>

      {renderFooter ? renderFooter(openFilePicker) : null}
    </>
  );
}
