import type { Metadata } from 'next'
import Link from 'next/link'
import { cache } from 'react'
import { JobHubView } from '@/components/jobs/JobHubView'
import { overseasRecruitmentEnabled } from '@/config/features'
import { jobsRepo, taxonomyRepo } from '@/data'
import { redirectOrNotFound } from '@/lib/cms-redirect'
import { loadJobBrowseData } from '@/lib/jobs-browse'
import { parseJobFilters, type SearchParams } from '@/lib/jobs-search'
import { routes } from '@/lib/routes'
import { hasEditorialContent, isJobHubIndexable } from '@/lib/seo/indexation'
import { buildMetadata } from '@/lib/seo/metadata'

type Props = { params: Promise<{ location: string }>; searchParams: Promise<SearchParams> }

const getLocation = cache(async (slug: string) => {
  const location = await taxonomyRepo.getLocation(slug)
  return location && (overseasRecruitmentEnabled || location.countryCode === 'UG') ? location : null
})

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { location: slug } = await params
  const { page } = parseJobFilters(await searchParams)
  const [location, browse] = await Promise.all([getLocation(slug), loadJobBrowseData()])
  if (!location) return { title: 'Page not found' }
  const liveJobs = browse.locationCounts[location.slug] ?? 0
  return buildMetadata({
    title: `Jobs in ${location.name}: Current Vacancies`,
    description: `Current job vacancies in ${location.name}, Uganda, recruited by Job Link Uganda, including hospitality and restaurant roles. See requirements and how to apply.`,
    path: routes.jobLocation(location.slug),
    indexable: page === 1 && isJobHubIndexable({ liveJobs, hasEditorialContent: hasEditorialContent(location.intro) }),
  })
}

export default async function JobLocationPage({ params, searchParams }: Props) {
  const { location: slug } = await params
  const { page } = parseJobFilters(await searchParams)
  const location = await getLocation(slug)
  if (!location) return redirectOrNotFound(routes.jobLocation(slug))

  const [results, browse] = await Promise.all([jobsRepo.listOpen({ locationSlug: location.slug, page }), loadJobBrowseData()])
  const categoriesHere = browse.categories.filter(
    (c) => (browse.counts.byCategoryAndLocation[`${c.slug}|${location.slug}`] ?? 0) > 0,
  )

  return (
    <JobHubView
      breadcrumbs={[
        { name: 'Jobs', path: routes.jobs() },
        { name: `Jobs in ${location.name}`, path: routes.jobLocation(location.slug) },
      ]}
      eyebrow="Jobs by location"
      title={`Jobs in ${location.name}`}
      intro={location.intro}
      results={results}
      basePath={routes.jobLocation(location.slug)}
      browse={browse}
      activeLocation={location.slug}
      related={
        categoriesHere.length > 0 && (
          <nav aria-labelledby="related-hubs" className="border-t border-line pt-8">
            <h2 id="related-hubs" className="text-xl font-bold">
              Jobs in {location.name} by category
            </h2>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
              {categoriesHere.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={routes.jobCategoryInLocation(c.slug, location.slug)}
                    className="font-semibold underline-offset-4 hover:underline"
                  >
                    {c.name} jobs in {location.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )
      }
    />
  )
}
