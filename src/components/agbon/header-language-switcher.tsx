'use client'

import { ChevronDown, Globe } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { replaceLocaleInPath } from '@/lib/agbon-routes'

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
] as const

interface HeaderLanguageSwitcherProps {
  locale: string
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  compact?: boolean
}

export function HeaderLanguageSwitcher({
  locale,
  isOpen,
  onToggle,
  onClose,
  compact = false,
}: HeaderLanguageSwitcherProps) {
  const currentLanguage = LANGUAGES.find((language) => language.code === locale) || LANGUAGES[0]
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleSelect = async (code: string) => {
    let nextPath = replaceLocaleInPath(pathname || '/', code)
    const query = searchParams.toString()
    const hash = typeof window !== 'undefined' ? window.location.hash : ''

    if (pathname) {
      try {
        const response = await fetch(
          `/api/localization/path?pathname=${encodeURIComponent(pathname)}&locale=${encodeURIComponent(code)}`,
          { cache: 'no-store' }
        )

        if (response.ok) {
          const payload = (await response.json()) as { path?: string }
          if (payload.path) {
            nextPath = payload.path
          }
        }
      } catch {
        // Fall back to simple locale-prefix replacement when alternate resolution fails.
      }
    }

    onClose()
    router.push(`${nextPath}${query ? `?${query}` : ''}${hash}`)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Change language"
        className={
          compact
            ? 'flex items-center gap-1 px-2 py-2 hover:bg-white/20 rounded transition text-xs'
            : 'flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 hover:bg-white/20 rounded transition text-xs md:text-sm'
        }
      >
        <Globe size={16} />
        <span>{currentLanguage.flag}</span>
        {!compact && <span className="hidden lg:inline">{currentLanguage.label}</span>}
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div
          role="menu"
          className="absolute top-full right-0 mt-2 bg-white text-black shadow-lg rounded-md overflow-hidden min-w-40 z-50"
        >
          {LANGUAGES.map((language) => (
            <button
              type="button"
              role="menuitem"
              key={language.code}
              onClick={() => handleSelect(language.code)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                locale === language.code ? 'bg-orange-50 text-[#FF6B35] font-medium' : ''
              }`}
            >
              <span className="text-xl">{language.flag}</span>
              <span>{language.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
