import { AgbonNetworkOverviewBlock } from '@/components/blocks/AgbonNetworkOverviewBlock';
import { defineBlock } from '@/core/blocks/define';

export const agbonNetworkOverviewSectionBlock = defineBlock({
  name: 'agbon-network-overview-section',
  label: 'Agbon Network Overview Section',
  category: 'content',
  icon: 'Network',
  definition: {
    content: [
      { name: 'sectionSubtitle', type: 'text', label: 'Section Subtitle' },
      { name: 'sectionTitle', type: 'text', label: 'Section Title' },
      { name: 'description', type: 'textarea', label: 'Description' },
      { name: 'backgroundImage', type: 'image', label: 'Background Image' },
    ],
    elements: {
      label: 'Stat',
      fields: [
        { name: 'value', type: 'text', label: 'Value', required: true },
        { name: 'label', type: 'text', label: 'Label', required: true },
        { name: 'caption', type: 'text', label: 'Caption' },
      ],
    },
  },
  component: AgbonNetworkOverviewBlock,
});
