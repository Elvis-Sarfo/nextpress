import { getNamedIcon, resolveItems } from '@/components/blocks/content-helpers'

interface AgbonStatsBarProps {
  locale?: string
  className?: string
  backgroundImage?: string
  stats?: Array<{ id: string; icon?: string; value: string; label: string }>
}

export function AgbonStatsBar({
  className = '',
  backgroundImage = '/images/section/light_gen.png',
  stats = [],
}: AgbonStatsBarProps) {
  const defaultStats = [
    { id: '1', icon: 'tractor', value: '2,500+', label: 'Machines Delivered' },
    { id: '2', icon: 'wheat', value: '20,000+', label: 'Farmers Empowered' },
    { id: '3', icon: 'globe', value: '15', label: 'African Countries' },
    { id: '4', icon: 'package', value: '100%', label: 'Local Support' },
  ]
  const resolvedStats = resolveItems(stats.filter((item) => item.value && item.label), defaultStats)

  return (
    <div className={`relative w-full py-8 md:py-12 overflow-hidden ${className}`}>
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#5C3A00]/90 via-[#6b4a1b]/85 to-[#5C3A00]/90" />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-2 md:flex md:flex-row justify-center items-center gap-4 md:gap-0 px-4">
        {resolvedStats.map((stat, idx) => {
          const Icon = getNamedIcon(stat.icon)
          return (
          <div
            key={stat.id || idx}
            className="flex flex-col items-center flex-1 px-2 md:px-8 border-b md:border-b-0 md:border-r border-[#8d6e3f]/40 last:border-none md:last:border-none py-3 md:py-0"
          >
            <div className="mb-1 md:mb-2 flex items-center justify-center">
              <Icon size={32} stroke="#FFC72C" className="md:w-12 md:h-12" />
            </div>
            <span className="text-2xl md:text-3xl font-bold text-[#FFC72C] mb-0.5 md:mb-1">{stat.value}</span>
            <span className="text-sm text-white font-medium text-center">{stat.label}</span>
          </div>
        )})}
      </div>
    </div>
  )
}
