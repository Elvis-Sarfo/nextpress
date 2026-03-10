import { AgbonContactFormBlock } from '@/components/blocks/AgbonSectionBlocks';
import { defineBlock } from '@/core/blocks/define';

export const agbonContactFormBlock = defineBlock({
  name: 'agbon-contact-form',
  label: 'Agbon Contact Form',
  category: 'contact',
  icon: 'Mail',
  definition: {
    content: [
      { name: 'email', type: 'text', label: 'Email' },
      { name: 'phone', type: 'text', label: 'Phone' },
      { name: 'address', type: 'textarea', label: 'Address' },
    ],
  },
  component: AgbonContactFormBlock,
});
