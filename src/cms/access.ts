import type { Access, FieldAccess, PayloadRequest } from 'payload'

/**
 * Staff roles.
 * - admin:     everything, including user management
 * - recruiter: jobs, employers, recruitment requests (and candidates, once enabled)
 * - editor:    articles, services, taxonomy and media; read-only on jobs
 *
 * Public visitors have NO direct access to CMS collections (except media
 * files). Public pages read content through the server-only data layer in
 * src/data, which selects public fields explicitly.
 */
export const ROLES = ['admin', 'recruiter', 'editor'] as const
export type Role = (typeof ROLES)[number]

export function hasRole(req: PayloadRequest, ...roles: Role[]): boolean {
  const userRoles = (req.user as { roles?: Role[] | null } | null)?.roles
  return Boolean(userRoles?.some((role) => roles.includes(role)))
}

export const nobody: Access = () => false
export const anyone: Access = () => true

export const isAdmin: Access = ({ req }) => hasRole(req, 'admin')
export const isStaff: Access = ({ req }) => hasRole(req, 'admin', 'recruiter', 'editor')
export const canManageRecruitment: Access = ({ req }) => hasRole(req, 'admin', 'recruiter')
export const canManageContent: Access = ({ req }) => hasRole(req, 'admin', 'editor')

export const isAdminField: FieldAccess = ({ req }) => hasRole(req, 'admin')
export const recruitmentField: FieldAccess = ({ req }) => hasRole(req, 'admin', 'recruiter')

/** Admins see all users; everyone else only themselves. */
export const isAdminOrSelf: Access = ({ req }) => {
  if (hasRole(req, 'admin')) return true
  if (!req.user) return false
  return { id: { equals: req.user.id } }
}
