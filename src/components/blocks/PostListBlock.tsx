import { getLocale } from '@/lib/locale-utils';

interface PostListContent {
  heading?: string;
  layout?: 'grid' | 'list';
}

interface PostItem {
  id: string;
  title: unknown;
  slug: unknown;
  excerpt: unknown;
  publishedAt?: string | null;
  featuredImage?: { url?: string; altText?: string } | null;
  category?: { name?: string; color?: string } | null;
}

export function PostListBlock({
  content,
  data,
}: {
  content: Record<string, unknown>;
  data?: unknown[];
}) {
  const c = content as PostListContent;
  const posts = (data ?? []) as PostItem[];
  const isList = c.layout === 'list';

  return (
    <div className="post-list-block py-12 px-6">
      {c.heading && (
        <h2 className="text-3xl font-bold mb-8 text-center">{c.heading}</h2>
      )}

      {posts.length === 0 ? (
        <p className="text-muted-foreground text-center">No posts found.</p>
      ) : isList ? (
        <div className="space-y-4 max-w-3xl mx-auto">
          {posts.map((post) => {
            const title = String(getLocale(post.title as Record<string, unknown>, 'en') ?? '');
            const excerpt = String(getLocale(post.excerpt as Record<string, unknown>, 'en') ?? '');
            return (
              <div key={post.id} className="flex gap-4 rounded-lg border bg-card p-4">
                {post.featuredImage?.url && (
                  <img
                    src={post.featuredImage.url}
                    alt={post.featuredImage.altText ?? title}
                    className="h-20 w-28 flex-shrink-0 rounded object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold leading-tight">{title}</h3>
                  {excerpt && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{excerpt}</p>
                  )}
                  {post.category?.name && (
                    <span className="mt-2 inline-block text-xs font-medium text-primary">
                      {post.category.name}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const title = String(getLocale(post.title as Record<string, unknown>, 'en') ?? '');
            const excerpt = String(getLocale(post.excerpt as Record<string, unknown>, 'en') ?? '');
            return (
              <div key={post.id} className="rounded-lg border bg-card overflow-hidden">
                {post.featuredImage?.url && (
                  <img
                    src={post.featuredImage.url}
                    alt={post.featuredImage.altText ?? title}
                    className="w-full aspect-video object-cover"
                  />
                )}
                <div className="p-4">
                  {post.category?.name && (
                    <span className="text-xs font-medium text-primary">{post.category.name}</span>
                  )}
                  <h3 className="font-semibold mt-1 leading-tight">{title}</h3>
                  {excerpt && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{excerpt}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
