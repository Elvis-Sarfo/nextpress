'use client';

import { useCallback, useMemo, useState } from 'react';
import { MEDIA_ALLOWED_MIME_TYPES, MEDIA_MAX_FILE_SIZE_BYTES } from '@/lib/media/constants';
import type { MediaListResponse, MediaRecord, SignedUploadResponse } from '@/lib/media/types';

interface UploadState {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

export function useMediaLibrary() {
  const [items, setItems] = useState<MediaRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(24);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<UploadState | null>(null);

  const hasMore = useMemo(() => page * limit < total, [page, limit, total]);

  const loadMedia = useCallback(async (next?: Partial<{ page: number; query: string; type: string }>) => {
    const targetPage = next?.page ?? page;
    const targetQuery = next?.query ?? query;
    const targetType = next?.type ?? typeFilter;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(targetPage),
        limit: String(limit),
        ...(targetQuery ? { q: targetQuery } : {}),
        ...(targetType && targetType !== 'all' ? { type: targetType } : {}),
      });

      const res = await fetch(`/api/media?${params}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to fetch media.');
      }

      const data = (await res.json()) as MediaListResponse;
      setItems(data.docs);
      setTotal(data.total);
      setPage(data.page);
      setLimit(data.limit);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load media.');
    } finally {
      setLoading(false);
    }
  }, [limit, page, query, typeFilter]);

  const updateMetadata = useCallback(async (
    id: string,
    payload: { altText?: string; title?: string; description?: string; metadata?: Record<string, unknown> }
  ) => {
    const res = await fetch(`/api/media/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Unable to update metadata.');
    }

    const data = (await res.json()) as { doc: MediaRecord };
    setItems((prev) => prev.map((item) => (item.id === id ? data.doc : item)));
    return data.doc;
  }, []);

  const deleteMedia = useCallback(async (id: string) => {
    const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Unable to delete media.');
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
    setTotal((prev) => Math.max(0, prev - 1));
  }, []);

  const uploadFile = useCallback(async (file: File, metadata?: {
    altText?: string;
    title?: string;
    description?: string;
  }) => {
    if (!MEDIA_ALLOWED_MIME_TYPES.includes(file.type as (typeof MEDIA_ALLOWED_MIME_TYPES)[number])) {
      throw new Error(`File type ${file.type} is not supported.`);
    }
    if (file.size > MEDIA_MAX_FILE_SIZE_BYTES) {
      throw new Error(`Max file size is ${Math.floor(MEDIA_MAX_FILE_SIZE_BYTES / (1024 * 1024))}MB.`);
    }

    setUploadState({ fileName: file.name, progress: 0, status: 'pending' });

    try {
      const signedRes = await fetch('/api/media/signed-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, mimeType: file.type, size: file.size }),
      });

      if (!signedRes.ok) {
        const data = await signedRes.json().catch(() => ({}));
        throw new Error(data.error || 'Could not prepare upload.');
      }

      const signed = (await signedRes.json()) as SignedUploadResponse;

      setUploadState({ fileName: file.name, progress: 5, status: 'uploading' });

      const { width, height } = await getImageDimensions(file);

      if (signed.strategy === 'server') {
        const formData = new FormData();
        formData.append('file', file);
        if (metadata?.altText) formData.append('altText', metadata.altText);
        if (metadata?.title) formData.append('title', metadata.title);
        if (metadata?.description) formData.append('description', metadata.description);
        if (width) formData.append('width', String(width));
        if (height) formData.append('height', String(height));

        const created = await uploadViaXhr('/api/media', {
          method: 'POST',
          body: formData,
          onProgress: (progress) => {
            setUploadState({ fileName: file.name, progress, status: 'uploading' });
          },
        });

        const createdData = JSON.parse(created) as { doc: MediaRecord };
        setItems((prev) => [createdData.doc, ...prev]);
        setTotal((prev) => prev + 1);
        setUploadState({ fileName: file.name, progress: 100, status: 'done' });
        return createdData.doc;
      }

      const uploadResult = await uploadDirect(file, signed, (progress) => {
        setUploadState({ fileName: file.name, progress, status: 'uploading' });
      });

      const finalUrl = uploadResult.publicUrl || signed.publicUrl || '';
      const finalKey = uploadResult.storageKey || signed.storageKey || file.name;

      const createRes = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          originalFilename: file.name,
          mimeType: file.type,
          size: file.size,
          width,
          height,
          url: finalUrl,
          storageKey: finalKey,
          storageProvider: signed.provider,
          altText: metadata?.altText,
          title: metadata?.title,
          description: metadata?.description,
          metadata: {
            directUploadResult: uploadResult.raw,
          },
        }),
      });

      if (!createRes.ok) {
        const data = await createRes.json().catch(() => ({}));
        throw new Error(data.error || 'Upload succeeded but metadata save failed.');
      }

      const data = (await createRes.json()) as { doc: MediaRecord };
      setItems((prev) => [data.doc, ...prev]);
      setTotal((prev) => prev + 1);
      setUploadState({ fileName: file.name, progress: 100, status: 'done' });
      return data.doc;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Upload failed.';
      setUploadState({ fileName: file.name, progress: 0, status: 'error', error: message });
      setError(message);
      throw e;
    }
  }, []);

  return {
    items,
    total,
    page,
    limit,
    query,
    typeFilter,
    loading,
    error,
    hasMore,
    uploadState,
    setPage,
    setQuery,
    setTypeFilter,
    loadMedia,
    uploadFile,
    updateMetadata,
    deleteMedia,
  };
}

async function getImageDimensions(file: File): Promise<{ width?: number; height?: number }> {
  if (!file.type.startsWith('image/')) return {};

  return new Promise((resolve) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      resolve({ width: image.width, height: image.height });
      URL.revokeObjectURL(objectUrl);
    };
    image.onerror = () => {
      resolve({});
      URL.revokeObjectURL(objectUrl);
    };
    image.src = objectUrl;
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

    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const pct = Math.max(1, Math.round((event.loaded / event.total) * 100));
      options.onProgress(pct);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText);
      } else {
        reject(new Error(`Upload failed (${xhr.status}).`));
      }
    };

    xhr.onerror = () => reject(new Error('Upload failed due to network error.'));
    xhr.send(options.body);
  });
}

async function uploadDirect(
  file: File,
  signed: SignedUploadResponse,
  onProgress: (progress: number) => void
): Promise<{ publicUrl?: string; storageKey?: string; raw?: unknown }> {
  if (!signed.uploadUrl || !signed.method) {
    throw new Error('Invalid signed upload response.');
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

  const formData = new FormData();
  Object.entries(signed.uploadFields || {}).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append('file', file);

  const rawResponse = await uploadViaXhr(signed.uploadUrl, {
    method: 'POST',
    body: formData,
    onProgress,
  });

  const parsed = safeJsonParse(rawResponse);
  const publicUrl =
    parsed?.secure_url ||
    parsed?.url ||
    signed.publicUrl;

  const storageKey = parsed?.public_id ? String(parsed.public_id) : signed.storageKey;

  return {
    publicUrl,
    storageKey,
    raw: parsed || rawResponse,
  };
}

function safeJsonParse(input: string): any {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}
