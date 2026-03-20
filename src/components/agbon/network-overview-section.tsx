import { AgbonSectionTitle } from '@/components/agbon/section-title';
import { getNamedIcon } from '@/components/blocks/content-helpers';

interface NetworkStat {
  value: string;
  label: string;
  caption?: string;
}

interface AgbonNetworkOverviewSectionProps {
  sectionSubtitle?: string;
  sectionTitle?: string;
  description?: string;
  backgroundImage?: string;
  stats?: NetworkStat[];
}

const defaultStats: NetworkStat[] = [
  { value: '15+', label: 'Active Countries', caption: 'Across Africa' },
  { value: '75+', label: 'Distribution Points', caption: 'Strategic Locations' },
  { value: '24/7', label: 'Customer Support', caption: 'Always Available' },
];

export function AgbonNetworkOverviewSection({
  sectionSubtitle = 'Connections That Matter',
  sectionTitle = 'Our Distribution Network',
  description = 'Empowering farmers across Africa with reliable machinery and unwavering support',
  backgroundImage = '/primary_pattern.webp',
  stats = defaultStats,
}: AgbonNetworkOverviewSectionProps) {
  const resolvedStats = stats.length > 0 ? stats : defaultStats;

  return (
    <section className="px">
      <div className="max-w-3xl mb-6">
        <AgbonSectionTitle
          align="left"
          title={sectionTitle}
          className="mb-0"
          subTitle={sectionSubtitle}
          iconSrc="/icons/agric.png"
          iconAlt="Rice Plant Icon"
          subtitleTextColor="text-[#7A5C00]"
        />
        <p className="text-base md:text-lg text-gray-600 mt-2">{description}</p>
      </div>

      <div className="relative bg-gradient-to-r from-green-700 via-green-600 to-green-800 text-white p-4 md:p-12 rounded-2xl shadow-2xl overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.03]"
          style={{ backgroundImage: `url("${backgroundImage}")` }}
        />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
          {resolvedStats.map((stat, index) => (
            <div key={`${stat.label}-${index}`} className="space-y-1">
              <p className="text-4xl md:text-6xl font-black mb-0 bg-clip-text text-transparent bg-gradient-to-b from-white to-green-100">
                {stat.value}
              </p>
              <p className="text-lg md:text-2xl font-semibold">{stat.label}</p>
              {stat.caption ? (
                <p className="text-sm md:text-base text-green-100 opacity-90">{stat.caption}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
