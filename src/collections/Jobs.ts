import type { CollectionConfig } from '@/core/collection/types';

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  labels: { singular: 'Job', plural: 'Jobs' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'employmentType', 'order'],
    group: { key: 'catalogue', label: 'Catalogue', order: 2 },
    editorView: 'page',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Job title displayed in the openings list.',
      },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      admin: {
        description: 'Job location, e.g. "Accra, Ghana" or "Remote (Africa)".',
      },
    },
    {
      name: 'flag',
      type: 'text',
      admin: {
        description: 'Optional flag emoji override for the job card.',
      },
    },
    {
      name: 'employmentType',
      type: 'select',
      required: true,
      defaultValue: 'Full-time',
      options: [
        { label: 'Full-time', value: 'Full-time' },
        { label: 'Part-time', value: 'Part-time' },
        { label: 'Contract', value: 'Contract' },
        { label: 'Internship', value: 'Internship' },
        { label: 'Remote', value: 'Remote' },
      ],
      admin: {
        description: 'Employment type shown beside the location.',
      },
    },
    {
      name: 'salary',
      type: 'text',
      defaultValue: 'Competitive',
      admin: {
        description: 'Compensation label shown in the job meta row.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short overview of the role.',
      },
    },
    {
      name: 'requirements',
      type: 'array',
      admin: {
        description: 'Requirements listed under the job opening.',
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'applyLabel',
      type: 'text',
      defaultValue: 'Apply Now',
      admin: {
        description: 'Optional button label override for this role.',
      },
    },
    {
      name: 'applyLink',
      type: 'text',
      admin: {
        description: 'Optional role-specific application URL or path.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order. Lower values appear first.',
      },
    },
  ],
};
