import { defineBlock } from './define';
import { GalleryBlock } from '@/components/blocks/GalleryBlock';

export const galleryManifest = defineBlock({
  type: 'gallery',
  label: 'Gallery',
  icon: 'Images',
  definition: {
    elements: {
      label: 'Gallery Image',
      fields: [
        { name: 'image', type: 'image', label: 'Image' },
        { name: 'caption', type: 'text', label: 'Caption' },
      ],
    },
  },
  component: GalleryBlock,
});
