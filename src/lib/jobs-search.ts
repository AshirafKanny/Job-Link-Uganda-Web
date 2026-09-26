import { EMPLOYMENT_TYPES, POSTED_WITHIN_OPTIONS, type EmploymentType, type JobFilters } from '@/domain/jobs/types'

export type SearchParams = Record<string, string | string[] | undefined>

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

/** Parses untrusted query parameters into safe, typed job filters. Invalid values are dropped. */
export function parseJobFilters(params: SearchParams): JobFilters {
  const q = first(params.q)?.trim().slice(0, 80)
  const category = first(params.category)
  const location = first(params.location)
  const type = first(params.type)
  const posted = Number(first(params.posted))
  const page = Number(first(params.page))

  return {
    query: q || undefined,
    categorySlug: category && SLUG.test(category) ? category : undefined,
    locationSlug: location && SLUG.test(location) ? location : undefined,
    employmentType: EMPLOYMENT_TYPES.includes(type as EmploymentType) ? (type as EmploymentType) : undefined,
    postedWithinDays: POSTED_WITHIN_OPTIONS.some((o) => o.days === posted) ? posted : undefined,
    page: Number.isInteger(page) && page > 1 && page <= 500 ? page : 1,
  }
}

/** Serialises filters back into a query string (for pagination links). */
export function jobFiltersQuery(filters: JobFilters, page?: number): string {
  const params = new URLSearchParams()
  if (filters.query) params.set('q', filters.query)
  if (filters.categorySlug) params.set('category', filters.categorySlug)
  if (filters.locationSlug) params.set('location', filters.locationSlug)
  if (filters.employmentType) params.set('type', filters.employmentType)
  if (filters.postedWithinDays) params.set('posted', String(filters.postedWithinDays))
  if (page && page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `?${query}` : ''
}
