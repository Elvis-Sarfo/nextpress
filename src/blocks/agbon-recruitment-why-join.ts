import { AgbonRecruitmentWhyJoinBlock } from '@/components/blocks/AgbonRecruitmentWhyJoinBlock';
import { defineBlock } from '@/core/blocks/define';

export const agbonRecruitmentWhyJoinBlock = defineBlock({
  name: 'agbon-recruitment-why-join',
  label: 'Agbon Recruitment Why Join',
  category: 'content',
  icon: 'BriefcaseBusiness',
  definition: {
    content: [
      { name: 'subTitle', type: 'text', label: 'Section Subtitle' },
      { name: 'title', type: 'text', label: 'Section Title' },
      { name: 'leadText', type: 'textarea', label: 'Lead Text' },
      { name: 'bodyHtml', type: 'richtext', label: 'Body Content' },
      { name: 'imageSrc', type: 'image', label: 'Image' },
      { name: 'imageAlt', type: 'text', label: 'Image Alt Text' },
      { name: 'badgeOne', type: 'text', label: 'Badge One' },
      { name: 'badgeTwo', type: 'text', label: 'Badge Two' },
      { name: 'iconSrc', type: 'image', label: 'Heading Icon' },
    ],
  },
  component: AgbonRecruitmentWhyJoinBlock,
});
