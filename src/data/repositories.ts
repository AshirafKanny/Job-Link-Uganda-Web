import type {
  Article,
  ArticleCategory,
  JobCategory,
  Location,
  Paginated,
  Service,
} from '@/domain/content/types'
import type { Job, JobFilters, JobSummary } from '@/domain/jobs/types'
import type { SiteSettings } from '@/domain/settings/types'

/**
 * Contracts between the website and its content backend. Pages and components
 * depend only on these interfaces and the domain types; the Payload adapter
 * in ./payload is one implementation.
 */

export type SitemapEntry = { path: string; lastModified: string }

export type OpenJobCounts = {
  total: number
  byCategory: Record<string, number>
  byLocation: Record<string, number>
  /** Keyed "category|location". */
  byCategoryAndLocation: Record<string, number>
}

export interface JobsRepository {
  /** Currently open vacancies (lifecycle state "open"), newest first. */
  listOpen(filters?: JobFilters): Promise<Paginated<JobSummary>>
  /** Any non-draft job by public reference, including closed ones (the page decides via lifecycle). */
  getByRef(ref: string): Promise<Job | null>
  /** Open jobs for the home page: featured first, then newest. */
  listFeatured(limit: number): Promise<JobSummary[]>
  countOpen(filters?: Pick<JobFilters, 'categorySlug' | 'locationSlug'>): Promise<number>
  /** Open-vacancy counts keyed by exact category slug and location slug. */
  openCounts(): Promise<OpenJobCounts>
  listRelatedOpen(job: Pick<Job, 'ref' | 'category' | 'location'>, limit?: number): Promise<JobSummary[]>
  sitemapEntries(): Promise<SitemapEntry[]>
}

export interface TaxonomyRepository {
  listJobCategories(): Promise<JobCategory[]>
  getJobCategory(slug: string): Promise<JobCategory | null>
  listLocations(): Promise<Location[]>
  getLocation(slug: string): Promise<Location | null>
  listArticleCategories(): Promise<ArticleCategory[]>
  getArticleCategory(slug: string): Promise<ArticleCategory | null>
}

export interface ServicesRepository {
  listPublished(): Promise<Service[]>
  getBySlug(slug: string): Promise<Service | null>
}

export interface ArticlesRepository {
  listPublished(options?: { page?: number; categorySlug?: string; limit?: number }): Promise<Paginated<Article>>
  getBySlug(slug: string): Promise<Article | null>
  sitemapEntries(): Promise<SitemapEntry[]>
}

export interface RedirectsRepository {
  find(path: string): Promise<{ destination: string; permanent: boolean } | null>
}

export interface SettingsRepository {
  /** Operational business details; falls back to empty values, never to invented ones. */
  get(): Promise<SiteSettings>
}

export type RecruitmentRequestInput = {
  contactName: string
  businessName: string
  phone: string
  email: string | null
  rolesNeeded: string
  numberOfPositions: number | null
  location: string | null
  preferredStartDate: string | null
  message: string | null
  serviceSlug: string | null
  /** Staff to hire, or existing staff to train. */
  enquiryType: 'recruitment' | 'training'
  /** Training package id, for training enquiries. */
  trainingPackage: string | null
  sourcePath: string
}

export type NotificationOutcome =
  | { status: 'sent'; providerId: string | null }
  | { status: 'failed'; error: string }
  | { status: 'skipped'; reason: string }

/** Private employer enquiries. Write-only from the website; never readable publicly. */
export interface EnquiriesRepository {
  /** Stores the enquiry and returns its private record id. */
  createRecruitmentRequest(input: RecruitmentRequestInput): Promise<{ id: number | string }>
  /** True when the same business and phone already sent an enquiry within the window (double submits, retries). */
  hasRecentRecruitmentRequest(
    input: Pick<RecruitmentRequestInput, 'businessName' | 'phone' | 'enquiryType'>,
    withinMs: number,
  ): Promise<boolean>
  /** Records whether the staff email notification went out, so failures are visible in the admin. */
  recordNotification(id: number | string, outcome: NotificationOutcome): Promise<void>
}

export type PageViewInput = {
  path: string
  jobRef: string | null
  visitorId: string
  referrerHost: string | null
  device: 'mobile' | 'tablet' | 'desktop'
}

export type AnalyticsTotals = { pageViews: number; visitors: number; jobViews: number }

export type AnalyticsSummary = {
  rangeDays: number
  totals: AnalyticsTotals
  previous: AnalyticsTotals
  /** One entry per Kampala calendar day in the range, oldest first (zero-filled). */
  daily: { date: string; pageViews: number; visitors: number }[]
  topJobs: { ref: string; views: number; visitors: number }[]
  topPages: { path: string; views: number }[]
  sources: { host: string | null; views: number }[]
  devices: { device: 'mobile' | 'tablet' | 'desktop'; views: number }[]
}

/** Anonymous visit statistics. */
export interface AnalyticsRepository {
  recordView(input: PageViewInput): Promise<void>
  summary(rangeDays: number): Promise<AnalyticsSummary>
}
