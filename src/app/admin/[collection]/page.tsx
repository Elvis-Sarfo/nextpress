/**
 * Collection List Page
 * 
 * Displays a list of documents in a specific collection.
 * Route: /admin/[collection]
 */

import { notFound } from 'next/navigation';
import { getCollection, collectionsMeta } from '@/lib/collections-data';
import { CollectionList } from '@/components/admin/CollectionList/CollectionList';
import { MediaLibraryPage } from '@/components/media/MediaLibraryPage';

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
    title: `${collection.labels.plural} | NextPress Admin`,
    description: `Manage ${collection.labels.plural.toLowerCase()} in your collection`,
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { collection: collectionSlug } = await params;
  
  // Get collection config
  const collection = getCollection(collectionSlug);
  
  if (!collection) {
    notFound();
  }

  // Dedicated media library UX for media collection
  if (collectionSlug === 'media') {
    return <MediaLibraryPage />;
  }

  return <CollectionList collection={collection} />;
}
