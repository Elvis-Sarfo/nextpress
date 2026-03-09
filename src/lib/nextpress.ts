/**
 * NextPress Core Initialization
 * 
 * This module initializes all NextPress components from the central configuration.
 */

import nextpressConfig from '../nextpress.config';
import { Collections } from '../core/collection';
import { generatePrismaSchema } from '../core/schema-engine';
import type {
  NextPressDatabaseProvider,
  NextPressSchemaConfig,
  NextPressSchemaStateBackend,
  NextPressSchemaStrategy,
  NextPressMigrationMode,
} from '../core/types/nextpress-config.types';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as crypto from 'crypto';

// ============================================================================
// MIGRATION HANDLER
// ============================================================================

/**
 * Run database migration based on the configured migration mode
 */
async function runMigration(migrationMode: NextPressMigrationMode | undefined): Promise<boolean> {
  // Default to 'manual' if not specified
  const mode = migrationMode || 'manual';

  // Skip migration in manual mode
  if (mode === 'manual') {
    console.log(`[NextPress] 📋 Migration mode is 'manual' - skipping auto-migration`);
    console.log(`[NextPress] ℹ️  Run 'pnpm db:migrate' or 'pnpm db:push' manually when needed`);
    return false;
  }

  // Determine which command to run based on mode
  let command: string;
  let description: string;

  switch (mode) {
    case 'deploy':
      command = 'npx prisma migrate deploy';
      description = 'Deploying migrations...';
      break;
    case 'prompt':
      // For prompt mode, we'll just log and skip (would need stdin for actual prompts)
      console.log(`[NextPress] ⚠️  Migration mode is 'prompt' - requires manual confirmation`);
      console.log(`[NextPress] ℹ️  Run 'pnpm db:migrate' to proceed`);
      return false;
    case 'auto':
    default:
      command = 'npx prisma db push';
      description = 'Pushing schema changes to database...';
      break;
  }

  console.log(`[NextPress] 🔄 ${description}`);

  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`[NextPress] ✅ Migration completed successfully!`);
    return true;
  } catch (error) {
    console.error(`[NextPress] ❌ Migration failed:`, error);
    return false;
  }
}

// ============================================================================
// STATE TRACKING
// ============================================================================

type NextPressRuntimeState = {
  initialized: boolean;
  lastConfigHash: string;
};

type SchemaRuntimeConfig = {
  strategy: NextPressSchemaStrategy;
  stateBackend: NextPressSchemaStateBackend;
  stateFilePath: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __NEXTPRESS_RUNTIME_STATE__: NextPressRuntimeState | undefined;
}

function getRuntimeState(): NextPressRuntimeState {
  if (!globalThis.__NEXTPRESS_RUNTIME_STATE__) {
    globalThis.__NEXTPRESS_RUNTIME_STATE__ = {
      initialized: false,
      lastConfigHash: '',
    };
  }

  return globalThis.__NEXTPRESS_RUNTIME_STATE__;
}

function getSchemaRuntimeConfig(): SchemaRuntimeConfig {
  const schemaConfig: NextPressSchemaConfig | undefined = nextpressConfig.schema;

  return {
    strategy: schemaConfig?.configChangeDetectionStrategy || schemaConfig?.strategy || 'once',
    stateBackend: schemaConfig?.stateBackend || 'memory',
    stateFilePath: schemaConfig?.stateFilePath || '.next/cache/nextpress-state.json',
  };
}

function getStateFilePath(): string {
  const { stateFilePath } = getSchemaRuntimeConfig();
  return path.resolve(process.cwd(), stateFilePath);
}

function readFileState(): NextPressRuntimeState {
  const statePath = getStateFilePath();
  if (!fs.existsSync(statePath)) {
    return { initialized: false, lastConfigHash: '' };
  }

  try {
    const state = JSON.parse(fs.readFileSync(statePath, 'utf8')) as Partial<NextPressRuntimeState>;
    return {
      initialized: !!state.initialized,
      lastConfigHash: typeof state.lastConfigHash === 'string' ? state.lastConfigHash : '',
    };
  } catch {
    return { initialized: false, lastConfigHash: '' };
  }
}

