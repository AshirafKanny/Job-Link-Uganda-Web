import type { CollectionConfig } from 'payload'
import { canManageRecruitment, isAdmin, nobody } from '../../access'

/**
 * PRIVATE — employer recruitment enquiries submitted through the website.
 * No public API access: submissions are created by a server action that
 * validates input and writes through the Local API. Contains personal data of
 * employer contacts, so it is subject to the Data Protection and Privacy Act.
 */
export const RecruitmentRequests: CollectionConfig = {
  slug: 'recruitment-requests',
  labels: { singular: 'Recruitment request', plural: 'Recruitment requests' },
  admin: {
    useAsTitle: 'businessName',
    group: 'Private records',
    defaultColumns: ['businessName', 'contactName', 'status', 'createdAt'],
  },
  access: { read: canManageRecruitment, create: nobody, update: canManageRecruitment, delete: isAdmin },
  fields: [
    { name: 'businessName', type: 'text', required: true },
    { name: 'contactName', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'location', type: 'text' },
    { name: 'rolesNeeded', type: 'textarea', required: true },
    { name: 'numberOfPositions', type: 'number', min: 1 },
    { name: 'preferredStartDate', type: 'date' },
    { name: 'message', type: 'textarea' },
    { name: 'serviceSlug', label: 'Service', type: 'text', admin: { readOnly: true } },
    {
      name: 'consent',
      type: 'checkbox',
      required: true,
      admin: { readOnly: true, description: 'Contact consented to Job Link Uganda processing this enquiry.' },
    },
    { name: 'sourcePath', type: 'text', admin: { readOnly: true, description: 'Page the enquiry was sent from.' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'internalNotes', type: 'textarea', admin: { position: 'sidebar' } },
  ],
}
