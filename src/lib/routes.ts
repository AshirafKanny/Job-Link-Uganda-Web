/**
 * Single source of truth for public URLs. Components, sitemaps, breadcrumbs,
 * canonicals and redirects must build paths through these helpers.
 */
import { jobSlug } from '@/domain/jobs/slug'
import type { Job } from '@/domain/jobs/types'

export const routes = {
  home: () => '/',

  // Job seekers
  jobs: () => '/jobs',
  jobCategory: (categorySlug: string) => `/jobs/category/${categorySlug}`,
  jobLocation: (locationSlug: string) => `/jobs/location/${locationSlug}`,
  jobCategoryInLocation: (categorySlug: string, locationSlug: string) =>
    `/jobs/category/${categorySlug}/location/${locationSlug}`,
  job: (job: Pick<Job, 'ref' | 'title' | 'location'>) => `/jobs/${jobSlug(job)}`,
  forJobSeekers: () => '/for-job-seekers',

  // Employers (the recruitment-services hub doubles as the employer hub)
  services: () => '/recruitment-services',
  service: (serviceSlug: string) => `/recruitment-services/${serviceSlug}`,
  hireStaff: () => '/hire-staff',

  // Trust & company
  howItWorks: () => '/how-it-works',
  recruitmentSafety: () => '/recruitment-safety',
  about: () => '/about',
  contact: () => '/contact',
  privacy: () => '/privacy-policy',
  terms: () => '/terms',

  // Locations (only for places with genuine activity)
  location: (locationSlug: string) => `/locations/${locationSlug}`,

  // Career resources
  careerResources: () => '/career-resources',
  articleCategory: (categorySlug: string) => `/career-resources/category/${categorySlug}`,
  article: (articleSlug: string) => `/career-resources/${articleSlug}`,

  // Feature-gated (see src/config/features.ts)
  overseasJobs: () => '/overseas-jobs',
} as const

/** Well-known service slugs used for deliberate internal links. */
export const serviceSlugs = {
  hospitality: 'hospitality-recruitment',
  restaurant: 'restaurant-staff-recruitment',
  hotel: 'hotel-staff-recruitment',
  general: 'general-recruitment',
} as const

/** Well-known job category slugs used for deliberate internal links. */
export const categorySlugs = {
  hospitality: 'hospitality',
  restaurant: 'restaurant',
  hotel: 'hotel',
  kitchen: 'kitchen',
} as const
