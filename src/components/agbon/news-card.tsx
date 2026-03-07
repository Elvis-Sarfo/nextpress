import Image from 'next/image'
import Link from 'next/link'

export interface AgbonNewsItem {
  id: string
  title: string
  excerpt: string
  image: string
  date: { day: string; month: string }
  url: string
  author?: { name: string; url: string }
  category?: { name: string; url: string }
  commentCount?: number
}

interface NewsCardProps {
  item: AgbonNewsItem
  className?: string
}

export function AgbonNewsCard({ item, className = '' }: NewsCardProps) {
  return (
    <div className={`relative w-full border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <div className="relative overflow-hidden group">
        <div className="relative aspect-[615/522] w-full">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="absolute top-4 left-4 bg-[#FF6B35] text-white text-center px-4 py-2 rounded-lg shadow-lg">
          <div className="text-lg font-bold leading-none">{item.date.day}</div>
          <div className="text-xs mt-1 font-medium">{item.date.month}</div>
        </div>
      </div>
      <div className="text-center p-3">
        <h4 className="text-base font-bold mb-4 text-[#1a1a1a] hover:text-[#FF6B35] transition-colors">
          <Link href={item.url}>{item.title}</Link>
        </h4>
        <p className="text-sm text-gray-600 mb-6 line-clamp-3">{item.excerpt}</p>
        <Link
          href={item.url}
          className="inline-flex items-center gap-2 text-[#FF6B35] font-semibold hover:gap-3 transition-all duration-300 group text-sm"
        >
          <span>Continue Reading</span>
          <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  )
}
