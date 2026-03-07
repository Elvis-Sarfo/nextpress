import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Linkedin, Twitter } from 'lucide-react'
import { t as agbonT } from '@/lib/agbon-translations'

export interface FooterConfig {
  companyName: string
  description: string
  logo: { src: string; alt: string; width: number; height: number; className?: string }
  quickLinks: Array<{ label: string; href: string }>
  contact: { phone: string; email: string; address: string }
  socialMedia: { facebook?: string; linkedin?: string; twitter?: string }
  newsletter: { enabled: boolean; placeholder: string }
  legal: { privacy: string; terms: string }
  copyright: string
}

interface AgbonFooterProps {
  config: FooterConfig
  locale?: string
}

export function AgbonFooter({ config, locale = 'en' }: AgbonFooterProps) {
  return (
    <footer className="relative bg-[#1a1a1a] text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.01] pointer-events-none"
        style={{ backgroundImage: `url("/box_pattern.png")`, backgroundSize: 'cover' }}
      />

      <div
        style={{ backgroundImage: `url("/primary_pattern.webp")` }}
        className="relative h-12 bg-gradient-to-r from-transparent via-white/10 to-transparent z-10"
      />

      <div className="relative px-4 py-12 md:py-16 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href={`/${locale}`} className="flex items-center mb-3">
              <Image
                src={config.logo.src}
                alt={config.logo.alt}
                width={config.logo.width}
                height={config.logo.height}
                className={config.logo.className || 'h-8 md:h-10 w-auto'}
              />
            </Link>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{config.description}</p>
            <div className="flex gap-4 mt-4">
              {config.socialMedia.facebook && (
                <a href={config.socialMedia.facebook} className="p-2 border border-gray-600 rounded-full hover:border-[#FF6B35] transition" aria-label="Facebook">
                  <Facebook size={16} />
                </a>
              )}
              {config.socialMedia.linkedin && (
                <a href={config.socialMedia.linkedin} className="p-2 border border-gray-600 rounded-full hover:border-[#FF6B35] transition" aria-label="LinkedIn">
                  <Linkedin size={16} />
                </a>
              )}
              {config.socialMedia.twitter && (
                <a href={config.socialMedia.twitter} className="p-2 border border-gray-600 rounded-full hover:border-[#FF6B35] transition" aria-label="Twitter">
                  <Twitter size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">{agbonT('footer.quickLinks', locale)}</h4>
            <ul className="space-y-2 text-xs md:text-sm text-gray-400">
              {config.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#FF6B35] transition">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">{agbonT('footer.contactUs', locale)}</h4>
            <ul className="space-y-2 text-xs md:text-sm text-gray-400">
              <li>📧 {config.contact.email}</li>
              <li>📞 {config.contact.phone}</li>
              <li>📍 {config.contact.address}</li>
            </ul>
          </div>

          {/* Newsletter */}
          {config.newsletter.enabled && (
            <div>
              <h4 className="font-bold mb-4">{agbonT('nav.joinUs', locale)}</h4>
              <p className="text-xs md:text-sm text-gray-400 mb-4">{agbonT('footer.newsletter', locale)}</p>
              <input
                type="email"
                placeholder={config.newsletter.placeholder}
                className="w-full px-3 py-2 bg-gray-800 text-white text-xs md:text-sm rounded border border-gray-700 focus:border-[#FF6B35] outline-none transition"
              />
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-gray-400">
          <p>{config.copyright}</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href={config.legal.privacy} className="hover:text-[#FF6B35] transition">
              {agbonT('footer.privacy', locale)}
            </Link>
            <Link href={config.legal.terms} className="hover:text-[#FF6B35] transition">
              {agbonT('footer.terms', locale)}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
