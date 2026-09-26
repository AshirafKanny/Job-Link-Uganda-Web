import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { JobHubView } from '@/components/jobs/JobHubView'
import { overseasRecruitmentEnabled } from '@/config/features'
import { jobsRepo, taxonomyRepo } from '@/data'
import { loadJobBrowseData } from '@/lib/jobs-browse'
import { parseJobFilters, type SearchParams } from '@/lib/jobs-search'
import { routes } from '@/lib/routes'
import { isJobCombinationIndexable, shouldRenderJobCombination } from '@/lib/seo/indexation'
import { buildMetadata } from '@/lib/seo/metadata'

type Props = { params: Promise<{ category: string; location: string }>; searchParams: Promise<SearchParams> }

/**
 * Category × location pages exist only while they have live vacancies
 * (404 otherwise) and are indexable only with at least three, so the
 * combination space can never produce thin or empty indexed pages.
 */
const load = cache(async (categorySlug: string, locationSlug: string) => {
  const [category, location, browse] = await Promise.all([
    taxonomyRepo.getJobCategory(categorySlug),
    taxonomyRepo.getLocation(locationSlug),
    loadJobBrowseData(),
  ])
  if (!category || !location || (!overseasRecruitmentEnabled && location.countryCode !== 'UG')) return null
  const own = browse.counts.byCategoryAndLocation
  const children = browse.categories.filter((c) => c.parentId === category.id)
  const liveJobs = [category, ...children].reduce((sum, c) => sum + (own[`${c.slug}|${location.slug}`] ?? 0), 0)
  return { category, location, browse, liveJobs, parent: browse.categories.find((c) => c.id === category.parentId) }
})

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { category, location } = await params
  const { page } = parseJobFilters(await searchParams)
  const data = await load(category, location)
  if (!data || !shouldRenderJobCombination(data.liveJobs)) return { title: 'Page not found' }
  return buildMetadata({
    title: `${data.category.name} Jobs in ${data.location.name}`,
    description: `Open ${data.category.name.toLowerCase()} vacancies in ${data.location.name}, recruited by Job Link Uganda. See the requirements and how to apply for each role.`,
    path: routes.jobCategoryInLocation(data.category.slug, data.location.slug),
    indexable: page === 1 && isJobCombinationIndexable(data.liveJobs),
  })
}

export default async function JobCategoryLocationPage({ params, searchParams }: Props) {
  const { category, location } = await params
  const { page } = parseJobFilters(await searchParams)
  const data = await load(category, location)
  if (!data || !shouldRenderJobCombination(data.liveJobs)) notFound()

  const results = await jobsRepo.listOpen({ categorySlug: data.category.slug, locationSlug: data.location.slug, page })
  const path = routes.jobCategoryInLocation(data.category.slug, data.location.slug)

  return (
    <JobHubView
      breadcrumbs={[
        { name: 'Jobs', path: routes.jobs() },
        { name: `${data.category.name} jobs`, path: routes.jobCategory(data.category.slug) },
        { name: `In ${data.location.name}`, path },
      ]}
      eyebrow={`Jobs in ${data.location.name}`}
      title={`${data.category.name} jobs in ${data.location.name}`}
      intro={null}
      results={results}
      basePath={path}
      browse={data.browse}
      activeCategory={data.category.slug}
      activeLocation={data.location.slug}
    />
  )
}
