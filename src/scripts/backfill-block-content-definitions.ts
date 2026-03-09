/**
 * Backfill `blocks.contentDefinition` from static registry by block `name`.
 *
 * - Idempotent: only updates rows where contentDefinition is null.
 * - Safe by default: dry-run unless `--write` is provided.
 *
 * Usage:
 *   npx tsx src/scripts/backfill-block-content-definitions.ts
 *   npx tsx src/scripts/backfill-block-content-definitions.ts --write
 */

import { prisma, disconnect } from '../adapters/prisma-adapter';
import { getBlockDefinition } from '../core/blocks/registry';

type BlockRow = {
  id: string;
  name: string;
  contentDefinition?: unknown | null;
};

function hasDefinition(value: unknown): boolean {
  return value !== null && value !== undefined;
}

async function main() {
  const shouldWrite = process.argv.includes('--write');

  const blocks = await (prisma as unknown as {
    blocks: {
      findMany: (args: unknown) => Promise<BlockRow[]>;
      update: (args: unknown) => Promise<unknown>;
    };
  }).blocks.findMany({
    select: { id: true, name: true, contentDefinition: true },
  });

  const candidates = blocks.filter((b) => !hasDefinition(b.contentDefinition));

  let updated = 0;
  let skippedNoStaticDefinition = 0;

  for (const block of candidates) {
    const def = getBlockDefinition(block.name);
    if (!def) {
      skippedNoStaticDefinition += 1;
      continue;
    }

    if (shouldWrite) {
      await (prisma as unknown as {
        blocks: { update: (args: unknown) => Promise<unknown> };
      }).blocks.update({
        where: { id: block.id },
        data: { contentDefinition: def },
      });
    }

    updated += 1;
  }

  console.log(`Backfill mode: ${shouldWrite ? 'write' : 'dry-run'}`);
  console.log(`Blocks total: ${blocks.length}`);
  console.log(`Candidates (null contentDefinition): ${candidates.length}`);
  console.log(`${shouldWrite ? 'Updated' : 'Would update'}: ${updated}`);
  console.log(`Skipped (no static definition for name): ${skippedNoStaticDefinition}`);
}

main()
  .catch((error) => {
    console.error('Backfill failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnect();
  });
