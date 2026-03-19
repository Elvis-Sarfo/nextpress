import { AgbonPartnershipOpportunitiesBlock } from '@/components/blocks/AgbonPartnershipOpportunitiesBlock';
import { defineBlock } from '@/core/blocks/define';

export const agbonPartnershipOpportunitiesSectionBlock = defineBlock({
  name: 'agbon-partnership-opportunities-section',
  label: 'Agbon Partnership Opportunities Section',
  category: 'content',
  icon: 'Handshake',
  definition: {
    content: [
      { name: 'sectionSubtitle', type: 'text', label: 'Section Subtitle' },
      { name: 'sectionTitle', type: 'text', label: 'Section Title' },
      { name: 'description', type: 'textarea', label: 'Description' },
    ],
    elements: {
      label: 'Opportunity Card',
      fields: [
        { name: 'title', type: 'text', label: 'Title', required: true },
        { name: 'description', type: 'textarea', label: 'Description', required: true },
        { name: 'image', type: 'image', label: 'Image', required: true },
        { name: 'fromColor', type: 'text', label: 'Gradient From' },
        { name: 'toColor', type: 'text', label: 'Gradient To' },
      ],
    },
  },
  component: AgbonPartnershipOpportunitiesBlock,
});
