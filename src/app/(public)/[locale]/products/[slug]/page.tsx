import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { localeEngine, getProductBySlug, getProducts, getProductCategories } from '@/lib/cms';
import { getSiteConfig } from '@/lib/site-config';
import { AgbonProductDetail } from '@/components/agbon/product-detail';
import { ProductPageShell } from '@/components/agbon/product-page-shell';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ProductDetailBySlugPage({ params }: Props) {
  const { locale, slug } = await params;

  if (!localeEngine.isSupported(locale)) {
    notFound();
  }

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const categoryId = typeof product.category === 'string'
    ? product.category
    : (product.category as { id?: string } | null)?.id;

  const [relatedResult, categories] = await Promise.all([
    getProducts({
      categoryId: categoryId || undefined,
      limit: 5,
    }),
    getProductCategories(),
  ]);

  const relatedProducts = relatedResult.products
    .filter((candidate) => candidate.id !== product.id)
    .slice(0, 4);

  return (
    <ProductPageShell
      locale={locale}
      categories={categories}
      sidebarMode="navigation"
      stickySidebar
    >
      <AgbonProductDetail
        product={product}
        relatedProducts={relatedProducts}
        locale={locale}
      />
    </ProductPageShell>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const siteConfig = await getSiteConfig(locale);
  const product = await getProductBySlug(slug);
  if (!product) {
    return {
      title: siteConfig.seo.defaultTitle,
      description: siteConfig.seo.description,
    };
  }

  const name = product.name as Record<string, string> | string;
  const title = typeof name === 'string' ? name : name?.[locale] || name?.en || 'Product';
  return {
    title,
    description: siteConfig.seo.description,
  };
}
