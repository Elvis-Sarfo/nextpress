import { AgbonPageBannerBlock } from '@/components/blocks/AgbonSectionBlocks';
import { defineBlock } from '@/core/blocks/define';

export const agbonBrandIntroductionBannerBlock = defineBlock({
  name: 'agbon-brand-introduction-banner',
  label: 'Agbon Brand Introduction Banner',
  category: 'layout',
  icon: 'PanelsTopLeft',
  definition: {
    content: [
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'subTitle', type: 'text', label: 'Subtitle' },
      { name: 'backgroundImage', type: 'image', label: 'Background Image' },
    ],
  },
  component: AgbonPageBannerBlock,
});
