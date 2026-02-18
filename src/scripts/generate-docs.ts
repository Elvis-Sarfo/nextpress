/**
 * Generate docs fragments from the codebase.
 *
 * Run: pnpm docs:generate
 *
 * Writes into docs/generated/ so the docs app and other tools can stay in sync
 * with config and collections. Also extracts JSDoc from selected source files
 * into docs/generated/from-code/. Re-run after changing config, collections, or comments.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const outDir = path.join(root, 'docs', 'generated');

// Dynamic import: resolve from project root so tsx can load config and its deps
const getConfig = async () => {
  const configPath = path.join(root, 'src', 'nextpress.config.ts');
  const mod = await import(/* @vite-ignore */ configPath);
  return mod.default;
};

async function main() {
  const config = await getConfig();
  const collections = config.collections ?? [];

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Collections reference (for docs page and AI)
  const collectionList = collections.map((c: { slug: string; labels?: { singular?: string; plural?: string }; fields?: unknown[] }) => ({
    slug: c.slug,
    singular: c.labels?.singular ?? c.slug,
    plural: c.labels?.plural ?? c.slug + 's',
    fieldCount: Array.isArray(c.fields) ? c.fields.length : 0,
  }));

  fs.writeFileSync(
    path.join(outDir, 'collections.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), collections: collectionList }, null, 2)
  );

  // Human-readable markdown fragment (can be included or linked from collections.md)
  const md = [
    '# Generated: Collections',
    '',
    'Auto-generated from `nextpress.config.ts`. Run `pnpm docs:generate` to update.',
    '',
    '| Slug | Singular | Plural | Fields |',
    '|------|----------|--------|--------|',
    ...collectionList.map((c) => `| ${c.slug} | ${c.singular} | ${c.plural} | ${c.fieldCount} |`),
  ].join('\n');

  fs.writeFileSync(path.join(outDir, 'collections.md'), md);

  // Config summary (non-sensitive)
  const schemaConfig = config.schema as Record<string, unknown> | undefined;
  const configSummary = {
    generatedAt: new Date().toISOString(),
    collectionsCount: collectionList.length,
    schema: schemaConfig
      ? {
          outputPath: schemaConfig.outputPath,
          migrationMode: schemaConfig.migrationMode,
          generateOnStart: schemaConfig.generateOnStart,
          configChangeDetectionStrategy: schemaConfig.configChangeDetectionStrategy,
          stateBackend: schemaConfig.stateBackend,
        }
      : undefined,
    localization: config.localization
      ? {
          defaultLocale: (config.localization as { defaultLocale?: string }).defaultLocale,
          localeCount: Array.isArray((config.localization as { locales?: unknown[] }).locales)
            ? (config.localization as { locales: unknown[] }).locales.length
            : 0,
        }
      : undefined,
  };

  fs.writeFileSync(
    path.join(outDir, 'config-summary.json'),
    JSON.stringify(configSummary, null, 2)
  );

  // Extract JSDoc/TSDoc from selected source files → docs/generated/from-code/
  const extractPath = path.join(__dirname, 'extract-jsdoc.ts');
  const { runExtractJsdoc } = await import(pathToFileURL(extractPath).href);
  runExtractJsdoc();

  console.log('Generated docs:');
  console.log('  docs/generated/collections.json');
  console.log('  docs/generated/collections.md');
  console.log('  docs/generated/config-summary.json');
  console.log('  docs/generated/from-code/*.md (from code comments)');
}

main().catch((e) => {
  console.error('docs:generate failed:', e);
  process.exit(1);
});
