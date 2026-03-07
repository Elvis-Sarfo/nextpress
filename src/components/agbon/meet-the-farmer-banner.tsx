import Link from 'next/link'

export function AgbonMeetTheFarmerBanner() {
  return (
    <section className="relative w-full min-h-[400px] flex items-center justify-center overflow-visible bg-[#f7f4ef]">
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/images/section/light_gen.png"
          alt="Farmers at work"
          className="w-full h-full object-cover object-center"
          draggable={false}
        />
      </div>
      <div className="absolute inset-0 bg-black/10 z-10" />
      <div
        className="absolute top-1/2 left-4 md:left-[6vw] z-20 max-w-3xl w-[90vw] md:w-[50vw] -translate-y-1/3 bg-[#16512b] rounded-3xl px-8 py-10 md:py-14 flex flex-col items-start shadow-xl"
        style={{ boxShadow: '0 8px 32px 0 rgba(44, 32, 12, 0.18)' }}
      >
        <div className="flex items-center gap-3 mb-2">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 4v8M16 20v8M4 16h8M20 16h8" stroke="#FFC72C" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="text-[#FFC72C] text-sm md:text-base lg:text-lg font-bold">
            Meet The Farmer
          </span>
        </div>
        <h2 className="text-white text-lg md:text-2xl lg:text-3xl xl:text-4xl font-extrabold mb-4 leading-tight">
          We Are Dedicated Farmers!
        </h2>
        <p className="text-[#e6f4ea] text-xs md:text-sm lg:text-base mb-6 max-w-2xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales faucibus commodo.
          Proin vehicula massa id congue rutrum, ex libero sodales ex, cursus euismod purus.
        </p>
        <Link href="/farmers" className="mt-2 text-sm md:text-base lg:text-lg font-semibold text-white group inline-block">
          <span className="border-b-2 border-[#FFC72C] pb-0.5 group-hover:border-white transition-colors">
            View All The Farmers
          </span>
        </Link>
        <svg className="absolute right-8 bottom-6 w-32 h-20 opacity-10 pointer-events-none" viewBox="0 0 160 100" fill="none">
          <path d="M20 80 Q60 20 140 60" stroke="#FFC72C" strokeWidth="2" fill="none" />
          <ellipse cx="120" cy="70" rx="18" ry="8" fill="#FFC72C" fillOpacity=".2" />
        </svg>
      </div>
    </section>
  )
}
