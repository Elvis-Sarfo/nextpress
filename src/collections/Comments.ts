/**
 * Comments Collection
 *
 * Comments can be attached to any collection that has `comments: true` (Pages, Posts).
 * Supports both anonymous (authorName + authorEmail) and authenticated (author → Users) paths.
 * All new comments start as 'pending' and require admin approval before showing publicly.
 */

import {
  CollectionConfig,
  CollectionTextField,
  CollectionTextareaField,
  EmailField,
  SelectField,
  RelationshipField,
} from '../core/collection';

export const Comments: CollectionConfig<'comments'> = {
  slug: 'comments',

  labels: {
    singular: 'Comment',
    plural: 'Comments',
  },

  admin: {
    useAsTitle: 'content',
    defaultColumns: ['authorName', 'contentType', 'status', 'createdAt'],
    group: 'Content',
  },

  access: {
    // Anyone can submit a comment (checked in public API); admin can read all
    read: ({ req }) => {
      if (req.user?.role === 'admin' || req.user?.role === 'editor') return true;
      return { status: { equals: 'approved' } };
    },
    create: () => true,
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The comment text',
      },
    } satisfies CollectionTextareaField,
    {
      name: 'authorName',
      type: 'text',
      admin: {
        description: 'Display name for anonymous commenters',
      },
    } satisfies CollectionTextField,
    {
      name: 'authorEmail',
      type: 'email',
      admin: {
        description: 'Email for anonymous commenters (not shown publicly)',
      },
    } satisfies EmailField,
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Linked user account (for authenticated commenters)',
      },
    } satisfies RelationshipField,
    {
      name: 'contentType',
      type: 'select',
      required: true,
      options: [
        { label: 'Page',  value: 'pages' },
        { label: 'Post',  value: 'posts' },
      ],
      admin: {
        description: 'The collection this comment belongs to',
      },
    } satisfies SelectField,
    {
      name: 'contentId',
      type: 'text',
      required: true,
      admin: {
        description: 'ID of the page or post this comment is on',
      },
    } satisfies CollectionTextField,
    {
      name: 'parentId',
      type: 'text',
      admin: {
        description: 'Parent comment ID for threaded replies',
      },
    } satisfies CollectionTextField,
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending',  value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Spam',     value: 'spam' },
      ],
    } satisfies SelectField,
  ],

  indexes: [
    { fields: ['contentType', 'contentId'] },
    { fields: ['status'] },
    { fields: ['parentId'] },
  ],
};
