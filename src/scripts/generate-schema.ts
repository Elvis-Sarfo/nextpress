/**
 * Schema Generator Script
 * 
 * Run: npx tsx src/scripts/generate-schema.ts
 * 
 * This generates the Prisma schema from all registered collections.
 */

import { generatePrismaSchema } from '../core/schema-engine';
import * as fs from 'fs';
import * as path from 'path';

// Import all collections
import { Users } from '../collections/Users';

// Register collections and generate schema
const collections = [Users];

// Generate schema
const schema = generatePrismaSchema(collections, {
  provider: 'postgresql',
  localization: true,
  versioning: true,
});

// Output path
const outputPath = path.join(process.cwd(), 'src/adapters/prisma-adapter/prisma/generated-schema.prisma');

// Write to file
fs.writeFileSync(outputPath, schema);

console.log(`✅ Schema generated successfully!`);
console.log(`📄 Output: ${outputPath}`);
console.log(`\n--- Generated Schema Preview ---\n`);
console.log(schema);
