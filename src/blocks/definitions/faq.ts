import type { BlockTypeDefinition } from '../types';

export const faqDef: BlockTypeDefinition = {
  type: 'faq',
  label: 'FAQ Section',
  icon: 'HelpCircle',
  content: [
    { name: 'heading', type: 'text', label: 'Heading' },
    { name: 'subheading', type: 'text', label: 'Subheading' },
    { name: 'description', type: 'text', label: 'Description' },
  ],
  elements: {
    label: 'FAQ Item',
    fields: [
      { name: 'question', type: 'text', label: 'Question', required: true },
      { name: 'answer', type: 'textarea', label: 'Answer', required: true },
    ],
  },
};
