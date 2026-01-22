
import Link from 'next/link';
import { FileText, BookOpen, Newspaper, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';


export default function NewContentPage() {
  const contentTypes = [
    {
      name: 'Page',
      description: 'Create a hierarchical page for your site',
      href: '/admin/pages/new',
      icon: FileText,
    },
    {
      name: 'Post',
      description: 'Create a blog post for your site',
      href: '/admin/posts/new',
      icon: BookOpen,
    },
    {
      name: 'News',
      description: 'Create a news article for your site',
      href: '/admin/news/new',
      icon: Newspaper,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Admin header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-gray-800">NextPress Admin</span>
          <span className="text-xs bg-gray-200 text-gray-600 rounded px-2 py-0.5 ml-2">Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" asChild>
            <Link href="/admin">Dashboard Home</Link>
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar (WordPress style) */}
        <aside className="w-56 bg-white border-r border-gray-200 py-8 px-4 flex flex-col gap-2 min-h-full">
          <nav className="flex-1">
            <ul className="space-y-1">
              <li>
                <Link href="/admin/pages" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-700 font-medium">
                  <FileText className="w-4 h-4" /> Pages
                </Link>
              </li>
              <li>
                <Link href="/admin/posts" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-700 font-medium">
                  <BookOpen className="w-4 h-4" /> Posts
                </Link>
              </li>
              <li>
                <Link href="/admin/news" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-700 font-medium">
                  <Newspaper className="w-4 h-4" /> News
                </Link>
              </li>
              <li>
                <Link href="/admin/content/new" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-700 font-medium">
                  <PlusCircle className="w-4 h-4" /> Add New
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-10">
          <h1 className="text-2xl font-bold mb-2 text-gray-800">Create New Content</h1>
          <p className="text-gray-600 mb-8">Select a content type to create a new entry.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Link
                  key={type.name}
                  href={type.href}
                  className="group block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition p-6"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <span className="p-2 bg-blue-100 rounded">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </span>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700">{type.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{type.description}</p>
                </Link>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
