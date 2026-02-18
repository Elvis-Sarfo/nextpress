/**
 * Server-only helpers for docs: list slugs and read markdown.
 */

import fs from 'node:fs';
import path from 'node:path';

const DOCS_DIR = path.join(process.cwd(), 'docs');
const GENERATED_DIR = path.join(DOCS_DIR, 'generated');

const ALLOWED_SLUG = /^[a-zA-Z0-9-]+$/;

export async function getDocsSlugs(): Promise<string[]> {
  if (!fs.existsSync(DOCS_DIR)) return [];
  const names = fs.readdirSync(DOCS_DIR);
  const slugs: string[] = [];
  for (const name of names) {
    if (name.endsWith('.md') && !name.startsWith('.')) {
      const base = name.slice(0, -3);
      if (base === 'README') slugs.push('README');
      else slugs.push(base);
    }
  }
  return slugs.sort((a, b) => {
    const order = ['README', 'overview', 'getting-started', 'configuration', 'collections', 'schema-engine', 'database', 'admin-and-routes', 'docs-from-code', 'updating-docs'];
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });
}

export async function getDocContent(slug: string): Promise<string | null> {
  if (!ALLOWED_SLUG.test(slug)) return null;
  const base = slug === 'README' ? 'README' : slug;
  const filePath = path.join(DOCS_DIR, `${base}.md`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf-8');
}

export async function getGeneratedCollectionsJson(): Promise<string | null> {
  const filePath = path.join(GENERATED_DIR, 'collections.json');
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf-8');
}
