/**
 * One-off: replaces the original (over-long) seeded meta descriptions in an
 * existing database with the shortened versions now in src/seed/*.
 *
 * Safe to run on production: a document is only updated when its current
 * description is still the ORIGINAL seeded text (same first word and longer
 * than 158 characters). Anything an editor has changed is left untouched.
 *
 * Usage (PowerShell), against the live database:
 *   $env:DATABASE_URL="<Neon connection string>"; npm run seo:update-meta
 */
import config from '@payload-config'
import { getPayload, type CollectionSlug } from 'payload'
import { seedArticles } from '../src/seed/articles'
import { seedServices } from '../src/seed/services'
import { seedJobCategories } from '../src/seed/taxonomy'

const payload = await getPayload({ config })

const targets: { collection: CollectionSlug; slug: string; description: string; drafts: boolean }[] = [
  ...seedServices.map((s) => ({ collection: 'services' as const, slug: s.slug, description: s.meta.description, drafts: true })),
  ...seedJobCategories
    .filter((c) => c.meta)
    .map((c) => ({ collection: 'job-categories' as const, slug: c.slug, description: c.meta!.description, drafts: false })),
  ...seedArticles.map((a) => ({ collection: 'articles' as const, slug: a.slug, description: a.meta.description, drafts: true })),
]

const firstWord = (s: string) => s.split(/\s+/)[0]!.toLowerCase()
let updated = 0
for (const t of targets) {
  const { docs } = await payload.find({ collection: t.collection, where: { slug: { equals: t.slug } }, limit: 1, depth: 0, overrideAccess: true })
  const doc = docs[0] as { id: number; meta?: { description?: string | null } } | undefined
  const current = doc?.meta?.description ?? ''
  if (!doc || current === t.description) continue
  // Every original seeded description was over 158 characters; edited ones are left alone.
  const isOriginalSeed = current.length > 158 && firstWord(current) === firstWord(t.description)
  if (!isOriginalSeed) continue
  await payload.update({
    collection: t.collection,
    id: doc.id,
    overrideAccess: true,
    data: { meta: { ...doc.meta, description: t.description }, ...(t.drafts ? { _status: 'published' } : {}) },
  })
  updated++
  payload.logger.info(`Updated meta description: ${t.collection}/${t.slug} (${current.length} → ${t.description.length} chars)`)
}
payload.logger.info(`Done: ${updated} description(s) updated.`)
process.exit(0)
