import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { pageRepository, getLocalizedField } from '@/lib/cms';
import { PageId } from '@cms/kernel';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPagePage({ params }: Props) {
  const { id } = await params;
  const page = await pageRepository.findById(PageId(id));

  if (!page) {
    notFound();
  }

  const locale = getLocalizedField(page, 'en');

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/pages"
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Page</h1>
          <p className="text-muted-foreground mt-1">{locale?.title ?? 'Untitled'}</p>
        </div>
      </div>

      <div className="bg-secondary/30 rounded-lg p-6">
        <form className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={locale?.title ?? ''}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Page title"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-2">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              defaultValue={locale?.slug ?? ''}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="page-slug"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={10}
              defaultValue={locale?.content ?? ''}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Page content..."
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={page.status}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Save Changes
            </button>
            <Link
              href="/admin/pages"
              className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
