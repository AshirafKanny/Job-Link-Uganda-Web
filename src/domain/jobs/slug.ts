import { slugify } from '@/lib/slugify'
import type { Job } from './types'

/**
 * Job URLs follow /jobs/[title-location-id], e.g.
 * /jobs/restaurant-supervisor-kampala-jl1042. Only the trailing reference
 * identifies the job; the words are descriptive. If the title or location
 * changes, the old URL still resolves and 301s to the new canonical slug.
 */
const REF_PATTERN = /-jl(\d+)$/

export function jobSlug(job: Pick<Job, 'ref' | 'title' | 'location'>): string {
  const words = slugify(`${job.title} ${job.location.name}`).split('-').slice(0, 12).join('-')
  return `${words}-jl${job.ref}`
}

/** Extracts the job reference from a slug, or null if the slug is not a job slug. */
export function parseJobRef(slug: string): string | null {
  const match = REF_PATTERN.exec(slug)
  return match?.[1] ?? null
}
