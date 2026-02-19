'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MEDIA_ALLOWED_MIME_TYPES, MEDIA_MAX_FILE_SIZE_BYTES } from '@/lib/media/constants';
import { MediaDropzone } from '@/components/media/MediaDropzone';

type UploadStatus = 'pending' | 'uploading' | 'done' | 'error';

interface FileMeta {
  filename: string;
  mimeType: string;
  size: number;
  sizeLabel: string;
  lastModifiedAt?: string;
  width?: number;
  height?: number;
  durationSec?: number;
  extension?: string;
}

interface UploadItem {
  id: string;
  file: File;
  meta: FileMeta;
  status: UploadStatus;
  progress: number;
  error?: string;
  uploadedId?: string;
}

interface SignedUploadResponse {
  provider: string;
  strategy: 'direct' | 'server';
  method?: 'POST' | 'PUT';
  uploadUrl?: string;
  uploadHeaders?: Record<string, string>;
  uploadFields?: Record<string, string>;
  storageKey?: string;
  publicUrl?: string;
}

export function MediaUpload() {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pendingCount = useMemo(
    () => items.filter((item) => item.status === 'pending' || item.status === 'error').length,
    [items]
  );

  const onFilesSelected = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setGlobalError(null);

    const next: UploadItem[] = [];
    for (const file of Array.from(fileList)) {
      const validationError = validateFile(file);
      const meta = await extractFileMetadata(file);
      next.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        file,
        meta,
        status: validationError ? 'error' : 'pending',
        progress: 0,
        error: validationError ?? undefined,
      });
    }

    setItems((prev) => [...next, ...prev]);
  };

  const updateItem = (id: string, patch: Partial<UploadItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const uploadAll = async () => {
    setIsUploading(true);
    setGlobalError(null);

    const targets = items.filter((item) => item.status === 'pending' || item.status === 'error');
    for (const item of targets) {
      await uploadSingle(item);
    }

    setIsUploading(false);
  };

  const uploadSingle = async (item: UploadItem) => {
    const file = item.file;
    const validationError = validateFile(file);
    if (validationError) {
      updateItem(item.id, { status: 'error', error: validationError, progress: 0 });
      return;
    }

    try {
      updateItem(item.id, { status: 'uploading', error: undefined, progress: 5 });

      const signedRes = await fetch('/api/media/signed-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          mimeType: file.type,
          size: file.size,
        }),
      });

      if (!signedRes.ok) {
        const data = await signedRes.json().catch(() => ({}));
        throw new Error(data.error || 'Could not initialize upload.');
      }

      const signed = (await signedRes.json()) as SignedUploadResponse;

      let uploadedUrl = signed.publicUrl || '';
      let uploadedKey = signed.storageKey || '';

      if (signed.strategy === 'server') {
        const form = new FormData();
        form.append('file', file);
        form.append('title', filenameToTitle(file.name));
        form.append('altText', filenameToTitle(file.name));
        form.append('description', `Uploaded file: ${file.name}`);
        if (item.meta.width) form.append('width', String(item.meta.width));
        if (item.meta.height) form.append('height', String(item.meta.height));

        const raw = await uploadViaXhr('/api/media', {
          method: 'POST',
          body: form,
          onProgress: (progress) => updateItem(item.id, { progress }),
        });

        const created = JSON.parse(raw) as { doc?: { id?: string } };
        updateItem(item.id, {
          status: 'done',
          progress: 100,
          uploadedId: created.doc?.id,
        });
        return;
      }

      const direct = await uploadDirect(file, signed, (progress) => updateItem(item.id, { progress }));
      uploadedUrl = direct.publicUrl || uploadedUrl;
      uploadedKey = direct.storageKey || uploadedKey;

      const createRes = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          originalFilename: file.name,
          mimeType: file.type,
          size: file.size,
          width: item.meta.width,
          height: item.meta.height,
          url: uploadedUrl,
          storageKey: uploadedKey,
          storageProvider: signed.provider,
          title: filenameToTitle(file.name),
          altText: filenameToTitle(file.name),
          description: `Uploaded file: ${file.name}`,
          metadata: {
            lastModifiedAt: item.meta.lastModifiedAt,
            durationSec: item.meta.durationSec,
            extension: item.meta.extension,
            uploadedThrough: 'admin-media-new-page',
          },
        }),
      });

      if (!createRes.ok) {
        const data = await createRes.json().catch(() => ({}));
        throw new Error(data.error || 'Upload succeeded but save failed.');
      }

      const created = (await createRes.json()) as { doc?: { id?: string } };
      updateItem(item.id, {
        status: 'done',
        progress: 100,
        uploadedId: created.doc?.id,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed.';
      updateItem(item.id, { status: 'error', error: message, progress: 0 });
      setGlobalError(message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Upload New Media</h1>

      <MediaDropzone
        onFilesSelected={onFilesSelected}
        buttonLabel="Select Files"
        dropLabel="Drop files to upload"
        renderFooter={(openFilePicker) => (
          <div className="space-y-1 text-lg text-slate-700">
            <p>
              You are using the multi-file uploader. Problems? Try the{' '}
              <button type="button" onClick={openFilePicker} className="text-blue-600 underline">
                browser uploader
              </button>{' '}
              instead.
            </p>
            <p>
              Maximum upload file size: {Math.floor(MEDIA_MAX_FILE_SIZE_BYTES / (1024 * 1024))} MB.
            </p>
          </div>
        )}
      />

      {globalError && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {globalError}
        </div>
      )}

      {items.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Files ({items.length})</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setItems((prev) => prev.filter((i) => i.status !== 'done'))}
              >
                Clear Uploaded
              </Button>
              <Button onClick={uploadAll} disabled={isUploading || pendingCount === 0}>
                {isUploading ? 'Uploading...' : `Upload ${pendingCount} file${pendingCount > 1 ? 's' : ''}`}
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                <tr>
                  <th className="px-3 py-2">File</th>
                  <th className="px-3 py-2">Metadata</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Progress</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t align-top">
                    <td className="px-3 py-2">
                      <p className="font-medium">{item.meta.filename}</p>
                      <p className="text-xs text-slate-600">{item.meta.mimeType}</p>
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-700">
                      <p>Size: {item.meta.sizeLabel}</p>
                      {item.meta.lastModifiedAt && <p>Modified: {formatDate(item.meta.lastModifiedAt)}</p>}
                      {item.meta.width && item.meta.height && (
                        <p>
                          Dimensions: {item.meta.width} x {item.meta.height}
                        </p>
                      )}
                      {typeof item.meta.durationSec === 'number' && (
                        <p>Duration: {item.meta.durationSec.toFixed(1)}s</p>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex rounded px-2 py-1 text-xs font-medium ${
                          item.status === 'done'
                            ? 'bg-green-100 text-green-700'
                            : item.status === 'error'
                              ? 'bg-red-100 text-red-700'
                              : item.status === 'uploading'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.status}
                      </span>
                      {item.error && <p className="mt-1 text-xs text-red-600">{item.error}</p>}
                      {item.uploadedId && (
                        <p className="mt-1 text-xs">
                          <Link href={`/admin/media/${item.uploadedId}`} className="text-blue-600 underline">
                            Open record
                          </Link>
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="h-2 w-40 overflow-hidden rounded bg-slate-200">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function validateFile(file: File): string | null {
  if (!MEDIA_ALLOWED_MIME_TYPES.includes(file.type as (typeof MEDIA_ALLOWED_MIME_TYPES)[number])) {
    return `Unsupported type: ${file.type || 'unknown'}`;
  }
  if (file.size > MEDIA_MAX_FILE_SIZE_BYTES) {
    return `File exceeds ${Math.floor(MEDIA_MAX_FILE_SIZE_BYTES / (1024 * 1024))}MB limit.`;
  }
  return null;
}

async function extractFileMetadata(file: File): Promise<FileMeta> {
  const extension = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() : undefined;

  const base: FileMeta = {
    filename: file.name,
    mimeType: file.type,
    size: file.size,
    sizeLabel: formatBytes(file.size),
    lastModifiedAt: file.lastModified ? new Date(file.lastModified).toISOString() : undefined,
    extension,
  };

  if (file.type.startsWith('image/')) {
    const dim = await getImageSize(file);
    return { ...base, ...dim };
  }

  if (file.type.startsWith('video/')) {
    const meta = await getVideoMetadata(file);
    return { ...base, ...meta };
  }

  return base;
}

function getImageSize(file: File): Promise<{ width?: number; height?: number }> {
  return new Promise((resolve) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      resolve({ width: image.width, height: image.height });
      URL.revokeObjectURL(url);
    };

    image.onerror = () => {
      resolve({});
      URL.revokeObjectURL(url);
    };

    image.src = url;
  });
}

function getVideoMetadata(file: File): Promise<{ width?: number; height?: number; durationSec?: number }> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);

    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth || undefined,
        height: video.videoHeight || undefined,
        durationSec: Number.isFinite(video.duration) ? video.duration : undefined,
      });
      URL.revokeObjectURL(url);
    };

    video.onerror = () => {
      resolve({});
      URL.revokeObjectURL(url);
    };

    video.src = url;
  });
}

