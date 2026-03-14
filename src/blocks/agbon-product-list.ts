import { AgbonProductListBlock } from '@/components/blocks/AgbonProductListBlock';
import { defineBlock } from '@/core/blocks/define';

export const agbonProductListBlock = defineBlock({
  name: 'agbon-product-list',
  label: 'Agbon Product List',
  category: 'catalogue',
  icon: 'LayoutGrid',
  definition: {
    content: [
      {
        name: 'itemsPerPage',
        type: 'number',
        label: 'Items Per Page',
      },
      {
        name: 'gridColumns',
        type: 'select',
        label: 'Grid Columns',
        options: [
          { label: '2 / 3 / 4', value: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' },
          { label: '1 / 2 / 3', value: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' },
          { label: '2 / 2 / 3', value: 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3' },
          { label: '2 / 4 / 4', value: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-4' },
        ],
      },
      {
        name: 'showHeader',
        type: 'toggle',
        label: 'Show Header',
      },
      {
        name: 'title',
        type: 'text',
        label: 'Fallback Title',
      },
      {
        name: 'showPagination',
        type: 'toggle',
        label: 'Show Pagination',
      },
      {
        name: 'showFeatured',
        type: 'toggle',
        label: 'Show Featured Products',
      },
      {
        name: 'featuredTitle',
        type: 'text',
        label: 'Featured Section Title',
      },
    ],
    dataSource: {
      collection: 'products',
      defaultParams: {
        limit: 100,
        orderBy: { order: 'asc' },
      },
      fields: [],
    },
  },
  component: AgbonProductListBlock,
});
