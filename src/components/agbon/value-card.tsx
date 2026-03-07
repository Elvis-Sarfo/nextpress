import React from 'react'

// Color map for Tailwind color values to actual CSS colors
const colorMap: Record<string, string> = {
  'emerald-100': '#d1fae5', 'emerald-400': '#34d399', 'emerald-600': '#059669', 'emerald-900': '#064e3b',
  '[#FF6B35]': '#FF6B35', '[#E55A24]': '#E55A24',
  'orange-100': '#ffedd5', 'orange-400': '#fb923c', 'orange-600': '#ea580c', 'orange-900': '#7c2d12',
  'blue-100': '#dbeafe', 'blue-400': '#60a5fa', 'blue-600': '#2563eb', 'blue-900': '#1e3a8a',
  'purple-100': '#f3e8ff', 'purple-400': '#c084fc', 'purple-600': '#9333ea', 'purple-900': '#581c87',
  'amber-100': '#fef3c7', 'amber-400': '#fbbf24', 'amber-600': '#d97706', 'amber-900': '#78350f',
  'teal-100': '#ccfbf1', 'teal-400': '#2dd4bf', 'teal-600': '#0d9488', 'teal-900': '#134e4a',
  'rose-100': '#ffe4e6', 'rose-400': '#fb7185', 'rose-600': '#e11d48', 'rose-900': '#881337',
  'red-100': '#fee2e2', 'red-400': '#f87171', 'red-600': '#dc2626', 'red-900': '#7f1d1d',
}

const getColor = (key: string): string => colorMap[key] || key

interface ValueCardProps {
  title: string
  description: string
  icon: React.ReactNode
  backgroundImage?: string
  gradientFrom?: string
  gradientTo?: string
  overlayFrom?: string
  textAccentColor?: string
  height?: string
  className?: string
}

export function AgbonValueCard({
  title,
  description,
  icon,
  backgroundImage = '/agricultural-tractor-machinery.jpg',
  gradientFrom = 'emerald-600',
  gradientTo = 'emerald-400',
  overlayFrom = 'emerald-900',
  textAccentColor = 'emerald-100',
  height = 'h-auto min-h-32 sm:min-h-40 md:min-h-48 lg:min-h-52',
  className = '',
}: ValueCardProps) {
  const fromColor = getColor(gradientFrom)
  const toColor = getColor(gradientTo)
  const overlayColor = getColor(overlayFrom)

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ${height} ${className}`}
    >
      <div
        className="relative overflow-hidden h-full"
        style={{ background: `linear-gradient(to bottom right, ${fromColor}, ${toColor})` }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5 group-hover:scale-110 transition-transform duration-700"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${overlayColor}cc, ${overlayColor}4d, transparent)`,
          }}
        />
        <div className="relative h-full flex flex-col justify-end p-2 md:p-6 text-white">
          <div className="mb-2 md:mb-3 inline-block">{icon}</div>
          <h3 className="text-lg font-bold mb-1 md:mb-2">{title}</h3>
          <p className="text-sm opacity-90" style={{ color: getColor(textAccentColor) }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

export const valueCardPresets = {
  emerald: { gradientFrom: 'emerald-600', gradientTo: 'emerald-400', overlayFrom: 'emerald-900', textAccentColor: 'emerald-100' },
  orange: { gradientFrom: '[#FF6B35]', gradientTo: '[#E55A24]', overlayFrom: 'orange-900', textAccentColor: 'orange-100' },
  blue: { gradientFrom: 'blue-600', gradientTo: 'blue-400', overlayFrom: 'blue-900', textAccentColor: 'blue-100' },
  purple: { gradientFrom: 'purple-600', gradientTo: 'purple-400', overlayFrom: 'purple-900', textAccentColor: 'purple-100' },
  amber: { gradientFrom: 'amber-600', gradientTo: 'amber-400', overlayFrom: 'amber-900', textAccentColor: 'amber-100' },
  teal: { gradientFrom: 'teal-600', gradientTo: 'teal-400', overlayFrom: 'teal-900', textAccentColor: 'teal-100' },
  rose: { gradientFrom: 'rose-600', gradientTo: 'rose-400', overlayFrom: 'rose-900', textAccentColor: 'rose-100' },
}
