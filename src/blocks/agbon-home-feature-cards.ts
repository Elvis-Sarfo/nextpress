import { AgbonHomeFeatureCardsBlock } from '@/components/blocks/AgbonSectionBlocks';
import { defineBlock } from '@/core/blocks/define';

export const agbonHomeFeatureCardsBlock = defineBlock({
  name: 'agbon-home-feature-cards',
  label: 'Agbon Home Feature Cards',
  category: 'content',
  icon: 'LayoutGrid',
  definition: {
    elements: {
      label: 'Card',
      fields: [
        { name: 'image', type: 'image', label: 'Image' },
        { name: 'title', type: 'text', label: 'Title', required: true },
        { name: 'description', type: 'textarea', label: 'Description' },
        { name: 'ctaText', type: 'text', label: 'CTA Text' },
        { name: 'ctaLink', type: 'text', label: 'CTA Link' },
      ],
    },
  },
  component: AgbonHomeFeatureCardsBlock,
});
