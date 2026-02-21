import type { BlockTypeDefinition } from '../types';

export const subscribeDef: BlockTypeDefinition = {
  type: 'subscribe',
  label: 'Subscribe Section',
  icon: 'Bell',
  content: [
    { name: 'heading', type: 'text', label: 'Heading' },
    { name: 'button_title', type: 'text', label: 'Button Title' },
  ],
};
