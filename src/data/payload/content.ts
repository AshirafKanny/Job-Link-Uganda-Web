import 'server-only'
import { routes } from '@/lib/routes'
import type {
  ArticlesRepository,
  RedirectsRepository,
  ServicesRepository,
  TaxonomyRepository,
} from '../repositories'
import { getPayloadClient } from './client'
import { toArticle, toArticleCategory, toJobCategory, toLocation, toService } from './mappers'

const PUBLISHED = { _status: { equals: 'published' } } as const
const PUBLIC = { overrideAccess: true, draft: false } as const

export const payloadTaxonomyRepository: TaxonomyRepository = {
  async listJobCategories() {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'job-categories', ...PUBLIC, depth: 1, sort: 'name', pagination: false })
    return docs.map(toJobCategory)
  },
  async getJobCategory(slug) {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'job-categories', ...PUBLIC, depth: 1, where: { slug: { equals: slug } }, limit: 1 })
    return docs[0] ? toJobCategory(docs[0]) : null
  },
  async listLocations() {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'locations', ...PUBLIC, sort: 'name', pagination: false })
    return docs.map(toLocation)
  },
  async getLocation(slug) {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'locations', ...PUBLIC, where: { slug: { equals: slug } }, limit: 1 })
    return docs[0] ? toLocation(docs[0]) : null
  },
  async listArticleCategories() {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'article-categories', ...PUBLIC, sort: 'name', pagination: false })
    return docs.map(toArticleCategory)
  },
  async getArticleCategory(slug) {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'article-categories', ...PUBLIC, where: { slug: { equals: slug } }, limit: 1 })
    return docs[0] ? toArticleCategory(docs[0]) : null
  },
}

export const payloadServicesRepository: ServicesRepository = {
  async listPublished() {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'services', ...PUBLIC, depth: 1, where: PUBLISHED, sort: 'order', pagination: false })
    return docs.map(toService)
  },
  async getBySlug(slug) {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'services',
      ...PUBLIC,
      depth: 1,
      where: { and: [PUBLISHED, { slug: { equals: slug } }] },
      limit: 1,
    })
    return docs[0] ? toService(docs[0]) : null
  },
}

export const payloadArticlesRepository: ArticlesRepository = {
  async listPublished({ page = 1, categorySlug, limit = 12 } = {}) {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'articles',
      ...PUBLIC,
      depth: 1,
      where: { and: [PUBLISHED, ...(categorySlug ? [{ 'category.slug': { equals: categorySlug } }] : [])] },
      sort: '-publishedAt',
      page,
      limit,
    })
    return { items: result.docs.map(toArticle), page: result.page ?? 1, totalPages: result.totalPages, totalItems: result.totalDocs }
  },
  async getBySlug(slug) {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'articles',
      ...PUBLIC,
      depth: 1,
      where: { and: [PUBLISHED, { slug: { equals: slug } }] },
      limit: 1,
    })
    return docs[0] ? toArticle(docs[0]) : null
  },
  async sitemapEntries() {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'articles',
      ...PUBLIC,
      depth: 0,
      where: PUBLISHED,
      select: { slug: true, updatedAt: true },
      pagination: false,
    })
    return docs.map((doc) => ({ path: routes.article(doc.slug), lastModified: doc.updatedAt }))
  },
}

const referencePath: Record<string, (slug: string) => string> = {
  articles: routes.article,
  services: routes.service,
  'job-categories': routes.jobCategory,
}

export const payloadRedirectsRepository: RedirectsRepository = {
  async find(path) {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'redirects',
      overrideAccess: true,
      depth: 1,
      where: { from: { equals: path } },
      limit: 1,
    })
    const redirect = docs[0]
    if (!redirect) return null

    let destination: string | null = null
    if (redirect.to?.type === 'custom') {
      destination = redirect.to.url ?? null
    } else if (redirect.to?.reference) {
      const { relationTo, value } = redirect.to.reference
      const slug = typeof value === 'object' && value && 'slug' in value ? (value.slug as string) : null
      const build = referencePath[relationTo]
      destination = slug && build ? build(slug) : null
    }
    return destination ? { destination, permanent: redirect.type !== '302' } : null
  },
}
