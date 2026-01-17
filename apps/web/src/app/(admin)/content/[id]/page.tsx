import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getContentEntry, contentVersionRepository } from '@/lib/cms';
import { ArrowLeft } from 'lucide-react';
import { formatDateTime, getStatusColor } from '@/lib/utils';
import type { ContentVersion } from '@cms/kernel';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ContentEditPage({ params }: Props) {
  const { id } = await params;
  const result = await getContentEntry(id);

  if (!result) {
    notFound();
  }

  const { entry, version, schema } = result;

  // Get all versions for this entry
  const allVersions = await contentVersionRepository.findByEntry(entry.id);

  // Parse version data - it's stored as JSON with locales
  const versionData = version.data as {
    locales?: Record<string, { slug?: string; fields?: Record<string, unknown> }>;
  };
  const locales = versionData?.locales ?? {};

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/content"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Content
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Content</h1>
            <p className="text-muted-foreground mt-1">
              Type: {schema.name} • ID: {entry.id}
            </p>
          </div>
          <div className="flex gap-2">
            <span
              className={`px-3 py-1 rounded-full ${getStatusColor(version.status)}`}
            >
              {version.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Main content area */}
        <div className="col-span-2">
          <div className="bg-secondary/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Content Data</h2>
            {Object.keys(locales).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(locales).map(([locale, localeData]) => (
                  <div key={locale} className="border border-border rounded-lg p-4">
                    <h3 className="font-medium mb-2">
                      Locale: {locale}
                    </h3>
                    {localeData.slug && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Slug: {localeData.slug}
                      </p>
                    )}
                    <pre className="bg-background p-4 rounded text-sm overflow-x-auto">
                      {JSON.stringify(localeData.fields ?? {}, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-border rounded-lg p-4">
                <pre className="bg-background p-4 rounded text-sm overflow-x-auto">
                  {JSON.stringify(version.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info */}
          <div className="bg-secondary/30 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Information</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Created</dt>
                <dd>{formatDateTime(entry.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Created By</dt>
                <dd>{entry.createdBy}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Default Locale</dt>
                <dd>{entry.defaultLocale}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Version</dt>
                <dd>{version.version}</dd>
              </div>
            </dl>
          </div>

          {/* Versions */}
          <div className="bg-secondary/30 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Versions</h2>
            {allVersions.length === 0 ? (
              <p className="text-muted-foreground text-sm">No versions yet.</p>
            ) : (
              <ul className="space-y-2">
                {allVersions.map((v: ContentVersion) => (
                  <li
                    key={v.id}
                    className="flex items-center justify-between p-2 bg-background rounded text-sm"
                  >
                    <span>v{v.version}</span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(
                        v.status
                      )}`}
                    >
                      {v.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Actions */}
          <div className="bg-secondary/30 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                Save Draft
              </button>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                Publish
              </button>
              <button className="w-full px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
