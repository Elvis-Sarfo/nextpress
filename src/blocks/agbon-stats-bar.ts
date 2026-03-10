import { AgbonStatsBarBlock } from '@/components/blocks/AgbonSectionBlocks';
import { defineBlock } from '@/core/blocks/define';

export const agbonStatsBarBlock = defineBlock({
  name: 'agbon-stats-bar',
  label: 'Agbon Stats Bar',
  category: 'content',
  icon: 'ChartNoAxesColumn',
  definition: {
    content: [
      { name: 'backgroundImage', type: 'image', label: 'Background Image' },
    ],
  },
  component: AgbonStatsBarBlock,
});
