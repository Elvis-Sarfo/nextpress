import Link from 'next/link'
import { ProductRecord } from '@/lib/cms'
import { t as agbonT } from '@/lib/agbon-translations'
import { buildLocalizedPath } from '@/lib/agbon-routes'
import { AgbonProductCard } from './product-card'
import { ProductDetailGallery } from './product-detail-gallery'
import { DEFAULT_AGBON_PRODUCT_GRID_COLUMNS } from './product-list'

interface ProductDetailProps {
  product: ProductRecord
  relatedProducts?: ProductRecord[]
  locale?: string
}

function getLocalized(field: unknown, locale: string): string {
  if (!field) return ''
  if (typeof field === 'string') return field
  if (typeof field === 'object') {
    const obj = field as Record<string, string>
    return obj[locale] || obj.en || obj.fr || Object.values(obj)[0] || ''
  }
  return ''
}

function isValidImageUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url) return false
  return url.startsWith('http') || url.startsWith('/')
}

export function AgbonProductDetail({
  product,
  relatedProducts = [],
  locale = 'en',
}: ProductDetailProps) {
  const mediaItems: Array<{ url?: string; isCover?: boolean; type?: string }> = Array.isArray(product.media)
    ? product.media
    : []

  const imageUrls = mediaItems
    .filter((m) => !m.type || m.type === 'image')
    .map((m) => m.url)
    .filter(isValidImageUrl)

  const finalImageUrls = imageUrls.length > 0 ? imageUrls : ['/placeholder.svg']

  const productName = getLocalized(product.name, locale) || 'Product'
  const productModel = product.model ? getLocalized(product.model, locale) : ''
  const productDescription = product.description ? getLocalized(product.description, locale) : ''
  const specificationsHtml = product.specifications ? getLocalized(product.specifications, locale) : ''

  return (
    <div className="w-full pb-8 md:pb-12">
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm text-gray-500 mb-4">
          <Link href={`/${locale}`} className="hover:text-[#FF6B35] transition">{agbonT('nav.home', locale)}</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/products`} className="hover:text-[#FF6B35] transition">{agbonT('nav.products', locale)}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{productName}</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-bold mb-1 text-black">{productName}</h1>
        {productModel && <p className="text-lg text-gray-500 mb-4">{productModel}</p>}

        <ProductDetailGallery imageUrls={finalImageUrls} productName={productName} />

        {productDescription && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2 relative text-black">
              {agbonT('product.description', locale)}
              <div className="absolute bottom-0 left-0 h-1 w-16 bg-gradient-to-r from-[#FF6B35] via-amber-500 to-transparent rounded-full" />
            </h3>
            <div
              className="prose prose-sm max-w-none text-gray-700 prose-p:text-gray-700 prose-li:text-gray-700"
              dangerouslySetInnerHTML={{ __html: productDescription }}
            />
          </div>
        )}

        {specificationsHtml && (
          <div className="relative bg-gray-50 mb-8">
            <h3 className="text-lg font-bold mb-3 relative text-black">
              {agbonT('product.specifications', locale)}
              <div className="absolute bottom-0 left-0 h-1 w-16 bg-gradient-to-r from-[#FF6B35] via-amber-500 to-transparent rounded-full" />
            </h3>
            <div
              className="prose prose-sm mt-4 max-w-none text-gray-700 prose-p:text-gray-700 prose-li:text-gray-700"
              dangerouslySetInnerHTML={{ __html: specificationsHtml }}
            />
          </div>
        )}

        <div className="relative bg-[#FF6B35] text-white p-6 rounded-lg mb-8">
          <h3 className="text-lg font-bold mb-2">{agbonT('common.contactUs', locale)}</h3>
          <p className="text-sm mb-4">
            Interested in this product? Get in touch with us for more information and pricing.
          </p>
          <Link
            href={buildLocalizedPath(locale, '/contact')}
            className="inline-block bg-white text-[#FF6B35] hover:bg-gray-100 px-6 py-2 rounded font-semibold transition"
          >
            {agbonT('common.contactUs', locale)}
          </Link>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-black">{agbonT('common.relatedProducts', locale)}</h3>
            <div className={`grid ${DEFAULT_AGBON_PRODUCT_GRID_COLUMNS} gap-2`}>
              {relatedProducts.slice(0, 4).map((p) => (
                <AgbonProductCard key={p.id} product={p} locale={locale} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
