/**
 * Docs index: show README (docs overview).
 */

import { redirect } from 'next/navigation';
import { getDocContent } from './docs-data';
import { DocContent } from './doc-content';

export default async function DocsIndexPage() {
  const content = await getDocContent('README');
  if (!content) {
    const alt = await getDocContent('overview');
    if (!alt) redirect('/');
    return (
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <DocContent source={alt} />
      </article>
    );
  }
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <DocContent source={content} />
    </article>
  );
}
