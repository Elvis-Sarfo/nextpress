import { AgbonPageBannerBlock } from '@/components/blocks/AgbonSectionBlocks';
import { defineBlock } from '@/core/blocks/define';

export const agbonAfterSalesServiceBannerBlock = defineBlock({
  name: 'agbon-after-sales-service-banner',
  label: 'Agbon After Sales Service Banner',
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
