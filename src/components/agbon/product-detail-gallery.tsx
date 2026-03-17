'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Maximize, X } from 'lucide-react'
import { Button } from '../ui/button'

interface ProductDetailGalleryProps {
  imageUrls: string[]
  productName: string
}

export function ProductDetailGallery({ imageUrls, productName }: ProductDetailGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <>
      <div className="mb-6">
        <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden mb-3">
          <div
            className="relative w-full h-[280px] sm:h-[350px] md:h-[450px] cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <Image
              src={imageUrls[selectedImage]}
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

        {imageUrls.length > 1 && (
          <div className="flex items-start gap-2 overflow-x-auto pb-2">
            {imageUrls.map((thumb, i) => (
              <Button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative w-14 h-14 md:w-16 md:h-16 rounded border-2 shrink-0 overflow-hidden transition-all ${
                  selectedImage === i ? 'border-[#FF6B35] shadow-md' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Image src={thumb} alt={`${productName} ${i + 1}`} fill className="object-cover" />
              </Button>
            ))}
          </div>
        )}
      </div>

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
              <Button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-60px)]">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imageUrls.map((img, i) => (
                  <div key={i} className="relative aspect-square bg-gray-100 rounded">
                    <Image src={img} alt={`${productName} ${i + 1}`} fill className="object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
