import { schemaEngine, contentStore } from '@/lib/cms';
import { FileText, Layers, Clock, CheckCircle } from 'lucide-react';

export default async function DashboardPage() {
  // Fetch stats
  const schemas = await schemaEngine.getAllSchemas();
  const recentContent = await contentStore.query({
    pageSize: 5,
    sort: { field: 'createdAt', direction: 'desc' },
  });

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
          value={recentContent.total}
          icon={<FileText className="w-6 h-6" />}
        />
        <StatCard
          title="Published"
          value={
            recentContent.items.filter(
              (i) => i.currentVersion?.status === 'PUBLISHED'
            ).length
          }
          icon={<CheckCircle className="w-6 h-6" />}
        />
        <StatCard
          title="Drafts"
          value={
            recentContent.items.filter(
              (i) => i.currentVersion?.status === 'DRAFT'
            ).length
          }
          icon={<Clock className="w-6 h-6" />}
        />
      </div>

      {/* Recent content */}
      <div className="bg-secondary/30 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Content</h2>
        {recentContent.items.length === 0 ? (
          <p className="text-muted-foreground">No content yet. Create your first content entry!</p>
        ) : (
          <ul className="space-y-3">
            {recentContent.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between p-3 bg-background rounded-lg"
              >
                <div>
                  <p className="font-medium">{item.id}</p>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    item.currentVersion?.status === 'PUBLISHED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {item.currentVersion?.status ?? 'No version'}
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
