import { AgbonSectionTitle } from '@/components/agbon/section-title';
import { AgbonValueCard } from '@/components/agbon/value-card';
import { getNamedIcon } from '@/components/blocks/content-helpers';

interface ValueItem {
  title: string;
  description: string;
  icon?: string;
  backgroundImage?: string;
  gradientFrom?: string;
  gradientTo?: string;
  overlayFrom?: string;
  textAccentColor?: string;
}

interface AgbonBrandValuesSectionProps {
  sectionSubtitle?: string;
  sectionTitle?: string;
  description?: string;
  iconSrc?: string;
  values?: ValueItem[];
}

const defaultValues: ValueItem[] = [
  {
    title: 'Transform Agriculture',
    description: 'Modernizing farming practices across Africa',
    icon: 'sparkles',
    backgroundImage: '/primary_pattern.webp',
    gradientFrom: '[#FF6B35]',
    gradientTo: '[#E55A24]',
    overlayFrom: 'orange-900',
    textAccentColor: 'orange-100',
  },
  {
    title: 'Innovation & Impact',
    description: 'Cutting-edge solutions for real-world agricultural challenges',
    icon: 'award',
    backgroundImage: '/primary_pattern.webp',
    gradientFrom: '[#FF6B35]',
    gradientTo: '[#E55A24]',
    overlayFrom: 'orange-900',
    textAccentColor: 'orange-100',
  },
  {
    title: 'Collaborative Culture',
    description: 'Work with passionate, mission-driven individuals',
    icon: 'users',
    backgroundImage: '/primary_pattern.webp',
    gradientFrom: '[#FF6B35]',
    gradientTo: '[#E55A24]',
    overlayFrom: 'orange-900',
    textAccentColor: 'orange-100',
  },
];

export function AgbonBrandValuesSection({
  sectionSubtitle = 'What Drives Us',
  sectionTitle = 'Our Core Values',
  description = 'The principles that guide every decision we make and every product we deliver',
  iconSrc = '/icons/agric.png',
  values = defaultValues,
}: AgbonBrandValuesSectionProps) {
  const resolvedValues = values.length > 0 ? values : defaultValues;

  return (
    <section className="relative overflow-hidden py-10 md:py-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-50 via-white to-gray-50" />
      <div
        className="absolute inset-0 -z-10 opacity-5"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #FF6B35 0px, #FF6B35 10px, transparent 10px, transparent 20px)',
        }}
      />

      <div className="max-w-[90rem] mx-auto space-y-4">
        <div className="text-center space-y-3">
          <AgbonSectionTitle
            subTitle={sectionSubtitle}
            title={sectionTitle}
            iconSrc={iconSrc}
            iconAlt="Values icon"
            align="center"
            subtitleTextColor="text-[#7A5C00]"
            showSubtitleIcons={false}
          />
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">{description}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resolvedValues.map((value, index) => {
            const Icon = getNamedIcon(value.icon);
            return (
              <AgbonValueCard
                key={`${value.title}-${index}`}
                title={value.title}
                description={value.description}
                backgroundImage={value.backgroundImage}
                gradientFrom={value.gradientFrom}
                gradientTo={value.gradientTo}
                overlayFrom={value.overlayFrom}
                textAccentColor={value.textAccentColor}
                icon={<Icon className="w-10 h-10" />}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
