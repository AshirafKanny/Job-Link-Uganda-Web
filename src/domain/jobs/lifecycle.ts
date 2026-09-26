import { routes } from '@/lib/routes'
import type { CloseReason, Job } from './types'

/** Jobs without a closing date stop being advertised after this many days. */
export const DEFAULT_VALIDITY_DAYS = 30
/** Closed job pages stay visible (noindex) for this long, then are retired. */
export const RETIRE_AFTER_DAYS = 90

const DAY_MS = 24 * 60 * 60 * 1000
/** Uganda (EAT) is UTC+3 all year, with no daylight saving. */
const KAMPALA_OFFSET_MS = 3 * 60 * 60 * 1000

type LifecycleInput = Pick<
  Job,
  'status' | 'closeReason' | 'datePosted' | 'closingDate' | 'closedAt' | 'retirement' | 'category'
>

export type JobLifecycle =
  /** Draft, or not yet published: the URL must 404. */
  | { state: 'unpublished' }
  | {
      state: 'open'
      validThrough: Date
      indexable: true
      includeStructuredData: true
      includeInSitemap: true
      includeInListings: true
    }
  | {
      state: 'closed'
      closedAt: Date
      reason: CloseReason
      indexable: false
      includeStructuredData: false
      includeInSitemap: false
      includeInListings: false
    }
  | { state: 'retired'; response: { type: 'gone' } | { type: 'redirect'; location: string } }

/**
 * A closing date is a calendar day; the vacancy stays open until the end of
 * that day in Kampala time.
 */
export function endOfKampalaDay(isoDate: string): Date {
  const kampalaWallClock = new Date(new Date(isoDate).getTime() + KAMPALA_OFFSET_MS)
  const ymd = kampalaWallClock.toISOString().slice(0, 10)
  return new Date(`${ymd}T23:59:59.999+03:00`)
}

export function getValidThrough(job: Pick<Job, 'datePosted' | 'closingDate'>): Date {
  if (job.closingDate) return endOfKampalaDay(job.closingDate)
  return new Date(new Date(job.datePosted).getTime() + DEFAULT_VALIDITY_DAYS * DAY_MS)
}

/**
 * Derives the public state of a job from its editorial status and dates.
 * Every job page, listing, sitemap and structured-data decision goes through
 * this function, so expiry never depends on someone remembering to close a job.
 */
export function getJobLifecycle(job: LifecycleInput, now: Date = new Date()): JobLifecycle {
  if (job.status === 'draft') return { state: 'unpublished' }

  const validThrough = getValidThrough(job)
  const isPastDeadline = validThrough.getTime() <= now.getTime()

  if (job.status === 'open' && !isPastDeadline) {
    return {
      state: 'open',
      validThrough,
      indexable: true,
      includeStructuredData: true,
      includeInSitemap: true,
      includeInListings: true,
    }
  }

  const closedAt =
    job.status === 'closed' && job.closedAt
      ? new Date(Math.min(new Date(job.closedAt).getTime(), validThrough.getTime()))
      : validThrough
  const reason: CloseReason = job.status === 'closed' && job.closeReason ? job.closeReason : 'deadline'

  if (now.getTime() - closedAt.getTime() >= RETIRE_AFTER_DAYS * DAY_MS) {
    return {
      state: 'retired',
      response:
        job.retirement === 'redirect-to-category'
          ? { type: 'redirect', location: routes.jobCategory(job.category.slug) }
          : { type: 'gone' },
    }
  }

  return {
    state: 'closed',
    closedAt,
    reason,
    indexable: false,
    includeStructuredData: false,
    includeInSitemap: false,
    includeInListings: false,
  }
}
