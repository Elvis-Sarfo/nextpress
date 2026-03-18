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
      { name: 'footerText', type: 'text', label: 'Footer Text', required: false },
      { name: 'footerCtaText', type: 'text', label: 'Footer CTA Text', required: false },
      { name: 'footerCtaLink', type: 'text', label: 'Footer CTA Link', required: false },
    ],
    elements: {
      label: 'Testimonial',
      fields: [
        { name: 'name', type: 'text', label: 'Name', required: true },
        { name: 'role', type: 'text', label: 'Role', required: true },
        { name: 'company', type: 'text', label: 'Company', required: true },
        { name: 'image', type: 'image', label: 'Image' },
        { name: 'rating', type: 'number', label: 'Rating' },
        { name: 'quote', type: 'textarea', label: 'Quote', required: true },
        { name: 'country', type: 'text', label: 'Country' },
      ],
    },
  },
  component: AgbonTestimonialsSectionBlock,
});
