import type { CollectionConfig } from '@/core/collection/types';

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: { singular: 'Contact Message', plural: 'Contact Messages' },
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['name', 'email', 'subject', 'status', 'submittedAt'],
    group: { key: 'content', label: 'Content', order: 2 },
    editorView: 'page',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Sender full name',
        readOnly: true,
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Sender email address',
        readOnly: true,
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Sender phone number',
        readOnly: true,
      },
    },
    {
      name: 'company',
      type: 'text',
      admin: {
        description: 'Company or farm name',
        readOnly: true,
      },
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      admin: {
        description: 'Subject selected on the form',
        readOnly: true,
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Submitted message body',
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Spam', value: 'spam' },
      ],
      admin: {
        description: 'Internal handling status',
      },
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Admin user handling this message',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes for follow-up',
      },
    },
    {
      name: 'sourcePage',
      type: 'text',
      admin: {
        description: 'Page path where the message was submitted',
        readOnly: true,
      },
    },
    {
      name: 'locale',
      type: 'text',
      admin: {
        description: 'Locale used when the form was submitted',
        readOnly: true,
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      admin: {
        description: 'Submission timestamp',
        readOnly: true,
      },
    },
  ],
};
