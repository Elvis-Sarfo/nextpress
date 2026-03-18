import { AgbonCommitmentSectionBlock } from '@/components/blocks/AgbonSectionBlocks';
import { defineBlock } from '@/core/blocks/define';

export const agbonCommitmentSectionBlock = defineBlock({
  name: 'agbon-commitment-section',
  label: 'Agbon Commitment Section',
  category: 'content',
  icon: 'BadgeCheck',
  definition: {
    content: [
      { name: 'subtitle', type: 'text', label: 'Subtitle' },
      { name: 'heading', type: 'text', label: 'Heading' },
      { name: 'description', type: 'textarea', label: 'Description' },
      { name: 'ctaText', type: 'text', label: 'CTA Text' },
      { name: 'ctaLink', type: 'text', label: 'CTA Link' },
      { name: 'image', type: 'image', label: 'Image' },
    ],
    elements: {
      label: 'Feature',
      fields: [
        { name: 'icon', type: 'icon', label: 'Icon Name' },
        { name: 'label', type: 'text', label: 'Label', required: true },
      ],
    },
  },
  component: AgbonCommitmentSectionBlock,
});
