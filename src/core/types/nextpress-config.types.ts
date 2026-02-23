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

// ============================================================================
// ADMIN UI CONFIG
// ============================================================================

/** A single sidebar navigation group definition */
export interface NextPressAdminSidebarGroupConfig {
  /** Matches the group key used in collection.admin.group */
  key: string;
  /** Display label shown in the sidebar */
  label?: string;
  /**
   * Lucide-react icon name (PascalCase).
   * E.g. 'Users', 'FileText', 'Settings', 'Image'
   */
  icon?: string;
  /** Sort order — lower numbers appear higher in the sidebar */
  order?: number;
  /** Whether the group starts collapsed (default: false) */
  defaultCollapsed?: boolean;
}

/** Per-collection sidebar overrides */
export interface NextPressAdminSidebarCollectionConfig {
  /** Override the display label */
  label?: string;
  /** Lucide-react icon name (PascalCase) */
  icon?: string | null;
  /** Hide this collection from the sidebar entirely */
  hidden?: boolean;
  /** Show the "Add New" sub-item (default: true) */
  showAddNew?: boolean;
  /**
   * Nest this collection inside another collection's menu item.
   * Provide the parent collection's slug (e.g. 'posts').
   * The collection is removed from its natural group position
   * and rendered as a collapsible sub-menu under the specified parent.
   */
  parent?: string;
}

/** A custom link entry in the sidebar */
export interface NextPressAdminSidebarLinkConfig {
  /** Display label */
  label: string;
  /** Target URL */
  href: string;
  /** Lucide-react icon name (PascalCase) */
  icon?: string;
  /** Opens link in a new tab */
  external?: boolean;
}

export interface NextPressAdminSidebarConfig {
  /**
   * Navigation group definitions — controls labels, icons, and sort order.
   * Keys must match collection.admin.group.key values.
   */
  groups?: NextPressAdminSidebarGroupConfig[];
  /**
   * Per-collection overrides (keyed by collection slug).
   * Control icons, labels, visibility, and sub-item presence.
   */
  collections?: Record<string, NextPressAdminSidebarCollectionConfig>;
  /**
   * Custom links rendered at the top of the sidebar (after Dashboard).
   */
  topLinks?: NextPressAdminSidebarLinkConfig[];
  /**
   * Custom links rendered at the bottom of the sidebar (alongside "View Site").
   */
  footerLinks?: NextPressAdminSidebarLinkConfig[];
}

export interface NextPressAdminConfig {
  sidebar?: NextPressAdminSidebarConfig;
}

export interface NextPressConfig {
  collections: CollectionConfig[];
  secret?: string;
  typescript?: NextPressTypeScriptConfig;
  db?: NextPressDbConfig;
  storage?: NextPressStorageConfig;
  localization?: NextPressLocalizationConfig;
  schema?: NextPressSchemaConfig;
  /** Admin UI configuration (sidebar layout, icons, custom links) */
  admin?: NextPressAdminConfig;
}
