import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { ArticleCard } from '@/components/cards/ArticleCard'
import { PageHeader } from '@/components/layout/PageHeader'
import { ArrowLink } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { articlesRepo, taxonomyRepo } from '@/data'
import { redirectOrNotFound } from '@/lib/cms-redirect'
import { parseJobFilters, type SearchParams } from '@/lib/jobs-search'
import { routes } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo/metadata'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> }

const load = cache(async (slug: string, page: number) => {
  const category = await taxonomyRepo.getArticleCategory(slug)
  if (!category) return null
  const articles = await articlesRepo.listPublished({ categorySlug: slug, page, limit: 12 })
  return { category, articles }
})

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = parseJobFilters(await searchParams).page ?? 1
  const data = await load(slug, page)
  if (!data || data.articles.totalItems === 0) return { title: 'Page not found' }
  return buildMetadata({
    title: data.category.seo.title ?? `${data.category.name}: Career Advice`,
    description: data.category.seo.description ?? data.category.description ?? `${data.category.name} guides from Job Link Uganda.`,
    path: routes.articleCategory(slug),
    indexable: page === 1,
  })
}

export default async function ArticleCategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const page = parseJobFilters(await searchParams).page ?? 1
  const data = await load(slug, page)
  if (!data) return redirectOrNotFound(routes.articleCategory(slug))
  // A topic with no published guides would be an empty page: don't serve it.
  if (data.articles.totalItems === 0) notFound()
  const { category, articles } = data

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { name: 'Career resources', path: routes.careerResources() },
          { name: category.name, path: routes.articleCategory(category.slug) },
        ]}
        eyebrow="Career resources"
        title={category.name}
        lead={category.description}
      >
        <ArrowLink href={routes.careerResources()}>All career resources</ArrowLink>
      </PageHeader>
      <div className="container-page py-12 lg:py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.items.map((a, i) => (
            <ArticleCard key={a.slug} article={a} index={i % 3} headingLevel="h2" />
          ))}
        </div>
        <Pagination
          page={articles.page}
          totalPages={articles.totalPages}
          hrefFor={(p) => (p > 1 ? `${routes.articleCategory(slug)}?page=${p}` : routes.articleCategory(slug))}
        />
      </div>
    </>
  )
}
