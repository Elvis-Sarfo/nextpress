import Link from 'next/link';
import { getLinkCollections, getLinksByCollection } from '@/lib/cms';
import { Plus, Link2, ExternalLink } from 'lucide-react';

function readLocalized(value: unknown): string {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';

  const localized = value as Record<string, unknown>;
  const english = localized.en;
  if (typeof english === 'string') return english;

  const firstValue = Object.values(localized).find((entry) => typeof entry === 'string');
  return typeof firstValue === 'string' ? firstValue : '';
}

export default async function LinksListPage() {
  // Get all collections
  const collections = await getLinkCollections();

  // Get links for each collection
  const collectionsWithLinks = await Promise.all(
    collections.map(async (collection) => {
      const links = await getLinksByCollection(collection.id);
      return { ...collection, links };
    })
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Link Collections</h1>
          <p className="text-muted-foreground mt-1">
            Manage link collections (social links, partner links, etc.)
          </p>
        </div>
        <Link
          href="/admin/links/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add New Collection
        </Link>
      </div>

      {collectionsWithLinks.length === 0 ? (
        <div className="text-center py-12 bg-secondary/30 rounded-lg">
          <Link2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No link collections yet.</p>
          <Link
            href="/admin/links/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Create your first collection
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {collectionsWithLinks.map((collection) => (
            <div
              key={collection.id}
              className="bg-secondary/30 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{collection.displayName}</h2>
                  <p className="text-sm text-muted-foreground">
                    Slug: {collection.name} • {collection.links.length} links
                  </p>
                  {collection.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {collection.description}
                    </p>
                  )}
                </div>
                <Link
                  href={`/admin/links/${collection.id}`}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Edit Collection
                </Link>
              </div>

              {collection.links.length > 0 && (
                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium mb-2">Links:</p>
                  <ul className="space-y-2">
                    {(collection.links as Array<{ id: string; order: number; title: unknown; url: string }>)
                      .sort((a, b) => a.order - b.order)
                      .map((link) => {
                        const title = readLocalized(link.title);

                        return (
                          <li
                            key={link.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            <span>{title}</span>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline font-mono text-xs"
                            >
                              {link.url}
                            </a>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
