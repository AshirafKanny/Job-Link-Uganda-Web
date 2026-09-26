import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { cache } from 'react'
import { WhatsAppLink } from '@/components/contact/WhatsAppLink'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmployerCtaBand } from '@/components/sections/EmployerCtaBand'
import { FaqList } from '@/components/sections/FaqList'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { JsonLd } from '@/components/seo/JsonLd'
import { ArrowLink, ButtonLink } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import type { StockImageKey } from '@/config/images'
import { employerSteps } from '@/content/recruitment'
import { servicesRepo, settingsRepo } from '@/data'
import { redirectOrNotFound } from '@/lib/cms-redirect'
import { loadJobBrowseData } from '@/lib/jobs-browse'
import { routes, serviceSlugs } from '@/lib/routes'
import { serviceJsonLd } from '@/lib/seo/jsonld/content'
import { buildMetadata } from '@/lib/seo/metadata'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

const getService = cache((slug: string) => servicesRepo.getBySlug(slug))

/** Illustrative photo per service when the CMS has no featured image. */
const fallbackImage: Record<string, StockImageKey> = {
  [serviceSlugs.hospitality]: 'chef',
  [serviceSlugs.restaurant]: 'waitress',
  [serviceSlugs.hotel]: 'hotelHost',
  [serviceSlugs.general]: 'teamDiscussion',
}

export async function generateStaticParams() {
  const services = await servicesRepo.listPublished().catch(() => [])
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService((await params).slug)
  if (!service) return { title: 'Page not found' }
  return buildMetadata({
    title: service.seo.title ?? `${service.title} in Kampala, Uganda`,
    description: service.seo.description ?? service.summary,
    path: routes.service(service.slug),
    image: service.seo.image ?? service.featuredImage ?? undefined,
  })
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) return redirectOrNotFound(routes.service(slug))

  const [services, settings, browse] = await Promise.all([
    servicesRepo.listPublished(),
    settingsRepo.get(),
    loadJobBrowseData(),
  ])
  const parent = services.find((s) => s.slug === service.parentSlug)
  const children = services.filter((s) => s.parentSlug === service.slug)
  const siblings = parent ? services.filter((s) => s.parentSlug === parent.slug && s.slug !== service.slug) : []
  const relatedCategories = browse.categories.filter((c) => service.relatedJobCategorySlugs.includes(c.slug))
  const image = fallbackImage[service.slug]

  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />
      <PageHeader
        breadcrumbs={[
          { name: 'Recruitment services', path: routes.services() },
          ...(parent ? [{ name: parent.title, path: routes.service(parent.slug) }] : []),
          { name: service.title, path: routes.service(service.slug) },
        ]}
        eyebrow={parent ? parent.title : 'Recruitment service'}
        title={service.title}
        lead={service.summary}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`${routes.hireStaff()}?service=${service.slug}`} size="lg" arrow>
            Request staff
          </ButtonLink>
          <WhatsAppLink
            number={settings.contact.whatsappEmployers}
            message={`Hello Job Link Uganda, I'd like to discuss ${service.title.toLowerCase()} for my business.`}
            label="WhatsApp our team"
            className="min-h-13"
          />
        </div>
      </PageHeader>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_20rem] lg:gap-16 lg:py-16">
        <div className="min-w-0 space-y-14">
          {service.featuredImage ? (
            <figure className="overflow-hidden bg-surface-sunken">
              <Image
                src={service.featuredImage.url}
                alt={service.featuredImage.alt}
                width={service.featuredImage.width ?? 1600}
                height={service.featuredImage.height ?? 900}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="aspect-[16/9] w-full object-cover"
              />
            </figure>
          ) : (
            image && <Photo image={image} aspect={[16, 9]} sizes="(min-width: 1024px) 60vw, 100vw" reveal className="aspect-[16/9]" />
          )}

          {service.body && <div className="prose-content max-w-3xl" dangerouslySetInnerHTML={{ __html: service.body.html }} />}

          <section aria-labelledby="process-heading">
            <h2 id="process-heading" className="text-2xl font-extrabold">
              How the recruitment process works
            </h2>
            <ProcessSteps steps={employerSteps} className="mt-6" />
          </section>

          <FaqList faqs={service.faqs} />
        </div>

        <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start" aria-label="Related">
          <div className="border border-line p-6">
            <h2 className="text-lg font-bold">Ready to recruit?</h2>
            <p className="mt-2 text-[0.95rem] text-ink-muted">
              Send us your requirements and we will come back to you to discuss them.
            </p>
            <ButtonLink href={`${routes.hireStaff()}?service=${service.slug}`} className="mt-5 w-full" arrow>
              Request staff
            </ButtonLink>
          </div>

          {(children.length > 0 || siblings.length > 0 || parent) && (
            <nav aria-labelledby="related-services">
              <h2 id="related-services" className="font-display text-xs font-bold tracking-[0.16em] uppercase">
                Related services
              </h2>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {[...(parent ? [parent] : []), ...children, ...siblings].map((s) => (
                  <li key={s.slug}>
                    <Link href={routes.service(s.slug)} className="block py-3 text-[0.95rem] font-semibold hover:text-brand-red-dark">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {relatedCategories.length > 0 && (
            <nav aria-labelledby="related-jobs">
              <h2 id="related-jobs" className="font-display text-xs font-bold tracking-[0.16em] uppercase">
                Looking for work in these roles?
              </h2>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {relatedCategories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={routes.jobCategory(c.slug)}
                      className="flex justify-between gap-3 py-3 text-[0.95rem] text-ink-muted hover:text-ink"
                    >
                      {c.name} jobs
                      {(browse.categoryCounts[c.slug] ?? 0) > 0 && (
                        <span className="tabular-nums text-ink-subtle">{browse.categoryCounts[c.slug]}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <ArrowLink href={routes.services()}>All recruitment services</ArrowLink>
        </aside>
      </div>

      <EmployerCtaBand whatsapp={settings.contact.whatsappEmployers} serviceSlug={service.slug} />
    </>
  )
}
