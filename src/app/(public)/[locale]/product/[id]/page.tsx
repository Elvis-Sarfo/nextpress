import { notFound } from 'next/navigation';
import { localeEngine, getProduct, getProducts } from '@/lib/cms';
import { AgbonProductDetailClient } from '@/components/agbon/product-detail-client';
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

  // Related products from same category
  const categoryId = typeof product.category === 'string'
    ? product.category
    : (product.category as any)?.id;

  const relatedResult = await getProducts({
    categoryId: categoryId || undefined,
    limit: 5,
  });

  const relatedProducts = relatedResult.products.filter((p) => p.id !== id).slice(0, 4);

  return (
    <div className="max-w-[90rem] mx-auto px-2 md:px-4 py-6">
      <AgbonProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
        locale={locale}
      />
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const product = await getProduct(id);
  if (!product) return {};

  const name = product.name as any;
  const title = typeof name === 'string' ? name : name?.[locale] || name?.en || 'Product';
  return { title };
}
