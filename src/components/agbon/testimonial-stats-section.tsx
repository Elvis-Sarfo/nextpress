import Image from 'next/image'

interface AgbonTestimonialStatsSectionProps {
  badge?: string
  title?: string
  quote?: string
  name?: string
  position?: string
  rating?: number
  mainImage?: string
}

export function AgbonTestimonialStatsSection({
  badge = 'Testimonials With Us',
  title = 'What Clients Say?',
  quote = `Having been a host farmer for three seasons, we've seen firsthand the difference this internship makes in beginning farmers and host farms alike. Fresh energy and enthusiasm.`,
  name = 'Christine Rose',
  position = 'Director, Radical Orange Pty Ltd.',
  rating = 5,
  mainImage = '/images/testimonials/home_2.png',
}: AgbonTestimonialStatsSectionProps) {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#fef6f0] via-[#fef9f3] to-[#fefbf7]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6B35]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#FFC72C]/10 rounded-full blur-3xl" />
      </div>

      <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto md:px-4 lg:px-8 py-10 md:py-16 relative z-10 gap-8 md:gap-12">
        <div className="w-full md:w-[45%] flex justify-center md:justify-start">
          <div className="relative w-full max-w-sm md:max-w-md">
            <div className="absolute -inset-3 bg-gradient-to-br from-[#FF6B35]/15 via-[#FFC72C]/15 to-[#FF6B35]/10 rounded-2xl blur-xl opacity-70" />
            <Image
              src={mainImage}
              alt="Happy Farmer"
              width={450}
              height={500}
              className="rounded-xl object-cover w-full h-auto relative z-10 shadow-lg"
            />
          </div>
        </div>

        <div className="w-full md:w-[55%] flex flex-col items-center md:items-start text-center md:text-left">
          <p className="text-xs text-[#2e7d32] font-semibold uppercase tracking-wider mb-2">{badge}</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-6">{title}</h2>

          <p className="text-sm text-gray-700 leading-relaxed italic mb-5 max-w-lg">{quote}</p>

          <div className="flex items-center gap-3 mb-2">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35] to-[#FFC72C] rounded-full opacity-80" />
              <span className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#FF6B35" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" />
                </svg>
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-bold text-[#1a1a1a] uppercase text-xs tracking-wide">{name}</span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: rating }).map((_, i) => (
                  <span key={i} className="text-[#FFC72C] text-base">★</span>
                ))}
              </div>
              <span className="text-xs text-gray-500">{position}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
