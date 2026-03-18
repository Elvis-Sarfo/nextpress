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
    elements: {
      label: 'Stat',
      fields: [
        { name: 'icon', type: 'icon', label: 'Icon Name' },
        { name: 'value', type: 'text', label: 'Value', required: true },
        { name: 'label', type: 'text', label: 'Label', required: true },
      ],
    },
  },
  component: AgbonStatsBarBlock,
});
