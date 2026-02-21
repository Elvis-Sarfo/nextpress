interface TestimonialItem {
  image?: string;
  name?: string;
  designation?: string;
  feedback?: string;
  star?: string | number;
}

interface TestimonialContent {
  heading?: string;
  subheading?: string;
  _elements?: TestimonialItem[];
}

function StarRating({ count }: { count: number }) {
  const filled = Math.min(5, Math.max(0, Math.round(count)));
  return (
    <div className="flex gap-0.5 text-yellow-400">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < filled ? '★' : '☆'}</span>
      ))}
    </div>
  );
}

export function TestimonialBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as TestimonialContent;
  const items = Array.isArray(c._elements) ? c._elements : [];

  return (
    <div className="testimonial-block py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {(c.heading || c.subheading) && (
          <div className="text-center mb-12 space-y-2">
            {c.heading && <h2 className="text-3xl font-bold">{c.heading}</h2>}
            {c.subheading && <p className="text-lg text-muted-foreground">{c.subheading}</p>}
          </div>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
                {item.star && <StarRating count={Number(item.star)} />}
                {item.feedback && (
                  <p className="text-muted-foreground italic leading-relaxed">
                    &ldquo;{item.feedback}&rdquo;
                  </p>
                )}
                <div className="flex items-center gap-3 pt-2 border-t">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name ?? ''}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  )}
                  <div>
                    {item.name && <p className="font-semibold text-sm">{item.name}</p>}
                    {item.designation && <p className="text-xs text-muted-foreground">{item.designation}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
