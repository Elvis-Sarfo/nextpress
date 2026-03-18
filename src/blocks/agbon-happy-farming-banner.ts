import { AgbonHappyFarmingBannerBlock } from '@/components/blocks/AgbonSectionBlocks';
import { defineBlock } from '@/core/blocks/define';

export const agbonHappyFarmingBannerBlock = defineBlock({
  name: 'agbon-happy-farming-banner',
  label: 'Agbon Happy Farming Banner',
  category: 'marketing',
  icon: 'BadgePlus',
  definition: {
    content: [
      { name: 'tagline', type: 'text', label: 'Tagline' },
      { name: 'heading', type: 'text', label: 'Heading' },
      { name: 'subtext', type: 'textarea', label: 'Subtext' },
      { name: 'ctaText', type: 'text', label: 'CTA Text' },
      { name: 'ctaLink', type: 'text', label: 'CTA Link' },
      { name: 'image', type: 'image', label: 'Banner Image' },
    ],
  },
  component: AgbonHappyFarmingBannerBlock,
});
