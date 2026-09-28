import type { Metadata } from 'next'
import { JobCard } from '@/components/jobs/JobCard'
import { JobSearchForm } from '@/components/jobs/JobSearchForm'
import { JobsSidebar } from '@/components/jobs/JobsSidebar'
import { NoJobsState } from '@/components/jobs/NoJobsState'
import { PageHeader } from '@/components/layout/PageHeader'
import { Pagination } from '@/components/ui/Pagination'
import { jobsRepo } from '@/data'
import { loadJobBrowseData } from '@/lib/jobs-browse'
import { jobFiltersQuery, parseJobFilters, type SearchParams } from '@/lib/jobs-search'
import { routes } from '@/lib/routes'
import { isRefinedListing } from '@/lib/seo/indexation'
import { buildMetadata } from '@/lib/seo/metadata'

type Props = { searchParams: Promise<SearchParams> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  return buildMetadata({
    title: 'Jobs in Uganda: Current Vacancies',
    description:
      'Current job vacancies in Kampala and across Uganda, including hospitality, restaurant and hotel jobs. Each listing shows the requirements and how to apply.',
    path: routes.jobs(),
    // Searches, filters and deeper pages are noindex and canonicalise to /jobs.
    indexable: !isRefinedListing(params),
  })
}

export default async function JobsPage({ searchParams }: Props) {
  const filters = parseJobFilters(await searchParams)
  const [results, browse] = await Promise.all([jobsRepo.listOpen(filters), loadJobBrowseData()])
  const refined = isRefinedListing(await searchParams)

  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: 'Jobs', path: routes.jobs() }]}
        eyebrow="Current vacancies"
        title="Jobs in Uganda"
        lead="Vacancies Job Link Uganda is currently recruiting for. Each listing explains the role, the requirements and exactly how to apply."
      >
        <JobSearchForm categories={browse.categories} locations={browse.locations} values={filters} />
      </PageHeader>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_18rem] lg:gap-16 lg:py-16">
        <section aria-labelledby="results-heading">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="results-heading" className="text-xl font-bold">
              {results.totalItems === 0
                ? 'No vacancies found'
                : `${results.totalItems} ${results.totalItems === 1 ? 'vacancy' : 'vacancies'}${refined ? ' matching your search' : ''}`}
            </h2>
            {results.totalPages > 1 && (
              <p className="text-sm text-ink-subtle">
                Page {results.page} of {results.totalPages}
              </p>
            )}
          </div>

          <div className="mt-6">
            {results.items.length > 0 ? (
              <ul className="grid gap-4">
                {results.items.map((job) => (
                  <li key={job.id}>
                    <JobCard job={job} headingLevel="h3" />
                  </li>
                ))}
              </ul>
            ) : (
              <NoJobsState filtered={refined} />
            )}
          </div>

          <Pagination
            page={results.page}
            totalPages={results.totalPages}
            hrefFor={(page) => `${routes.jobs()}${jobFiltersQuery(filters, page)}`}
          />
        </section>

        <JobsSidebar
          categories={browse.categories}
          categoryCounts={browse.categoryCounts}
          locations={browse.locations}
          locationCounts={browse.locationCounts}
          activeCategory={filters.categorySlug}
          activeLocation={filters.locationSlug}
        />
      </div>
    </>
  )
}
