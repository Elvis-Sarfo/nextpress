import type { CollectionConfig } from '../collection';

export type NextPressSchemaStrategy = 'once' | 'hash' | 'always';
export type NextPressSchemaStateBackend = 'memory' | 'file';
export type NextPressDatabaseProvider = 'postgres' | 'postgresql' | 'mysql' | 'sqlite';
export type NextPressStorageProvider = 'local' | 's3' | 'supabase' | 'cloudinary';

/**
 * Migration mode options:
 * - "auto" - Automatically run migrations after schema changes (development only)
 * - "manual" - User must run migrations manually via CLI or API
 * - "deploy" - Run migrations in deploy mode (production-ready, no dev features)
 * - "prompt" - Ask user confirmation before running migrations
 */
export type NextPressMigrationMode = 'auto' | 'manual' | 'deploy' | 'prompt';

export interface NextPressSchemaConfig {
  generateOnStart?: boolean;
  outputPath?: string;
  configChangeDetectionStrategy?: NextPressSchemaStrategy;
  /**
   * Legacy alias kept for compatibility with older plans/config examples.
   */
  strategy?: NextPressSchemaStrategy;
  stateBackend?: NextPressSchemaStateBackend;
  stateFilePath?: string;
  /**
   * Migration mode controls how database migrations are handled:
   * - "auto" - Automatically run migrations after schema generation (default in dev)
   * - "manual" - Never auto-migrate, user must run manually
   * - "deploy" - Use prisma migrate deploy (recommended for production)
   * - "prompt" - Ask before running migrations (experimental)
   */
  migrationMode?: NextPressMigrationMode;
  /**
   * @deprecated Use migrationMode instead
   * Auto-migrate the schema to the database after generation.
   * When enabled, Prisma migrate will be run automatically after the schema is generated.
   * Note: Only recommended for development. Use with caution in production.
   */
  autoMigrate?: boolean;
}

export interface NextPressLocalizationConfig {
  locales: Array<{
    code: string;
    label: string;
  }>;
  defaultLocale: string;
  fallback?: boolean | string;
}

export interface NextPressTypeScriptConfig {
  outputFile: string;
}

export interface NextPressDbConfig {
  provider: NextPressDatabaseProvider;
  url: string;
}

export interface NextPressStorageConfig {
  provider: NextPressStorageProvider;
  local?: {
    /**
     * Relative path from project root where files are stored.
     * Default: "public/uploads/media"
     */
    uploadDir?: string;
    /**
     * Public URL prefix for local files.
     * Default: "/uploads/media"
     */
    publicBasePath?: string;
  };
  s3?: {
    bucket: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint?: string;
    publicBaseUrl?: string;
  };
  supabase?: {
    url: string;
    serviceRoleKey: string;
    bucket: string;
  };
  cloudinary?: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
    folder?: string;
  };
}

export interface NextPressConfig {
  collections: CollectionConfig[];
  secret?: string;
  typescript?: NextPressTypeScriptConfig;
  db?: NextPressDbConfig;
  storage?: NextPressStorageConfig;
  localization?: NextPressLocalizationConfig;
  schema?: NextPressSchemaConfig;
}
