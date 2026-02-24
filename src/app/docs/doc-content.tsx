'use client';

/**
 * Renders markdown source with react-markdown and GFM.
 * All elements are explicitly styled with Tailwind so no typography plugin is needed.
 */

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ComponentPropsWithoutRef } from 'react';

export function DocContent({ source }: { source: string }) {
  return (
    <div className="min-w-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // ── Headings ───────────────────────────────────────────────────────
          h1: ({ children }) => (
            <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight text-foreground first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-8 mb-3 text-2xl font-semibold tracking-tight text-foreground border-b border-border pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 mb-2 text-xl font-semibold text-foreground">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-4 mb-1 text-base font-semibold text-foreground">
              {children}
            </h4>
          ),

          // ── Paragraph ──────────────────────────────────────────────────────
          p: ({ children }) => (
            <p className="mb-4 leading-7 text-foreground/90">{children}</p>
          ),

          // ── Links ──────────────────────────────────────────────────────────
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

          // ── Lists ──────────────────────────────────────────────────────────
          ul: ({ children }) => (
            <ul className="mb-4 ml-6 list-disc space-y-1 text-foreground/90 [&>li]:leading-7">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-6 list-decimal space-y-1 text-foreground/90 [&>li]:leading-7">{children}</ol>
          ),
          // ── Code ───────────────────────────────────────────────────────────
          pre: ({ children }) => (
            <pre className="mb-4 overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm leading-6">
              {children}
            </pre>
          ),
          code: ({ className, children, ...props }: ComponentPropsWithoutRef<'code'>) => {
            const isBlock = Boolean(className?.includes('language-'));
            if (isBlock) {
              return (
                <code className="font-mono text-foreground" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code
                className="rounded bg-muted px-1.5 py-0.5 text-[0.85em] font-mono text-foreground"
                {...props}
              >
                {children}
              </code>
            );
          },

          // ── Blockquote ─────────────────────────────────────────────────────
          blockquote: ({ children }) => (
            <blockquote className="mb-4 border-l-4 border-primary pl-4 text-muted-foreground italic">
              {children}
            </blockquote>
          ),

          // ── Tables ─────────────────────────────────────────────────────────
          table: ({ children }) => (
            <div className="mb-6 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted text-foreground font-medium">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border">{children}</tbody>
          ),
          tr: ({ children }) => <tr className="hover:bg-muted/40 transition-colors">{children}</tr>,
          th: ({ children }) => (
            <th className="px-4 py-2.5 text-left font-medium text-foreground">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 text-foreground/80 align-top">{children}</td>
          ),

          // ── Horizontal rule ────────────────────────────────────────────────
          hr: () => <hr className="my-8 border-border" />,

          // ── Inline text ────────────────────────────────────────────────────
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
