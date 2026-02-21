interface SubscribeContent {
  heading?: string;
  button_title?: string;
}

export function SubscribeBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as SubscribeContent;

  return (
    <div className="subscribe-block py-16 px-6 bg-muted/40">
      <div className="max-w-xl mx-auto text-center space-y-6">
        {c.heading && <h2 className="text-3xl font-bold">{c.heading}</h2>}
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-md border bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="button"
            className="shrink-0 rounded-md bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:opacity-90"
          >
            {c.button_title ?? 'Subscribe'}
          </button>
        </div>
      </div>
    </div>
  );
}
