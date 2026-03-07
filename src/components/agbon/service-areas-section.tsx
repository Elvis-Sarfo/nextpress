import { MapPin, ArrowRight } from 'lucide-react'
import Image from 'next/image'

interface Country {
  id: string
  name: string | { en?: string; fr?: string }
  flag?: string
  offices?: unknown[]
}

interface ServiceAreasSectionProps {
  countries?: Country[]
  title?: string
  subtitle?: string
  onViewAllClick?: () => void
}

function getCountryName(name: string | { en?: string; fr?: string }): string {
  if (typeof name === 'string') return name
  return name.en || name.fr || 'Unknown'
}

export function AgbonServiceAreasSection({
  countries = [],
  title = 'Where We Serve',
  subtitle = 'AGBON is expanding across Africa, bringing quality agricultural equipment to farmers everywhere',
  onViewAllClick,
}: ServiceAreasSectionProps) {
  const displayed = countries.slice(0, 6)
  const hasMore = countries.length > 6

  return (
    <section className="relative py-12 mb-12 md:py-20 px-4 bg-[#1a1a1a] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <Image src="/african_map.png" alt="" fill className="object-contain object-center" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Map visualization */}
          <div className="relative">
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="relative w-full h-full bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <Image src="/african_map.png" alt="Africa Map" fill className="object-contain p-4" />
                <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-[#FF6B35] rounded-full shadow-lg shadow-[#FF6B35]/50 animate-pulse" />
                <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-[#FF6B35] rounded-full shadow-lg shadow-[#FF6B35]/50 animate-pulse" style={{ animationDelay: '0.3s' }} />
                <div className="absolute top-2/3 left-1/2 w-3 h-3 bg-[#FF6B35] rounded-full shadow-lg shadow-[#FF6B35]/50 animate-pulse" style={{ animationDelay: '0.6s' }} />
              </div>
              <div className="absolute -bottom-8 -right-4 bg-[#FF6B35] text-white rounded-xl p-4 shadow-xl">
                <div className="text-3xl font-bold">{countries.length}+</div>
                <div className="text-sm">Countries Served</div>
              </div>
            </div>
          </div>

          {/* Country list */}
          <div className="space-y-3">
            {displayed.length > 0 ? (
              displayed.map((country, i) => (
                <div
                  key={country.id}
                  className="group flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-[#FF6B35]/10 border border-white/10 transition-all duration-300 cursor-pointer hover:translate-x-2"
                >
                  {country.flag && (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 shrink-0 ring-2 ring-white/20 group-hover:ring-[#FF6B35]/50 transition-all">
                      {country.flag.startsWith('http') ? (
                        <Image src={country.flag} alt={getCountryName(country.name)} width={40} height={40} className="object-cover w-full h-full rounded-full" />
                      ) : (
                        <span className="text-2xl" role="img">{country.flag}</span>
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white group-hover:text-[#FF6B35] transition-colors">{getCountryName(country.name)}</h4>
                    <p className="text-sm text-gray-400">{country.offices?.length || 0} {(country.offices?.length || 0) === 1 ? 'Office' : 'Offices'}</p>
                  </div>
                  <ArrowRight size={20} className="text-gray-400 group-hover:text-[#FF6B35] group-hover:translate-x-1 transition-all" />
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <MapPin size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No service areas available</p>
              </div>
            )}
            {hasMore && onViewAllClick && (
              <button
                onClick={onViewAllClick}
                className="w-full mt-6 px-6 py-4 bg-[#FF6B35] hover:bg-[#E55A24] text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <span>View All Locations</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-300 mb-6">Don&apos;t see your country? We&apos;re constantly expanding our reach.</p>
          <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-300 border border-white/20 backdrop-blur-sm">
            Contact Us About Expansion
          </button>
        </div>
      </div>
    </section>
  )
}