function writeFileState(state: NextPressRuntimeState): void {
  const statePath = getStateFilePath();
  const dir = path.dirname(statePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');
}

function getState(): NextPressRuntimeState {
  const { stateBackend } = getSchemaRuntimeConfig();
  return stateBackend === 'file' ? readFileState() : getRuntimeState();
}

function setState(state: NextPressRuntimeState): void {
  const { stateBackend } = getSchemaRuntimeConfig();
  if (stateBackend === 'file') {
    writeFileState(state);
    return;
  }

  globalThis.__NEXTPRESS_RUNTIME_STATE__ = state;
}

// ============================================================================
// HASH GENERATION
// ============================================================================

/**
 * Generate a hash from collection configs to detect changes
 */
function generateConfigHash(): string {
  const collections = nextpressConfig.collections;

  // Create a simplified representation of the config
  const configData = collections.map(c => ({
    slug: c.slug,
    fields: c.fields?.map(f => ({
      name: f.name,
      type: f.type,
      required: f.required,
      unique: f.unique,
      localized: f.localized,
    })),
    versioning: typeof c.versions === 'object' ? c.versions?.enabled : c.versions,
    localization: typeof c.localization === 'object' ? c.localization?.locales : c.localization,
  }));

  const json = JSON.stringify(configData);
  return crypto.createHash('md5').update(json).digest('hex');
}

function normalizePrismaProvider(
  provider: NextPressDatabaseProvider | undefined,
): Exclude<NextPressDatabaseProvider, 'postgres'> | 'postgresql' {
  if (provider === 'postgres') {
    return 'postgresql';
  }

  return provider ?? 'postgresql';
}

// ============================================================================
// INITIALIZATION STRATEGIES
// ============================================================================

/**
 * Check if initialization should run based on the configured configChangeDetectionStrategy
 */
function shouldInitialize(): boolean {
  const state = getState();
  const { strategy: configChangeDetectionStrategy } = getSchemaRuntimeConfig();

  switch (configChangeDetectionStrategy) {
    case 'always':
      // Always run - useful for debugging
      return true;

    case 'hash':
      // Run when config hash changes
      const currentHash = generateConfigHash();
      if (currentHash === state.lastConfigHash) {
        console.log('[NextPress] Collections unchanged, skipping init');
        return false;
      }
      setState({
        ...state,
        lastConfigHash: currentHash,
      });
      return true;

    case 'once':
    default:
      // Run once per server start (default)
      if (state.initialized) {
        console.log('[NextPress] Already initialized, skipping');
        return false;
      }
      setState({
        ...state,
        initialized: true,
      });
      return true;
  }
}

/**
 * Initialize NextPress with the central configuration
 * Uses the configChangeDetectionStrategy defined in nextpress.config.ts
 */
export async function initializeNextPress(): Promise<void> {
  // Check if we should initialize based on configChangeDetectionStrategy
  if (!shouldInitialize()) {
    return;
  }

  // Initialize collections from config
  Collections.initFromConfig(nextpressConfig);

  // console.log(`[NextPress] Initialized ${Collections.count()} collections:`);
  for (const slug of Collections.getSlugs()) {
    console.log(`  - ${slug}`);
  }

  // Generate Prisma schema on startup if enabled
  if (nextpressConfig.schema?.generateOnStart) {
    await generateSchema();
  }
}

// ============================================================================
// SCHEMA GENERATION
// ============================================================================

/**
 * Generate Prisma schema from collections
 */
export async function generateSchema(): Promise<void> {
  const collections = nextpressConfig.collections;
  const dbProvider: NextPressDatabaseProvider | undefined = nextpressConfig.db?.provider;

  console.log(`[NextPress] Generating Prisma schema for ${collections.length} collections...`);

  const schema = generatePrismaSchema(collections, {
    provider: normalizePrismaProvider(dbProvider),
    localization: true,
    versioning: true,
  });

  const outputPath = path.resolve(process.cwd(), nextpressConfig.schema?.outputPath ||
    'src/adapters/prisma-adapter/prisma/schema.prisma');

  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Avoid touching the file when schema content is unchanged, which prevents dev watch loops.
  if (fs.existsSync(outputPath)) {
    const currentSchema = fs.readFileSync(outputPath, 'utf8');
    if (currentSchema === schema) {
      console.log('[NextPress] Schema unchanged, skipping write');
      return;
    }
  }

  fs.writeFileSync(outputPath, schema, 'utf8');

  console.log(`[NextPress] ✅ Schema generated: ${outputPath}`);

  // Handle migration based on configured mode
  const schemaConfig = nextpressConfig.schema as { migrationMode?: string } | undefined;
  const migrationMode = schemaConfig?.migrationMode as NextPressMigrationMode | undefined;

  await runMigration(migrationMode);
}

// ============================================================================
// EXPORTS
// ============================================================================

// Export collections for use throughout the app
export { Collections } from '../core/collection';

// Export config
export { default as config } from '../nextpress.config';
