import type { CollectionConfig } from 'payload'
import { routes } from '@/lib/routes'
import { canManageContent, isAdmin, isStaff } from '../access'
import { slugField } from '../fields/slug'
import { revalidateOnChange } from '../hooks/revalidate'
import { redirectOnSlugChange } from '../hooks/slug-redirect'

const servicesRevalidation = revalidateOnChange([routes.services(), routes.home()])
const articlesRevalidation = revalidateOnChange([routes.careerResources(), routes.home()])

/**
 * Employer-facing recruitment services (/recruitment-services/[slug]).
 * Only create services Job Link Uganda genuinely offers.
 */
export const Services: CollectionConfig = {
  slug: 'services',
  admin: { useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'parent', '_status', 'updatedAt'] },
  versions: { drafts: true, maxPerDoc: 25 },
  access: { read: isStaff, create: canManageContent, update: canManageContent, delete: isAdmin },
  hooks: {
    afterChange: [servicesRevalidation.afterChange, redirectOnSlugChange(routes.service)],
    afterDelete: [servicesRevalidation.afterDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true, admin: { description: 'e.g. Restaurant Staff Recruitment' } },
    slugField('title'),
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'services',
      admin: { position: 'sidebar', description: 'e.g. Restaurant Staff Recruitment → Hospitality Recruitment' },
    },
    { name: 'summary', type: 'textarea', required: true, maxLength: 300 },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText' },
    {
      name: 'faqs',
      label: 'FAQs (shown on the page)',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    {
      name: 'relatedJobCategories',
      type: 'relationship',
      relationTo: 'job-categories',
      hasMany: true,
      admin: { description: 'Job families this service recruits for (cluster links to live vacancies).' },
    },
    { name: 'order', type: 'number', defaultValue: 100, admin: { position: 'sidebar' } },
  ],
}

/** Career advice and employer guides (/career-advice/[slug]). */
export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: { useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'category', '_status', 'publishedAt'] },
  versions: { drafts: true, maxPerDoc: 25 },
  access: { read: isStaff, create: canManageContent, update: canManageContent, delete: isAdmin },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data._status === 'published' && !data.publishedAt) data.publishedAt = new Date().toISOString()
        return data
      },
    ],
    afterChange: [articlesRevalidation.afterChange, redirectOnSlugChange(routes.article)],
    afterDelete: [articlesRevalidation.afterDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 300,
      admin: { description: 'What the reader will get from this article. Used on cards and in search results.' },
    },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText', required: true },
    { name: 'category', type: 'relationship', relationTo: 'article-categories', admin: { position: 'sidebar' } },
    {
      name: 'authorName',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'A real person who wrote or reviewed the article. Leave empty to credit Job Link Uganda.',
      },
    },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
    {
      type: 'collapsible',
      label: 'Internal links & conversion',
      fields: [
        { name: 'relatedJobCategory', type: 'relationship', relationTo: 'job-categories' },
        { name: 'relatedService', type: 'relationship', relationTo: 'services' },
        {
          name: 'primaryCta',
          type: 'select',
          defaultValue: 'jobs',
          options: [
            { label: 'Browse jobs', value: 'jobs' },
            { label: 'Request staff (employers)', value: 'hire-staff' },
            { label: 'None', value: 'none' },
          ],
        },
      ],
    },
  ],
}
