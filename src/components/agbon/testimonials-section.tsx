import Image from 'next/image'
import { Star } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  image: string
  rating: number
  quote: string
  country?: string
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Kwame Mensah',
    role: 'Farm Owner',
    company: 'Golden Harvest Farms',
    image: '/placeholder-user.jpg',
    rating: 5,
    quote: 'AGBON agricultural equipment has transformed our farming operations. The quality and reliability are exceptional, and their after-sales service is outstanding.',
    country: 'Ghana',
  },
  {
    id: '2',
    name: 'Amara Okafor',
    role: 'Agricultural Director',
    company: 'Green Valley Agriculture',
    image: '/placeholder-user.jpg',
    rating: 5,
    quote: 'Working with AGBON has been a game-changer for our cooperative. Their machinery is durable and perfectly suited for African farming conditions.',
    country: 'Nigeria',
  },
  {
    id: '3',
    name: 'Jean-Pierre Dubois',
    role: 'Plantation Manager',
    company: 'Ivory Cacao Plantations',
    image: '/placeholder-user.jpg',
    rating: 5,
    quote: "The efficiency gains from AGBON equipment have increased our productivity by 40%. Excellent investment for any serious agricultural operation.",
    country: "Côte d'Ivoire",
  },
]

interface TestimonialsSectionProps {
  testimonials?: Testimonial[]
  title?: string
  subtitle?: string
}

export function AgbonTestimonialsSection({
  testimonials = defaultTestimonials,
  title = 'What Our Customers Say',
  subtitle = 'Trusted by farmers and agricultural businesses across Africa',
}: TestimonialsSectionProps) {
  return (
    <section className="relative py-12 md:py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-orange-50/30 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B35' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">{title}</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#FF6B35] to-orange-300" />
              <div className="absolute top-4 right-4 text-[#FF6B35]/10 text-6xl font-serif leading-none">&ldquo;</div>
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ring-2 ring-[#FF6B35]/20">
                  <Image src={t.image} alt={t.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#1a1a1a] text-sm md:text-base truncate">{t.name}</h4>
                  <p className="text-xs text-gray-600 truncate">{t.role}</p>
                  <p className="text-xs text-[#FF6B35] font-semibold truncate">{t.company}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-[#FF6B35] text-[#FF6B35]" />
                ))}
              </div>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
              {t.country && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="inline-flex items-center text-xs text-gray-500">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {t.country}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Join hundreds of satisfied customers across Africa</p>
          <button className="px-6 py-3 bg-[#FF6B35] hover:bg-[#E55A24] text-white font-semibold rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg">
            Start Your Journey
          </button>
        </div>
      </div>
    </section>
  )
}
