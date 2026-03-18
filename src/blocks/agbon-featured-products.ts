import { AgbonFeaturedProductsBlock } from '@/components/blocks/AgbonFeaturedProductsBlock';
import { DEFAULT_AGBON_PRODUCT_GRID_COLUMNS } from '@/components/agbon/product-list';
import { defineBlock } from '@/core/blocks/define';

export const agbonFeaturedProductsBlock = defineBlock({
  name: 'agbon-featured-products',
  label: 'Agbon Featured Products',
  category: 'catalogue',
  icon: 'Flame',
  definition: {
    content: [
      {
        name: 'title',
        type: 'text',
        label: 'Section Title',
      },
      {
        name: 'showViewAllButton',
        type: 'toggle',
        label: 'Show View All Button',
      },
      {
        name: 'viewAllLabel',
        type: 'text',
        label: 'View All Label',
      },
      {
        name: 'viewAllHref',
        type: 'text',
        label: 'View All Path',
      },
      {
        name: 'gridColumns',
        type: 'select',
        label: 'Grid Columns',
        options: [
          { label: '2 / 3 / 4', value: DEFAULT_AGBON_PRODUCT_GRID_COLUMNS },
          { label: '1 / 2 / 3', value: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' },
          { label: '2 / 2 / 3', value: 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3' },
          { label: '2 / 4 / 4', value: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-4' },
        ],
      },
    ],
    dataSource: {
      collection: 'products',
      defaultParams: {
        limit: 8,
        where: {
          featured: true,
        },
        orderBy: { order: 'asc' },
      },
      fields: [
        {
          name: 'limit',
          type: 'number',
          label: 'Products Limit',
          default: 8,
          scope: 'root',
        },
        {
          name: 'categoryId',
          type: 'relationship',
          label: 'Category Filter',
          relationTo: 'product-categories',
          scope: 'where',
        },
      ],
    },
  },
  component: AgbonFeaturedProductsBlock,
});
