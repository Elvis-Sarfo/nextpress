import { AgbonSupportCtaBlock } from '@/components/blocks/AgbonSupportCtaBlock';
import { defineBlock } from '@/core/blocks/define';

export const agbonSupportCtaSectionBlock = defineBlock({
  name: 'agbon-support-cta-section',
  label: 'Agbon Support CTA Section',
  category: 'content',
  icon: 'MessageCircleMore',
  definition: {
    content: [
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'description', type: 'textarea', label: 'Description' },
      { name: 'ctaText', type: 'text', label: 'CTA Text' },
      { name: 'ctaLink', type: 'text', label: 'CTA Link' },
      { name: 'backgroundImage', type: 'image', label: 'Background Image' },
    ],
    elements: {
      label: 'Benefit',
      fields: [{ name: 'label', type: 'text', label: 'Label', required: true }],
    },
  },
  component: AgbonSupportCtaBlock,
});
