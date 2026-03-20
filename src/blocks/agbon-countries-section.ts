import { AgbonCountriesSectionBlock } from '@/components/blocks/AgbonCountriesSectionBlock';
import { defineBlock } from '@/core/blocks/define';

export const agbonCountriesSectionBlock = defineBlock({
  name: 'agbon-countries-section',
  label: 'Agbon Countries Section',
  category: 'content',
  icon: 'MapPinned',
  definition: {
    content: [
      { name: 'subTitle', type: 'text', label: 'Section Subtitle' },
      { name: 'title', type: 'text', label: 'Section Title' },
      { name: 'showSearch', type: 'toggle', label: 'Show Search' },
      { name: 'searchPlaceholder', type: 'text', label: 'Search Placeholder' },
      { name: 'searchNoResultsTemplate', type: 'text', label: 'Search No Results Template' },
      { name: 'noResultsMessage', type: 'text', label: 'No Results Message' },
      { name: 'emptyMessage', type: 'text', label: 'Empty State Message' },
      { name: 'officesHeading', type: 'text', label: 'Offices Heading' },
      { name: 'headquartersBadgeLabel', type: 'text', label: 'HQ Badge Label' },
      { name: 'moreOfficesTemplate', type: 'text', label: 'More Offices Template' },
      {
        name: 'columns',
        type: 'select',
        label: 'Desktop Columns',
        options: [
          { label: '1 Column', value: '1' },
          { label: '2 Columns', value: '2' },
          { label: '3 Columns', value: '3' },
        ],
      },
    ],
    elements: {
      label: 'Country Card',
      fields: [
        { name: 'name', type: 'text', label: 'Country Name', required: true },
        { name: 'flag', type: 'text', label: 'Flag Emoji' },
        { name: 'description', type: 'textarea', label: 'Description' },
        { name: 'color', type: 'text', label: 'Accent Color Hex' },
        { name: 'backgroundImage', type: 'image', label: 'Background Image' },
        { name: 'officesJson', type: 'textarea', label: 'Offices JSON' },
      ],
    },
  },
  component: AgbonCountriesSectionBlock,
});
