'use client'

import { useState, useEffect, useRef } from 'react'
import { Phone, X } from 'lucide-react'

const storeContacts = [
  { location: 'Accra, Ghana', phone: '+233 24 123 4567' },
  { location: 'Lagos, Nigeria', phone: '+234 803 456 7890' },
  { location: 'Nairobi, Kenya', phone: '+254 712 345 678' },
  { location: 'Abidjan, Ivory Coast', phone: '+225 07 12 34 56 78' },
  { location: 'Headquarters', phone: '+233 30 276 5432' },
]

export function AgbonFloatingQuickInquiry() {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

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
          aria-label="Store Contact Information"
          className="fixed right-6 bottom-24 z-50 w-80 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#FF6B35] to-[#E55A24] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <h3 className="font-bold text-lg">Contact Our Stores</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {storeContacts.map((store, i) => (
              <a
                key={i}
                href={`tel:${store.phone.replace(/\s/g, '')}`}
                className="block p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-[#1a1a1a] text-sm mb-1">{store.location}</p>
                    <p className="text-[#FF6B35] font-medium text-base group-hover:underline">{store.phone}</p>
                  </div>
                  <Phone className="w-4 h-4 text-[#FF6B35] mt-1 group-hover:rotate-12 transition-transform" />
                </div>
              </a>
            ))}
          </div>
          <div className="bg-gray-50 p-3 text-center">
            <p className="text-xs text-gray-600">Tap a number to call instantly</p>
          </div>
        </div>
      )}
    </>
  )
}
