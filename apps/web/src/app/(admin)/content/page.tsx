import Link from 'next/link';
import { getContentTypes, getContentEntries } from '@/lib/cms';
import { Plus } from 'lucide-react';
import { getStatusColor, formatDate } from '@/lib/utils';
import type { ContentTypeId } from '@cms/kernel';

export default async function ContentListPage() {
  const schemas = await getContentTypes();
  const schemaMap = new Map(schemas.map((s) => [s.id as ContentTypeId, s]));

  // Gather content from all types
  const allContent: Array<{
    id: string;
    typeId: ContentTypeId;
    status: string;
    createdAt: Date;
  }> = [];

  for (const schema of schemas) {
    const result = await getContentEntries(schema.id, { limit: 50 });
    for (const { entry, version } of result.entries) {
      allContent.push({
        id: entry.id,
        typeId: entry.typeId,
        status: version.status,
        createdAt: entry.createdAt,
      });
    }
  }

  // Sort by createdAt desc
  const sortedContent = allContent.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

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

      {sortedContent.length === 0 ? (
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
              {sortedContent.map((item) => {
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
                          item.status
                        )}`}
                      >
                        {item.status}
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
    </div>
  );
}
