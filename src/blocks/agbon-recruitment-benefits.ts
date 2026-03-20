import { AgbonRecruitmentBenefitsBlock } from '@/components/blocks/AgbonRecruitmentBenefitsBlock';
import { defineBlock } from '@/core/blocks/define';

export const agbonRecruitmentBenefitsBlock = defineBlock({
  name: 'agbon-recruitment-benefits',
  label: 'Agbon Recruitment Benefits',
  category: 'content',
  icon: 'Gift',
  definition: {
    content: [
      { name: 'subTitle', type: 'text', label: 'Section Subtitle' },
      { name: 'title', type: 'text', label: 'Section Title' },
      { name: 'description', type: 'textarea', label: 'Section Description' },
      { name: 'iconSrc', type: 'image', label: 'Heading Icon' },
    ],
    elements: {
      label: 'Benefit',
      fields: [
        { name: 'title', type: 'text', label: 'Title', required: true },
        { name: 'description', type: 'textarea', label: 'Description', required: true },
        { name: 'icon', type: 'icon', label: 'Icon' },
        { name: 'backgroundImage', type: 'image', label: 'Background Image' },
        { name: 'gradientFrom', type: 'text', label: 'Gradient From' },
        { name: 'gradientTo', type: 'text', label: 'Gradient To' },
        { name: 'overlayFrom', type: 'text', label: 'Overlay From' },
        { name: 'textAccentColor', type: 'text', label: 'Text Accent Color' },
      ],
    },
  },
  component: AgbonRecruitmentBenefitsBlock,
});