function uploadViaXhr(
  url: string,
  options: {
    method: 'POST' | 'PUT';
    body: FormData | Blob;
    headers?: Record<string, string>;
    onProgress: (progress: number) => void;
  }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method, url);

    Object.entries(options.headers || {}).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const progress = Math.max(1, Math.round((event.loaded / event.total) * 100));
      options.onProgress(progress);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText);
      } else {
        reject(new Error(`Upload failed (${xhr.status}).`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload.'));
    xhr.send(options.body);
  });
}

async function uploadDirect(
  file: File,
  signed: SignedUploadResponse,
  onProgress: (progress: number) => void
): Promise<{ publicUrl?: string; storageKey?: string }> {
  if (!signed.uploadUrl || !signed.method) {
    throw new Error('Missing upload target.');
  }

  if (signed.method === 'PUT') {
    await uploadViaXhr(signed.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: signed.uploadHeaders,
      onProgress,
    });

    return {
      publicUrl: signed.publicUrl,
      storageKey: signed.storageKey,
    };
  }

  const form = new FormData();
  Object.entries(signed.uploadFields || {}).forEach(([key, value]) => {
    form.append(key, value);
  });
  form.append('file', file);

  const raw = await uploadViaXhr(signed.uploadUrl, {
    method: 'POST',
    body: form,
    onProgress,
  });

  const parsed = safeJson(raw);
  return {
    publicUrl: parsed?.secure_url || parsed?.url || signed.publicUrl,
    storageKey: parsed?.public_id || signed.storageKey,
  };
}

function filenameToTitle(filename: string): string {
  const withoutExt = filename.replace(/\.[^/.]+$/, '');
  return withoutExt.replace(/[_-]+/g, ' ').trim();
}

function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[i]}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

function safeJson(input: string): any {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}
