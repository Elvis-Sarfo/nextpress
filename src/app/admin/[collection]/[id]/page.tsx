/**
 * Edit Document Page
 * 
 * Edits an existing document in a collection.
 * Route: /admin/[collection]/[id]
 */

import { notFound } from 'next/navigation';
import { getCollection, collectionsMeta } from '@/lib/collections-data';
import { CollectionEdit } from '@/components/admin/CollectionEdit/CollectionEdit';

interface PageProps {
  params: Promise<{
    collection: string;
    id: string;
  }>;
}

export async function generateStaticParams() {
  const params: { collection: string; id: string }[] = [];
  
  for (const collection of collectionsMeta) {
    // In a real implementation, we'd fetch existing IDs from the database
    // For now, we'll just generate the route structure
    params.push({
      collection: collection.slug,
      id: '[id]',
    });
  }
  
  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { collection: collectionSlug, id } = await params;
  const collection = getCollection(collectionSlug);
  
  if (!collection) {
    return {
      title: 'Collection Not Found',
    };
  }
  
  return {
    title: `Edit ${collection.labels.singular} | NextPress Admin`,
    description: `Edit ${collection.labels.singular.toLowerCase()} - ${id}`,
  };
}

export default async function EditDocumentPage({ params }: PageProps) {
  const { collection: collectionSlug, id } = await params;
  
  // Get collection config
  const collection = getCollection(collectionSlug);
  
  if (!collection) {
    notFound();
  }
  
  return <CollectionEdit collection={collection} documentId={id} />;
}
