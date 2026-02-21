'use client';

import { useState } from 'react';

interface FAQItem {
  question?: string;
  answer?: string;
}

interface FAQContent {
  heading?: string;
  subheading?: string;
  description?: string;
  _elements?: FAQItem[];
}

export function FAQBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as FAQContent;
  const items = Array.isArray(c._elements) ? c._elements : [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="faq-block py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {(c.heading || c.subheading || c.description) && (
          <div className="text-center mb-10 space-y-2">
            {c.heading && <h2 className="text-3xl font-bold">{c.heading}</h2>}
            {c.subheading && <p className="text-lg text-muted-foreground">{c.subheading}</p>}
            {c.description && <p className="text-muted-foreground">{c.description}</p>}
          </div>
        )}

        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="rounded-lg border bg-card overflow-hidden">
              <button
                type="button"
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left font-medium hover:bg-muted/40 transition-colors"
              >
                <span>{item.question}</span>
                <span className="text-muted-foreground shrink-0 ml-4">
                  {openIndex === i ? '−' : '+'}
                </span>
              </button>
              {openIndex === i && item.answer && (
                <div className="px-5 pb-4 text-muted-foreground leading-relaxed border-t">
                  <div className="pt-4">{item.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
