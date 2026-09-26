import type { GlobalConfig } from 'payload'
import { SOCIAL_PLATFORMS } from '@/domain/settings/types'
import { isAdmin, isStaff } from '../access'

const whatsappValidate = (value: unknown) =>
  !value || /^256\d{9}$/.test(String(value)) ? true : 'Use the international format without "+" or spaces, e.g. 2567XXXXXXXX.'

/**
 * Operational business details shown on the website. Leave a field empty
 * rather than entering a placeholder — empty fields are simply not displayed.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
    description: 'Contact details and business information shown across the website. Only enter verified details.',
  },
  access: { read: isStaff, update: isAdmin },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        try {
          const { revalidatePath } = await import('next/cache')
          revalidatePath('/', 'layout')
        } catch {
          req.payload.logger.debug('Skipped revalidation outside Next.js runtime')
        }
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Contact',
      fields: [
        { name: 'phone', type: 'text', admin: { description: 'As it should be displayed, e.g. +256 7XX XXX XXX' } },
        { name: 'email', type: 'email' },
        {
          type: 'row',
          fields: [
            {
              name: 'whatsappCandidates',
              label: 'WhatsApp for job seekers',
              type: 'text',
              validate: whatsappValidate,
              admin: { width: '50%', description: 'Digits only, e.g. 2567XXXXXXXX' },
            },
            {
              name: 'whatsappEmployers',
              label: 'WhatsApp for employers',
              type: 'text',
              validate: whatsappValidate,
              admin: { width: '50%', description: 'Can be the same number.' },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Office',
      fields: [
        {
          name: 'hasPublicOffice',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Only tick if there is a verified office that visitors can come to.' },
        },
        {
          name: 'office',
          type: 'group',
          admin: { condition: (data) => Boolean(data?.hasPublicOffice) },
          fields: [
            { name: 'streetAddress', type: 'text' },
            { name: 'locality', type: 'text', defaultValue: 'Kampala' },
            { name: 'region', type: 'text', defaultValue: 'Central Region' },
            { name: 'postalCode', type: 'text' },
            { name: 'mapUrl', type: 'text', admin: { description: 'Google Maps link to the verified location.' } },
          ],
        },
        {
          name: 'openingHours',
          type: 'array',
          labels: { singular: 'Line', plural: 'Lines' },
          fields: [{ name: 'line', type: 'text', required: true, admin: { description: 'e.g. Mon–Fri 8:30–17:30' } }],
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              options: SOCIAL_PLATFORMS.map((p) => ({ label: p === 'x' ? 'X (Twitter)' : p[0]!.toUpperCase() + p.slice(1), value: p })),
              admin: { width: '30%' },
            },
            { name: 'url', type: 'text', required: true, admin: { width: '70%' } },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'SEO defaults',
      fields: [
        {
          name: 'defaultDescription',
          type: 'textarea',
          maxLength: 160,
          admin: { description: 'Fallback meta description for pages without their own.' },
        },
      ],
    },
  ],
}
