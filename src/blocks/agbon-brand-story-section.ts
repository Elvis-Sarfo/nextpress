import { AgbonBrandStoryBlock } from '@/components/blocks/AgbonBrandStoryBlock';
import { defineBlock } from '@/core/blocks/define';

export const agbonBrandStorySectionBlock = defineBlock({
  name: 'agbon-brand-story-section',
  label: 'Agbon Brand Story Section',
  category: 'content',
  icon: 'BookOpen',
  definition: {
    content: [
      { name: 'sectionSubtitle', type: 'text', label: 'Section Subtitle' },
      { name: 'sectionTitle', type: 'text', label: 'Section Title' },
      { name: 'iconSrc', type: 'image', label: 'Section Icon' },
      { name: 'paragraphOne', type: 'textarea', label: 'Paragraph One' },
      { name: 'paragraphTwo', type: 'textarea', label: 'Paragraph Two' },
      { name: 'autoPlayMs', type: 'number', label: 'Slider Auto Play (ms)' },
    ],
    elements: {
      label: 'Story Item',
      fields: [
        {
          name: 'kind',
          type: 'select',
          label: 'Item Type',
          required: true,
          options: [
            { label: 'Slide', value: 'slide' },
            { label: 'Highlight', value: 'highlight' },
          ],
        },
        { name: 'image', type: 'image', label: 'Slide Image' },
        { name: 'alt', type: 'text', label: 'Slide Alt Text' },
        { name: 'label', type: 'text', label: 'Highlight Label' },
        { name: 'value', type: 'text', label: 'Highlight Value' },
      ],
    },
  },
  component: AgbonBrandStoryBlock,
});
