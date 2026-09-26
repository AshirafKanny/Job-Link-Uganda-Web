import type { JobCategory, Location, RichText } from '@/domain/content/types'

/** Mirrors schema.org / Google JobPosting employmentType values. */
export const EMPLOYMENT_TYPES = [
  'FULL_TIME',
  'PART_TIME',
  'CONTRACTOR',
  'TEMPORARY',
  'INTERN',
  'VOLUNTEER',
  'PER_DIEM',
  'OTHER',
] as const
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number]

export const SALARY_UNITS = ['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'] as const
export type SalaryUnit = (typeof SALARY_UNITS)[number]

/** Editorial status set by staff. The effective public state also depends on dates. */
export const JOB_STATUSES = ['draft', 'open', 'closed'] as const
export type JobStatus = (typeof JOB_STATUSES)[number]

export const CLOSE_REASONS = ['filled', 'deadline', 'withdrawn'] as const
export type CloseReason = (typeof CLOSE_REASONS)[number]

/** What happens to a job URL once the closed page has been retired. */
export const RETIREMENT_BEHAVIOURS = ['gone', 'redirect-to-category'] as const
export type RetirementBehaviour = (typeof RETIREMENT_BEHAVIOURS)[number]

export type Salary = {
  currency: string
  min: number
  max: number | null
  unit: SalaryUnit
  note: string | null
}

export type HiringOrganization =
  | { kind: 'named'; name: string; url: string | null }
  /** Employer asked not to be named; Job Link Uganda recruits on their behalf. */
  | { kind: 'confidential' }

export type ApplicationMethod = 'instructions' | 'whatsapp' | 'online'

export type Job = {
  id: string
  /** Stable public reference used in URLs, e.g. "1042" → "…-jl1042". */
  ref: string
  title: string
  summary: string
  category: Pick<JobCategory, 'name' | 'slug'>
  location: Pick<Location, 'name' | 'slug' | 'region' | 'countryCode'>
  employmentTypes: EmploymentType[]
  hiringOrganization: HiringOrganization
  responsibilities: string[]
  requirements: string[]
  experience: string | null
  benefits: string[]
  additionalDetails: RichText | null
  salary: Salary | null
  application: { method: ApplicationMethod; instructions: string }
  status: JobStatus
  featured: boolean
  closeReason: CloseReason | null
  /** ISO timestamps. */
  datePosted: string
  closingDate: string | null
  closedAt: string | null
  updatedAt: string
  retirement: RetirementBehaviour
}

export type JobSummary = Pick<
  Job,
  'id' | 'ref' | 'title' | 'summary' | 'category' | 'location' | 'employmentTypes' | 'hiringOrganization' | 'salary' | 'datePosted' | 'closingDate'
>

export type JobFilters = {
  query?: string
  categorySlug?: string
  locationSlug?: string
  employmentType?: EmploymentType
  /** Only jobs posted within this many days. */
  postedWithinDays?: number
  page?: number
}

/** Options offered in the "Date posted" filter. */
export const POSTED_WITHIN_OPTIONS = [
  { days: 1, label: 'Last 24 hours' },
  { days: 7, label: 'Last 7 days' },
  { days: 30, label: 'Last 30 days' },
] as const

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACTOR: 'Contract',
  TEMPORARY: 'Temporary',
  INTERN: 'Internship',
  VOLUNTEER: 'Volunteer',
  PER_DIEM: 'Daily paid',
  OTHER: 'Other',
}
