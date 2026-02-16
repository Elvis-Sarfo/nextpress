'use client';

/**
 * Collection List Component
 * 
 * Displays a list of documents in a collection, similar to Payload CMS.
 */

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  ArrowUpDown,
  Eye,
  Pencil,
  Trash2,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CollectionMeta } from '@/lib/collections-data';

interface CollectionListProps {
  collection: CollectionMeta;
}

export function CollectionList({ collection }: CollectionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Get columns to display
  const columns = collection.admin.defaultColumns || ['id', 'createdAt', 'updatedAt'];
  
  // Filter available fields
  const displayFields = columns
    .map((col) => collection.fields.find((f) => f.name === col))
    .filter(Boolean) as CollectionMeta['fields'];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{collection.labels.plural}</h1>
          <p className="text-muted-foreground mt-1">
            Manage {collection.labels.plural.toLowerCase()} in your collection
          </p>
        </div>
        <Link href={`/admin/${collection.slug}/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add {collection.labels.singular}
          </Button>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search ${collection.labels.plural.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Select all
                      } else {
                        setSelectedRows(new Set());
                      }
                    }}
                  />
                </th>
                {displayFields.map((field) => (
                  <th
                    key={field.name}
                    className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                  >
                    <button className="flex items-center gap-1 hover:text-foreground">
                      {field.label || field.name}
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Empty state - would be replaced with actual data */}
              <tr className="border-b">
                <td colSpan={displayFields.length + 2} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground">No {collection.labels.plural.toLowerCase()} found</p>
                    <Link href={`/admin/${collection.slug}/new`}>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Create your first {collection.labels.singular.toLowerCase()}
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 0 of 0 {collection.labels.plural.toLowerCase()}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
