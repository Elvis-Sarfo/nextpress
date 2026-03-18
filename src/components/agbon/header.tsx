'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Search, ChevronDown, Star, Wrench, HandCoins } from 'lucide-react'
import { t as agbonT } from '@/lib/agbon-translations'
import { HeaderLanguageSwitcher } from './header-language-switcher'
import { HeaderSearchDialog } from './header-search-dialog'

export interface HeaderNavItem {
  label: string
  href?: string
  target?: '_self' | '_blank'
  items?: Array<{ label: string; href: string; target?: '_self' | '_blank' }>
}

interface LegacyHeaderNavigation {
  about?: HeaderNavItem
  afterSales?: HeaderNavItem
  joinUs?: HeaderNavItem
}

export interface HeaderConfig {
  logo: { src: string; alt: string; width: number; height: number; className?: string }
  navigation: HeaderNavItem[] | LegacyHeaderNavigation
}

interface AgbonHeaderProps {
  config: HeaderConfig
  locale?: string
}

function normalizeNavigation(
  navigation: HeaderConfig['navigation']
): HeaderNavItem[] {
  if (Array.isArray(navigation)) return navigation

  const legacy = navigation as LegacyHeaderNavigation
  return [legacy.about, legacy.afterSales, legacy.joinUs].filter(
    (item): item is HeaderNavItem => Boolean(item)
  )
}

export function AgbonHeader({ config, locale = 'en' }: AgbonHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)
  const [langOpen, setLangOpen] = useState(false)
  const navigation = normalizeNavigation(config.navigation)

  const closeAll = () => {
    setOpenMenuIndex(null)
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
            <HeaderLanguageSwitcher
              locale={locale}
              isOpen={langOpen}
              onToggle={() => { setLangOpen(!langOpen); setOpenMenuIndex(null) }}
              onClose={() => setLangOpen(false)}
              compact
            />
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={agbonT('search.openSearch', locale)}
              className="p-2 hover:bg-white/20 rounded transition"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <div className="bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-0 px-2 md:px-4">
            <nav className="flex items-center divide-x divide-white/20 flex-1">
              {navigation.map((item, index) => {
                const hasDropdown = Boolean(item.items?.length)
                const isOpen = openMenuIndex === index
                const itemClass = `px-2 md:px-6 py-2 text-xs md:text-sm transition-colors whitespace-nowrap ${isOpen ? 'bg-[#FF6B35] text-white' : 'hover:text-[#FF6B35]'}`

                return (
                  <div key={`${item.label}-${index}`} className="relative">
                    {hasDropdown ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuIndex(isOpen ? null : index)
                            setLangOpen(false)
                          }}
                          aria-expanded={isOpen}
                          aria-haspopup="menu"
                          className={`flex items-center gap-1 ${itemClass}`}
                        >
                          {item.label}
                          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="hidden md:block absolute top-full left-0 mt-0 bg-[#FF6B35] text-white shadow-lg min-w-50 z-50">
                            {item.items?.map((child, childIndex) => (
                              <Link
                                key={`${child.href}-${childIndex}`}
                                href={child.href}
                                target={child.target}
                                className={`block px-4 py-2 text-sm hover:bg-[#ff5722] transition-colors ${childIndex < (item.items?.length || 0) - 1 ? 'border-b border-white/20' : ''}`}
                                onClick={() => setOpenMenuIndex(null)}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href || '#'}
                        target={item.target}
                        className={itemClass}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                )
              })}
            </nav>

            {/* Desktop: lang switcher */}
            <div className="relative shrink-0 hidden md:block">
              <HeaderLanguageSwitcher
                locale={locale}
                isOpen={langOpen}
                onToggle={() => { setLangOpen(!langOpen); setOpenMenuIndex(null) }}
                onClose={() => setLangOpen(false)}
              />
            </div>

            {/* Desktop: search */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={agbonT('search.openSearch', locale)}
              className="hidden md:block p-2 hover:bg-white/20 rounded transition"
            >
              <Search size={20} />
            </button>
          </div>

          {openMenuIndex !== null && navigation[openMenuIndex]?.items?.length ? (
            <div className="md:hidden bg-[#FF6B35] flex flex-col">
              {navigation[openMenuIndex]?.items?.map((item, i) => (
                <Link
                  key={`${item.href}-${i}`}
                  href={item.href}
                  target={item.target}
                  className={`px-4 py-2 text-xs text-white hover:bg-[#ff5722] transition-colors ${i < (navigation[openMenuIndex]?.items?.length || 0) - 1 ? 'border-b border-white/20' : ''}`}
                  onClick={() => setOpenMenuIndex(null)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Overlay for closing dropdowns */}
      {(openMenuIndex !== null || langOpen) && (
        <div className="hidden md:block fixed inset-0 z-40" onClick={closeAll} />
      )}

      <HeaderSearchDialog locale={locale} isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
