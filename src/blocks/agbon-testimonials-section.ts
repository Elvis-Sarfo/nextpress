import { AgbonTestimonialsSectionBlock } from '@/components/blocks/AgbonTestimonialsSectionBlock'
import { defineBlock } from '@/core/blocks/define'

export const agbonTestimonialsSectionBlock = defineBlock({
  name: 'agbon-testimonials-section',
  label: 'Agbon Testimonials Section',
  category: 'content',
  icon: 'Quote',
  definition: {
    content: [
      { name: 'title', type: 'text', label: 'Title', required: false },
      { name: 'subtitle', type: 'text', label: 'Subtitle', required: false },
      { name: 'testimonials', type: 'textarea', label: 'Testimonials JSON', required: false },
    ],
  },
  component: AgbonTestimonialsSectionBlock,
})
