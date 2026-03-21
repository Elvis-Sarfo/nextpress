'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { MapPin, Phone, Search, X } from 'lucide-react'
import type { CountryContactRecord } from '@/lib/cms'

function cleanPhone(phone: string) {
  return phone.replace(/[^\d+]/g, '')
}

interface AgbonFloatingQuickInquiryProps {
  countries?: CountryContactRecord[]
}

export function AgbonFloatingQuickInquiry({
  countries = [],
}: AgbonFloatingQuickInquiryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const countriesWithOffices = useMemo(
    () => countries.filter((country) => country.offices.length > 0),
    [countries],
  )
  const filteredCountries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return countriesWithOffices

    return countriesWithOffices
      .map((country) => ({
        ...country,
        offices: country.offices.filter((office) => {
          const countryMatch = country.name.toLowerCase().includes(query)
          const cityMatch = office.city.toLowerCase().includes(query)
          const typeMatch = office.type?.toLowerCase().includes(query) ?? false
          return countryMatch || cityMatch || typeMatch
        }),
      }))
      .filter((country) => country.offices.length > 0)
  }, [countriesWithOffices, searchQuery])

  useEffect(() => {
    if (!isOpen) return
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current && buttonRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !buttonRef.current.contains(e.target as Node)
      ) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') { setIsOpen(false); buttonRef.current?.focus() }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) setSearchQuery('')
  }, [isOpen])

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((v) => !v)}
        className="fixed right-6 bottom-6 z-40 flex items-center gap-2 bg-[#FF6B35] hover:bg-[#E55A24] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        aria-label="Quick Inquiry"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="hidden md:inline font-semibold text-sm">Quick Inquiry</span>
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Office contact lines"
          className="fixed right-6 bottom-24 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#FF6B35] to-[#E55A24] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <h3 className="font-bold text-lg">Office Lines</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="border-b border-gray-100 p-3 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF6B35]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search countries or cities..."
                className="w-full h-10 rounded-xl border border-gray-200 pl-10 pr-10 text-sm text-[#1a1a1a] outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear office search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-[#FF6B35]"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </div>
          <div className="max-h-[28rem] overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <div key={country.id} className="border-b border-gray-100 last:border-b-0">
                  <div className="px-4 pt-4 pb-2 bg-gray-50">
                    <p className="font-semibold text-[#1a1a1a] text-sm">
                      {country.flag ? `${country.flag} ` : ''}
                      {country.name}
                    </p>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {country.offices.map((office, index) => (
                      <a
                        key={`${country.id}-${office.city}-${index}`}
                        href={`tel:${cleanPhone(office.phone)}`}
                        className="block p-4 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-4 h-4 text-[#FF6B35]" />
                              <p className="font-semibold text-[#1a1a1a] text-sm">
                                {office.city}
                                {office.type === 'headquarters' ? ' • HQ' : ''}
                              </p>
                            </div>
                            <p className="text-[#FF6B35] font-medium text-base group-hover:underline">
                              {office.phone}
                            </p>
                          </div>
                          <Phone className="w-4 h-4 text-[#FF6B35] mt-1 group-hover:rotate-12 transition-transform" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))
            ) : countriesWithOffices.length > 0 ? (
              <div className="p-4 text-sm text-gray-600">
                No office lines match "{searchQuery}".
              </div>
            ) : (
              <div className="p-4 text-sm text-gray-600">
                Office lines will appear here when countries and offices are added.
              </div>
            )}
          </div>
          <div className="bg-gray-50 p-3 text-center">
            <p className="text-xs text-gray-600">Tap any office line to call instantly</p>
          </div>
        </div>
      )}
    </>
  )
}
