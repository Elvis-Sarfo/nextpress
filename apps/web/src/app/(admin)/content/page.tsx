import Link from 'next/link';
import { contentStore, schemaEngine } from '@/lib/cms';
import { Plus } from 'lucide-react';
import { getStatusColor, formatDate } from '@/lib/utils';

export default async function ContentListPage() {
  const content = await contentStore.query({
    pageSize: 50,
    sort: { field: 'createdAt', direction: 'desc' },
  });

  const schemas = await schemaEngine.getAllSchemas();
  const schemaMap = new Map(schemas.map((s) => [s.id, s]));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Content</h1>
        <Link
          href="/content/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Content
        </Link>
      </div>

      {content.items.length === 0 ? (
        <div className="text-center py-12 bg-secondary/30 rounded-lg">
          <p className="text-muted-foreground mb-4">No content entries yet.</p>
          <Link
            href="/content/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Create your first content
          </Link>
        </div>
      ) : (
        <div className="bg-secondary/30 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold">
                  ID
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold">
                  Type
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold">
                  Created
                </th>
                <th className="text-right px-6 py-3 text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {content.items.map((item) => {
                const schema = schemaMap.get(item.typeId);
                return (
                  <tr key={item.id} className="hover:bg-secondary/30">
                    <td className="px-6 py-4">
                      <Link
                        href={`/content/${item.id}`}
                        className="font-medium hover:underline"
                      >
                        {item.id.slice(0, 8)}...
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {schema?.name ?? 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          item.currentVersion?.status ?? 'DRAFT'
                        )}`}
                      >
                        {item.currentVersion?.status ?? 'No version'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/content/${item.id}`}
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

      {content.totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: content.totalPages }, (_, i) => (
            <Link
              key={i}
              href={`/content?page=${i + 1}`}
              className={`px-3 py-1 rounded ${
                i + 1 === content.page
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
