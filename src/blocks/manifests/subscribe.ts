import type { BlockManifest } from '../types';
import { SubscribeBlock } from '@/components/blocks/SubscribeBlock';

export const subscribeManifest: BlockManifest = {
  type: 'subscribe',
  label: 'Subscribe Section',
  icon: 'Bell',
  definition: {
    content: [
      { name: 'heading', type: 'text', label: 'Heading' },
      { name: 'button_title', type: 'text', label: 'Button Title' },
    ],
  },
  component: SubscribeBlock,
};
