import 'server-only'
import type { Where } from 'payload'
import { overseasRecruitmentEnabled } from '@/config/features'
import { DEFAULT_VALIDITY_DAYS, getJobLifecycle } from '@/domain/jobs/lifecycle'
import type { Job, JobFilters } from '@/domain/jobs/types'
import { routes } from '@/lib/routes'
import type { JobsRepository, OpenJobCounts } from '../repositories'
import { getPayloadClient } from './client'
import { toJob, toJobSummary } from './mappers'

const PAGE_SIZE = 20
const DAY_MS = 86_400_000

/** Never load private fields for public pages, even into server memory. */
const PUBLIC_QUERY = {
  depth: 1,
  select: { internalNotes: false },
  populate: { employers: { publicName: true, website: true } },
  overrideAccess: true,
} as const

/**
 * Coarse database filter for "possibly open" jobs. The exact decision is made
 * by getJobLifecycle() afterwards; the 2-day margin absorbs timezone handling
 * of calendar closing dates.
 */
function possiblyOpenWhere(now: Date): Where[] {
  return [
    { status: { equals: 'open' } },
    {
      or: [
        { closingDate: { greater_than: new Date(now.getTime() - 2 * DAY_MS).toISOString() } },
        {
          and: [
            { closingDate: { exists: false } },
            { publishedAt: { greater_than: new Date(now.getTime() - DEFAULT_VALIDITY_DAYS * DAY_MS).toISOString() } },
          ],
        },
      ],
    },
  ]
}

function scopeWhere(filters: Pick<JobFilters, 'categorySlug' | 'locationSlug'> = {}): Where[] {
  const where: Where[] = []
  // Defence in depth: overseas vacancies never reach public pages while the feature is off.
  if (!overseasRecruitmentEnabled) where.push({ 'location.countryCode': { equals: 'UG' } })
  if (filters.categorySlug) {
    where.push({
      or: [{ 'category.slug': { equals: filters.categorySlug } }, { 'category.parent.slug': { equals: filters.categorySlug } }],
    })
  }
  if (filters.locationSlug) where.push({ 'location.slug': { equals: filters.locationSlug } })
  return where
}

const isOpenNow = (now: Date) => (job: Job) => getJobLifecycle(job, now).state === 'open'

export const payloadJobsRepository: JobsRepository = {
  async listOpen(filters = {}) {
    const payload = await getPayloadClient()
    const now = new Date()
    const where: Where[] = [...possiblyOpenWhere(now), ...scopeWhere(filters)]
    if (filters.employmentType) where.push({ employmentTypes: { contains: filters.employmentType } })
    if (filters.postedWithinDays) {
      where.push({ publishedAt: { greater_than: new Date(now.getTime() - filters.postedWithinDays * DAY_MS).toISOString() } })
    }
    if (filters.query?.trim()) {
      where.push({ or: [{ title: { like: filters.query.trim() } }, { summary: { like: filters.query.trim() } }] })
    }

    const result = await payload.find({
      collection: 'jobs',
      ...PUBLIC_QUERY,
      where: { and: where },
      sort: '-publishedAt',
      page: Math.max(1, filters.page ?? 1),
      limit: PAGE_SIZE,
    })

    const items = result.docs.map(toJob).filter(isOpenNow(now)).map(toJobSummary)
    return { items, page: result.page ?? 1, totalPages: result.totalPages, totalItems: result.totalDocs }
  },

  async getByRef(ref) {
    if (!/^\d+$/.test(ref)) return null
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'jobs',
      ...PUBLIC_QUERY,
      where: { and: [{ id: { equals: Number(ref) } }, { status: { not_equals: 'draft' } }, ...scopeWhere()] },
      limit: 1,
      pagination: false,
    })
    const doc = result.docs[0]
    return doc ? toJob(doc) : null
  },

  async listFeatured(limit) {
    const payload = await getPayloadClient()
    const now = new Date()
    const result = await payload.find({
      collection: 'jobs',
      ...PUBLIC_QUERY,
      where: { and: [...possiblyOpenWhere(now), ...scopeWhere()] },
      sort: ['-featured', '-publishedAt'],
      limit: limit * 2,
    })
    return result.docs.map(toJob).filter(isOpenNow(now)).slice(0, limit).map(toJobSummary)
  },

  async countOpen(filters = {}) {
    const payload = await getPayloadClient()
    const now = new Date()
    // Counts are exact: fetch the candidate set (small) and apply the lifecycle rule.
    const result = await payload.find({
      collection: 'jobs',
      ...PUBLIC_QUERY,
      where: { and: [...possiblyOpenWhere(now), ...scopeWhere(filters)] },
      pagination: false,
    })
    return result.docs.map(toJob).filter(isOpenNow(now)).length
  },

  async openCounts() {
    const payload = await getPayloadClient()
    const now = new Date()
    const result = await payload.find({
      collection: 'jobs',
      ...PUBLIC_QUERY,
      where: { and: [...possiblyOpenWhere(now), ...scopeWhere()] },
      pagination: false,
    })
    const counts: OpenJobCounts = { total: 0, byCategory: {}, byLocation: {}, byCategoryAndLocation: {} }
    for (const job of result.docs.map(toJob).filter(isOpenNow(now))) {
      counts.total++
      counts.byCategory[job.category.slug] = (counts.byCategory[job.category.slug] ?? 0) + 1
      counts.byLocation[job.location.slug] = (counts.byLocation[job.location.slug] ?? 0) + 1
      const key = `${job.category.slug}|${job.location.slug}`
      counts.byCategoryAndLocation[key] = (counts.byCategoryAndLocation[key] ?? 0) + 1
    }
    return counts
  },

  async listRelatedOpen(job, limit = 4) {
    const { items } = await this.listOpen({ categorySlug: job.category.slug })
    const sameCategory = items.filter((j) => j.ref !== job.ref)
    const sameLocationFirst = [
      ...sameCategory.filter((j) => j.location.slug === job.location.slug),
      ...sameCategory.filter((j) => j.location.slug !== job.location.slug),
    ]
    return sameLocationFirst.slice(0, limit)
  },

  async sitemapEntries() {
    const payload = await getPayloadClient()
    const now = new Date()
    const result = await payload.find({
      collection: 'jobs',
      ...PUBLIC_QUERY,
      where: { and: [...possiblyOpenWhere(now), ...scopeWhere()] },
      pagination: false,
    })
    return result.docs
      .map(toJob)
      .filter(isOpenNow(now))
      .map((job) => ({ path: routes.job(job), lastModified: job.updatedAt }))
  },
}
