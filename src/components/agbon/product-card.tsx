import Image from 'next/image'
import Link from 'next/link'
import { ProductRecord } from '@/lib/cms'
import { t as agbonT } from '@/lib/agbon-translations'

interface ProductCardProps {
  product: ProductRecord
  locale?: string
  showSpecs?: boolean
}

function getLocalized(field: unknown, locale: string): string {
  if (!field) return ''
  if (typeof field === 'string') return field
  if (typeof field === 'object') {
    const obj = field as Record<string, string>
    return obj[locale] || obj.en || obj.fr || obj.zh || Object.values(obj)[0] || ''
  }
  return ''
}

function isValidImageUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url) return false
  return url.startsWith('http') || url.startsWith('/')
}

function stripHtml(html: string): string {
  return html
    .replace(/<(br|\/p|\/div|\/li|\/ul|\/ol)\s*\/?>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<div[^>]*>/gi, '')
    .replace(/<ul[^>]*>/gi, '')
    .replace(/<ol[^>]*>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim()
}

export function AgbonProductCard({ product, locale = 'en', showSpecs = true }: ProductCardProps) {
  // Get first image from media JSON
  const mediaItems: Array<{ url?: string; isCover?: boolean }> = Array.isArray(product.media)
    ? product.media
    : []
  const coverImage = mediaItems.find((m) => m.isCover) || mediaItems[0]
  const rawImageUrl = coverImage?.url
  const imageUrl = isValidImageUrl(rawImageUrl) ? rawImageUrl : '/placeholder.svg'

  const productName = getLocalized(product.name, locale) || 'Product'
  const productModel = product.model ? getLocalized(product.model, locale) : ''

  const specsHtml = product.specifications ? getLocalized(product.specifications, locale) : ''
  const specs = specsHtml
    ? stripHtml(specsHtml)
      .split(/\n+/)
      .map((spec) => spec.trim())
      .filter(Boolean)
    : []

  return (
    <Link href={`/${locale}/product/${product.id}`}>
      <div className="bg-white rounded-[8px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col border-2 border-[#e7e9ef] hover:border-[#FF6B35]/40 hover:scale-[1.01]">
        <div className="relative w-full aspect-[4/3] bg-[#f6f7fb]">
          <Image src={imageUrl} alt={productName} fill className="object-cover" />
        </div>

        <div className="p-2 md:p-5 flex-1 flex flex-col bg-white">
          <div className="overflow-hidden">
            <h3 className="font-bold text-[#FF6B35] text-sm md:text-base leading-snug overflow-hidden">
              <span className="line-clamp-2" title={productName}>{productName}</span>
            </h3>
            <h4 className="font-semibold text-[#686c6e] text-xs md:text-sm min-h-5 md:min-h-6">
              {productModel || '\u00A0'}
            </h4>
          </div>

          {showSpecs && specs.length > 0 && (
            <>
              <hr className="border-t border-[#d8dee8] my-0" />
              <div className="flex-1 flex flex-col">
                <div className="text-[10px] text-[#FF6B35] mb-1.5 tracking-[0.16em] uppercase">
                  {agbonT('common.technicalDescription', locale)}
                </div>
                <div
                  className="text-[10px]"
                  dangerouslySetInnerHTML={{ __html: specsHtml || '' }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
