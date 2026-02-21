import type { BlockTypeDefinition } from '../types';

export const contactDef: BlockTypeDefinition = {
  type: 'contact',
  label: 'Contact Us',
  icon: 'Mail',
  content: [
    { name: 'heading', type: 'text', label: 'Heading' },
    { name: 'description', type: 'text', label: 'Description' },
    { name: 'form_heading', type: 'text', label: 'Form Heading' },
    { name: 'email_address', type: 'text', label: 'Email Address' },
    { name: 'contact_number', type: 'text', label: 'Contact Number' },
    { name: 'address', type: 'text', label: 'Address' },
    { name: 'location_iframe_source', type: 'textarea', label: 'Map Embed (iframe src)' },
  ],
};
