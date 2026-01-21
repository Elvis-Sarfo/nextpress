import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewNewsPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/news"
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">New News Article</h1>
          <p className="text-muted-foreground mt-1">Create a new news article</p>
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
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Article title"
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
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="article-slug"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Technology, Business, etc."
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Brief description..."
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
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Article content..."
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Create Article
            </button>
            <Link
              href="/admin/news"
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
