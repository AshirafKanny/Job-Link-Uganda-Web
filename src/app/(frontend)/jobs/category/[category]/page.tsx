import type { Metadata } from 'next'
import Link from 'next/link'
import { cache } from 'react'
import { JobHubView } from '@/components/jobs/JobHubView'
import { ArrowLink } from '@/components/ui/Button'
import { servicesRepo, taxonomyRepo, jobsRepo } from '@/data'
import { redirectOrNotFound } from '@/lib/cms-redirect'
import { loadJobBrowseData } from '@/lib/jobs-browse'
import { parseJobFilters, type SearchParams } from '@/lib/jobs-search'
import { routes } from '@/lib/routes'
import { hasEditorialContent, isJobHubIndexable } from '@/lib/seo/indexation'
import { buildMetadata } from '@/lib/seo/metadata'

type Props = { params: Promise<{ category: string }>; searchParams: Promise<SearchParams> }

const getCategory = cache((slug: string) => taxonomyRepo.getJobCategory(slug))

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { category: slug } = await params
  const { page } = parseJobFilters(await searchParams)
  const [category, counts] = await Promise.all([getCategory(slug), loadJobBrowseData()])
  if (!category) return { title: 'Page not found' }
  const liveJobs = counts.categoryCounts[category.slug] ?? 0
  return buildMetadata({
    title: category.seo.title ?? `${category.name} Jobs in Uganda`,
    description:
      category.seo.description ??
      `Current ${category.name.toLowerCase()} job vacancies in Kampala and Uganda, recruited by Job Link Uganda. See the requirements and how to apply.`,
    path: routes.jobCategory(category.slug),
    indexable: page === 1 && isJobHubIndexable({ liveJobs, hasEditorialContent: hasEditorialContent(category.intro) }),
  })
}

export default async function JobCategoryPage({ params, searchParams }: Props) {
  const { category: slug } = await params
  const { page } = parseJobFilters(await searchParams)
  const category = await getCategory(slug)
  if (!category) return redirectOrNotFound(routes.jobCategory(slug))

  const [results, browse, services] = await Promise.all([
    jobsRepo.listOpen({ categorySlug: category.slug, page }),
    loadJobBrowseData(),
    servicesRepo.listPublished(),
  ])
  const parent = category.parentId ? browse.categories.find((c) => c.id === category.parentId) : undefined
  const children = browse.categories.filter((c) => c.parentId === category.id)
  const relatedService = services.find((s) => s.slug === category.relatedServiceSlug)
  const locationsWithJobs = browse.locations.filter(
    (l) => (browse.counts.byCategoryAndLocation[`${category.slug}|${l.slug}`] ?? 0) > 0,
  )

  return (
    <JobHubView
      breadcrumbs={[
        { name: 'Jobs', path: routes.jobs() },
        ...(parent ? [{ name: `${parent.name} jobs`, path: routes.jobCategory(parent.slug) }] : []),
        { name: `${category.name} jobs`, path: routes.jobCategory(category.slug) },
      ]}
      eyebrow="Jobs by category"
      title={`${category.name} jobs in Uganda`}
      intro={category.intro}
      results={results}
      basePath={routes.jobCategory(category.slug)}
      browse={browse}
      activeCategory={category.slug}
      related={
        <>
          {(children.length > 0 || locationsWithJobs.length > 0) && (
            <nav aria-labelledby="related-hubs" className="border-t border-line pt-8">
              <h2 id="related-hubs" className="text-xl font-bold">
                Narrow your search
              </h2>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                {children.map((child) => (
                  <li key={child.slug}>
                    <Link href={routes.jobCategory(child.slug)} className="font-semibold underline-offset-4 hover:underline">
                      {child.name} jobs
                    </Link>
                  </li>
                ))}
                {locationsWithJobs.map((l) => (
                  <li key={l.slug}>
                    <Link
                      href={routes.jobCategoryInLocation(category.slug, l.slug)}
                      className="font-semibold underline-offset-4 hover:underline"
                    >
                      {category.name} jobs in {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          {relatedService && (
            <aside aria-labelledby="hiring-heading" className="border-l-4 border-brand-red bg-surface-muted p-6">
              <h2 id="hiring-heading" className="text-lg font-bold">
                Hiring for these roles?
              </h2>
              <p className="mt-2 text-ink-muted">{relatedService.summary}</p>
              <ArrowLink href={routes.service(relatedService.slug)} className="mt-3">
                {relatedService.title}
              </ArrowLink>
            </aside>
          )}
        </>
      }
    />
  )
}
