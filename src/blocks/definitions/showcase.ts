import type { BlockTypeDefinition } from '../types';

export const showcaseDef: BlockTypeDefinition = {
  type: 'showcase',
  label: 'Showcase Section',
  icon: 'Layers',
  content: [
    { name: 'heading', type: 'text', label: 'Heading' },
    { name: 'subheading', type: 'text', label: 'Subheading' },
  ],
  elements: {
    label: 'Showcase Item',
    fields: [
      { name: 'tab_name', type: 'text', label: 'Tab Name', required: true },
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'description', type: 'textarea', label: 'Description' },
      { name: 'button_text', type: 'text', label: 'Button Text' },
      { name: 'button_link', type: 'text', label: 'Button Link' },
      { name: 'background_image', type: 'image', label: 'Background Image', size: '1920x1080' },
      { name: 'mobile_background_image', type: 'image', label: 'Mobile Background Image', size: '750x1334' },
    ],
  },
};
