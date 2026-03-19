import { MapPin } from 'lucide-react';
import { getNamedIcon } from '@/components/blocks/content-helpers';

interface PresenceStat {
  value: string;
  label: string;
  icon?: string;
}

interface AgbonBrandPresenceSectionProps {
  badge?: string;
  title?: string;
  description?: string;
  watermarkImage?: string;
  regionsTitle?: string;
  regions?: string[];
  stats?: PresenceStat[];
}

const defaultStats: PresenceStat[] = [
  { value: '8+', label: 'African Countries', icon: 'globe' },
  { value: '50K+', label: 'Happy Farmers', icon: 'users' },
  { value: '120+', label: 'Dealer Network', icon: 'mapPin' },
  { value: '24/7', label: 'Support Available', icon: 'award' },
];

const defaultRegions = ['West Africa', 'East Africa', 'Central Africa'];

export function AgbonBrandPresenceSection({
  badge = 'Continental Impact',
  title = 'Our Global Presence',
  description = 'From West Africa to East Africa, AGBON machines are empowering farmers and transforming agriculture across the continent',
  watermarkImage = '/african_map.png',
  regionsTitle = 'Key Operating Regions',
  regions = defaultRegions,
  stats = defaultStats,
}: AgbonBrandPresenceSectionProps) {
  const resolvedStats = stats.length > 0 ? stats : defaultStats;
  const resolvedRegions = regions.length > 0 ? regions : defaultRegions;

  return (
    <section className="max-w-[90rem]">
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("${watermarkImage}")`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B35]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E55A24]/20 rounded-full blur-3xl" />

        <div className="relative z-10 p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2">
                <MapPin className="text-[#FF6B35]" size={18} />
                <span className="text-white font-semibold text-sm md:text-base">{badge}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white">{title}</h2>
              <p className="text-white/80 text-base md:text-xl max-w-3xl mx-auto">{description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {resolvedStats.map((stat, index) => {
                const Icon = getNamedIcon(stat.icon);
                return (
                  <div
                    key={`${stat.label}-${index}`}
                    className="bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-2xl p-4 md:p-6 text-center flex flex-col items-center justify-center"
                  >
                    <Icon className="text-[#FF6B35] mb-3" size={28} />
                    <div className="text-2xl md:text-4xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-xs md:text-sm text-white/75 font-semibold leading-tight">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-8">
              <h3 className="text-lg md:text-2xl font-bold text-white mb-6 text-center">{regionsTitle}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {resolvedRegions.map((region, index) => (
                  <div
                    key={`${region}-${index}`}
                    className="flex items-center justify-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10 text-center"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#FF6B35] shrink-0" />
                    <span className="text-white font-semibold text-sm md:text-base">{region}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
