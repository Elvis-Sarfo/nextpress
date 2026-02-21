import type { BlockTypeDefinition } from '../types';

export const serviceDef: BlockTypeDefinition = {
  type: 'service',
  label: 'Service Section',
  icon: 'Star',
  content: [
    { name: 'heading', type: 'text', label: 'Heading' },
    { name: 'subheading', type: 'text', label: 'Subheading' },
    { name: 'description', type: 'textarea', label: 'Description' },
  ],
  elements: {
    label: 'Service Item',
    fields: [
      { name: 'image', type: 'image', label: 'Icon/Image', size: '100x100' },
      { name: 'name', type: 'text', label: 'Name', required: true },
      { name: 'description', type: 'textarea', label: 'Description' },
    ],
  },
};
