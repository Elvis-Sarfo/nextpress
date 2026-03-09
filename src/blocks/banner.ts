import { defineBlock } from './define';
import { BannerBlock } from '@/components/blocks/BannerBlock';

export const bannerManifest = defineBlock({
  type: 'banner',
  label: 'Banner Section',
  icon: 'Image',
  definition: {
    content: [
      { name: 'heading', type: 'text', label: 'Heading' },
      { name: 'subheading', type: 'text', label: 'Subheading' },
      { name: 'image', type: 'image', label: 'Desktop Image', size: '3800x1630' },
      { name: 'mobile_image', type: 'image', label: 'Mobile Image', size: '750x1334' },
      { name: 'height', type: 'text', label: 'Height (CSS value, e.g. 600px)' },
      {
        name: 'background_type',
        type: 'radio',
        label: 'Background Type',
        options: [
          { label: 'Image', value: 'image' },
          { label: 'Video', value: 'video' },
        ],
      },
      { name: 'video', type: 'text', label: 'Video URL (desktop)' },
      { name: 'mobile_video', type: 'text', label: 'Video URL (mobile)' },
      { name: 'autoplay', type: 'toggle', label: 'Autoplay' },
      { name: 'loop', type: 'toggle', label: 'Loop' },
      { name: 'muted', type: 'toggle', label: 'Muted' },
      { name: 'show_overlay', type: 'toggle', label: 'Show Overlay' },
      { name: 'overlay_opacity', type: 'number', label: 'Overlay Opacity (0–100)' },
      { name: 'show_scroll_button', type: 'toggle', label: 'Show Scroll Button' },
    ],
  },
  component: BannerBlock,
});
