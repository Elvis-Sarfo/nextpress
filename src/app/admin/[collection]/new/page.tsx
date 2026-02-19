/**
 * New Document Page
 * 
 * Creates a new document in a collection.
 * Route: /admin/[collection]/new
 */

import { notFound } from 'next/navigation';
import { getCollection, collectionsMeta } from '@/lib/collections-data';
import { CollectionEdit } from '@/components/admin/CollectionEdit/CollectionEdit';
import { MediaUpload } from '@/components/admin/MediaUpload';

interface PageProps {
  params: Promise<{
    collection: string;
  }>;
}

export async function generateStaticParams() {
  return collectionsMeta.map((collection) => ({
    collection: collection.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { collection: collectionSlug } = await params;
  const collection = getCollection(collectionSlug);
  
  if (!collection) {
    return {
      title: 'Collection Not Found',
    };
  }
  
  return {
    title: `Create ${collection.labels.singular} | NextPress Admin`,
    description: `Create a new ${collection.labels.singular.toLowerCase()}`,
  };
}

export default async function NewDocumentPage({ params }: PageProps) {
  const { collection: collectionSlug } = await params;
  
  // Get collection config
  const collection = getCollection(collectionSlug);
  
  if (!collection) {
    notFound();
  }

  // Dedicated uploader UX for media creation
  if (collectionSlug === 'media') {
    return <MediaUpload />;
  }

  return <CollectionEdit collection={collection} />;
}
