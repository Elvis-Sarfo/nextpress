import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import nextpressConfig from '@/nextpress.config';

export type StorageProvider = 'local' | 's3' | 'supabase' | 'cloudinary';

export interface SignedUploadInput {
  filename: string;
  mimeType: string;
  size: number;
}

export interface SignedUploadOutput {
  strategy: 'direct' | 'server';
  provider: StorageProvider;
  method?: 'POST' | 'PUT';
  uploadUrl?: string;
  uploadHeaders?: Record<string, string>;
  uploadFields?: Record<string, string>;
  storageKey?: string;
  publicUrl?: string;
  expiresAt?: string;
}

export interface UploadServerInput {
  filename: string;
  mimeType: string;
  content: Buffer;
}

export interface StoredFile {
  provider: StorageProvider;
  key: string;
  url: string;
}

interface StorageAdapter {
  getSignedUpload(input: SignedUploadInput): Promise<SignedUploadOutput>;
  uploadServerFile(input: UploadServerInput): Promise<StoredFile>;
  deleteFile(input: { key: string; url?: string }): Promise<void>;
}

function getStorageConfig() {
  return nextpressConfig.storage ?? {
    provider: 'local' as const,
    local: { uploadDir: 'public/uploads/media', publicBasePath: '/uploads/media' },
  };
}

export function getStorageProvider(): StorageProvider {
  return getStorageConfig().provider;
}

function safeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
}

function fileExtension(filename: string): string {
  const ext = path.extname(filename || '').toLowerCase();
  return ext.replace('.', '');
}

function makeStorageKey(filename: string): string {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const random = crypto.randomUUID();
  const ext = fileExtension(filename);
  return ext
    ? `media/${yyyy}/${mm}/${random}.${ext}`
    : `media/${yyyy}/${mm}/${random}-${safeFilename(filename || 'file')}`;
}

function localPublicUrlForKey(key: string): string {
  const local = getStorageConfig().local;
  const base = (local?.publicBasePath || '/uploads/media').replace(/\/$/, '');
  const basename = key.split('/').pop() ?? key;
  return `${base}/${basename}`;
}

const localAdapter: StorageAdapter = {
  async getSignedUpload() {
    return {
      strategy: 'server',
      provider: 'local',
    };
  },

  async uploadServerFile(input) {
    const cfg = getStorageConfig().local;
    const uploadDir = cfg?.uploadDir || 'public/uploads/media';
    const root = path.resolve(process.cwd(), uploadDir);
    await fs.mkdir(root, { recursive: true });

    const key = makeStorageKey(input.filename);
    const basename = key.split('/').pop() ?? key;
    const targetPath = path.join(root, basename);

    await fs.writeFile(targetPath, input.content);

    return {
      provider: 'local',
      key,
      url: localPublicUrlForKey(key),
    };
  },

  async deleteFile(input) {
    const cfg = getStorageConfig().local;
    const uploadDir = cfg?.uploadDir || 'public/uploads/media';
    const basename = input.key.split('/').pop() ?? '';
    if (!basename) return;

    const targetPath = path.resolve(process.cwd(), uploadDir, basename);
    await fs.rm(targetPath, { force: true });
  },
};

function hmacSha256(key: string | Buffer, message: string): Buffer {
  return crypto.createHmac('sha256', key).update(message, 'utf8').digest();
}

function getS3SignatureKey(secret: string, date: string, region: string): Buffer {
  const kDate = hmacSha256(`AWS4${secret}`, date);
  const kRegion = hmacSha256(kDate, region);
  const kService = hmacSha256(kRegion, 's3');
  return hmacSha256(kService, 'aws4_request');
}

const s3Adapter: StorageAdapter = {
  async getSignedUpload(input) {
    const cfg = getStorageConfig().s3;
    if (!cfg?.bucket || !cfg.region || !cfg.accessKeyId || !cfg.secretAccessKey) {
      throw new Error('S3 storage is not fully configured.');
    }

    const key = makeStorageKey(input.filename);
    const now = new Date();
    const amzDate = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const dateStamp = amzDate.slice(0, 8);
    const expiresSeconds = 900;
    const credentialScope = `${dateStamp}/${cfg.region}/s3/aws4_request`;
    const endpoint = cfg.endpoint || `https://${cfg.bucket}.s3.${cfg.region}.amazonaws.com`;

    const policy = {
      expiration: new Date(now.getTime() + expiresSeconds * 1000).toISOString(),
      conditions: [
        { bucket: cfg.bucket },
        ['starts-with', '$key', 'media/'],
        { key },
        { acl: 'public-read' },
        { 'Content-Type': input.mimeType },
        ['content-length-range', 1, Math.max(input.size, 1)],
        { 'x-amz-algorithm': 'AWS4-HMAC-SHA256' },
        { 'x-amz-credential': `${cfg.accessKeyId}/${credentialScope}` },
        { 'x-amz-date': amzDate },
      ],
    };

    const policyBase64 = Buffer.from(JSON.stringify(policy)).toString('base64');
    const signatureKey = getS3SignatureKey(cfg.secretAccessKey, dateStamp, cfg.region);
    const signature = crypto.createHmac('sha256', signatureKey).update(policyBase64).digest('hex');
    const publicUrl = cfg.publicBaseUrl?.replace(/\/$/, '')
      ? `${cfg.publicBaseUrl.replace(/\/$/, '')}/${key}`
      : `${endpoint}/${key}`;

    return {
      strategy: 'direct',
      provider: 's3',
      method: 'POST',
      uploadUrl: endpoint,
      uploadFields: {
        key,
        acl: 'public-read',
        'Content-Type': input.mimeType,
        Policy: policyBase64,
        'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
        'X-Amz-Credential': `${cfg.accessKeyId}/${credentialScope}`,
        'X-Amz-Date': amzDate,
        'X-Amz-Signature': signature,
      },
      storageKey: key,
      publicUrl,
      expiresAt: new Date(now.getTime() + expiresSeconds * 1000).toISOString(),
    };
  },

  async uploadServerFile() {
    throw new Error('S3 adapter expects signed direct uploads.');
  },

  async deleteFile(input) {
    // Optional hard-delete. Without AWS SDK we cannot issue a signed DELETE request safely.
    // Keep DB deletion working even when object removal is unavailable.
    console.warn(`[media] S3 file deletion skipped for key: ${input.key}`);
  },
};

