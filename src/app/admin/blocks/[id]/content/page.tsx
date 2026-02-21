import { BlockContentPage } from '@/components/admin/BlockContentPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BlockContentRoute({ params }: PageProps) {
  const { id } = await params;
  return <BlockContentPage blockId={id} />;
}
