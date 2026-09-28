import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleCard } from '@/components/cards/ArticleCard'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { Icon } from '@/components/ui/Icon'
import { Pagination } from '@/components/ui/Pagination'
import { articlesRepo, taxonomyRepo } from '@/data'
import { parseJobFilters, type SearchParams } from '@/lib/jobs-search'
import { routes } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo/metadata'

export const revalidate = 3600

type Props = { searchParams: Promise<SearchParams> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { page } = parseJobFilters(await searchParams)
  return buildMetadata({
    title: 'Career Advice: CVs, Interviews and Job Search',
    description:
      'Practical career advice for job seekers in Uganda: CV writing, interview preparation, hospitality careers and avoiding scams, plus hiring guides.',
    path: routes.careerResources(),
    indexable: page === 1,
  })
}

export default async function CareerResourcesPage({ searchParams }: Props) {
  const { page } = parseJobFilters(await searchParams)
  const [articles, categories] = await Promise.all([
    articlesRepo.listPublished({ page, limit: 12 }),
    taxonomyRepo.listArticleCategories(),
  ])

  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: 'Career resources', path: routes.careerResources() }]}
        eyebrow="Career resources"
        title="Advice for finding work and hiring well"
        lead="Practical guides for job seekers in Uganda, from writing a CV to preparing for interviews, plus hiring guidance for employers."
      >
        <nav aria-label="Topics">
          <ul className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={routes.articleCategory(c.slug)}
                  className="inline-flex min-h-10 items-center rounded-control border border-line-strong bg-surface px-3.5 text-sm font-semibold transition-colors hover:border-ink"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <div className="container-page py-12 lg:py-16">
        <Link
          href={routes.recruitmentSafety()}
          className="group mb-10 flex items-start gap-4 border-l-4 border-brand-yellow bg-surface-muted p-5 sm:items-center sm:p-6"
        >
          <Icon name="shield" size={26} className="shrink-0 text-ink" />
          <span className="flex-1">
            <span className="block font-display text-lg font-bold group-hover:underline group-hover:underline-offset-4">
              How to recognise a genuine job opportunity
            </span>
            <span className="block text-ink-muted">Six practical checks before you accept any job offer.</span>
          </span>
          <Icon name="arrow-right" size={22} className="hidden shrink-0 transition-transform group-hover:translate-x-1 sm:block" />
        </Link>

        {articles.items.length > 0 ? (
          <>
            <h2 className="sr-only">Latest guides</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.items.map((a, i) => (
                <ArticleCard key={a.slug} article={a} index={i % 3} />
              ))}
            </div>
            <Pagination
              page={articles.page}
              totalPages={articles.totalPages}
              hrefFor={(p) => (p > 1 ? `${routes.careerResources()}?page=${p}` : routes.careerResources())}
            />
          </>
        ) : (
          <EmptyState icon="document" title="New guides are on the way">
            We are preparing practical guides on CVs, interviews and hospitality careers.
          </EmptyState>
        )}
      </div>
    </>
  )
}
