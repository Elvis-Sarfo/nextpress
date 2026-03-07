import Image from 'next/image'
import React from 'react'

interface SectionTitleProps {
  subTitle?: string
  title: string
  iconSrc?: string
  iconAlt?: string
  icon?: React.ReactNode
  align?: 'left' | 'center' | 'right'
  subtitleTextColor?: string
  titleColor?: string
  className?: string
  headingShapeSrc?: string
  showSubtitleIcons?: boolean
  subtitleLeftIcon?: React.ReactNode
  subtitleRightIcon?: React.ReactNode
  subtitleIconSrc?: string
}

export function AgbonSectionTitle({
  subTitle,
  title,
  iconSrc,
  iconAlt = 'Section Icon',
  icon,
  align = 'left',
  subtitleTextColor = 'text-[#7A5C00]',
  titleColor = 'text-[#1a1a1a]',
  className = '',
  headingShapeSrc,
  showSubtitleIcons = false,
  subtitleLeftIcon,
  subtitleRightIcon,
  subtitleIconSrc,
}: SectionTitleProps) {
  const alignmentClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }
  const labelAlignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  const defaultDecorativeIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#7A5C00]">
      <path
        d="M12 3v18M9 6c0-1.5 1.5-3 3-3s3 1.5 3 3M9 10c0-1.5 1.5-3 3-3s3 1.5 3 3M9 14c0-1.5 1.5-3 3-3s3 1.5 3 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )

  const makeDecorativeIcon = (src?: string, node?: React.ReactNode) =>
    node || (src ? (
      <Image src={src} alt="decoration" width={20} height={20} className="w-5 h-5 object-contain" />
    ) : defaultDecorativeIcon)

  const leftIcon = makeDecorativeIcon(subtitleIconSrc, subtitleLeftIcon)
  const rightIcon = makeDecorativeIcon(subtitleIconSrc, subtitleRightIcon)

  return (
    <div className={`flex flex-col ${alignmentClasses[align]} ${className}`}>
      {(subTitle || iconSrc || icon) && (
        <div className={`flex items-center gap-3 ${labelAlignmentClasses[align]}`}>
          {iconSrc && (
            <Image src={iconSrc} alt={iconAlt} width={32} height={32} className="w-8 h-8 object-contain" />
          )}
          {icon && !iconSrc && icon}
          {subTitle && (
            <div className="flex items-center gap-2">
              {showSubtitleIcons && leftIcon}
              <span className={`${subtitleTextColor} font-semibold text-sm md:text-base tracking-wide`}>
                {subTitle}
              </span>
              {showSubtitleIcons && rightIcon}
            </div>
          )}
        </div>
      )}
      <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold ${titleColor} leading-tight`}>
        {title}
      </h2>
      {headingShapeSrc && (
        <div className={`mb-4 flex ${labelAlignmentClasses[align]}`}>
          <Image src={headingShapeSrc} alt="heading shape" width={70} height={12} />
        </div>
      )}
    </div>
  )
}
