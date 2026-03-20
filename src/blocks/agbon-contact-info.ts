import { AgbonContactInfoBlock } from '@/components/blocks/AgbonSectionBlocks';
import { defineBlock } from '@/core/blocks/define';

export const agbonContactInfoBlock = defineBlock({
  name: 'agbon-contact-info',
  label: 'Agbon Contact Info',
  category: 'contact',
  icon: 'MessageSquareMore',
  definition: {
    content: [
      { name: 'badge', type: 'text', label: 'Badge' },
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'subtitle', type: 'text', label: 'Subtitle' },
      { name: 'description', type: 'textarea', label: 'Description' },
      { name: 'email', type: 'text', label: 'Email' },
      { name: 'phone', type: 'text', label: 'Phone' },
      { name: 'address', type: 'textarea', label: 'Address' },
    ],
  },
  component: AgbonContactInfoBlock,
});
