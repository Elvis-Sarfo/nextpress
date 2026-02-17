import { execSync } from 'node:child_process';
import dotenv from 'dotenv';
import nextpressConfig from '../nextpress.config';
import type { NextPressMigrationMode } from '../core/types/nextpress-config.types';

// Load environment variables
dotenv.config();

// Get migration mode from config
const schemaConfig = nextpressConfig.schema;
const migrationMode = (schemaConfig?.migrationMode || 'manual') as NextPressMigrationMode;

console.log(`Running Prisma migration in '${migrationMode}' mode...\n`);

try {
  // Determine which command to run based on migration mode
  // Override with --deploy or --push flag if provided
  let command: string;
  
  if (process.argv.includes('--deploy')) {
    command = 'npx prisma migrate deploy';
  } else if (process.argv.includes('--push')) {
    command = 'npx prisma db push';
  } else {
    // Use config-based mode
    switch (migrationMode) {
      case 'deploy':
        command = 'npx prisma migrate deploy';
        break;
      case 'manual':
        console.log('📋 Migration mode is manual - no action taken');
        console.log('ℹ️  Use --deploy or --push flag to force migration');
        process.exit(0);
      case 'prompt':
        console.log('⚠️  Migration mode is prompt - manual confirmation required');
        console.log('ℹ️  Use --deploy or --push flag to force migration');
        process.exit(0);
      case 'auto':
      default:
        command = 'npx prisma db push';
        break;
    }
  }

  console.log(`Executing: ${command}`);

  execSync(command, {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: { ...process.env }
  });

  console.log('\n✅ Database synchronized successfully!');
} catch (error) {
  console.error('\n❌ Migration failed:', error);
  process.exit(1);
}
