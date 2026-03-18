import { AgbonTestimonialStatsSectionBlock } from '@/components/blocks/AgbonSectionBlocks';
import { defineBlock } from '@/core/blocks/define';

export const agbonTestimonialStatsSectionBlock = defineBlock({
  name: 'agbon-testimonial-stats-section',
  label: 'Agbon Testimonial Stats Section',
  category: 'content',
  icon: 'MessageSquareQuote',
  definition: {
    content: [
      { name: 'badge', type: 'text', label: 'Badge' },
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'quote', type: 'textarea', label: 'Quote' },
      { name: 'name', type: 'text', label: 'Customer Name' },
      { name: 'position', type: 'text', label: 'Customer Role / Company' },
      { name: 'rating', type: 'number', label: 'Rating' },
      { name: 'mainImage', type: 'image', label: 'Main Image' },
    ],
  },
  component: AgbonTestimonialStatsSectionBlock,
});
