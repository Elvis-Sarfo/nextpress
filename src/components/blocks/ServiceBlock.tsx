interface ServiceItem {
  image?: string;
  name?: string;
  description?: string;
}

interface ServiceContent {
  heading?: string;
  subheading?: string;
  description?: string;
  _elements?: ServiceItem[];
}

export function ServiceBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as ServiceContent;
  const items = Array.isArray(c._elements) ? c._elements : [];

  return (
    <div className="service-block py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {(c.heading || c.subheading || c.description) && (
          <div className="text-center mb-12 space-y-2">
            {c.heading && <h2 className="text-3xl font-bold">{c.heading}</h2>}
            {c.subheading && <p className="text-lg text-muted-foreground">{c.subheading}</p>}
            {c.description && <p className="text-muted-foreground">{c.description}</p>}
          </div>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <div key={i} className="rounded-lg border bg-card overflow-hidden hover:shadow-md transition-shadow">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name ?? ''}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5 space-y-2">
                  {item.name && <h3 className="font-semibold text-lg">{item.name}</h3>}
                  {item.description && <p className="text-muted-foreground text-sm">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
