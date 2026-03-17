import { notFound, redirect } from 'next/navigation';
import { localeEngine, getProduct } from '@/lib/cms';
import { buildProductPath } from '@/lib/agbon-routes';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, id } = await params;

  if (!localeEngine.isSupported(locale)) {
    notFound();
  }

  const product = await getProduct(id);
  if (!product) notFound();
  redirect(buildProductPath(locale, product.slug));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const product = await getProduct(id);
  if (!product) return {};

  const name = product.name as any;
  const title = typeof name === 'string' ? name : name?.[locale] || name?.en || 'Product';
  return { title };
}
