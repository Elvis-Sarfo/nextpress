/**
 * fix-prisma-symlink.mjs
 *
 * Creates a `.prisma` symlink inside the `@prisma/client` package directory in
 * the pnpm virtual store.  Without this, the VS Code TypeScript language server
 * cannot follow pnpm's two-level symlink chain and fails to resolve the
 * generated Prisma types, producing false "Property does not exist" IDE errors.
 *
 * Safe to run multiple times – skips if the symlink already exists.
 * Run via: node scripts/fix-prisma-symlink.mjs
 */

import { createRequire } from 'node:module';
import { existsSync, symlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);

// Resolve the REAL on-disk path of @prisma/client (following pnpm symlink).
const clientPkg = dirname(require.resolve('@prisma/client/package.json'));
const dotPrismaLink = join(clientPkg, '.prisma');

if (existsSync(dotPrismaLink)) {
  console.log('✓ .prisma symlink already exists — nothing to do.');
} else {
  // The generated .prisma/client lives two directories above clientPkg:
  //   node_modules/.pnpm/.../.../node_modules/@prisma/client  ← clientPkg
  //   node_modules/.pnpm/.../.../node_modules/.prisma          ← target
  symlinkSync('../../.prisma', dotPrismaLink);
  console.log('✓ Created .prisma symlink inside @prisma/client for IDE type resolution.');
}
