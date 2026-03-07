import path from 'path'
import { fileURLToPath } from 'url'
import type { NextPressConfig } from './core/types'
import { collections } from './collections/index'
import adminConfig from './admin.config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const config = {
  // Collections to register — edit src/collections/index.ts to add/remove collections
  collections,

  // Admin UI configuration — edit src/admin.config.ts to customize the sidebar
  admin: adminConfig,

  // Secret for authentication
  secret: process.env.PAYLOAD_SECRET || '',

  // TypeScript configuration
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // Database configuration
  db: {
    provider: 'mysql',
    url: process.env.DATABASE_URI || '',
  },

  // Media storage configuration (switch provider without code changes)
  storage: {
    provider: (process.env.NEXTPRESS_STORAGE_PROVIDER as 'local' | 's3' | 'supabase' | 'cloudinary') || 'local',
    local: {
      uploadDir: process.env.NEXTPRESS_LOCAL_UPLOAD_DIR || 'public/uploads/media',
      publicBasePath: process.env.NEXTPRESS_LOCAL_PUBLIC_PATH || '/uploads/media',
    },
    s3: {
      bucket: process.env.S3_BUCKET || '',
      region: process.env.S3_REGION || '',
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      endpoint: process.env.S3_ENDPOINT || '',
      publicBaseUrl: process.env.S3_PUBLIC_BASE_URL || '',
    },
    supabase: {
      url: process.env.SUPABASE_URL || '',
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      bucket: process.env.SUPABASE_STORAGE_BUCKET || 'media',
    },
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
      apiKey: process.env.CLOUDINARY_API_KEY || '',
      apiSecret: process.env.CLOUDINARY_API_SECRET || '',
      folder: process.env.CLOUDINARY_FOLDER || 'nextpress-media',
    },
  },

  // Localization configuration
  localization: {
    locales: [
      {
        code: 'en',
        label: 'English',
      },
      {
        code: 'fr',
        label: 'Français',
      },
      {
        code: 'zh',
        label: '中文',
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },

  // Schema generation settings
  schema: {
    // Generate Prisma schema on startup (dev only)
    generateOnStart: process.env.NODE_ENV === 'development',
    // Output path for generated schema (relative to project root)
    outputPath: 'src/adapters/prisma-adapter/prisma/schema.prisma',
    // configChangeDetectionStrategy for detecting config changes:
    // - "once" - Only run once per server start (default)
    // - "hash" - Run when collection config changes (more precise)
    // - "always" - Run every time (useful for debugging)
    configChangeDetectionStrategy: 'once',
    // State backend:
    // - "memory" - In-memory, HMR-safe within the running process
    // - "file" - Persisted to JSON file across process restarts
    stateBackend: 'memory',
    // Used when stateBackend is "file"
    stateFilePath: '.next/cache/nextpress-state.json',
    // Migration mode:
    // - "auto" - Automatically run migrations after schema changes (default in dev)
    // - "manual" - Never auto-migrate, user must run migrations manually
    // - "deploy" - Use prisma migrate deploy (for production)
    // - "prompt" - Ask before running migrations
    migrationMode: process.env.NODE_ENV === 'production' ? 'deploy' : 'auto',
  },
} satisfies NextPressConfig

export default config
