import { getContentTypes, getContentEntries } from '@/lib/cms';
import { FileText, Layers, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  // Fetch stats
  const schemas = await getContentTypes();

  // Get recent content from all types
  let totalContent = 0;
  let publishedCount = 0;
  let draftCount = 0;
  const recentItems: Array<{ id: string; typeId: string; status: string; createdAt: Date }> = [];

  for (const schema of schemas) {
    const result = await getContentEntries(schema.id, { limit: 10 });
    totalContent += result.total;

    for (const { entry, version } of result.entries) {
      if (version.status === 'PUBLISHED') publishedCount++;
      if (version.status === 'DRAFT') draftCount++;
      recentItems.push({
        id: entry.id,
        typeId: entry.typeId,
        status: version.status,
        createdAt: entry.createdAt,
      });
    }
  }

  // Sort by createdAt and take top 5
  const sortedRecent = recentItems
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Content Types"
          value={schemas.length}
          icon={<Layers className="w-6 h-6" />}
        />
        <StatCard
          title="Total Content"
          value={totalContent}
          icon={<FileText className="w-6 h-6" />}
        />
        <StatCard
          title="Published"
          value={publishedCount}
          icon={<CheckCircle className="w-6 h-6" />}
        />
        <StatCard
          title="Drafts"
          value={draftCount}
          icon={<Clock className="w-6 h-6" />}
        />
      </div>

      {/* Recent content */}
      <div className="bg-secondary/30 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Content</h2>
        {sortedRecent.length === 0 ? (
          <p className="text-muted-foreground">No content yet. Create your first content entry!</p>
        ) : (
          <ul className="space-y-3">
            {sortedRecent.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between p-3 bg-background rounded-lg"
              >
                <div>
                  <Link href={`/content/${item.id}`} className="font-medium hover:underline">
                    {item.id.slice(0, 8)}...
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(item.createdAt).toLocaleDateString()}
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
            ))}
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
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-secondary/30 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
    </div>
  );
}
