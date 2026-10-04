import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { cache } from 'react'
import { ArticleCard } from '@/components/cards/ArticleCard'
import { SafetyCallout } from '@/components/sections/SafetyCallout'
import { JsonLd } from '@/components/seo/JsonLd'
import { Photo } from '@/components/ui/Photo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ButtonLink } from '@/components/ui/Button'
import { business } from '@/config/business'
import { articleImageFor, stockShareImage } from '@/config/visuals'
import { articlesRepo, servicesRepo, taxonomyRepo } from '@/data'
import type { Article } from '@/domain/content/types'
import { redirectOrNotFound } from '@/lib/cms-redirect'
import { formatDate } from '@/lib/format'
import { routes } from '@/lib/routes'
import { articleJsonLd } from '@/lib/seo/jsonld/content'
import { buildMetadata } from '@/lib/seo/metadata'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

const getArticle = cache((slug: string) => articlesRepo.getBySlug(slug))

export async function generateStaticParams() {
  const { items } = await articlesRepo.listPublished({ limit: 100 }).catch(() => ({ items: [] as Article[] }))
  return items.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle((await params).slug)
  if (!article) return { title: 'Page not found' }
  return buildMetadata({
    title: article.seo.title ?? article.title,
    description: article.seo.description ?? article.excerpt,
    path: routes.article(article.slug),
    type: 'article',
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    image: article.seo.image ?? article.featuredImage ?? stockShareImage(articleImageFor(article)),
  })
}

/** Each article routes the reader into the relevant part of the site. */
async function ArticleCta({ article }: { article: Article }) {
  if (article.primaryCta === 'none') return null
  if (article.primaryCta === 'hire-staff') {
    const service = article.relatedServiceSlug ? await servicesRepo.getBySlug(article.relatedServiceSlug) : null
    return (
      <aside aria-label="Recruit with Job Link" className="bg-brand-black p-6 text-white sm:p-8">
        <h2 className="text-2xl font-extrabold text-white">Need help recruiting?</h2>
        <p className="mt-2 text-white/70">
          {service ? service.summary : 'Tell us the roles you need to fill and we will discuss your requirements.'}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={routes.hireStaff()} variant="primary" arrow>
            Request staff
          </ButtonLink>
          {service && (
            <ButtonLink href={routes.service(service.slug)} variant="outline-light">
              {service.title}
            </ButtonLink>
          )}
        </div>
      </aside>
    )
  }
  const category = article.relatedJobCategorySlug ? await taxonomyRepo.getJobCategory(article.relatedJobCategorySlug) : null
  return (
    <aside aria-label="Find a job" className="border-l-4 border-brand-red bg-surface-muted p-6 sm:p-8">
      <h2 className="text-2xl font-extrabold">Ready to apply?</h2>
      <p className="mt-2 text-ink-muted">
        Browse {category ? `current ${category.name.toLowerCase()} vacancies` : 'current vacancies'} and follow the application
        instructions for each role.
      </p>
      <ButtonLink href={category ? routes.jobCategory(category.slug) : routes.jobs()} className="mt-6" arrow>
        {category ? `${category.name} jobs` : 'Browse jobs'}
      </ButtonLink>
    </aside>
  )
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return redirectOrNotFound(routes.article(slug))

  const related = article.category
    ? (await articlesRepo.listPublished({ categorySlug: article.category.slug, limit: 4 })).items.filter((a) => a.slug !== article.slug).slice(0, 3)
    : []
  const updated = article.updatedAt.slice(0, 10) !== article.publishedAt.slice(0, 10)

  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <article>
        <header className="border-b border-line bg-surface-muted">
          <div className="container-page max-w-4xl py-10 sm:py-14">
            <Breadcrumbs
              items={[
                { name: 'Career resources', path: routes.careerResources() },
                ...(article.category ? [{ name: article.category.name, path: routes.articleCategory(article.category.slug) }] : []),
                { name: article.title, path: routes.article(article.slug) },
              ]}
            />
            {article.category && (
              <p className="enter mt-8 font-display text-xs font-bold tracking-[0.16em] text-brand-red-dark uppercase">
                <Link href={routes.articleCategory(article.category.slug)} className="hover:underline">
                  {article.category.name}
                </Link>
              </p>
            )}
            <h1 className="enter mt-3 text-4xl leading-[1.1] font-extrabold [--enter-step:1] sm:text-5xl">{article.title}</h1>
            <p className="enter mt-5 text-xl leading-relaxed text-ink-muted [--enter-step:2]">{article.excerpt}</p>
            <p className="enter mt-6 text-sm text-ink-subtle [--enter-step:2]">
              By {article.authorName ?? business.name} · <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              {updated && (
                <>
                  {' '}
                  · Updated <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
                </>
              )}
            </p>
          </div>
        </header>

        <div className="container-page max-w-4xl py-12 lg:py-16">
          {article.featuredImage ? (
            <figure className="mb-10 overflow-hidden bg-surface-sunken">
              <Image
                src={article.featuredImage.url}
                alt={article.featuredImage.alt}
                width={article.featuredImage.width ?? 1600}
                height={article.featuredImage.height ?? 900}
                sizes="(min-width: 896px) 56rem, 100vw"
                className="w-full"
                priority
              />
            </figure>
          ) : (
            // Illustrative photo until the article has a featured image of its own.
            <Photo
              image={articleImageFor(article)}
              aspect={[16, 9]}
              sizes="(min-width: 896px) 56rem, 100vw"
              className="mb-10 aspect-[16/9]"
            />
          )}
          {article.body && <div className="prose-content" dangerouslySetInnerHTML={{ __html: article.body.html }} />}

          <div className="mt-14 space-y-8">
            <ArticleCta article={article} />
            {article.primaryCta !== 'hire-staff' && <SafetyCallout />}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="border-t border-line bg-surface-muted py-14">
          <div className="container-page">
            <h2 id="related-heading" className="text-2xl font-extrabold">
              More in {article.category?.name}
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((a, i) => (
                <ArticleCard key={a.slug} article={a} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
