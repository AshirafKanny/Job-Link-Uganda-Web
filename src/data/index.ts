import 'server-only'
import {
  payloadArticlesRepository,
  payloadRedirectsRepository,
  payloadServicesRepository,
  payloadTaxonomyRepository,
} from './payload/content'
import { payloadAnalyticsRepository } from './payload/analytics'
import { payloadEnquiriesRepository } from './payload/enquiries'
import { payloadJobsRepository } from './payload/jobs'
import { payloadSettingsRepository } from './payload/settings'
import type {
  AnalyticsRepository,
  ArticlesRepository,
  EnquiriesRepository,
  JobsRepository,
  RedirectsRepository,
  ServicesRepository,
  SettingsRepository,
  TaxonomyRepository,
} from './repositories'

/**
 * The website's only entry point to content. To change CMS, database or
 * storage, provide new implementations of the repository interfaces here;
 * pages and components do not change.
 */
export const jobsRepo: JobsRepository = payloadJobsRepository
export const taxonomyRepo: TaxonomyRepository = payloadTaxonomyRepository
export const servicesRepo: ServicesRepository = payloadServicesRepository
export const articlesRepo: ArticlesRepository = payloadArticlesRepository
export const redirectsRepo: RedirectsRepository = payloadRedirectsRepository
export const settingsRepo: SettingsRepository = payloadSettingsRepository
export const enquiriesRepo: EnquiriesRepository = payloadEnquiriesRepository
export const analyticsRepo: AnalyticsRepository = payloadAnalyticsRepository

export type { AnalyticsSummary, SitemapEntry } from './repositories'
