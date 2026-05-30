import Link from 'next/link';
import { getPages, getLocalizedField } from '@/lib/cms';
import { Plus, FileText } from 'lucide-react';
import { getStatusColor, formatDate } from '@/lib/utils';

export default async function PagesListPage() {
  const { pages, total } = await getPages({ limit: 100 });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="text-muted-foreground mt-1">{total} pages total</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add New Page
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-12 bg-secondary/30 rounded-lg">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No pages yet.</p>
          <Link
            href="/admin/pages/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Create your first page
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
                <th className="text-left px-6 py-3 text-sm font-semibold">Created</th>
                <th className="text-right px-6 py-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pages.map((page) => {
                const locale = getLocalizedField(page, 'en');
                const title = locale?.title ?? 'Untitled';
                const slug = locale?.slug ?? '';

                return (
                  <tr key={page.id} className="hover:bg-secondary/30">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/pages/${page.id}`}
                        className="font-medium hover:underline"
                      >
                        {title}
                      </Link>
                      {page.parentId && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (child page)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-sm">
                      /{slug}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(page.status)}`}
                      >
                        {page.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDate(page.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/pages/${page.id}`}
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
