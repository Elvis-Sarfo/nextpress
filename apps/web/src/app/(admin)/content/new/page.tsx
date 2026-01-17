import Link from 'next/link';
import { getContentTypes } from '@/lib/cms';
import { ArrowLeft, FileText } from 'lucide-react';

export default async function NewContentPage() {
  const schemas = await getContentTypes();

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
        <h1 className="text-3xl font-bold">Create New Content</h1>
        <p className="text-muted-foreground mt-1">
          Select a content type to create a new entry
        </p>
      </div>

      {schemas.length === 0 ? (
        <div className="text-center py-12 bg-secondary/30 rounded-lg">
          <p className="text-muted-foreground mb-4">
            No content types defined yet. Create a schema first.
          </p>
          <Link
            href="/schemas"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Go to Schemas
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schemas.map((schema) => (
            <Link
              key={schema.id}
              href={`/content/new/${schema.id}`}
              className="p-6 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{schema.displayName ?? schema.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {schema.description ?? `Create a new ${schema.name}`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {schema.fields.length} fields
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
