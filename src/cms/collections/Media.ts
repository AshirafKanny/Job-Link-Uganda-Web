import { APIError, type CollectionConfig } from 'payload'
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
  hooks: {
    beforeOperation: [
      ({ operation }) => {
        // Vercel's filesystem is read-only: without cloud storage (S3_* variables, see
        // docs/04-deployment-guide.md, Step 2) an upload can only fail. Say why, clearly.
        if ((operation === 'create' || operation === 'update') && process.env.VERCEL && !process.env.S3_BUCKET) {
          throw new APIError(
            'Image storage is not set up yet, so images cannot be uploaded. Add the Cloudflare R2 storage settings (S3_BUCKET and related variables) in Vercel, then redeploy.',
            503,
            null,
            true,
          )
        }
      },
    ],
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
