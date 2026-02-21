interface RoomItem {
  image?: string;
  name?: string;
  description?: string;
}

interface FeaturedRoomsContent {
  heading?: string;
  subheading?: string;
  description?: string;
  _elements?: RoomItem[];
}

export function FeaturedRoomsBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as FeaturedRoomsContent;
  const rooms = Array.isArray(c._elements) ? c._elements : [];

  return (
    <div className="featured-rooms-block py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {(c.heading || c.subheading || c.description) && (
          <div className="text-center mb-12 space-y-2">
            {c.heading && <h2 className="text-3xl font-bold">{c.heading}</h2>}
            {c.subheading && <p className="text-lg text-muted-foreground">{c.subheading}</p>}
            {c.description && <p className="text-muted-foreground">{c.description}</p>}
          </div>
        )}

        {rooms.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room, i) => (
              <div key={i} className="rounded-lg border bg-card overflow-hidden group hover:shadow-lg transition-shadow">
                {room.image && (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={room.image}
                      alt={room.name ?? ''}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5 space-y-2">
                  {room.name && <h3 className="font-semibold text-lg">{room.name}</h3>}
                  {room.description && <p className="text-muted-foreground text-sm">{room.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
