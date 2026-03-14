import { ProductCategorySidebarBlock } from '@/components/blocks/ProductCategorySidebarBlock';
import { defineBlock } from '@/core/blocks/define';

export const productCategorySidebarBlock = defineBlock({
  name: 'product-category-sidebar',
  label: 'Product Category Sidebar',
  category: 'catalogue',
  icon: 'PanelLeft',
  definition: {
    content: [
      {
        name: 'showSearchButton',
        type: 'toggle',
        label: 'Show Search Button',
      },
      {
        name: 'compactOnMobile',
        type: 'toggle',
        label: 'Compact On Mobile',
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