const supabaseAdapter: StorageAdapter = {
  async getSignedUpload(input) {
    const cfg = getStorageConfig().supabase;
    if (!cfg?.url || !cfg.serviceRoleKey || !cfg.bucket) {
      throw new Error('Supabase storage is not fully configured.');
    }

    const key = makeStorageKey(input.filename);
    const endpoint = `${cfg.url.replace(/\/$/, '')}/storage/v1/object/upload/sign/${cfg.bucket}/${key}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.serviceRoleKey}`,
        apikey: cfg.serviceRoleKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ upsert: false }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Supabase signed upload failed: ${text}`);
    }

    const data = (await res.json()) as { signedURL?: string; token?: string };
    const signedPath = data.signedURL || '';
    if (!signedPath) {
      throw new Error('Supabase did not return a signed upload URL.');
    }

    const uploadUrl = `${cfg.url.replace(/\/$/, '')}${signedPath}`;
    const publicUrl = `${cfg.url.replace(/\/$/, '')}/storage/v1/object/public/${cfg.bucket}/${key}`;

    return {
      strategy: 'direct',
      provider: 'supabase',
      method: 'PUT',
      uploadUrl,
      uploadHeaders: {
        'Content-Type': input.mimeType,
      },
      storageKey: key,
      publicUrl,
    };
  },

  async uploadServerFile() {
    throw new Error('Supabase adapter expects signed direct uploads.');
  },

  async deleteFile(input) {
    const cfg = getStorageConfig().supabase;
    if (!cfg?.url || !cfg.serviceRoleKey || !cfg.bucket) return;

    const endpoint = `${cfg.url.replace(/\/$/, '')}/storage/v1/object/${cfg.bucket}/${input.key}`;
    await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${cfg.serviceRoleKey}`,
        apikey: cfg.serviceRoleKey,
      },
    });
  },
};

const cloudinaryAdapter: StorageAdapter = {
  async getSignedUpload(input) {
    const cfg = getStorageConfig().cloudinary;
    if (!cfg?.cloudName || !cfg.apiKey || !cfg.apiSecret) {
      throw new Error('Cloudinary storage is not fully configured.');
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = makeStorageKey(input.filename).replace(/^media\//, '').replace(/\.[^/.]+$/, '');
    const folder = cfg.folder || 'nextpress-media';
    const paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash('sha1')
      .update(`${paramsToSign}${cfg.apiSecret}`)
      .digest('hex');

    const ext = fileExtension(input.filename);
    const storageKey = `${folder}/${publicId}${ext ? `.${ext}` : ''}`;

    return {
      strategy: 'direct',
      provider: 'cloudinary',
      method: 'POST',
      uploadUrl: `https://api.cloudinary.com/v1_1/${cfg.cloudName}/auto/upload`,
      uploadFields: {
        api_key: cfg.apiKey,
        timestamp: String(timestamp),
        signature,
        folder,
        public_id: publicId,
      },
      storageKey,
      publicUrl: `https://res.cloudinary.com/${cfg.cloudName}/image/upload/${storageKey}`,
    };
  },

  async uploadServerFile() {
    throw new Error('Cloudinary adapter expects signed direct uploads.');
  },

  async deleteFile() {
    // Optional hard-delete omitted to avoid provider-specific SDK dependency.
  },
};

function getAdapter(): StorageAdapter {
  const provider = getStorageProvider();
  if (provider === 's3') return s3Adapter;
  if (provider === 'supabase') return supabaseAdapter;
  if (provider === 'cloudinary') return cloudinaryAdapter;
  return localAdapter;
}

export async function createSignedUpload(input: SignedUploadInput): Promise<SignedUploadOutput> {
  return getAdapter().getSignedUpload(input);
}

export async function storeServerFile(input: UploadServerInput): Promise<StoredFile> {
  return getAdapter().uploadServerFile(input);
}

export async function deleteStoredFile(input: { key: string; url?: string }): Promise<void> {
  await getAdapter().deleteFile(input);
}
