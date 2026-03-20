import Image from 'next/image';
import type { CSSProperties } from 'react';
import { Building2, MapPin, TrendingUp } from 'lucide-react';

interface BusinessMapCountry {
  id: string;
  name: string;
  officesCount?: number;
}

interface MarkerPosition {
  top: string;
  left: string;
  delay?: string;
}

interface BusinessMapImageProps {
  countries?: BusinessMapCountry[];
  mapImageSrc?: string;
  mapImageAlt?: string;
  className?: string;
  badgeText?: string;
  title?: string;
  description?: string;
  countriesLabel?: string;
  officesLabel?: string;
  growthValue?: string;
  growthLabel?: string;
  activeMarketsLabel?: string;
  expandingLabel?: string;
  markerPositions?: MarkerPosition[];
  mapCardOffsetTop?: string;
}

const defaultMarkerPositions: MarkerPosition[] = [
  { top: '25%', left: '48%', delay: '0s' },
  { top: '35%', left: '42%', delay: '0.2s' },
  { top: '45%', left: '52%', delay: '0.4s' },
  { top: '55%', left: '58%', delay: '0.6s' },
  { top: '70%', left: '48%', delay: '0.8s' },
  { top: '38%', left: '65%', delay: '1s' },
];

export function BusinessMapImage({
  countries = [],
  mapImageSrc = '/african_map.png',
  mapImageAlt = 'Business Map',
  className = '',
  badgeText = 'Our Global Presence',
  title = 'Expanding Across Africa',
  description,
  countriesLabel = 'Countries',
  officesLabel = 'Offices',
  growthValue = '100%',
  growthLabel = 'Growth',
  activeMarketsLabel = 'Active Markets',
  expandingLabel = 'Expanding',
  markerPositions = defaultMarkerPositions,
  mapCardOffsetTop = '11rem',
}: BusinessMapImageProps) {
  const totalOffices = countries.reduce((sum, country) => sum + (country.officesCount || 0), 0);
  const resolvedDescription =
    description ??
    `Building partnerships and delivering quality agricultural equipment to farmers in ${countries.length}+ countries`;
  const resolvedMarkers = markerPositions.length > 0 ? markerPositions : defaultMarkerPositions;

  return (
    <section className={`relative z-20 py-6 md:py-8 px-4 overflow-visible bg-transparent ${className}`}>
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6B35]/10 rounded-full mb-4">
                <MapPin size={16} className="text-[#FF6B35]" />
                <span className="text-caption font-semibold text-[#FF6B35]">{badgeText}</span>
              </div>
              <h2 className="text-hero font-bold mb-4 text-gray-900">{title}</h2>
              <p className="text-subheading text-gray-600">{resolvedDescription}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MapPin className="text-[#FF6B35]" size={20} />
                  <span className="text-feature font-bold text-gray-900">{countries.length}+</span>
                </div>
                <p className="text-caption text-gray-600 text-center">{countriesLabel}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Building2 className="text-[#FF6B35]" size={20} />
                  <span className="text-feature font-bold text-gray-900">{totalOffices}+</span>
                </div>
                <p className="text-caption text-gray-600 text-center">{officesLabel}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="text-[#FF6B35]" size={20} />
                  <span className="text-feature font-bold text-gray-900">{growthValue}</span>
                </div>
                <p className="text-caption text-gray-600 text-center">{growthLabel}</p>
              </div>
            </div>
          </div>

          <div className="relative z-30">
            <div
              className="relative z-30 lg:-mt-[var(--business-map-offset-top)]"
              style={{ '--business-map-offset-top': mapCardOffsetTop } as CSSProperties}
            >
              <div className="relative z-30 w-full h-[450px] sm:h-[700px] md:h-[600px] lg:aspect-square max-w-2xl mx-auto bg-linear-to-br from-white to-gray-50 rounded-3xl p-2 sm:p-4 md:p-8 shadow-2xl border border-gray-200/50 overflow-visible bg-[white]">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF6B35]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#B8D4E8]/10 rounded-full blur-3xl" />

                <div className="relative w-full h-full z-10">
                  <Image
                    src={mapImageSrc}
                    alt={mapImageAlt}
                    fill
                    className="object-contain drop-shadow-2xl scale-[1.16] sm:scale-145 md:scale-110 lg:scale-115"
                  />
                </div>

                {/* {resolvedMarkers.map((marker, index) => (
                  <div
                    key={`marker-${index}`}
                    className="absolute w-3 h-3 bg-[#FF6B35] rounded-full shadow-lg shadow-[#FF6B35]/50 animate-pulse z-10"
                    style={{
                      top: marker.top,
                      left: marker.left,
                      animationDelay: marker.delay ?? `${index * 0.2}s`,
                    }}
                  />
                ))} */}

                <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-gray-200/50 z-10">
                  <div className="text-feature font-bold text-[#FF6B35] mb-1">
                    {countries.length}+
                  </div>
                  <div className="text-caption text-gray-600 font-medium">{activeMarketsLabel}</div>
                  <div className="mt-2 flex items-center gap-1 text-caption text-green-600">
                    <TrendingUp size={12} />
                    <span>{expandingLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
