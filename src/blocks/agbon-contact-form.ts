import { AgbonContactFormBlock } from '@/components/blocks/AgbonSectionBlocks';
import { defineBlock } from '@/core/blocks/define';

export const agbonContactFormBlock = defineBlock({
  name: 'agbon-contact-form',
  label: 'Agbon Contact Form',
  category: 'contact',
  icon: 'Mail',
  definition: {
    content: [
      { name: 'badge', type: 'text', label: 'Badge' },
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'subtitle', type: 'text', label: 'Subtitle' },
      { name: 'description', type: 'textarea', label: 'Description' },
      { name: 'email', type: 'text', label: 'Email' },
      { name: 'phone', type: 'text', label: 'Phone' },
      { name: 'address', type: 'textarea', label: 'Address' },
      { name: 'formTitle', type: 'text', label: 'Form Title' },
      { name: 'successTitle', type: 'text', label: 'Success Title' },
      { name: 'successMessage', type: 'textarea', label: 'Success Message' },
      { name: 'errorTitle', type: 'text', label: 'Error Title' },
      { name: 'submitLabel', type: 'text', label: 'Submit Button Label' },
      { name: 'submittingLabel', type: 'text', label: 'Submitting Label' },
    ],
    elements: {
      label: 'Subject Option',
      fields: [
        { name: 'label', type: 'text', label: 'Label', required: true },
        { name: 'value', type: 'text', label: 'Value', required: true },
      ],
    },
  },
  component: AgbonContactFormBlock,
});
