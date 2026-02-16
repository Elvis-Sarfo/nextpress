/**
 * Admin Dashboard
 * 
 * Main dashboard showing collection overview and quick actions.
 */

import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  Image,
  Users,
  Settings,
  Shield,
  Key,
  Database,
  Plus,
  ArrowRight,
  BarChart3,
} from 'lucide-react';
import { collectionsMeta, getGroupedCollections } from '@/lib/collections-data';

// Icon mapping for collections
const collectionIcons: Record<string, React.ElementType> = {
  users: Users,
  roles: Shield,
  permissions: Key,
  media: Image,
  pages: FileText,
  settings: Settings,
  default: Database,
};

function getCollectionIcon(slug: string): React.ElementType {
  return collectionIcons[slug] || collectionIcons.default;
}

export default function AdminDashboard() {
  const groupedCollections = getGroupedCollections();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your NextPress admin panel. Manage your content and settings from here.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Collections</p>
              <p className="text-2xl font-bold">{collectionsMeta.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pages</p>
              <p className="text-2xl font-bold">-</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Image className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Media Files</p>
              <p className="text-2xl font-bold">-</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Users</p>
              <p className="text-2xl font-bold">-</p>
            </div>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Collections</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {collectionsMeta.map((collection) => {
            const Icon = getCollectionIcon(collection.slug);
            return (
              <Link
                key={collection.slug}
                href={`/admin/${collection.slug}`}
                className="group rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{collection.labels.plural}</h3>
                        <p className="text-sm text-muted-foreground">
                          {collection.labels.singular} collection
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {collectionsMeta.slice(0, 4).map((collection) => (
            <Link
              key={collection.slug}
              href={`/admin/${collection.slug}/new`}
              className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add {collection.labels.singular}
            </Link>
          ))}
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
