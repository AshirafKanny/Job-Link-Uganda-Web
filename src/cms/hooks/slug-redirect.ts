import type { CollectionAfterChangeHook } from 'payload'

/**
 * When the slug of a published document changes, record a 301 from the old
 * public URL to the new one so links and rankings are preserved.
 */
export function redirectOnSlugChange(buildPath: (slug: string) => string): CollectionAfterChangeHook {
  return async ({ doc, previousDoc, operation, req }) => {
    if (operation !== 'update' || !previousDoc?.slug || previousDoc.slug === doc.slug) return doc
    const wasPublished = previousDoc._status === undefined || previousDoc._status === 'published'
    if (!wasPublished) return doc

    const from = buildPath(previousDoc.slug)
    const to = buildPath(doc.slug)
    const existing = await req.payload.find({
      collection: 'redirects',
      where: { from: { equals: from } },
      limit: 1,
      req,
      overrideAccess: true,
    })
    if (existing.docs.length === 0) {
      await req.payload.create({
        collection: 'redirects',
        data: { from, to: { type: 'custom', url: to }, type: '301' },
        req,
        overrideAccess: true,
      })
    }
    return doc
  }
}
