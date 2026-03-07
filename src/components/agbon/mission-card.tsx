import React from 'react'

interface MissionCardProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function AgbonMissionCard({
  title = 'Our Mission',
  children,
  className = '',
}: MissionCardProps) {
  return (
    <div
      className={`rounded-3xl bg-[#5C3700] p-4 xs:p-6 sm:p-8 md:p-12 shadow-lg max-w-3xl mx-auto ${className}`}
    >
      <div className="border border-dashed border-[#FFC72C] rounded-2xl p-4 xs:p-6 sm:p-8 bg-transparent w-full h-full">
        <h3 className="text-center text-[#FFC72C] text-xl xs:text-2xl sm:text-3xl font-bold mb-6">
          {title}
        </h3>
        <div className="text-white text-base xs:text-lg sm:text-xl text-center leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}
