import Image from 'next/image'
import { ReactNode, CSSProperties } from 'react'

interface BreakPageSectionProps {
  children?: ReactNode
  bgColor?: string
  className?: string
  style?: CSSProperties
  topBorderImagePath?: string
  topBorderHeight?: string
  topBorderTopOffset?: string
  bgImage?: string
  tornEdgeImagePath?: string
  height?: string
  showBorderImage?: boolean
}

export function AgbonBreakPageSection({
  children,
  bgColor = '#FFC72C',
  className = '',
  style = {},
  showBorderImage = true,
  topBorderImagePath = '/item/grass-5.png',
  topBorderHeight = '100px',
  topBorderTopOffset = '-60px',
  bgImage = '/item/tractor1.png',
  tornEdgeImagePath = '/item/torn-edge.png',
  height = '400px',
}: BreakPageSectionProps) {
  return (
    <section
      className={`relative w-full overflow-visible flex items-end ${className}`}
      style={{ height, backgroundColor: bgColor, ...style }}
    >
      {showBorderImage && (
        <div
          className="absolute left-0 w-full z-10"
          style={{ top: topBorderTopOffset, height: topBorderHeight }}
        >
          <Image
            src={topBorderImagePath}
            alt="Top border"
            width={1920}
            height={48}
            unoptimized
            className="w-full h-full object-none object-top-left select-none pointer-events-none"
            priority
          />
        </div>
      )}
      <div className="absolute bottom-0 right-0 w-1/2 xs:w-1/3 max-w-[160px] xs:max-w-[200px] sm:max-w-[260px] md:max-w-[340px] h-3/4 xs:h-4/5 md:h-full flex items-end z-20 pointer-events-none select-none">
        <Image src={bgImage} alt="Decoration" fill className="object-contain object-bottom" />
      </div>
      <div className="absolute -bottom-2 left-0 w-full h-12 xs:h-8 sm:h-10 md:h-[60px] z-30">
        <Image src={tornEdgeImagePath} alt="Torn paper edge" fill className="object-cover object-bottom" />
      </div>
      <div className="relative z-40 w-full h-full flex items-center justify-center">{children}</div>
    </section>
  )
}
