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
      { name: 'backgroundImage', type: 'image', label: 'Background Image' },
      { name: 'mapImage', type: 'image', label: 'Map Image' },
      { name: 'statLabel', type: 'text', label: 'Stats Label' },
      { name: 'emptyMessage', type: 'text', label: 'Empty State Message' },
      { name: 'footerText', type: 'textarea', label: 'Footer Text' },
      { name: 'footerCtaText', type: 'text', label: 'Footer CTA Text' },
      { name: 'footerCtaLink', type: 'text', label: 'Footer CTA Link' },
    ],
    elements: {
      label: 'Service Area',
      fields: [
        { name: 'name', type: 'text', label: 'Country Name', required: true },
        { name: 'flag', type: 'text', label: 'Flag Emoji or Image URL' },
        { name: 'officesCount', type: 'number', label: 'Offices Count' },
      ],
    },
  },
  component: AgbonServiceAreasSectionBlock,
});
