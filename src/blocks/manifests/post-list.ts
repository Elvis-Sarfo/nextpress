import type { BlockManifest } from '../types';
import { PostListBlock } from '@/components/blocks/PostListBlock';

export const postListManifest: BlockManifest = {
  type: 'post-list',
  label: 'Post List',
  icon: 'List',
  definition: {
    content: [
      { name: 'heading', type: 'text', label: 'Section Heading' },
      {
        name: 'layout',
        type: 'select',
        label: 'Layout',
        options: [
          { label: 'Grid', value: 'grid' },
          { label: 'List', value: 'list' },
        ],
      },
    ],
    dataSource: {
      collection: 'posts',
      defaultParams: {
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' },
      },
      fields: [
        {
          name: 'limit',
          type: 'number',
          label: 'Number of Posts',
          default: 6,
          scope: 'root',
        },
        {
          name: 'categoryId',
          type: 'relationship',
          label: 'Filter by Category',
          relationTo: 'categories',
          scope: 'where',
        },
      ],
    },
  },
  component: PostListBlock,
};
