import { AgbonBrandValuesBlock } from '@/components/blocks/AgbonBrandValuesBlock';
import { defineBlock } from '@/core/blocks/define';

export const agbonBrandValuesSectionBlock = defineBlock({
  name: 'agbon-brand-values-section',
  label: 'Agbon Brand Values Section',
  category: 'content',
  icon: 'Gem',
  definition: {
    content: [
      { name: 'sectionSubtitle', type: 'text', label: 'Section Subtitle' },
      { name: 'sectionTitle', type: 'text', label: 'Section Title' },
      { name: 'description', type: 'textarea', label: 'Section Description' },
      { name: 'iconSrc', type: 'image', label: 'Section Icon' },
    ],
    elements: {
      label: 'Value Card',
      fields: [
        { name: 'title', type: 'text', label: 'Title', required: true },
        { name: 'description', type: 'textarea', label: 'Description', required: true },
        { name: 'icon', type: 'icon', label: 'Icon Name' },
        { name: 'backgroundImage', type: 'image', label: 'Background Image' },
        { name: 'gradientFrom', type: 'text', label: 'Gradient From' },
        { name: 'gradientTo', type: 'text', label: 'Gradient To' },
        { name: 'overlayFrom', type: 'text', label: 'Overlay Color' },
        { name: 'textAccentColor', type: 'text', label: 'Text Accent Color' },
      ],
    },
  },
  component: AgbonBrandValuesBlock,
});
