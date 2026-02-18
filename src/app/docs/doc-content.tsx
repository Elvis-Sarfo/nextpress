'use client';

/**
 * Renders markdown source with react-markdown and GFM.
 */

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function DocContent({ source }: { source: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children, ...props }) => {
          let to = href ?? '';
          if (to.endsWith('.md')) {
            const base = to.replace(/^\.\//, '').replace(/\.md$/, '');
            to = base === 'README' ? '/docs' : `/docs/${base}`;
          }
          return (
            <a
              href={to}
              className="text-primary underline underline-offset-2 hover:no-underline"
              {...props}
            >
              {children}
            </a>
          );
        },
        code: ({ className, children, ...props }) => {
          const isBlock = className?.includes('language-');
          if (isBlock) {
            return (
              <code
                className="block rounded-md bg-muted p-4 text-sm overflow-x-auto"
                {...props}
              >
                {children}
              </code>
            );
          }
          return (
            <code
              className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono"
              {...props}
            >
              {children}
            </code>
          );
        },
        pre: ({ children }) => <>{children}</>,
      }}
    >
      {source}
    </ReactMarkdown>
  );
}
