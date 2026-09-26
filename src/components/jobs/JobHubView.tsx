import type { ReactNode } from 'react'
import { JobCard } from '@/components/jobs/JobCard'
import { JobsSidebar } from '@/components/jobs/JobsSidebar'
import { NoJobsState } from '@/components/jobs/NoJobsState'
import { PageHeader } from '@/components/layout/PageHeader'
import { ArrowLink } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import type { Paginated } from '@/domain/content/types'
import type { JobSummary } from '@/domain/jobs/types'
import type { loadJobBrowseData } from '@/lib/jobs-browse'
import type { Crumb } from '@/lib/seo/jsonld/breadcrumbs'
import { routes } from '@/lib/routes'

type Props = {
  breadcrumbs: Crumb[]
  eyebrow: string
  title: string
  intro: string | null
  results: Paginated<JobSummary>
  basePath: string
  browse: Awaited<ReturnType<typeof loadJobBrowseData>>
  activeCategory?: string
  activeLocation?: string
  /** Contextual internal links rendered under the results (related hubs, services). */
  related?: ReactNode
}

/** Shared layout for category, location and category-in-location job hubs. */
export function JobHubView({
  breadcrumbs,
  eyebrow,
  title,
  intro,
  results,
  basePath,
  browse,
  activeCategory,
  activeLocation,
  related,
}: Props) {
  const paragraphs = intro?.split(/\n{2,}/).filter(Boolean) ?? []
  return (
    <>
      <PageHeader
        breadcrumbs={breadcrumbs}
        eyebrow={eyebrow}
        title={title}
        lead={paragraphs.length > 0 ? paragraphs.map((p) => <p key={p.slice(0, 32)} className="[&+p]:mt-3">{p}</p>) : undefined}
      >
        <ArrowLink href={routes.jobs()}>Search all vacancies</ArrowLink>
      </PageHeader>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_18rem] lg:gap-16 lg:py-16">
        <div>
          <section aria-labelledby="hub-results">
            <h2 id="hub-results" className="text-xl font-bold">
              {results.totalItems === 0
                ? 'No open vacancies right now'
                : `${results.totalItems} open ${results.totalItems === 1 ? 'vacancy' : 'vacancies'}`}
            </h2>
            <div className="mt-6">
              {results.items.length > 0 ? (
                <ul className="grid gap-4">
                  {results.items.map((job) => (
                    <li key={job.id}>
                      <JobCard job={job} />
                    </li>
                  ))}
                </ul>
              ) : (
                <NoJobsState title="No open vacancies in this area right now" />
              )}
            </div>
            <Pagination
              page={results.page}
              totalPages={results.totalPages}
              hrefFor={(page) => (page > 1 ? `${basePath}?page=${page}` : basePath)}
            />
          </section>
          {related && <div className="mt-14 space-y-8">{related}</div>}
        </div>

        <JobsSidebar
          categories={browse.categories}
          categoryCounts={browse.categoryCounts}
          locations={browse.locations}
          locationCounts={browse.locationCounts}
          activeCategory={activeCategory}
          activeLocation={activeLocation}
        />
      </div>
    </>
  )
}
