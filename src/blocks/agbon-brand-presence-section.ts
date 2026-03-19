import { AgbonBrandPresenceBlock } from '@/components/blocks/AgbonBrandPresenceBlock';
import { defineBlock } from '@/core/blocks/define';

export const agbonBrandPresenceSectionBlock = defineBlock({
  name: 'agbon-brand-presence-section',
  label: 'Agbon Brand Presence Section',
  category: 'content',
  icon: 'Map',
  definition: {
    content: [
      { name: 'badge', type: 'text', label: 'Badge' },
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'description', type: 'textarea', label: 'Description' },
      { name: 'watermarkImage', type: 'image', label: 'Watermark Image' },
      { name: 'regionsTitle', type: 'text', label: 'Regions Title' },
      { name: 'regionOne', type: 'text', label: 'Region One' },
      { name: 'regionTwo', type: 'text', label: 'Region Two' },
      { name: 'regionThree', type: 'text', label: 'Region Three' },
      { name: 'regionFour', type: 'text', label: 'Region Four' },
      { name: 'regionFive', type: 'text', label: 'Region Five' },
      { name: 'regionSix', type: 'text', label: 'Region Six' },
    ],
    elements: {
      label: 'Presence Stat',
      fields: [
        { name: 'value', type: 'text', label: 'Value', required: true },
        { name: 'label', type: 'text', label: 'Label', required: true },
        { name: 'icon', type: 'icon', label: 'Icon Name' },
      ],
    },
  },
  component: AgbonBrandPresenceBlock,
});
