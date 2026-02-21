import type { BlockTypeDefinition } from '../types';

export const aboutDef: BlockTypeDefinition = {
  type: 'about',
  label: 'About Us Section',
  icon: 'Info',
  content: [
    { name: 'image', type: 'image', label: 'Image', size: '1270x990' },
    { name: 'heading', type: 'text', label: 'Heading' },
    { name: 'subheading', type: 'text', label: 'Subheading' },
    { name: 'description', type: 'richtext', label: 'Description' },
  ],
};
