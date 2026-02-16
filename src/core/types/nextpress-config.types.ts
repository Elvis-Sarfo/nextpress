import type { CollectionConfig } from '../collection';

export type NextPressSchemaStrategy = 'once' | 'hash' | 'always';
export type NextPressSchemaStateBackend = 'memory' | 'file';
export type NextPressDatabaseProvider = 'postgres' | 'postgresql' | 'mysql' | 'sqlite';

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

export interface NextPressConfig {
  collections: CollectionConfig[];
  secret?: string;
  typescript?: NextPressTypeScriptConfig;
  db?: NextPressDbConfig;
  localization?: NextPressLocalizationConfig;
  schema?: NextPressSchemaConfig;
}
