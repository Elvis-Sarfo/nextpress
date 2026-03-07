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

  const specs: string[] = []
  if (Array.isArray(product.specifications)) {
    product.specifications.forEach((spec: any) => {
      if (typeof spec === 'string') {
        specs.push(spec)
      } else if (spec?.key && spec?.value) {
        const k = getLocalized(spec.key, locale)
        const v = getLocalized(spec.value, locale)
        specs.push(`${k}:${v}`)
      }
    })
  }

  return (
    <Link href={`/${locale}/product/${product.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col border border-gray-200 hover:border-[#FF6B35]/50 hover:scale-[1.02]">
        <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-4">
          <Image src={imageUrl} alt={productName} fill className="object-contain p-2" />
        </div>

        <div className="p-3 md:p-4 flex-1 flex flex-col bg-white">
          <div className="h-14 md:h-16 overflow-hidden">
            <h3 className="font-bold text-[#FF6B35] text-sm leading-snug max-h-10 md:max-h-12 overflow-hidden">
              <span className="line-clamp-1" title={productName}>{productName}</span>
            </h3>
            <h4 className="font-semibold text-[#686c6e] text-xs min-h-5 md:min-h-6">
              {productModel || '\u00A0'}
            </h4>
          </div>

          {showSpecs && specs.length > 0 && (
            <>
              <hr className="border-t border-gray-200 my-2" />
              <div className="flex-1 flex flex-col">
                <div className="text-[10px] text-[#FF6B35] mb-1 tracking-wide uppercase">
                  {agbonT('common.technicalDescription', locale)}
                </div>
                <div className="space-y-0.5">
                  {specs.slice(0, 4).map((spec, i) => (
                    <div key={i} className="text-[10px] text-gray-600 leading-relaxed line-clamp-1 flex items-start">
                      <span className="text-gray-400 mr-1.5">•</span>
                      <span className="flex-1">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
