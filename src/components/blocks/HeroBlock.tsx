interface HeroContent {
  heading?: string;
  subheading?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  alignment?: 'left' | 'center' | 'right';
}

export function HeroBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as HeroContent;

  return (
    <div
      className="hero-block relative w-full py-20 px-6"
      style={c.backgroundImage ? { backgroundImage: `url(${c.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      <div className={`max-w-3xl mx-auto text-${c.alignment ?? 'center'}`}>
        {c.heading    && <h1 className="text-4xl font-bold mb-4">{c.heading}</h1>}
        {c.subheading && <p  className="text-xl text-muted-foreground mb-6">{c.subheading}</p>}
        {c.ctaText    && (
          <a
            href={c.ctaLink ?? '#'}
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90"
          >
            {c.ctaText}
          </a>
        )}
      </div>
    </div>
  );
}
