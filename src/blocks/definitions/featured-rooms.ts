import type { BlockTypeDefinition } from '../types';

export const featuredRoomsDef: BlockTypeDefinition = {
  type: 'featured_rooms',
  label: 'Featured Rooms',
  icon: 'BedDouble',
  content: [
    { name: 'heading', type: 'text', label: 'Heading' },
    { name: 'subheading', type: 'text', label: 'Subheading' },
    { name: 'description', type: 'text', label: 'Description' },
  ],
};
