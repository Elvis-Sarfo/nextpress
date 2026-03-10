import { AgbonTestimonialStatsSectionBlock } from '@/components/blocks/AgbonSectionBlocks';
import { defineBlock } from '@/core/blocks/define';

export const agbonTestimonialStatsSectionBlock = defineBlock({
  name: 'agbon-testimonial-stats-section',
  label: 'Agbon Testimonial Stats Section',
  category: 'content',
  icon: 'MessageSquareQuote',
  definition: {},
  component: AgbonTestimonialStatsSectionBlock,
});
