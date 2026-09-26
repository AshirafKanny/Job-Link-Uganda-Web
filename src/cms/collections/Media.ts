import type { CollectionConfig } from 'payload'
import { anyone, isStaff } from '../access'

/**
 * Public website imagery only. Candidate documents (CVs, IDs, photos) must
 * NEVER be stored here; they belong in the private, feature-gated candidate
 * storage (see src/cms/collections/private).
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content', defaultColumns: ['filename', 'alt', 'source'] },
  access: {
    read: anyone,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'],
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 800 },
      { name: 'wide', width: 1600 },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describe what the image shows for people who cannot see it. Do not stuff keywords.' },
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'unsplash',
      options: [
        { label: 'Unsplash (illustrative stock)', value: 'unsplash' },
        { label: 'Other licensed stock (illustrative)', value: 'licensed-stock' },
        { label: 'Job Link Uganda original photography', value: 'job-link' },
      ],
      admin: {
        description:
          'Stock photos are illustrative only. Never caption or place them in a way that implies the people are Job Link staff, candidates or clients, or that a location is our office.',
      },
    },
    {
      name: 'creditName',
      type: 'text',
      admin: { condition: (data) => data?.source !== 'job-link', description: 'Photographer name' },
    },
    {
      name: 'creditUrl',
      type: 'text',
      admin: { condition: (data) => data?.source !== 'job-link', description: 'Link to the original photo page' },
    },
  ],
}
