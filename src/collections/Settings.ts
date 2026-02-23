import { CollectionConfig } from "@/core/types";

export const Settings: CollectionConfig<'settings'> = {
  slug: 'settings',
  admin: {
    useAsTitle: 'siteName',
    defaultColumns: ['siteName', 'updatedAt'],
    description: 'Global website configuration including logo, header, footer, and contact information',
    group: { key: 'system', label: 'System', order: 4 },
  },
  access: {
    read: () => true, // Public access for reading
    create: ({ req: { user } }) => user?.role === 'admin', // Only admins can create
    update: ({ req: { user } }) => !!user, // Authenticated users can update
    delete: ({ req: { user } }) => user?.role === 'admin', // Only admins can delete
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'AGBON',
      admin: {
        description: 'Website/Company name',
      },
    },

    // Logo Configuration
    {
      name: 'logo',
      type: 'group',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Logo image file',
          },
        },
        {
          name: 'alt',
          type: 'text',
          required: true,
          defaultValue: 'Agbon',
          admin: {
            description: 'Alt text for accessibility',
          },
        },
        {
          name: 'width',
          type: 'number',
          required: true,
          defaultValue: 120,
          admin: {
            description: 'Logo width in pixels',
          },
        },
        {
          name: 'height',
          type: 'number',
          required: true,
          defaultValue: 40,
          admin: {
            description: 'Logo height in pixels',
          },
        },
      ],
    },

    // Contact Information
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'phone',
          type: 'text',
          required: true,
          defaultValue: '+1 (555) 123-4567',
          admin: {
            description: 'Primary phone number',
          },
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          defaultValue: 'info@agbon.com',
          admin: {
            description: 'Primary email address',
          },
        },
        {
          name: 'address',
          type: 'text',
          required: true,
          defaultValue: 'Industrial Park, Zone A, Manufacturing District',
          admin: {
            description: 'Physical address',
          },
        },
      ],
    },

    // Header Navigation
    {
      name: 'headerNavigation',
      type: 'group',
      admin: {
        description: 'Header navigation menu items',
      },
      fields: [
        {
          name: 'aboutMenu',
          type: 'array',
          label: 'About AGBON Menu Items',
          minRows: 1,
          maxRows: 10,
          defaultValue: [
            { label: 'Brand Introduction', href: '/about/brand-introduction' },
            { label: 'Business Map', href: '/about/business-map' },
          ],
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                description: 'Menu item label',
              },
            },
            {
              name: 'href',
              type: 'text',
              required: true,
              admin: {
                description: 'Link URL',
              },
            },
          ],
        },
        {
          name: 'afterSalesHref',
          type: 'text',
          required: true,
          defaultValue: '/after-sales-service',
          admin: {
            description: 'After Sales Service page URL',
          },
        },
        {
          name: 'joinUsMenu',
          type: 'array',
          label: 'Join Us Menu Items',
          minRows: 1,
          maxRows: 10,
          defaultValue: [
            { label: 'Recruitment', href: '/join-us/recruitment' },
            { label: 'Contact', href: '/contact' },
          ],
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                description: 'Menu item label',
              },
            },
            {
              name: 'href',
              type: 'text',
              required: true,
              admin: {
                description: 'Link URL',
              },
            },
          ],
        },
      ],
    },

    // Footer Configuration
    {
      name: 'footer',
      type: 'group',
      fields: [
        {
          name: 'companyName',
          type: 'text',
          required: true,
          defaultValue: 'AGBON',
          admin: {
            description: 'Company name displayed in footer',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          admin: {
            localizedAs: 'textarea',
            description: 'Company description (localized)',
          },
        },
        {
          name: 'quickLinks',
          type: 'array',
          minRows: 1,
          maxRows: 10,
          defaultValue: [
            { label: 'About', href: '/' },
            { label: 'Products', href: '/products' },
            { label: 'After Sales', href: '/after-sales-service' },
            { label: 'Join Us', href: '/join-us' },
          ],
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'href',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            description: 'Quick links displayed in footer',
          },
        },
        {
          name: 'copyright',
          type: 'text',
          required: true,
          defaultValue: '© 2024 AGBON. All rights reserved.',
          admin: {
            description: 'Copyright text',
          },
        },
      ],
    },

    // Social Media Links
    {
      name: 'socialMedia',
      type: 'group',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          admin: {
            description: 'Facebook profile URL',
          },
        },
        {
          name: 'linkedin',
          type: 'text',
          admin: {
            description: 'LinkedIn profile URL',
          },
        },
        {
          name: 'twitter',
          type: 'text',
          admin: {
            description: 'Twitter/X profile URL',
          },
        },
        {
          name: 'instagram',
          type: 'text',
          admin: {
            description: 'Instagram profile URL',
          },
        },
        {
          name: 'youtube',
          type: 'text',
          admin: {
            description: 'YouTube channel URL',
          },
        },
      ],
    },

    // Newsletter
    {
      name: 'newsletter',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable newsletter signup in footer',
          },
        },
        {
          name: 'placeholder',
          type: 'text',
          localized: true,
          admin: {
            localizedAs: 'text',
            description: 'Placeholder text for email input (localized)',
          },
        },
      ],
    },

    // Legal Links
    {
      name: 'legal',
      type: 'group',
      fields: [
        {
          name: 'privacyPolicy',
          type: 'text',
          required: true,
          defaultValue: '/privacy-policy',
          admin: {
            description: 'Privacy policy page URL',
          },
        },
        {
          name: 'termsOfService',
          type: 'text',
          required: true,
          defaultValue: '/terms-of-service',
          admin: {
            description: 'Terms of service page URL',
          },
        },
      ],
    },

    // Feature Toggles
    {
      name: 'features',
      type: 'group',
      fields: [
        {
          name: 'showSearch',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show search button in header',
          },
        },
        {
          name: 'showLanguageSwitcher',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show language switcher in header',
          },
        },
      ],
    },
  ],
  queryable: false,
}
