'use client'

import { Mail, MapPin, Phone } from 'lucide-react'
import { AgbonSectionTitle } from './section-title'
import { t as agbonT } from '@/lib/agbon-translations'
import { useSiteConfig } from '@/contexts/site-config-context'

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
  email,
  phone,
  address,
}: ContactInfoProps) {
  const siteConfig = useSiteConfig()
  const resolvedEmail = email || siteConfig?.contact.email || 'info@agbon.com'
  const resolvedPhone = phone || siteConfig?.contact.phone || '+1 (555) 123-4567'
  const resolvedAddress = address || siteConfig?.contact.address || 'Industrial Park, Zone A'

  const items = [
    {
      icon: <Mail className="w-8 h-8" />,
      label: 'Email',
      value: resolvedEmail,
      href: `mailto:${resolvedEmail}`,
    },
    {
      icon: <Phone className="w-8 h-8" />,
      label: 'Phone',
      value: resolvedPhone,
      href: `tel:${resolvedPhone}`,
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      label: 'Location',
      value: resolvedAddress,
    },
  ]

  return (
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
            className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FF6B35]/10 text-[#FF6B35] rounded-full mb-3">
              {item.icon}
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{item.label}</h3>
            {item.href ? (
              <a
                href={item.href}
                className="text-[#FF6B35] hover:underline"
              >
                {item.value}
              </a>
            ) : (
              <p className="text-gray-600">{item.value}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
