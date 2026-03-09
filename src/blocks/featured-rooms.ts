import { defineBlock } from './define';
import { FeaturedRoomsBlock } from '@/components/blocks/FeaturedRoomsBlock';

export const featuredRoomsManifest = defineBlock({
  type: 'featured_rooms',
  label: 'Featured Rooms',
  icon: 'BedDouble',
  definition: {
    content: [
      { name: 'heading', type: 'text', label: 'Heading' },
      { name: 'subheading', type: 'text', label: 'Subheading' },
      { name: 'description', type: 'text', label: 'Description' },
    ],
    elements: {
      label: 'Room',
      fields: [
        { name: 'image', type: 'image', label: 'Image', size: '800x600' },
        { name: 'name', type: 'text', label: 'Name', required: true },
        { name: 'description', type: 'textarea', label: 'Description' },
      ],
    },
  },
  component: FeaturedRoomsBlock,
});
