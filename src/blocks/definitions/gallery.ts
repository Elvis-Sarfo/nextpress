import type { BlockTypeDefinition } from '../types';

export const galleryDef: BlockTypeDefinition = {
  type: 'gallery',
  label: 'Gallery',
  icon: 'Images',
  elements: {
    label: 'Gallery Image',
    fields: [
      { name: 'image', type: 'image', label: 'Image' },
      { name: 'caption', type: 'text', label: 'Caption' },
    ],
  },
};
