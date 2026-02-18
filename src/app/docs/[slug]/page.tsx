/**
 * Single doc page: render markdown from docs/[slug].md.
 */

import { notFound } from 'next/navigation';
import { getDocContent, getDocsSlugs } from '../docs-data';
import { DocContent } from '../doc-content';

export async function generateStaticParams() {
  const slugs = await getDocsSlugs();
  return slugs
    .filter((s) => s !== 'README')
    .map((slug) => ({ slug }));
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getDocContent(slug);
  if (!content) notFound();
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <DocContent source={content} />
    </article>
  );
}
