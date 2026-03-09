import { defineBlock } from './define';
import { AboutBlock } from '@/components/blocks/AboutBlock';

export const aboutManifest = defineBlock({
  type: 'about',
  label: 'About Us Section',
  icon: 'Info',
  definition: {
    content: [
      { name: 'image', type: 'image', label: 'Image', size: '1270x990' },
      { name: 'heading', type: 'text', label: 'Heading' },
      { name: 'subheading', type: 'text', label: 'Subheading' },
      { name: 'description', type: 'richtext', label: 'Description' },
    ],
  },
  component: AboutBlock,
});
