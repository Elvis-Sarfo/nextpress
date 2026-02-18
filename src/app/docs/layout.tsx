/**
 * Docs layout: sidebar with doc list and generated references.
 */

import Link from 'next/link';
import { FileText, BookOpen } from 'lucide-react';
import { getDocsSlugs } from './docs-data';

const DOC_LABELS: Record<string, string> = {
  'README': 'Overview',
  'overview': 'Overview',
  'getting-started': 'Getting started',
  'configuration': 'Configuration',
  'collections': 'Collections',
  'schema-engine': 'Schema engine',
  'database': 'Database',
  'admin-and-routes': 'Admin & routes',
  'docs-from-code': 'Docs from code comments',
  'updating-docs': 'Updating docs',
};

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const slugs = await getDocsSlugs();
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 border-r border-border bg-muted/30 p-4">
        <Link
          href="/docs"
          className="mb-4 flex items-center gap-2 font-semibold text-foreground"
        >
          <BookOpen className="h-5 w-5" />
          Docs
        </Link>
        <nav className="space-y-1">
          {slugs.map((slug) => (
            <Link
              key={slug}
              href={slug === 'README' ? '/docs' : `/docs/${slug}`}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <FileText className="h-4 w-4 shrink-0" />
              {DOC_LABELS[slug] ?? slug}
            </Link>
          ))}
        </nav>
        <div className="mt-6 border-t border-border pt-4">
          <p className="px-3 text-xs text-muted-foreground">
            Run <code className="rounded bg-muted px-1">pnpm docs:generate</code> to
            refresh generated content.
          </p>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-8">{children}</main>
    </div>
  );
}
