interface GalleryImage {
  image?: string;
  caption?: string;
}

interface GalleryContent {
  _elements?: GalleryImage[];
}

export function GalleryBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as GalleryContent;
  const items = Array.isArray(c._elements) ? c._elements : [];

  if (items.length === 0) return null;

  return (
    <div className="gallery-block py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <figure key={i} className="group overflow-hidden rounded-lg bg-muted">
            {item.image && (
              <img
                src={item.image}
                alt={item.caption ?? ''}
                className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
            {item.caption && (
              <figcaption className="px-3 py-2 text-xs text-muted-foreground truncate">
                {item.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}
