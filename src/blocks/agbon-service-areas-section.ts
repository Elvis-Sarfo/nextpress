import { AgbonServiceAreasSectionBlock } from '@/components/blocks/AgbonSectionBlocks';
import { defineBlock } from '@/core/blocks/define';

export const agbonServiceAreasSectionBlock = defineBlock({
  name: 'agbon-service-areas-section',
  label: 'Agbon Service Areas Section',
  category: 'content',
  icon: 'MapPinned',
  definition: {
    content: [
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'subtitle', type: 'textarea', label: 'Subtitle' },
    ],
  },
  component: AgbonServiceAreasSectionBlock,
});
