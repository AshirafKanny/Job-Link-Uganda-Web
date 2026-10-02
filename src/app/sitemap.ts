import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/config/site'
import { articlesRepo, jobsRepo, servicesRepo, taxonomyRepo } from '@/data'
import { loadJobBrowseData } from '@/lib/jobs-browse'
import { routes } from '@/lib/routes'
import { isJobCombinationIndexable, isJobHubIndexable } from '@/lib/seo/indexation'

export const revalidate = 3600

/**
 * Only indexable, existing pages are listed. Every dynamic section applies
 * the same indexation rules as the pages themselves, so the sitemap can never
 * advertise a noindex, empty or closed page.
 *
 * `lastmod` is only given where a real content edit date exists (jobs,
 * services, articles). Google ignores lastmod on sites where it is not
 * consistently accurate, so pages without a trustworthy date omit it rather
 * than reporting "now" on every request.
 *
 * At this size one sitemap is correct. Split into a sitemap index
 * (pages / jobs / articles) only once the site approaches thousands of URLs.
 */
const STATIC_PATHS = [
  routes.home(),
  routes.jobs(),
  routes.services(),
  routes.hireStaff(),
  routes.hospitalityTraining(),
  routes.forJobSeekers(),
  routes.howItWorks(),
  routes.recruitmentSafety(),
  routes.careerResources(),
  routes.about(),
  routes.contact(),
  routes.privacy(),
  routes.terms(),
]

type Entry = { path: string; lastModified?: string }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [jobs, articles, services, browse, articleCategories] = await Promise.all([
    jobsRepo.sitemapEntries(),
    articlesRepo.sitemapEntries(),
    servicesRepo.listPublished(),
    loadJobBrowseData(),
    taxonomyRepo.listArticleCategories(),
  ])

  const entries: Entry[] = [
    ...STATIC_PATHS.map((path) => ({ path })),
    ...services.map((s) => ({ path: routes.service(s.slug), lastModified: s.updatedAt })),
    // Open vacancies only (closed and retired jobs are excluded by the lifecycle).
    ...jobs,
    ...articles,
  ]

  // Job hubs: listed only while they contain open vacancies (empty listings are soft-404 risks).
  for (const category of browse.categories) {
    if (isJobHubIndexable(browse.categoryCounts[category.slug] ?? 0)) {
      entries.push({ path: routes.jobCategory(category.slug) })
    }
    for (const location of browse.locations) {
      if (isJobCombinationIndexable(browse.counts.byCategoryAndLocation[`${category.slug}|${location.slug}`] ?? 0)) {
        entries.push({ path: routes.jobCategoryInLocation(category.slug, location.slug) })
      }
    }
  }
  for (const location of browse.locations) {
    if (isJobHubIndexable(browse.locationCounts[location.slug] ?? 0)) {
      entries.push({ path: routes.jobLocation(location.slug) })
    }
  }

  const categoryTotals = await Promise.all(
    articleCategories.map(async (c) => ({
      c,
      total: (await articlesRepo.listPublished({ categorySlug: c.slug, limit: 1 })).totalItems,
    })),
  )
  for (const { c, total } of categoryTotals) {
    if (total > 0) entries.push({ path: routes.articleCategory(c.slug) })
  }

  return entries.map(({ path, lastModified }) => ({
    url: absoluteUrl(path),
    ...(lastModified ? { lastModified } : {}),
  }))
}
