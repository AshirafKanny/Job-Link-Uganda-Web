import type { CollectionConfig } from 'payload'
import { canManageRecruitment, isAdmin, nobody } from '../../access'

/**
 * PRIVATE — anonymous, cookieless visit statistics shown on the admin dashboard.
 *
 * Privacy by design (Data Protection and Privacy Act, 2019):
 * - No IP address, name, email or other identifier is stored.
 * - `visitorId` is a one-way hash that changes every day, so the same person
 *   cannot be followed from one day to the next or identified.
 * - Visitors with Do Not Track / Global Privacy Control, bots, automated
 *   browsers and logged-in staff are not counted.
 * Written only by the /track route handler; never readable publicly.
 */
export const PageViews: CollectionConfig = {
  slug: 'page-views',
  labels: { singular: 'Page view', plural: 'Page views' },
  admin: { hidden: true },
  access: { read: canManageRecruitment, create: nobody, update: nobody, delete: isAdmin },
  timestamps: true,
  indexes: [{ fields: ['createdAt'] }],
  fields: [
    { name: 'path', type: 'text', required: true, index: true },
    { name: 'jobRef', type: 'text', index: true },
    { name: 'visitorId', type: 'text', required: true, index: true },
    { name: 'referrerHost', type: 'text' },
    {
      name: 'device',
      type: 'select',
      required: true,
      options: [
        { label: 'Mobile', value: 'mobile' },
        { label: 'Tablet', value: 'tablet' },
        { label: 'Desktop', value: 'desktop' },
      ],
    },
  ],
}
