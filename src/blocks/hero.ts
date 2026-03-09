import { defineBlock } from './define';
import { HeroBlock } from '@/components/blocks/HeroBlock';

export const heroManifest = defineBlock({
  type: 'hero',
  label: 'Hero',
  icon: 'LayoutTemplate',
  definition: {
    content: [
      { name: 'heading', type: 'text', label: 'Heading' },
      { name: 'subheading', type: 'text', label: 'Subheading' },
      { name: 'ctaText', type: 'text', label: 'CTA Button Text' },
      { name: 'ctaLink', type: 'text', label: 'CTA Button Link' },
      { name: 'backgroundImage', type: 'image', label: 'Background Image', size: '1920x1080' },
      {
        name: 'alignment',
        type: 'radio',
        label: 'Text Alignment',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ],
      },
    ],
  },
  component: HeroBlock,
});
