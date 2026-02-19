import type { MediaKind } from './constants';

export interface MediaRecord {
  id: string;
  filename: string;
  originalFilename?: string | null;
  url: string;
  storageKey: string;
  storageProvider: string;
  type: string;
  kind: MediaKind;
  extension?: string | null;
  size: number;
  width?: number | null;
  height?: number | null;
  altText?: string | null;
  title?: string | null;
  description?: string | null;
  uploadedAt: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, unknown> | null;
}

export interface MediaListResponse {
  docs: MediaRecord[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface SignedUploadResponse {
  provider: string;
  strategy: 'direct' | 'server';
  method?: 'POST' | 'PUT';
  uploadUrl?: string;
  uploadHeaders?: Record<string, string>;
  uploadFields?: Record<string, string>;
  storageKey?: string;
  publicUrl?: string;
  expiresAt?: string;
}
