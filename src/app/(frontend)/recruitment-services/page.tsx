import type { Metadata } from 'next'
import Link from 'next/link'
import { ServiceCard } from '@/components/cards/ServiceCard'
import { WhatsAppLink } from '@/components/contact/WhatsAppLink'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmployerCtaBand } from '@/components/sections/EmployerCtaBand'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { ArrowLink, ButtonLink } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { employerReasons, employerSteps } from '@/content/recruitment'
import { servicesRepo, settingsRepo } from '@/data'
import { routes, serviceSlugs } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo/metadata'

export const revalidate = 3600

export const metadata: Metadata = buildMetadata({
  title: 'Recruitment Services in Kampala, Uganda',
  description:
    'Recruitment services in Kampala for hospitality, restaurant, hotel and general roles. Candidates are sourced and screened against your requirements.',
  path: routes.services(),
})

export default async function RecruitmentServicesPage() {
  const [services, settings] = await Promise.all([servicesRepo.listPublished(), settingsRepo.get()])
  const hospitality = services.find((s) => s.slug === serviceSlugs.hospitality)
  const hospitalityChildren = services.filter((s) => s.parentSlug === serviceSlugs.hospitality)
  const others = services.filter((s) => !s.parentSlug && s.slug !== serviceSlugs.hospitality)

  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: 'Recruitment services', path: routes.services() }]}
        eyebrow="For employers"
        title="Recruitment services for employers in Uganda"
        lead="Job Link Uganda is a recruitment agency working with employers in Kampala. We find candidates for your vacancies, screen them against your requirements, and introduce the people who fit. Hospitality and restaurant recruitment is our specialism."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={routes.hireStaff()} size="lg" arrow>
            Request staff
          </ButtonLink>
          <WhatsAppLink
            number={settings.contact.whatsappEmployers}
            message="Hello Job Link Uganda, I'd like to discuss hiring staff for my business."
            label="WhatsApp our team"
            className="min-h-13"
          />
        </div>
      </PageHeader>

      {hospitality && (
        <section aria-labelledby="hospitality-service" className="py-16 sm:py-20">
          <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Photo image="chef" aspect={[4, 3]} sizes="(min-width: 1024px) 45vw, 100vw" reveal className="aspect-[4/3]" />
            <div className="self-center">
              <p className="font-display text-xs font-bold tracking-[0.18em] text-brand-red-dark uppercase" data-aos="fade-up">Our specialism</p>
              <h2 id="hospitality-service" className="mt-3 text-3xl font-extrabold sm:text-4xl" data-aos="fade-up">
                <Link href={routes.service(hospitality.slug)} className="hover:underline hover:underline-offset-4">
                  {hospitality.title}
                </Link>
              </h2>
              <p className="mt-4 text-lg text-ink-muted" data-aos="fade-up">{hospitality.summary}</p>
              {hospitalityChildren.length > 0 && (
                <ul className="mt-6 divide-y divide-line border-y border-line" data-aos="fade-up">
                  {hospitalityChildren.map((child) => (
                    <li key={child.slug}>
                      <Link
                        href={routes.service(child.slug)}
                        className="group flex items-center justify-between gap-4 py-4 font-display font-bold"
                      >
                        {child.title}
                        <span className="text-brand-red transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <ArrowLink href={routes.service(hospitality.slug)} className="mt-6" data-aos="fade-up">
                About hospitality recruitment
              </ArrowLink>
            </div>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section aria-labelledby="other-services" className="border-t border-line py-16 sm:py-20">
          <div className="container-page">
            <SectionHeading
              id="other-services"
              eyebrow="Beyond hospitality"
              title="Recruitment for other roles"
              data-aos="fade-up"
            />
            <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((service, i) => (
                <ServiceCard key={service.slug} service={service} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="process-heading" className="border-t border-line bg-surface-muted py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.3fr] lg:gap-20">
          <SectionHeading
            id="process-heading"
            eyebrow="How we recruit"
            title="From your brief to your shortlist"
            lead="The same four steps apply to every assignment, whatever the role."
            className="lg:sticky lg:top-28 lg:self-start" data-aos="fade-up"
          />
          <ProcessSteps steps={employerSteps} />
        </div>
      </section>

      <section aria-labelledby="expect-heading" className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading id="expect-heading" eyebrow="Working with us" title="What employers can expect" data-aos="fade-up" />
          <ul className="mt-10 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {employerReasons.map((reason, i) => (
              <li key={reason.title} className="bg-surface p-6" data-aos="fade-up" data-aos-delay={(i % 3) * 100}>
                <span aria-hidden="true" className="block h-0.5 w-8 bg-brand-red" />
                <h3 className="mt-4 text-lg font-bold">{reason.title}</h3>
                <p className="mt-2 text-ink-muted">{reason.text}</p>
              </li>
            ))}
          </ul>
          <ArrowLink href={`${routes.howItWorks()}#employers`} className="mt-8" data-aos="fade-up">
            Read the full employer process
          </ArrowLink>
        </div>
      </section>

      <EmployerCtaBand whatsapp={settings.contact.whatsappEmployers} />
    </>
  )
}
