import { AgbonSectionTitle } from '@/components/agbon/section-title';

interface PartnershipCard {
  title: string;
  description: string;
  image: string;
  fromColor?: string;
  toColor?: string;
}

interface AgbonPartnershipOpportunitiesSectionProps {
  sectionSubtitle?: string;
  sectionTitle?: string;
  description?: string;
  cards?: PartnershipCard[];
}

const defaultCards: PartnershipCard[] = [
  {
    title: 'Distribution Partners',
    description: 'Expand your portfolio with premium agricultural machinery',
    image: '/images/section/partnership/distro.png',
    fromColor: '#2563eb',
    toColor: '#60a5fa',
  },
  {
    title: 'Financial Partners',
    description: 'Enable farmers with flexible financing solutions',
    image: '/images/section/partnership/financial_institutions.png',
    fromColor: '#9333ea',
    toColor: '#c084fc',
  },
  {
    title: 'Government & NGO Partners',
    description: 'Drive agricultural mechanization initiatives nationwide',
    image: '/images/section/partnership/government_ngo.png',
    fromColor: '#d97706',
    toColor: '#fbbf24',
  },
  {
    title: 'Training & Technical Partners',
    description: 'Empower communities with knowledge and expertise',
    image: '/images/section/partnership/technical_people_2.png',
    fromColor: '#0d9488',
    toColor: '#2dd4bf',
  },
];

export function AgbonPartnershipOpportunitiesSection({
  sectionSubtitle = 'Growth Through Collaboration',
  sectionTitle = 'Partnership Opportunities',
  description = 'Join us in transforming African agriculture through strategic collaboration',
  cards = defaultCards,
}: AgbonPartnershipOpportunitiesSectionProps) {
  const resolvedCards = cards.length > 0 ? cards : defaultCards;

  return (
    <section className="max-w-[90rem] mx-auto px-4 md:px-8 py-8 md:py-14">
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

      <div className="grid md:grid-cols-2 gap-6">
        {resolvedCards.map((card, index) => (
          <div
            key={`${card.title}-${index}`}
            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
          >
            <div
              className="aspect-video relative overflow-hidden"
              style={{
                background: `linear-gradient(to bottom right, ${card.fromColor ?? '#2563eb'}, ${card.toColor ?? '#60a5fa'})`,
              }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: `url("${card.image}")` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">{card.title}</h3>
                <p className="text-sm md:text-base text-white/85">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
