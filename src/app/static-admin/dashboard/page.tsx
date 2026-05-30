import { getPages, getPosts, getNews, getPendingCommentCount } from '@/lib/cms';
import { FileText, Newspaper, BookOpen, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  // Fetch stats for each content type
  const [pagesResult, postsResult, newsResult, pendingComments] = await Promise.all([
    getPages({ limit: 10 }),
    getPosts({ limit: 10 }),
    getNews({ limit: 10 }),
    getPendingCommentCount(),
  ]);

  // Count by status
  const allContent = [
    ...pagesResult.pages.map((p) => ({ ...p, type: 'page' as const })),
    ...postsResult.posts.map((p) => ({ ...p, type: 'post' as const })),
    ...newsResult.news.map((n) => ({ ...n, type: 'news' as const })),
  ];

  const publishedCount = allContent.filter((c) => c.status === 'PUBLISHED').length;
  const draftCount = allContent.filter((c) => c.status === 'DRAFT').length;

  // Sort by createdAt and take top 5
  const recentItems = allContent
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Pages"
          value={pagesResult.total}
          icon={<FileText className="w-6 h-6" />}
          href="/admin/pages"
        />
        <StatCard
          title="Posts"
          value={postsResult.total}
          icon={<BookOpen className="w-6 h-6" />}
          href="/admin/posts"
        />
        <StatCard
          title="News"
          value={newsResult.total}
          icon={<Newspaper className="w-6 h-6" />}
          href="/admin/news"
        />
        <StatCard
          title="Pending Comments"
          value={pendingComments}
          icon={<MessageSquare className="w-6 h-6" />}
          href="/admin/comments"
        />
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-secondary/30 rounded-lg p-6 flex items-center gap-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-2xl font-bold">{publishedCount}</p>
            <p className="text-sm text-muted-foreground">Published</p>
          </div>
        </div>
        <div className="bg-secondary/30 rounded-lg p-6 flex items-center gap-4">
          <Clock className="w-8 h-8 text-yellow-500" />
          <div>
            <p className="text-2xl font-bold">{draftCount}</p>
            <p className="text-sm text-muted-foreground">Drafts</p>
          </div>
        </div>
      </div>

      {/* Recent content */}
      <div className="bg-secondary/30 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Content</h2>
        {recentItems.length === 0 ? (
          <p className="text-muted-foreground">No content yet. Create your first content entry!</p>
        ) : (
          <ul className="space-y-3">
            {recentItems.map((item) => {
              const title = item.locales[0]?.title ?? 'Untitled';
              const href =
                item.type === 'page'
                  ? `/admin/pages/${item.id}`
                  : item.type === 'post'
                    ? `/admin/posts/${item.id}`
                    : `/admin/news/${item.id}`;

              return (
                <li
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-background rounded-lg"
                >
                  <div>
                    <Link href={href} className="font-medium hover:underline">
                      {title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)} •{' '}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  href,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="bg-secondary/30 rounded-lg p-6 hover:bg-secondary/50 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          <div className="text-muted-foreground">{icon}</div>
        </div>
      </div>
    </Link>
  );
}
