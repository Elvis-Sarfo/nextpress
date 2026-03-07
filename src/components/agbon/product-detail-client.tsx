'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Maximize, X } from 'lucide-react'
import { ProductRecord } from '@/lib/cms'
import { AgbonProductCard } from './product-card'
import { t as agbonT } from '@/lib/agbon-translations'

interface ProductDetailClientProps {
  product: ProductRecord
  relatedProducts?: ProductRecord[]
  locale?: string
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

export function AgbonProductDetailClient({
  product,
  relatedProducts = [],
  locale = 'en',
}: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Extract images from media JSON
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

  const specifications: Array<{ key: unknown; value: unknown }> = Array.isArray(product.specifications)
    ? product.specifications
    : []

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <div className="w-full pb-8 md:pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link href={`/${locale}`} className="hover:text-[#FF6B35] transition">{agbonT('nav.home', locale)}</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/products`} className="hover:text-[#FF6B35] transition">{agbonT('nav.products', locale)}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{productName}</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-bold mb-1">{productName}</h1>
        {productModel && <p className="text-lg text-gray-500 mb-4">{productModel}</p>}

        {/* Image gallery */}
        <div className="mb-6">
          <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden mb-3">
            <div
              className="relative w-full h-[280px] sm:h-[350px] md:h-[450px] cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <Image
                src={finalImageUrls[selectedImage]}
                alt={productName}
                fill
                className="object-contain transition-transform duration-300 ease-out"
                style={{
                  transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                }}
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all hover:scale-110"
              aria-label="View fullscreen"
            >
              <Maximize className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Thumbnails */}
          {finalImageUrls.length > 1 && (
            <div className="flex items-start gap-2 overflow-x-auto pb-2">
              {finalImageUrls.map((thumb, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-14 h-14 md:w-16 md:h-16 rounded border-2 shrink-0 overflow-hidden transition-all ${
                    selectedImage === i ? 'border-[#FF6B35] shadow-md' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Image src={thumb} alt={`${productName} ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fullscreen modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="font-semibold">{productName}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-60px)]">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {finalImageUrls.map((img, i) => (
                    <div key={i} className="relative aspect-square bg-gray-100 rounded">
                      <Image src={img} alt={`${productName} ${i + 1}`} fill className="object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        {productDescription && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2 relative">
              Description
              <div className="absolute bottom-0 left-0 h-1 w-20 bg-gradient-to-r from-[#FF6B35] via-amber-500 to-transparent rounded-full" />
            </h3>
            <p className="text-gray-700 leading-relaxed">{productDescription}</p>
          </div>
        )}

        {/* Specifications */}
        {specifications.length > 0 && (
          <div className="relative bg-gray-50 p-4 rounded-lg mb-8">
            <h3 className="text-lg font-bold mb-3 relative">
              Product Specifications
              <div className="absolute bottom-0 left-0 h-1 w-20 bg-gradient-to-r from-[#FF6B35] via-amber-500 to-transparent rounded-full" />
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 mt-4">
              {specifications.map((spec: any, i) => {
                const key = getLocalized(spec.key, locale)
                const value = getLocalized(spec.value, locale)
                return (
                  <li key={i}>✓ <strong>{key}:</strong> {value}</li>
                )
              })}
            </ul>
          </div>
        )}

        {/* Contact CTA */}
        <div className="relative bg-[#FF6B35] text-white p-6 rounded-lg mb-8">
          <h3 className="text-lg font-bold mb-2">{agbonT('common.contactUs', locale)}</h3>
          <p className="text-sm mb-4">
            Interested in this product? Get in touch with us for more information and pricing.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-[#FF6B35] hover:bg-gray-100 px-6 py-2 rounded font-semibold transition"
          >
            {agbonT('common.contactUs', locale)}
          </Link>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-4">{agbonT('common.relatedProducts', locale)}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
