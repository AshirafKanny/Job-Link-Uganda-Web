import type { CollectionConfig, PayloadRequest } from 'payload'
import { overseasRecruitmentEnabled } from '@/config/features'
import { routes } from '@/lib/routes'
import { canManageContent, canManageRecruitment, isAdmin, isStaff } from '../access'
import { slugField } from '../fields/slug'
import { revalidateOnChange } from '../hooks/revalidate'
import { redirectOnSlugChange } from '../hooks/slug-redirect'

const jobsRevalidation = revalidateOnChange([routes.jobs(), routes.home()])

/**
 * Job families, e.g. Hospitality → Restaurant / Hotel / Kitchen.
 * The hierarchy supports the hospitality topical cluster in breadcrumbs and
 * internal links, while URLs stay flat (/jobs/category/[slug]).
 */
export const JobCategories: CollectionConfig = {
  slug: 'job-categories',
  labels: { singular: 'Job category', plural: 'Job categories' },
  admin: { useAsTitle: 'name', group: 'Recruitment', defaultColumns: ['name', 'slug', 'parent'] },
  access: { read: isStaff, create: canManageContent, update: canManageContent, delete: isAdmin },
  hooks: {
    afterChange: [jobsRevalidation.afterChange, redirectOnSlugChange(routes.jobCategory)],
    afterDelete: [jobsRevalidation.afterDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      // Case-insensitive, so "hospitality" cannot be added next to "Hospitality".
      validate: async (
        value: unknown,
        { req, id, previousValue }: { req: PayloadRequest; id?: number | string; previousValue?: unknown },
      ) => {
        if (typeof value !== 'string' || !value.trim()) return 'Enter a category name.'
        // Only new or renamed categories are checked, so an existing clash never blocks unrelated edits.
        if (id != null && value === previousValue) return true
        const { docs } = await req.payload.find({
          collection: 'job-categories',
          depth: 0,
          pagination: false,
          select: { name: true },
          overrideAccess: true,
          req,
        })
        const clash = docs.find((d) => d.id !== id && d.name.trim().toLowerCase() === value.trim().toLowerCase())
        return clash ? `A category called "${clash.name}" already exists. Use that one instead.` : true
      },
    },
    slugField('name'),
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'job-categories',
      validate: (value: unknown, { id }: { id?: number | string }) =>
        value != null && id != null && String(typeof value === 'object' ? (value as { id: unknown }).id : value) === String(id)
          ? 'A category cannot be its own parent.'
          : true,
      admin: { position: 'sidebar', description: 'e.g. "Restaurant" sits under "Hospitality".' },
    },
    {
      name: 'intro',
      type: 'textarea',
      admin: {
        description:
          'Genuinely useful introduction for job seekers (what these roles involve, typical requirements). An empty category with no live jobs and no intro is kept out of search results.',
      },
    },
    {
      name: 'relatedService',
      type: 'relationship',
      relationTo: 'services',
      admin: { description: 'Employer-side service for this job family, linked as "Hiring for these roles?"' },
    },
  ],
}

export const Locations: CollectionConfig = {
  slug: 'locations',
  admin: { useAsTitle: 'name', group: 'Recruitment', defaultColumns: ['name', 'region', 'hasLandingPage'] },
  access: { read: isStaff, create: canManageRecruitment, update: canManageRecruitment, delete: isAdmin },
  hooks: {
    afterChange: [jobsRevalidation.afterChange, redirectOnSlugChange(routes.jobLocation)],
    afterDelete: [jobsRevalidation.afterDelete],
  },
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'e.g. Kampala' } },
    slugField('name'),
    { name: 'region', type: 'text', admin: { description: 'e.g. Central Region' } },
    {
      name: 'countryCode',
      type: 'text',
      required: true,
      defaultValue: 'UG',
      // Rejected loudly rather than silently coerced, so an overseas place is never saved as Ugandan.
      validate: (value: string | null | undefined) =>
        value === 'UG' || overseasRecruitmentEnabled
          ? true
          : 'Locations outside Uganda are disabled until overseas recruitment is licensed and enabled.',
      admin: {
        readOnly: !overseasRecruitmentEnabled,
        description: 'ISO country code. Locked to UG while overseas recruitment is disabled.',
      },
    },
    {
      name: 'hasLandingPage',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Publish a dedicated /locations page. Only enable where Job Link has genuine recruitment activity, to avoid thin doorway pages.',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      admin: { description: 'Local context for job seekers and employers in this area.' },
    },
  ],
}

export const ArticleCategories: CollectionConfig = {
  slug: 'article-categories',
  labels: { singular: 'Article category', plural: 'Article categories' },
  admin: { useAsTitle: 'name', group: 'Content' },
  access: { read: isStaff, create: canManageContent, update: canManageContent, delete: isAdmin },
  hooks: {
    afterChange: [revalidateOnChange([routes.careerResources()]).afterChange, redirectOnSlugChange(routes.articleCategory)],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    { name: 'description', type: 'textarea' },
  ],
}
