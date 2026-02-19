import { prisma } from '@/adapters/prisma-adapter';
import { MEDIA_ALLOWED_MIME_TYPES, MEDIA_MAX_FILE_SIZE_BYTES, inferMediaKind } from './constants';
import type { MediaRecord } from './types';

export interface MediaUploadInput {
  filename: string;
  originalFilename?: string;
  url: string;
  storageProvider: string;
  storageKey: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  altText?: string;
  title?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface MediaSearchInput {
  page: number;
  limit: number;
  query?: string;
  type?: string;
}

export function validateFileInput(input: {
  mimeType: string;
  size: number;
  filename: string;
}): string | null {
  if (!input.filename?.trim()) return 'Filename is required.';
  if (!input.mimeType) return 'MIME type is required.';
  if (!MEDIA_ALLOWED_MIME_TYPES.includes(input.mimeType as (typeof MEDIA_ALLOWED_MIME_TYPES)[number])) {
    return `File type ${input.mimeType} is not allowed.`;
  }
  if (input.size <= 0) return 'File size must be greater than zero.';
  if (input.size > MEDIA_MAX_FILE_SIZE_BYTES) {
    return `File exceeds max size (${Math.floor(MEDIA_MAX_FILE_SIZE_BYTES / (1024 * 1024))}MB).`;
  }
  return null;
}

function normalizeMedia(row: Record<string, any>): MediaRecord {
  return {
    id: String(row.id),
    filename: String(row.filename || ''),
    originalFilename: row.originalFilename ?? null,
    url: String(row.url || ''),
    storageKey: String(row.storageKey || ''),
    storageProvider: String(row.storageProvider || 'local'),
    type: String(row.mimeType || row.type || ''),
    kind: inferMediaKind(String(row.mimeType || row.type || '')),
    extension: row.extension ?? null,
    size: Number(row.filesize ?? row.size ?? 0),
    width: row.width ?? null,
    height: row.height ?? null,
    altText: row.altText ?? row.alt ?? null,
    title: row.title ?? null,
    description: row.description ?? row.caption ?? null,
    uploadedAt: (row.uploadedAt ?? row.createdAt ?? new Date()).toISOString?.() || String(row.uploadedAt),
    createdAt: row.createdAt?.toISOString?.() || row.createdAt,
    updatedAt: row.updatedAt?.toISOString?.() || row.updatedAt,
    metadata: (row.metadata as Record<string, unknown> | null) ?? null,
  };
}

export async function listMedia(input: MediaSearchInput) {
  const model = (prisma as unknown as Record<string, any>).media;
  const page = Math.max(1, input.page || 1);
  const limit = Math.min(100, Math.max(1, input.limit || 24));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (input.query) {
    where.OR = [
      { filename: { contains: input.query, mode: 'insensitive' } },
      { originalFilename: { contains: input.query, mode: 'insensitive' } },
      { altText: { contains: input.query, mode: 'insensitive' } },
      { title: { contains: input.query, mode: 'insensitive' } },
      { description: { contains: input.query, mode: 'insensitive' } },
      { alt: { contains: input.query, mode: 'insensitive' } },
      { caption: { contains: input.query, mode: 'insensitive' } },
    ];
  }

  if (input.type && input.type !== 'all') {
    where.mimeType = { startsWith: `${input.type}/` };
  }

  const [rows, total] = await Promise.all([
    model.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    model.count({ where }),
  ]);

  return {
    docs: (rows as Record<string, any>[]).map(normalizeMedia),
    page,
    limit,
    total,
    hasMore: page * limit < total,
  };
}

export async function createMedia(input: MediaUploadInput) {
  const model = (prisma as unknown as Record<string, any>).media;

  const ext = input.filename.includes('.') ? input.filename.split('.').pop()?.toLowerCase() : null;

  const data: Record<string, unknown> = {
    filename: input.filename,
    originalFilename: input.originalFilename || input.filename,
    url: input.url,
    mimeType: input.mimeType,
    kind: inferMediaKind(input.mimeType),
    filesize: input.size,
    size: input.size,
    extension: ext,
    storageProvider: input.storageProvider,
    storageKey: input.storageKey,
    width: input.width,
    height: input.height,
    altText: input.altText || null,
    title: input.title || null,
    description: input.description || null,
    alt: input.altText || null,
    caption: input.description || null,
    uploadedAt: new Date(),
    metadata: input.metadata || {},
    status: 'active',
    documentId: cryptoRandomDocumentId(),
  };

  const row = await model.create({ data });
  return normalizeMedia(row);
}

export async function getMediaById(id: string) {
  const model = (prisma as unknown as Record<string, any>).media;
  const row = await model.findUnique({ where: { id } });
  if (!row) return null;
  return normalizeMedia(row as Record<string, any>);
}

export async function updateMediaById(
  id: string,
  input: Partial<Pick<MediaUploadInput, 'altText' | 'title' | 'description' | 'metadata'>>
) {
  const model = (prisma as unknown as Record<string, any>).media;
  const row = await model.update({
    where: { id },
    data: {
      altText: input.altText,
      alt: input.altText,
      title: input.title,
      description: input.description,
      caption: input.description,
      metadata: input.metadata,
    },
  });

  return normalizeMedia(row as Record<string, any>);
}

export async function deleteMediaById(id: string) {
  const model = (prisma as unknown as Record<string, any>).media;
  const row = await model.delete({ where: { id } });
  return normalizeMedia(row as Record<string, any>);
}

function cryptoRandomDocumentId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
