import type { CollectionConfig } from 'payload'
import { candidateSystemEnabled, overseasRecruitmentEnabled } from '@/config/features'
import { site } from '@/config/site'
import { DEFAULT_VALIDITY_DAYS, endOfKampalaDay, RETIRE_AFTER_DAYS } from '@/domain/jobs/lifecycle'
import { CLOSE_REASONS, EMPLOYMENT_TYPES, SALARY_UNITS } from '@/domain/jobs/types'
import { routes } from '@/lib/routes'
import { canManageRecruitment, isAdmin, isStaff, recruitmentField } from '../access'
import { revalidateOnChange } from '../hooks/revalidate'

const revalidation = revalidateOnChange([routes.jobs(), routes.home()])

const humanise = (value: string) => value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, ' ')

const listField = (name: string, label: string, required: boolean) => ({
  name,
  label,
  type: 'array' as const,
  minRows: required ? 1 : 0,
  labels: { singular: 'Item', plural: 'Items' },
  fields: [{ name: 'item', type: 'text' as const, required: true }],
})

/**
 * Vacancies. Public visibility is derived by getJobLifecycle() from the
 * status and dates, so expiry does not rely on staff remembering to close jobs.
 * Only real vacancies may be entered here; never publish example jobs.
 */
export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: {
    useAsTitle: 'title',
    group: 'Recruitment',
    defaultColumns: ['title', 'status', 'location', 'category', 'closingDate', 'updatedAt'],
    description: `Jobs without a closing date stop being advertised ${DEFAULT_VALIDITY_DAYS} days after publishing. Closed jobs stay visible (not indexed) for ${RETIRE_AFTER_DAYS} days, then their URL is retired.`,
  },
  access: { read: isStaff, create: canManageRecruitment, update: canManageRecruitment, delete: isAdmin },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        const now = new Date().toISOString()
        if (data.status === 'open') {
          if (!data.publishedAt && !originalDoc?.publishedAt) data.publishedAt = now
          data.closedAt = null
          data.closeReason = null
        }
        if (data.status === 'closed' && originalDoc?.status !== 'closed') data.closedAt = now
        return data
      },
    ],
    afterChange: [revalidation.afterChange],
    afterDelete: [revalidation.afterDelete],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true, admin: { width: '60%', description: 'e.g. Restaurant Supervisor' } },
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'job-categories',
          required: true,
          admin: { width: '40%' },
        },
      ],
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      required: true,
      filterOptions: overseasRecruitmentEnabled ? undefined : { countryCode: { equals: 'UG' } },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      maxLength: 300,
      admin: { description: 'One or two sentences. Used on job cards and as the search-result description.' },
    },
    {
      name: 'employmentTypes',
      type: 'select',
      hasMany: true,
      required: true,
      options: EMPLOYMENT_TYPES.map((value) => ({ label: humanise(value), value })),
    },
    {
      type: 'collapsible',
      label: 'Employer',
      fields: [
        {
          name: 'employerVisibility',
          type: 'select',
          required: true,
          defaultValue: 'confidential',
          options: [
            { label: 'Confidential — advertised by Job Link Uganda', value: 'confidential' },
            { label: 'Named — employer agreed to be shown', value: 'named' },
          ],
        },
        {
          name: 'employer',
          type: 'relationship',
          relationTo: 'employers',
          access: { read: recruitmentField, create: recruitmentField, update: recruitmentField },
          validate: (value: unknown, { siblingData }: { siblingData: { employerVisibility?: string } }) =>
            siblingData.employerVisibility === 'named' && !value ? 'Choose the employer to name on this vacancy.' : true,
          admin: { description: 'Internal record. Only its public name is shown, and only when "Named" is selected.' },
        },
      ],
    },
    listField('responsibilities', 'Responsibilities', true),
    listField('requirements', 'Requirements', true),
    {
      name: 'experience',
      type: 'text',
      admin: { description: 'Experience expected, only if the employer specified it, e.g. "At least 1 year in a busy restaurant"' },
    },
    listField('benefits', 'Benefits (only if confirmed by the employer)', false),
    { name: 'additionalDetails', type: 'richText' },
    {
      type: 'collapsible',
      label: 'Salary',
      fields: [
        {
          name: 'showSalary',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Only publish a salary the employer has confirmed.' },
        },
        {
          name: 'salary',
          type: 'group',
          admin: { condition: (data) => Boolean(data?.showSalary) },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'currency', type: 'text', defaultValue: site.defaultCurrency, admin: { width: '20%' } },
                { name: 'min', type: 'number', min: 0, admin: { width: '25%' } },
                { name: 'max', type: 'number', min: 0, admin: { width: '25%' } },
                {
                  name: 'unit',
                  type: 'select',
                  defaultValue: 'MONTH',
                  options: SALARY_UNITS.map((value) => ({ label: `Per ${value.toLowerCase()}`, value })),
                  admin: { width: '30%' },
                },
              ],
            },
            { name: 'note', type: 'text', admin: { description: 'e.g. "plus service charge"' } },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'How to apply',
      fields: [
        {
          name: 'applicationMethod',
          type: 'select',
          required: true,
          defaultValue: 'instructions',
          options: [
            { label: 'Written instructions', value: 'instructions' },
            { label: 'WhatsApp enquiry', value: 'whatsapp' },
            ...(candidateSystemEnabled ? [{ label: 'Apply online', value: 'online' }] : []),
          ],
        },
        {
          name: 'applicationInstructions',
          type: 'textarea',
          required: true,
          admin: { description: 'Shown on the page and included in search-engine job data.' },
        },
      ],
    },
    // Sidebar: publishing and lifecycle
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft (not public)', value: 'draft' },
        { label: 'Open', value: 'open' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Draft jobs are saved but NOT shown on the website. Choose "Open" and save to publish.',
      },
    },
    {
      name: 'closeReason',
      type: 'select',
      options: CLOSE_REASONS.map((value) => ({ label: humanise(value), value })),
      validate: (value: unknown, { siblingData }: { siblingData: { status?: string } }) =>
        siblingData.status === 'closed' && !value ? 'Select why the vacancy closed.' : true,
      admin: { position: 'sidebar', condition: (data) => data?.status === 'closed' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on the home page while open.' },
    },
    {
      name: 'publishedAt',
      label: 'Date posted',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'closingDate',
      type: 'date',
      // An open job with a past closing date would be closed the moment it is saved.
      validate: (value: unknown, { siblingData }: { siblingData: { status?: string } }) =>
        siblingData.status === 'open' && typeof value === 'string' && endOfKampalaDay(value).getTime() < Date.now()
          ? 'This closing date has already passed, so the job would not appear on the website. Choose a future date, or leave it empty (the job then stays open for 30 days).'
          : true,
      admin: {
        position: 'sidebar',
        // Stored as midday UTC; show the calendar day only, never a misleading "3:00 PM".
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' },
        description: 'Applications accepted until the end of this day (Kampala time).',
      },
    },
    { name: 'closedAt', type: 'date', admin: { position: 'sidebar', readOnly: true } },
    {
      name: 'retirement',
      label: 'After retirement',
      type: 'select',
      required: true,
      defaultValue: 'gone',
      options: [
        { label: 'Remove page (410 Gone)', value: 'gone' },
        { label: 'Redirect to category (if other sites link here)', value: 'redirect-to-category' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      access: { read: recruitmentField, create: recruitmentField, update: recruitmentField },
      admin: { position: 'sidebar', description: 'Never shown publicly.' },
    },
  ],
}
