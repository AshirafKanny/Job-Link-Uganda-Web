/**
 * Loads launch content (services, taxonomy, articles) into the CMS.
 * Idempotent: documents that already exist (matched by slug) are left
 * untouched, so editors' changes are never overwritten.
 *
 * Creates NO jobs. Vacancies are only ever entered by Job Link staff.
 *
 * Usage: npm run seed
 */
import config from '@payload-config'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { getPayload, type CollectionSlug } from 'payload'
import { seedArticles } from '../src/seed/articles'
import { seedServices } from '../src/seed/services'
import { seedArticleCategories, seedJobCategories, seedLocations } from '../src/seed/taxonomy'

const payload = await getPayload({ config })
const editorConfig = await editorConfigFactory.default({ config: payload.config })
const markdown = (md: string) => convertMarkdownToLexical({ editorConfig, markdown: md.trim() })
const context = { disableRevalidate: true }

async function findId(collection: CollectionSlug, slug: string): Promise<number | null> {
  const { docs } = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    draft: true,
  })
  return (docs[0]?.id as number | undefined) ?? null
}

let created = 0
let skipped = 0
async function ensure(collection: CollectionSlug, slug: string, create: () => Promise<unknown>) {
  if (await findId(collection, slug)) {
    skipped++
    return
  }
  await create()
  created++
  payload.logger.info(`Created ${collection}: ${slug}`)
}

// 1. Services (parents before children)
for (const s of [...seedServices].sort((a, b) => Number(Boolean(a.parentSlug)) - Number(Boolean(b.parentSlug)))) {
  await ensure('services', s.slug, async () =>
    payload.create({
      collection: 'services',
      overrideAccess: true,
      context,
      data: {
        title: s.title,
        slug: s.slug,
        summary: s.summary,
        body: markdown(s.body),
        faqs: s.faqs,
        order: s.order,
        parent: s.parentSlug ? await findId('services', s.parentSlug) : null,
        meta: s.meta,
        _status: 'published',
      },
    }),
  )
}

// 2. Job categories (parents first), linked to their employer-side service
for (const c of [...seedJobCategories].sort((a, b) => Number(Boolean(a.parentSlug)) - Number(Boolean(b.parentSlug)))) {
  await ensure('job-categories', c.slug, async () =>
    payload.create({
      collection: 'job-categories',
      overrideAccess: true,
      context,
      data: {
        name: c.name,
        slug: c.slug,
        intro: c.intro,
        parent: c.parentSlug ? await findId('job-categories', c.parentSlug) : null,
        relatedService: c.relatedServiceSlug ? await findId('services', c.relatedServiceSlug) : null,
        ...(c.meta ? { meta: c.meta } : {}),
      },
    }),
  )
}

// 3. Link services to the job categories they recruit for
for (const s of seedServices) {
  const id = await findId('services', s.slug)
  if (!id) continue
  const existing = await payload.findByID({ collection: 'services', id, depth: 0, overrideAccess: true, draft: true })
  if ((existing.relatedJobCategories ?? []).length > 0) continue
  const ids = (await Promise.all(s.relatedJobCategorySlugs.map((slug) => findId('job-categories', slug)))).filter(
    (v): v is number => v !== null,
  )
  await payload.update({
    collection: 'services',
    id,
    overrideAccess: true,
    context,
    data: { relatedJobCategories: ids, _status: 'published' },
  })
}

// 4. Locations
for (const l of seedLocations) {
  await ensure('locations', l.slug, () =>
    payload.create({ collection: 'locations', overrideAccess: true, context, data: { ...l, countryCode: 'UG' } }),
  )
}

// 5. Article categories and articles
for (const c of seedArticleCategories) {
  await ensure('article-categories', c.slug, () =>
    payload.create({ collection: 'article-categories', overrideAccess: true, context, data: c }),
  )
}
for (const a of seedArticles) {
  await ensure('articles', a.slug, async () =>
    payload.create({
      collection: 'articles',
      overrideAccess: true,
      context,
      data: {
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        body: markdown(a.body),
        category: await findId('article-categories', a.categorySlug),
        relatedJobCategory: a.relatedJobCategorySlug ? await findId('job-categories', a.relatedJobCategorySlug) : null,
        relatedService: a.relatedServiceSlug ? await findId('services', a.relatedServiceSlug) : null,
        primaryCta: a.primaryCta,
        meta: a.meta,
        publishedAt: new Date().toISOString(),
        _status: 'published',
      },
    }),
  )
}

payload.logger.info(`Seed complete: ${created} created, ${skipped} already existed.`)
process.exit(0)
