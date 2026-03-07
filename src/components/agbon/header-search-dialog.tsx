'use client'

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { t as agbonT } from '@/lib/agbon-translations'
import { buildLocalizedPath } from '@/lib/agbon-routes'

interface HeaderSearchDialogProps {
  locale: string
  isOpen: boolean
  onClose: () => void
}

export function HeaderSearchDialog({ locale, isOpen, onClose }: HeaderSearchDialogProps) {
  const router = useRouter()

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center pt-20"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={agbonT('search.openSearch', locale)}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            autoFocus
            placeholder={agbonT('header.searchPlaceholder', locale)}
            className="flex-1 text-base outline-none"
            onKeyDown={(event) => {
              if (event.key === 'Escape') onClose()
              if (event.key === 'Enter') {
                const query = (event.target as HTMLInputElement).value.trim()
                if (!query) return
                router.push(`${buildLocalizedPath(locale, '/products')}?search=${encodeURIComponent(query)}`)
                onClose()
              }
            }}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
