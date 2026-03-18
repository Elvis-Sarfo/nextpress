import { ProductCategorySidebarBlock } from '@/components/blocks/ProductCategorySidebarBlock';
import { defineBlock } from '@/core/blocks/define';

export const productCategorySidebarBlock = defineBlock({
  name: 'product-category-sidebar',
  label: 'Catalogue Sidebar',
  category: 'catalogue',
  icon: 'PanelLeft',
  definition: {
    content: [
      {
        name: 'layoutMode',
        type: 'select',
        label: 'Layout Mode',
        options: [
          { label: 'Responsive', value: 'responsive' },
          { label: 'Compact', value: 'compact' },
          { label: 'Standard', value: 'standard' },
        ],
      },
      {
        name: 'searchMode',
        type: 'select',
        label: 'Search Mode',
        options: [
          { label: 'Auto', value: 'auto' },
          { label: 'Dialog', value: 'dialog' },
          { label: 'Inline', value: 'inline' },
        ],
      },
      {
        name: 'showSearch',
        type: 'toggle',
        label: 'Show Search',
      },
      {
        name: 'showAllProducts',
        type: 'toggle',
        label: 'Show All Products',
      },
      {
        name: 'showHotSelling',
        type: 'toggle',
        label: 'Show Hot Selling',
      },
      {
        name: 'showCategoryHeading',
        type: 'toggle',
        label: 'Show Category Heading',
      },
    ],
    dataSource: {
      collection: 'product-categories',
      defaultParams: {
        orderBy: { order: 'asc' },
      },
      fields: [],
    },
  },
  component: ProductCategorySidebarBlock,
});
