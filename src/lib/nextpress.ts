/**
 * NextPress Core Initialization
 * 
 * This module initializes all NextPress components from the central configuration.
 */

import nextpressConfig from '../nextpress.config';
import { Collections } from '../core/collection';
import { generatePrismaSchema } from '../core/schema-engine';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// ============================================================================
// STATE TRACKING
// ============================================================================

// Track initialization state
let initialized = false;

// Track config hash for change detection
let lastConfigHash = '';

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

// ============================================================================
// INITIALIZATION STRATEGIES
// ============================================================================

/**
 * Check if initialization should run based on the configured configChangeDetectionStrategy
 */
function shouldInitialize(): boolean {
  const configChangeDetectionStrategy = nextpressConfig.schema?.configChangeDetectionStrategy || 'once';
  
  switch (configChangeDetectionStrategy) {
    case 'always':
      // Always run - useful for debugging
      return true;
      
    case 'hash':
      // Run when config hash changes
      const currentHash = generateConfigHash();
      if (currentHash === lastConfigHash) {
        console.log('[NextPress] Collections unchanged, skipping init');
        return false;
      }
      lastConfigHash = currentHash;
      return true;
      
    case 'once':
    default:
      // Run once per server start (default)
      if (initialized) {
        console.log('[NextPress] Already initialized, skipping');
        return false;
      }
      initialized = true;
      return true;
  }
}

/**
 * Initialize NextPress with the central configuration
 * Uses the configChangeDetectionStrategy defined in nextpress.config.ts
 */
export function initializeNextPress(): void {
  // Check if we should initialize based on configChangeDetectionStrategy
  if (!shouldInitialize()) {
    return;
  }
  
  // Initialize collections from config
  Collections.initFromConfig(nextpressConfig);
  
  console.log(`[NextPress] Initialized ${Collections.count()} collections:`);
  for (const slug of Collections.getSlugs()) {
    console.log(`  - ${slug}`);
  }
  
  // Generate Prisma schema on startup if enabled
  if (nextpressConfig.schema?.generateOnStart) {
    generateSchema();
  }
}

// ============================================================================
// SCHEMA GENERATION
// ============================================================================

/**
 * Generate Prisma schema from collections
 */
export function generateSchema(): void {
  const collections = nextpressConfig.collections;
  
  console.log(`[NextPress] Generating Prisma schema for ${collections.length} collections...`);
  
  const schema = generatePrismaSchema(collections, {
    provider: (nextpressConfig.db?.provider as 'postgresql' | 'mysql' | 'sqlite') || 'postgresql',
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
  
  fs.writeFileSync(outputPath, schema);
  
  console.log(`[NextPress] ✅ Schema generated: ${outputPath}`);
}

// ============================================================================
// EXPORTS
// ============================================================================

// Export collections for use throughout the app
export { Collections } from '../core/collection';

// Export config
export { default as config } from '../nextpress.config';
