import Image from 'next/image'
import React from 'react'

const steps = [
  {
    number: '1',
    title: 'Search For The Equipment You Need',
    description: "Browse our extensive catalogue to find the agricultural equipment that fits your needs. Filter by category, specifications, or use the search bar.",
    image: '/images/how-it-works/step1-search.svg',
    imageAlt: 'Search interface showing equipment search',
    position: 'right' as const,
  },
  {
    number: '2',
    title: 'Find The Equipment And Order It Online',
    description: "Once you've found what you need, contact us directly or submit an inquiry. Our team will respond quickly with pricing and availability.",
    image: '/images/how-it-works/step2-order.svg',
    imageAlt: 'Equipment details page with order button',
    position: 'left' as const,
  },
  {
    number: '3',
    title: 'Get The Equipment Shipped To Your Location',
    description: "We handle logistics to deliver your agricultural machinery safely and on time. Our after-sales team ensures you get the most out of your equipment.",
    image: '/images/how-it-works/step3-delivery.svg',
    imageAlt: 'Heavy machinery being delivered',
    position: 'right' as const,
  },
]

function ProcessStep({ step, index }: { step: (typeof steps)[0]; index: number }) {
  const isEven = index % 2 === 0

  return (
    <div className="relative">
      {index < steps.length - 1 && (
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-20 md:-bottom-32 w-full max-w-[600px] h-32 md:h-48 pointer-events-none z-0">
          <svg className="w-full h-full" viewBox="0 0 600 200" fill="none">
            <path
              d={isEven ? 'M 50 20 Q 300 120, 550 20' : 'M 550 20 Q 300 120, 50 20'}
              stroke="#FFC72C" strokeWidth="3" strokeDasharray="8 8" fill="none" opacity="0.4"
            />
            <path
              d={isEven ? 'M 550 20 L 540 15 M 550 20 L 540 25' : 'M 50 20 L 60 15 M 50 20 L 60 25'}
              stroke="#FFC72C" strokeWidth="3" fill="none" opacity="0.6"
            />
          </svg>
        </div>
      )}
      <div className={`flex flex-col ${step.position === 'right' ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12 mb-20 md:mb-32`}>
        <div className={`flex-1 ${step.position === 'right' ? 'md:text-left' : 'md:text-right'} text-center space-y-4`}>
          <div className={`flex items-center gap-4 ${step.position === 'right' ? 'justify-center md:justify-start' : 'justify-center md:justify-end'}`}>
            <span className="text-6xl md:text-7xl font-bold bg-gradient-to-br from-[#FF6B35] to-[#FFC72C] bg-clip-text text-transparent drop-shadow-lg">
              {step.number}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] max-w-xs">{step.title}</h3>
          </div>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
            {step.description}
          </p>
        </div>
        <div className="flex-1 relative">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#FF6B35]/20 via-[#FFC72C]/20 to-[#FF6B35]/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-white group-hover:scale-105 transition-transform duration-300">
              <Image
                src={step.image}
                alt={step.imageAlt}
                width={500}
                height={400}
                className="w-full h-auto object-cover"
              />
              {index === 1 && (
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AgbonHowItWorksSection() {
  return (
    <section className="relative w-full py-16 md:py-24 bg-gradient-to-b from-white via-[#fef9f3] to-white overflow-hidden">
      <div className="absolute top-20 left-0 w-96 h-96 bg-gradient-to-br from-[#FF6B35]/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-gradient-to-tl from-[#FFC72C]/5 to-transparent rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1a1a1a]">HOW DOES IT WORK</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#FF6B35] to-[#FFC72C] mx-auto rounded-full" />
        </div>
        <div className="space-y-8">
          {steps.map((step, index) => (
            <ProcessStep key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
