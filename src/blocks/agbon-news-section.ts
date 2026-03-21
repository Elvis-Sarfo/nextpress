import { AgbonNewsSectionBlock } from '@/components/blocks/AgbonNewsSectionBlock';
import { defineBlock } from '@/core/blocks/define';

export const agbonNewsSectionBlock = defineBlock({
  name: 'agbon-news-section',
  label: 'Agbon News Section',
  category: 'content',
  icon: 'Newspaper',
  definition: {
    content: [
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'subtitle', type: 'text', label: 'Subtitle' },
      { name: 'itemsPerPage', type: 'number', label: 'Items Per Page' },
    ],
    dataSource: {
      collection: 'news',
      defaultParams: {
        limit: 3,
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' },
      },
      fields: [
        { name: 'limit', type: 'number', label: 'Fetch Limit', default: 3, scope: 'root' },
      ],
    },
  },
  component: AgbonNewsSectionBlock,
});
