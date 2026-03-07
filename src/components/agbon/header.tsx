'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Search, ChevronDown, Globe, Star, Wrench, HandCoins } from 'lucide-react'
import { t as agbonT } from '@/lib/agbon-translations'
import { Button } from '../ui/button'

export interface HeaderConfig {
  logo: { src: string; alt: string; width: number; height: number; className?: string }
  navigation: {
    about: { label: string; href?: string; items?: Array<{ label: string; href: string }> }
    afterSales: { label: string; href?: string }
    joinUs: { label: string; href?: string; items?: Array<{ label: string; href: string }> }
  }
}

interface AgbonHeaderProps {
  config: HeaderConfig
  locale?: string
}

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
] as const

export function AgbonHeader({ config, locale = 'en' }: AgbonHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [joinUsOpen, setJoinUsOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const currentLanguage = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0]

  const handleLangSelect = (code: string) => {
    setLangOpen(false)
    // Navigate to the same page with different locale
    if (typeof window !== 'undefined') {
      const path = window.location.pathname
      const newPath = path.replace(/^\/(en|fr|zh)/, `/${code}`)
      window.location.href = newPath === path ? `/${code}` : newPath
    }
  }

  const closeAll = () => {
    setAboutOpen(false)
    setJoinUsOpen(false)
    setLangOpen(false)
  }

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#FF6B35] text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src={config.logo.src}
              alt={config.logo.alt}
              width={config.logo.width}
              height={config.logo.height}
              className={config.logo.className || 'h-8 md:h-10 w-auto'}
              priority
            />
          </Link>

          {/* Value props — desktop */}
          <div className="hidden lg:flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2"><Star size={16} /><span>{agbonT('value.quality', locale)}</span></div>
            <div className="flex items-center gap-2"><Wrench size={16} /><span>{agbonT('value.service', locale)}</span></div>
            <div className="flex items-center gap-2"><HandCoins size={16} /><span>{agbonT('value.price', locale)}</span></div>
          </div>

          {/* Mobile: lang + search */}
          <div className="flex md:hidden items-center gap-2">
            <div className="relative">
              <button
                onClick={() => { setLangOpen(!langOpen); setAboutOpen(false); setJoinUsOpen(false) }}
                className="flex items-center gap-1 px-2 py-2 hover:bg-white/20 rounded transition text-xs"
              >
                <Globe size={16} />
                <span>{currentLanguage.flag}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white text-black shadow-lg rounded-md overflow-hidden min-w-40 z-50">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLangSelect(lang.code)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${locale === lang.code ? 'bg-orange-50 text-[#FF6B35] font-medium' : ''}`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button onClick={() => setSearchOpen(true)} className="p-2 hover:bg-white/20 rounded transition">
              <Search size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <div className="bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-0 px-2 md:px-4">
            <nav className="flex items-center divide-x divide-white/20 flex-1">
              {/* About */}
              {config.navigation.about.items?.[0] && (
                <Link
                  href={config.navigation.about.items[0].href}
                  className="px-2 md:px-6 py-2 text-xs md:text-sm hover:text-[#FF6B35] transition-colors whitespace-nowrap"
                >
                  {config.navigation.about.items[0].label}
                </Link>
              )}

              {/* After Sales */}
              <Link
                href={config.navigation.afterSales.href || '#'}
                className="px-2 md:px-6 py-2 text-xs md:text-sm hover:text-[#FF6B35] transition-colors whitespace-nowrap"
              >
                {agbonT('nav.service', locale)}
              </Link>

              {/* Join Us */}
              <div className="relative">
                <button
                  onClick={() => { setJoinUsOpen(!joinUsOpen); setAboutOpen(false) }}
                  className={`flex items-center gap-1 px-1 md:px-6 py-2 text-xs md:text-sm transition-colors ${joinUsOpen ? 'bg-[#FF6B35] text-white' : 'hover:text-[#FF6B35]'}`}
                >
                  {agbonT('nav.joinUs', locale)}
                  <ChevronDown className={`w-3 h-3 transition-transform ${joinUsOpen ? 'rotate-180' : ''}`} />
                </button>
                {joinUsOpen && (
                  <div className="hidden md:block absolute top-full left-0 mt-0 bg-[#FF6B35] text-white shadow-lg min-w-50 z-50">
                    {config.navigation.joinUs.items?.map((item, i) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-2 text-sm hover:bg-[#ff5722] transition-colors ${i < (config.navigation.joinUs.items?.length || 0) - 1 ? 'border-b border-white/20' : ''}`}
                        onClick={() => setJoinUsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Desktop: lang switcher */}
            <div className="relative shrink-0 hidden md:block">
              <button
                onClick={() => { setLangOpen(!langOpen); setAboutOpen(false); setJoinUsOpen(false) }}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 hover:bg-white/20 rounded transition text-xs md:text-sm"
              >
                <Globe size={16} />
                <span className="hidden md:inline">{currentLanguage.flag}</span>
                <span className="hidden lg:inline">{currentLanguage.label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white text-black shadow-lg rounded-md overflow-hidden min-w-40 z-50">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLangSelect(lang.code)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${locale === lang.code ? 'bg-orange-50 text-[#FF6B35] font-medium' : ''}`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop: search */}
            <Button
              onClick={() => setSearchOpen(true)}
              className="hidden md:block p-2 hover:bg-white/20 rounded transition"
            >
              <Search size={20} />
            </Button>
          </div>

          {/* Mobile join us submenu */}
          {joinUsOpen && (
            <div className="md:hidden bg-[#FF6B35] flex flex-col">
              {config.navigation.joinUs.items?.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-xs text-white hover:bg-[#ff5722] transition-colors ${i < (config.navigation.joinUs.items?.length || 0) - 1 ? 'border-b border-white/20' : ''}`}
                  onClick={() => setJoinUsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overlay for closing dropdowns */}
      {(aboutOpen || joinUsOpen || langOpen) && (
        <div className="hidden md:block fixed inset-0 z-40" onClick={closeAll} />
      )}

      {/* Simple search overlay (placeholder — full SearchOverlay not copied) */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center pt-20">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center gap-3">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                autoFocus
                placeholder={agbonT('header.searchPlaceholder', locale)}
                className="flex-1 text-base outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchOpen(false)
                  if (e.key === 'Enter') {
                    const query = (e.target as HTMLInputElement).value
                    if (query) window.location.href = `/${locale}/products?search=${encodeURIComponent(query)}`
                  }
                }}
              />
              <button onClick={() => setSearchOpen(false)} className="text-gray-500 hover:text-black">✕</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
