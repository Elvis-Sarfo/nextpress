import Link from 'next/link';
import { getPosts, getLocalizedField } from '@/lib/cms';
import { Plus, BookOpen } from 'lucide-react';
import { getStatusColor, formatDate } from '@/lib/utils';

export default async function PostsListPage() {
  const { posts, total } = await getPosts({ limit: 100 });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground mt-1">{total} posts total</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-secondary/30 rounded-lg">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No posts yet.</p>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="bg-secondary/30 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold">Title</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Slug</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Status</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Published</th>
                <th className="text-right px-6 py-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((post) => {
                const locale = getLocalizedField(post, 'en');
                const title = locale?.title ?? 'Untitled';
                const slug = locale?.slug ?? '';

                return (
                  <tr key={post.id} className="hover:bg-secondary/30">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="font-medium hover:underline"
                      >
                        {title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-sm">
                      /{slug}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(post.status)}`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {post.publishedAt ? formatDate(post.publishedAt) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
