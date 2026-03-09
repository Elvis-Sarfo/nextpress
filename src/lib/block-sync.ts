import nextpressConfig from '@/nextpress.config';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/adapters/prisma-adapter';
import type { BlockManifest } from '@/core/blocks/types';

type SyncSummary = {
  totalRegistered: number;
  created: number;
  updated: number;
  unchanged: number;
  missingInCode: number;
};

type BlockRow = {
  id: string;
  name: string;
  label: string;
  contentDefinition: unknown | null;
};

function stableJson(value: unknown): string {
  return JSON.stringify(value ?? null);
}

function hasSameDefinition(row: BlockRow, block: BlockManifest): boolean {
  return (
    row.label === block.label &&
    stableJson(row.contentDefinition) === stableJson({
      name: block.name,
      label: block.label,
      icon: block.icon,
      content: block.definition.content,
      elements: block.definition.elements,
    })
  );
}

function toStoredDefinition(block: BlockManifest) {
  return {
    name: block.name,
    label: block.label,
    icon: block.icon,
    content: block.definition.content,
    elements: block.definition.elements,
  } as unknown as Prisma.InputJsonValue;
}

export async function syncBlocksToDatabase(
  blocks: BlockManifest[] = nextpressConfig.blocks ?? [],
): Promise<SyncSummary> {
  const registeredByName = new Map(blocks.map((block) => [block.name, block]));
  const existing = await prisma.blocks.findMany({
    select: {
      id: true,
      name: true,
      label: true,
      contentDefinition: true,
    },
  });

  let created = 0;
  let updated = 0;
  let unchanged = 0;

  for (const block of blocks) {
    const current = existing.find((row) => row.name === block.name) as BlockRow | undefined;
    const nextDefinition = toStoredDefinition(block);

    if (!current) {
      await prisma.blocks.create({
        data: {
          name: block.name,
          label: block.label,
          contentDefinition: nextDefinition,
          content: {},
          status: 'published',
        },
      });
      created += 1;
      continue;
    }

    if (hasSameDefinition(current, block)) {
      unchanged += 1;
      continue;
    }

    await prisma.blocks.update({
      where: { id: current.id },
      data: {
        label: block.label,
        contentDefinition: nextDefinition,
      },
    });
    updated += 1;
  }

  const missingInCode = existing.filter((row) => !registeredByName.has(row.name)).length;

  return {
    totalRegistered: blocks.length,
    created,
    updated,
    unchanged,
    missingInCode,
  };
}
