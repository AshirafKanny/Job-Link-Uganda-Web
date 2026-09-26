import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminField, isAdminOrSelf, ROLES } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Staff user', plural: 'Staff users' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'displayName', 'roles'],
    group: 'Settings',
  },
  auth: {
    tokenExpiration: 8 * 60 * 60,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
  },
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      // The very first account (created through the admin's first-user screen) becomes an admin.
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true, req })
          if (totalDocs === 0) return { ...data, roles: ['admin'] }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      admin: { description: 'Shown only inside the admin. Never published on the website.' },
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      options: ROLES.map((role) => ({ label: role[0]!.toUpperCase() + role.slice(1), value: role })),
      access: { update: isAdminField, create: isAdminField },
      saveToJWT: true,
    },
  ],
}
