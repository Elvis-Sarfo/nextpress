/**
 * Admin Dashboard
 *
 * Main dashboard showing collection overview and quick actions.
 */

import Link from 'next/link';
import {
  Bell,
  FileText,
  Image,
  Users,
  Settings,
  Shield,
  Key,
  Database,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { collectionsMeta } from '@/lib/collections-data';
import { getNewContactMessagesCount, getPageCount, getMediaCount, getUserCount } from '@/lib/cms';

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

export default async function AdminDashboard() {
  const [pageCount, mediaCount, userCount, newContactMessagesCount] = await Promise.all([
    getPageCount(),
    getMediaCount(),
    getUserCount(),
    getNewContactMessagesCount(),
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your NextPress admin panel. Manage your content and settings from here.
        </p>
      </div>

      {newContactMessagesCount > 0 ? (
        <Link
          href="/admin/contact-messages"
          className="flex items-start justify-between gap-4 rounded-xl border border-[#FFD9CC] bg-[#FFF4EF] p-5 shadow-sm transition-colors hover:bg-[#FFEDE4]"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-white p-2 shadow-sm">
              <Bell className="h-5 w-5 text-[#FF6B35]" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#FF6B35]">
                New Contact Messages
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {newContactMessagesCount} message{newContactMessagesCount === 1 ? '' : 's'} waiting for review
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Open the inbox to assign, reply, or resolve them.
              </p>
            </div>
          </div>
          <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[#FF6B35]" />
        </Link>
      ) : null}

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
              <p className="text-2xl font-bold">{pageCount}</p>
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
              <p className="text-2xl font-bold">{mediaCount}</p>
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
              <p className="text-2xl font-bold">{userCount}</p>
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
