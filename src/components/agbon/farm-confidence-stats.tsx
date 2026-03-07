import { Tractor, Smile } from 'lucide-react'

export function AgbonFarmConfidenceStats() {
  return (
    <div className="w-full py-4 md:py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 text-center md:text-left">
          <p className="text-2xl md:text-3xl text-[#20512b] font-semibold">
            We are confident that we are the leading farm in providing
            <br className="hidden md:block" />
            agricultural products that ensure{' '}
            <span className="underline font-bold">food hygiene and safety!</span>
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-16">
          <div className="flex flex-row items-center gap-5">
            <div className="bg-[#23823d] rounded-full w-14 h-14 flex items-center justify-center">
              <Tractor size={32} className="text-white" />
            </div>
            <div>
              <div className="text-[#20512b] text-lg font-medium mb-1">Agricultural Products</div>
              <div className="text-3xl md:text-4xl font-extrabold text-[#FFC72C]">1,386+</div>
            </div>
          </div>
          <div className="flex flex-row items-center gap-5">
            <span className="bg-[#23823d] rounded-full w-14 h-14 flex items-center justify-center">
              <Smile size={32} className="text-white" />
            </span>
            <div>
              <div className="text-[#20512b] text-lg font-medium mb-1">Trust By Clients</div>
              <div className="text-3xl md:text-4xl font-extrabold text-[#FFC72C]">12,980+</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
