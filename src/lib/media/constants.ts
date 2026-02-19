export const MEDIA_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const MEDIA_MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

export type MediaKind = 'image' | 'video' | 'document' | 'other';

export function inferMediaKind(mimeType: string): MediaKind {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.includes('pdf') || mimeType.includes('word') || mimeType.startsWith('text/')) {
    return 'document';
  }
  return 'other';
}
