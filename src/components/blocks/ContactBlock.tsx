interface ContactContent {
  heading?: string;
  description?: string;
  form_heading?: string;
  email_address?: string;
  contact_number?: string;
  address?: string;
  location_iframe_source?: string;
}

export function ContactBlock({ content }: { content: Record<string, unknown> }) {
  const c = content as ContactContent;

  return (
    <div className="contact-block py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {(c.heading || c.description) && (
          <div className="text-center mb-12 space-y-2">
            {c.heading && <h2 className="text-3xl font-bold">{c.heading}</h2>}
            {c.description && <p className="text-muted-foreground">{c.description}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact details */}
          <div className="space-y-5">
            {(c.email_address || c.contact_number || c.address) && (
              <dl className="space-y-4">
                {c.email_address && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</dt>
                    <dd>
                      <a href={`mailto:${c.email_address}`} className="hover:underline">
                        {c.email_address}
                      </a>
                    </dd>
                  </div>
                )}
                {c.contact_number && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Phone</dt>
                    <dd>
                      <a href={`tel:${c.contact_number}`} className="hover:underline">
                        {c.contact_number}
                      </a>
                    </dd>
                  </div>
                )}
                {c.address && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Address</dt>
                    <dd className="whitespace-pre-line">{c.address}</dd>
                  </div>
                )}
              </dl>
            )}

            {c.location_iframe_source && (
              <div className="rounded-lg overflow-hidden border aspect-video">
                <iframe
                  src={c.location_iframe_source}
                  className="w-full h-full"
                  loading="lazy"
                  title="Location map"
                />
              </div>
            )}
          </div>

          {/* Contact form placeholder */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            {c.form_heading && <h3 className="font-semibold text-lg">{c.form_heading}</h3>}
            <div className="space-y-3">
              <input type="text" placeholder="Your name" className="w-full rounded-md border px-3 py-2 text-sm" />
              <input type="email" placeholder="Your email" className="w-full rounded-md border px-3 py-2 text-sm" />
              <textarea placeholder="Your message" rows={4} className="w-full rounded-md border px-3 py-2 text-sm resize-none" />
              <button type="button" className="w-full rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
