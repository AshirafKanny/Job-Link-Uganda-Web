import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/config/site'
import { articlesRepo, jobsRepo, servicesRepo, taxonomyRepo, type SitemapEntry } from '@/data'
import { loadJobBrowseData } from '@/lib/jobs-browse'
import { routes } from '@/lib/routes'
import { hasEditorialContent, isJobCombinationIndexable, isJobHubIndexable } from '@/lib/seo/indexation'

export const revalidate = 3600

/**
 * Only indexable, existing pages are listed. Every dynamic section applies
 * the same indexation rules as the pages themselves, so the sitemap can never
 * advertise a noindex, empty or closed page.
 */
const STATIC_PATHS = [
  routes.home(),
  routes.jobs(),
  routes.services(),
  routes.hireStaff(),
  routes.forJobSeekers(),
  routes.howItWorks(),
  routes.recruitmentSafety(),
  routes.careerResources(),
  routes.about(),
  routes.contact(),
  routes.privacy(),
  routes.terms(),
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString()
  const [jobs, articles, services, browse, articleCategories] = await Promise.all([
    jobsRepo.sitemapEntries(),
    articlesRepo.sitemapEntries(),
    servicesRepo.listPublished(),
    loadJobBrowseData(),
    taxonomyRepo.listArticleCategories(),
  ])

  const entries: SitemapEntry[] = [
    ...STATIC_PATHS.map((path) => ({ path, lastModified: now })),
    ...services.map((s) => ({ path: routes.service(s.slug), lastModified: s.updatedAt })),
    // Open vacancies only (closed and retired jobs are excluded by the lifecycle).
    ...jobs,
    ...articles,
  ]

  for (const category of browse.categories) {
    const liveJobs = browse.categoryCounts[category.slug] ?? 0
    if (isJobHubIndexable({ liveJobs, hasEditorialContent: hasEditorialContent(category.intro) })) {
      entries.push({ path: routes.jobCategory(category.slug), lastModified: now })
    }
    for (const location of browse.locations) {
      if (isJobCombinationIndexable(browse.counts.byCategoryAndLocation[`${category.slug}|${location.slug}`] ?? 0)) {
        entries.push({ path: routes.jobCategoryInLocation(category.slug, location.slug), lastModified: now })
      }
    }
  }

  for (const location of browse.locations) {
    const liveJobs = browse.locationCounts[location.slug] ?? 0
    if (isJobHubIndexable({ liveJobs, hasEditorialContent: hasEditorialContent(location.intro) })) {
      entries.push({ path: routes.jobLocation(location.slug), lastModified: now })
    }
  }

  const categoryCounts = await Promise.all(
    articleCategories.map(async (c) => ({ c, total: (await articlesRepo.listPublished({ categorySlug: c.slug, limit: 1 })).totalItems })),
  )
  for (const { c, total } of categoryCounts) {
    if (total > 0) entries.push({ path: routes.articleCategory(c.slug), lastModified: now })
  }

  return entries.map(({ path, lastModified }) => ({ url: absoluteUrl(path), lastModified }))
}
