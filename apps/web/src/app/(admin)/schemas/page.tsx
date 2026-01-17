import Link from 'next/link';
import { getContentTypes } from '@/lib/cms';
import { Plus, Layers } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function SchemasPage() {
  const schemas = await getContentTypes();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Content Schemas</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          New Schema
        </button>
      </div>

      {schemas.length === 0 ? (
        <div className="text-center py-12 bg-secondary/30 rounded-lg">
          <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            No content schemas defined yet.
          </p>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            Create your first schema
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schemas.map((schema) => (
            <div
              key={schema.id}
              className="p-6 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">
                  v{schema.version}
                </span>
              </div>
              <h3 className="font-semibold text-lg">{schema.displayName ?? schema.name}</h3>
              <p className="text-sm text-muted-foreground">
                {schema.name}
              </p>
              {schema.description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {schema.description}
                </p>
              )}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {schema.fields.length} fields
                  </span>
                  <span className="text-muted-foreground">
                    Updated {formatDate(schema.updatedAt)}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 px-3 py-1.5 text-sm border border-border rounded hover:bg-secondary transition-colors">
                  Edit
                </button>
                <Link
                  href={`/content/new/${schema.id}`}
                  className="flex-1 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity text-center"
                >
                  New Entry
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
