import type { BlockTypeDefinition } from '../types';

export const testimonialDef: BlockTypeDefinition = {
  type: 'testimonial',
  label: 'Testimonial Section',
  icon: 'Quote',
  content: [
    { name: 'heading', type: 'text', label: 'Heading' },
    { name: 'subheading', type: 'text', label: 'Subheading' },
  ],
  elements: {
    label: 'Testimonial',
    fields: [
      { name: 'image', type: 'image', label: 'Photo', size: '100x100' },
      { name: 'name', type: 'text', label: 'Name', required: true },
      { name: 'designation', type: 'text', label: 'Designation' },
      { name: 'feedback', type: 'textarea', label: 'Feedback', required: true },
      {
        name: 'star',
        type: 'select',
        label: 'Rating',
        options: [
          { label: '1 Star', value: '1' },
          { label: '2 Stars', value: '2' },
          { label: '3 Stars', value: '3' },
          { label: '4 Stars', value: '4' },
          { label: '5 Stars', value: '5' },
        ],
      },
    ],
  },
};
