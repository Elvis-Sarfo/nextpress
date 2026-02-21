interface AboutContent {
  heading?: string;
  subheading?: string;
  description?: string;
  image?: string;
}

export function AboutBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as AboutContent;

  return (
    <div className="about-block py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {c.image ? (
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="md:w-1/2">
              <img src={c.image} alt={c.heading ?? ''} className="rounded-lg w-full object-cover" />
            </div>
            <div className="md:w-1/2 space-y-4">
              {c.heading && <h2 className="text-3xl font-bold">{c.heading}</h2>}
              {c.subheading && <p className="text-lg text-muted-foreground">{c.subheading}</p>}
              {c.description && <p className="leading-relaxed">{c.description}</p>}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center space-y-4">
            {c.heading && <h2 className="text-3xl font-bold">{c.heading}</h2>}
            {c.subheading && <p className="text-lg text-muted-foreground">{c.subheading}</p>}
            {c.description && <p className="leading-relaxed">{c.description}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
