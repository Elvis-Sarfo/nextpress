import { AgbonRecruitmentApplicationProcessBlock } from '@/components/blocks/AgbonRecruitmentApplicationProcessBlock';
import { defineBlock } from '@/core/blocks/define';

export const agbonRecruitmentApplicationProcessBlock = defineBlock({
  name: 'agbon-recruitment-application-process',
  label: 'Agbon Recruitment Application Process',
  category: 'content',
  icon: 'Workflow',
  definition: {
    content: [
      { name: 'subTitle', type: 'text', label: 'Section Subtitle' },
      { name: 'title', type: 'text', label: 'Section Title' },
    ],
    elements: {
      label: 'Step',
      fields: [
        { name: 'title', type: 'text', label: 'Step Title', required: true },
        { name: 'description', type: 'textarea', label: 'Step Description', required: true },
      ],
    },
  },
  component: AgbonRecruitmentApplicationProcessBlock,
});
