'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Search, ChevronDown, Star, Wrench, HandCoins } from 'lucide-react'
import { t as agbonT } from '@/lib/agbon-translations'
import { HeaderLanguageSwitcher } from './header-language-switcher'
import { HeaderSearchDialog } from './header-search-dialog'

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

export function AgbonHeader({ config, locale = 'en' }: AgbonHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [joinUsOpen, setJoinUsOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

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
            <HeaderLanguageSwitcher
              locale={locale}
              isOpen={langOpen}
              onToggle={() => { setLangOpen(!langOpen); setAboutOpen(false); setJoinUsOpen(false) }}
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
              {/* About */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setAboutOpen(!aboutOpen); setJoinUsOpen(false); setLangOpen(false) }}
                  aria-expanded={aboutOpen}
                  aria-haspopup="menu"
                  className={`flex items-center gap-1 px-2 md:px-6 py-2 text-xs md:text-sm transition-colors whitespace-nowrap ${
                    aboutOpen ? 'bg-[#FF6B35] text-white' : 'hover:text-[#FF6B35]'
                  }`}
                >
                  {agbonT('nav.about', locale)}
                  <ChevronDown className={`w-3 h-3 transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
                </button>
                {aboutOpen && (
                  <div className="hidden md:block absolute top-full left-0 mt-0 bg-[#FF6B35] text-white shadow-lg min-w-50 z-50">
                    {config.navigation.about.items?.map((item, i) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-2 text-sm hover:bg-[#ff5722] transition-colors ${i < (config.navigation.about.items?.length || 0) - 1 ? 'border-b border-white/20' : ''}`}
                        onClick={() => setAboutOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

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
                  type="button"
                  onClick={() => { setJoinUsOpen(!joinUsOpen); setAboutOpen(false) }}
                  aria-expanded={joinUsOpen}
                  aria-haspopup="menu"
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
              <HeaderLanguageSwitcher
                locale={locale}
                isOpen={langOpen}
                onToggle={() => { setLangOpen(!langOpen); setAboutOpen(false); setJoinUsOpen(false) }}
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

          {/* Mobile about submenu */}
          {aboutOpen && (
            <div className="md:hidden bg-[#FF6B35] flex flex-col">
              {config.navigation.about.items?.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-xs text-white hover:bg-[#ff5722] transition-colors ${i < (config.navigation.about.items?.length || 0) - 1 ? 'border-b border-white/20' : ''}`}
                  onClick={() => setAboutOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

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

      <HeaderSearchDialog locale={locale} isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
