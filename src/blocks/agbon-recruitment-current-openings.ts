import { AgbonRecruitmentCurrentOpeningsBlock } from '@/components/blocks/AgbonRecruitmentCurrentOpeningsBlock';
import { defineBlock } from '@/core/blocks/define';

export const agbonRecruitmentCurrentOpeningsBlock = defineBlock({
  name: 'agbon-recruitment-current-openings',
  label: 'Agbon Recruitment Current Openings',
  category: 'content',
  icon: 'ClipboardList',
  definition: {
    content: [
      { name: 'subTitle', type: 'text', label: 'Section Subtitle' },
      { name: 'title', type: 'text', label: 'Section Title' },
      { name: 'iconSrc', type: 'image', label: 'Heading Icon' },
      { name: 'requirementsHeading', type: 'text', label: 'Requirements Heading' },
      { name: 'applyButtonLabel', type: 'text', label: 'Default Apply Button Label' },
      { name: 'applyButtonLink', type: 'text', label: 'Default Apply Button Link' },
      { name: 'emptyMessage', type: 'text', label: 'Empty State Message' },
    ],
    dataSource: {
      collection: 'jobs',
      defaultParams: {
        limit: 12,
        where: { status: 'active' },
        orderBy: { order: 'asc' },
      },
      fields: [
        {
          name: 'limit',
          type: 'number',
          label: 'Jobs Limit',
          default: 12,
          scope: 'root',
        },
        {
          name: 'employmentType',
          type: 'select',
          label: 'Employment Type Filter',
          options: [
            { label: 'All Types', value: '' },
            { label: 'Full-time', value: 'Full-time' },
            { label: 'Part-time', value: 'Part-time' },
            { label: 'Contract', value: 'Contract' },
            { label: 'Internship', value: 'Internship' },
            { label: 'Remote', value: 'Remote' },
          ],
          scope: 'where',
        },
      ],
    },
  },
  component: AgbonRecruitmentCurrentOpeningsBlock,
});
