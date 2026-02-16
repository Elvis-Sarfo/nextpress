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

// Import config (which contains all collections)
import nextpressConfig from '../nextpress.config';

// Get collections from config
const collections = nextpressConfig.collections;

console.log(`📦 Generating schema for ${collections.length} collections:`);
collections.forEach(c => console.log(`   - ${c.slug}`));
console.log();

// Generate schema
const schema = generatePrismaSchema(collections, {
  provider: 'postgresql',
  localization: true,
  versioning: true,
});

// Output path
const outputPath = path.join(process.cwd(), 'src/adapters/prisma-adapter/prisma/schema.prisma');

// Write to file
fs.writeFileSync(outputPath, schema);

console.log(`✅ Schema generated successfully!`);
console.log(`📄 Output: ${outputPath}`);
console.log(`\n--- Generated Schema Preview ---\n`);
console.log(schema);
