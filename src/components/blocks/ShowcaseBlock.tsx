'use client';

import { useState } from 'react';

interface ShowcaseItem {
  tab_name?: string;
  title?: string;
  description?: string;
  button_text?: string;
  button_link?: string;
  background_image?: string;
  mobile_background_image?: string;
}

interface ShowcaseContent {
  heading?: string;
  subheading?: string;
  _elements?: ShowcaseItem[];
}

export function ShowcaseBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as ShowcaseContent;
  const items = Array.isArray(c._elements) ? c._elements : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];

  return (
    <div className="showcase-block py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {(c.heading || c.subheading) && (
          <div className="text-center mb-10 space-y-2">
            {c.heading && <h2 className="text-3xl font-bold">{c.heading}</h2>}
            {c.subheading && <p className="text-lg text-muted-foreground">{c.subheading}</p>}
          </div>
        )}

        {items.length > 0 && (
          <>
            {/* Tab bar */}
            {items.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {items.map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      i === activeIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {item.tab_name ?? `Item ${i + 1}`}
                  </button>
                ))}
              </div>
            )}

            {/* Active panel */}
            {active && (
              <div
                className="relative rounded-xl overflow-hidden min-h-[300px] flex items-center"
                style={
                  active.background_image
                    ? { backgroundImage: `url(${active.background_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : undefined
                }
              >
                <div className="relative z-10 p-8 md:p-12 max-w-lg space-y-4 bg-black/40 rounded-xl text-white">
                  {active.title && <h3 className="text-2xl font-bold">{active.title}</h3>}
                  {active.description && <p className="leading-relaxed opacity-90">{active.description}</p>}
                  {active.button_text && (
                    <a
                      href={active.button_link ?? '#'}
                      className="inline-block px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90"
                    >
                      {active.button_text}
                    </a>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
