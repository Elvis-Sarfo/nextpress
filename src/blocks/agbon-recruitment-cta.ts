import { AgbonRecruitmentCtaBlock } from '@/components/blocks/AgbonRecruitmentCtaBlock';
import { defineBlock } from '@/core/blocks/define';

export const agbonRecruitmentCtaBlock = defineBlock({
  name: 'agbon-recruitment-cta',
  label: 'Agbon Recruitment CTA',
  category: 'content',
  icon: 'Send',
  definition: {
    content: [
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'description', type: 'richtext', label: 'Description' },
      { name: 'ctaText', type: 'text', label: 'CTA Text' },
      { name: 'ctaLink', type: 'text', label: 'CTA Link' },
      { name: 'backgroundImage', type: 'image', label: 'Background Image' },
      { name: 'backgroundImageAlt', type: 'text', label: 'Background Image Alt Text' },
    ],
  },
  component: AgbonRecruitmentCtaBlock,
});
