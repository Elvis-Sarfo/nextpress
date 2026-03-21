/**
 * Schema Generator Script
 * 
 * Run: npx tsx src/scripts/generate-schema.ts
 * 
 * This generates the Prisma schema from all registered collections
 * defined in nextpress.config.ts.
 */

import { generatePrismaSchema } from '../core/schema-engine';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import type { NextPressDatabaseProvider } from '../core/types/nextpress-config.types';

// Import config (which contains all collections)
import nextpressConfig from '../nextpress.config';

// Get collections from config
const collections = nextpressConfig.collections;
const dbProvider = nextpressConfig.db?.provider as NextPressDatabaseProvider | undefined;
const configuredProvider = dbProvider === 'postgres'
  ? 'postgresql'
  : (dbProvider ?? 'postgresql');

console.log(`📦 Generating schema for ${collections.length} collections:`);
collections.forEach(c => console.log(`   - ${c.slug}`));
console.log();

// Generate schema
const schema = generatePrismaSchema(collections, {
  provider: configuredProvider,
  localization: true,
  versioning: true,
});

// Output path
const outputPath = path.join(process.cwd(), 'src/adapters/prisma-adapter/prisma/schema.prisma');

// Write to file
fs.writeFileSync(outputPath, schema);

console.log(`✅ Schema generated successfully!`);
console.log(`📄 Output: ${outputPath}`);

// Handle migration based on configured mode
const schemaConfig = nextpressConfig.schema as { migrationMode?: string } | undefined;
const migrationMode = schemaConfig?.migrationMode as string | undefined;

// Determine migration behavior based on mode
if (migrationMode === 'manual' || !migrationMode) {
  console.log(`\n📋 Migration mode is 'manual' - skipping auto-migration`);
  console.log(`ℹ️  Run 'pnpm db:migrate' or 'pnpm db:push' manually when needed`);
  console.log(`\n--- Generated Schema Preview ---\n`);
  console.log(schema);
} else if (migrationMode === 'prompt') {
  console.log(`\n⚠️  Migration mode is 'prompt' - requires manual confirmation`);
  console.log(`ℹ️  Run 'pnpm db:migrate' to proceed`);
  console.log(`\n--- Generated Schema Preview ---\n`);
  console.log(schema);
} else {
  // 'auto' or 'deploy' mode
  const command = migrationMode === 'deploy' 
    ? 'npx prisma migrate deploy' 
    : 'npx prisma db push';
  const description = migrationMode === 'deploy' 
    ? 'Deploying migrations...' 
    : 'Pushing schema changes to database...';
  
  console.log(`\n🔄 ${description}`);
  
  exec(command, (error, stdout, stderr) => {
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    if (error) {
      console.error('❌ Migration failed:', error.message);
      process.exit(1);
    }
    
    console.log('✅ Migration completed successfully!');
    console.log(`\n--- Generated Schema Preview ---\n`);
    console.log(schema);
  });
}
