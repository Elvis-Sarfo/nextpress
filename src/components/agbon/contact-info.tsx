'use client'

import { Mail, MapPin, Phone } from 'lucide-react'
import { AgbonSectionTitle } from './section-title'
import { t as agbonT } from '@/lib/agbon-translations'

interface ContactInfoProps {
  locale?: string
  badge?: string
  title?: string
  subtitle?: string
  description?: string
  email?: string
  phone?: string
  address?: string
}

export function AgbonContactInfo({
  locale = 'en',
  badge,
  title,
  subtitle,
  description,
  email = 'info@agbon.com',
  phone = '+1 (555) 123-4567',
  address = 'Industrial Park, Zone A',
}: ContactInfoProps) {
  const items = [
    {
      icon: <Mail className="w-8 h-8" />,
      label: 'Email',
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: <Phone className="w-8 h-8" />,
      label: 'Phone',
      value: phone,
      href: `tel:${phone}`,
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      label: 'Location',
      value: address,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="space-y-10">
        <div>
          <AgbonSectionTitle
            title={title || agbonT('contact.heading', locale)}
            subTitle={subtitle || badge || agbonT('contact.subtitle', locale)}
            align="center"
            className="items-center text-center"
          />
          <p className="text-gray-600 mt-4 text-body text-center max-w-4xl mx-auto">
            {description || agbonT('contact.description', locale)}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-200 bg-white px-8 py-12 shadow-lg text-center"
            >
              <div className="w-24 h-24 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center mx-auto mb-6">
                {item.icon}
              </div>
              <h3 className="text-section-title text-[#1a1a1a] mb-4">{item.label}</h3>
              {item.href ? (
                <a
                  href={item.href}
                  className="text-2xl text-[#FF6B35] hover:text-[#E55A24] transition"
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-2xl text-gray-600">{item.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
