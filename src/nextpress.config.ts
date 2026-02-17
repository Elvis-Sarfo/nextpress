import path from 'path'
import { fileURLToPath } from 'url'
import type { NextPressConfig } from './core/types'

// System collections
import { Users } from './collections/Users'
import { Roles } from './collections/Roles'
import { Permissions } from './collections/Permissions'

// Content collections
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'

// Settings collection
import { Settings } from './collections/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const config = {
  // Collections to register
  collections: [
    // System collections (no localization)
    Users,
    Roles,
    Permissions,

    // Content collections
    Media,
    Pages,

    // Settings
    Settings,
  ],

  // Secret for authentication
  secret: process.env.PAYLOAD_SECRET || '',

  // TypeScript configuration
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // Database configuration
  db: {
    provider: 'postgres',
    url: process.env.DATABASE_URI || '',
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
