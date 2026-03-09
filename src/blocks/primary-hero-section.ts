import { PrimaryHeroSectionBlock } from '@/components/blocks/PrimaryHeroSectionBlock';
import { defineBlock } from '@/core/blocks/define';

export const primaryHeroSectionBlock = defineBlock({
  name: 'primary-hero-section',
  label: 'Primary Hero Section',
  category: 'layout',
  icon: 'PanelsTopLeft',
  definition: {
    elements: {
      label: 'Slide',
      fields: [
        { name: 'title', type: 'text', label: 'Title', required: true },
        { name: 'subtitle', type: 'textarea', label: 'Subtitle' },
        { name: 'imageUrl', type: 'image', label: 'Desktop Image' },
        { name: 'mobileImageUrl', type: 'image', label: 'Mobile Image' },
        { name: 'videoUrl', type: 'text', label: 'Video URL' },
        { name: 'ctaText', type: 'text', label: 'CTA Text' },
        { name: 'ctaLink', type: 'text', label: 'CTA Link' },
        {
          name: 'desktopAlignment',
          type: 'select',
          label: 'Desktop Alignment',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
        {
          name: 'desktopVerticalPosition',
          type: 'select',
          label: 'Desktop Vertical Position',
          options: [
            { label: 'Top', value: 'top' },
            { label: 'Center', value: 'center' },
            { label: 'Bottom', value: 'bottom' },
          ],
        },
        {
          name: 'mobileAlignment',
          type: 'select',
          label: 'Mobile Alignment',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
        {
          name: 'mobileVerticalPosition',
          type: 'select',
          label: 'Mobile Vertical Position',
          options: [
            { label: 'Top', value: 'top' },
            { label: 'Center', value: 'center' },
            { label: 'Bottom', value: 'bottom' },
          ],
        },
        {
          name: 'textColor',
          type: 'select',
          label: 'Text Color',
          options: [
            { label: 'White', value: 'white' },
            { label: 'Black', value: 'black' },
            { label: 'Orange', value: 'orange' },
          ],
        },
        { name: 'overlayOpacity', type: 'number', label: 'Overlay Opacity' },
      ],
    },
  },
  component: PrimaryHeroSectionBlock,
});
