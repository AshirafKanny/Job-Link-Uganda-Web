import type { CollectionConfig } from 'payload'
import { canManageRecruitment, isAdmin } from '../../access'

/**
 * PRIVATE — client businesses. Recruiters and admins only. Nothing here is
 * published except `publicName`, and only on vacancies set to "Named".
 */
export const Employers: CollectionConfig = {
  slug: 'employers',
  admin: { useAsTitle: 'name', group: 'Private records', defaultColumns: ['name', 'publicName', 'contactName'] },
  access: { read: canManageRecruitment, create: canManageRecruitment, update: canManageRecruitment, delete: isAdmin },
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'Internal name.' } },
    {
      name: 'publicName',
      type: 'text',
      admin: { description: 'Name shown on vacancies, only where the employer has agreed to be named.' },
    },
    { name: 'website', type: 'text' },
    {
      type: 'collapsible',
      label: 'Contact (private)',
      fields: [
        { name: 'contactName', type: 'text' },
        { name: 'contactPhone', type: 'text' },
        { name: 'contactEmail', type: 'email' },
      ],
    },
    { name: 'notes', type: 'textarea' },
  ],
}
