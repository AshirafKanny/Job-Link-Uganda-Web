import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/PageHeader'
import { AudienceCta } from '@/components/sections/AudienceCta'
import { JsonLd } from '@/components/seo/JsonLd'
import { ArrowLink } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { business, isLicenceValid } from '@/config/business'
import { hospitalityRoleGroups } from '@/content/recruitment'
import { settingsRepo } from '@/data'
import { routes, serviceSlugs } from '@/lib/routes'
import { organizationJsonLd } from '@/lib/seo/jsonld/organization'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({
  title: 'About Us: Recruitment Agency in Kampala',
  description:
    'Job Link Uganda is a Kampala recruitment agency connecting employers with suitable staff and job seekers with genuine vacancies, focused on hospitality.',
  path: routes.about(),
})

const principles = [
  {
    title: 'Requirements first',
    text: 'We start every assignment by understanding what the employer needs, and we screen candidates against it.',
  },
  {
    title: 'Genuine opportunities',
    text: 'We only advertise vacancies we are recruiting for, and we describe them as they really are.',
  },
  {
    title: 'Straightforward communication',
    text: 'Employers and candidates should always know what is happening and what comes next.',
  },
  {
    title: 'Respect for people',
    text: 'Candidates’ time and information are treated with care, and employers’ standards are taken seriously.',
  },
]

export default async function AboutPage() {
  const settings = await settingsRepo.get()
  const domestic = business.licences.domesticRecruitment

  return (
    <>
      <JsonLd data={organizationJsonLd(settings)} />
      <PageHeader
        breadcrumbs={[{ name: 'About', path: routes.about() }]}
        eyebrow="About Job Link Uganda"
        title="A recruitment agency connecting talent to opportunity"
        lead="Job Link Uganda helps businesses find suitable people for their jobs, and helps job seekers reach legitimate employment opportunities."
      />

      <section aria-labelledby="who-heading" className="py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="prose-content">
            <h2 id="who-heading" className="!mt-0 !text-3xl">
              Who we are
            </h2>
            <p>
              Job Link Uganda is a recruitment agency working with employers and job seekers in Kampala. We work on both
              sides of recruitment: we help businesses fill their vacancies with suitable people, and we give job seekers
              access to genuine roles with clear information about what each one involves.
            </p>
            <p>
              Our main focus is hospitality. Job Link Uganda has practical recruitment experience with restaurants and
              hospitality businesses, and we recruit service, kitchen and supervisory staff with an understanding of how
              those businesses operate. We also recruit for other roles, including sales, office, cleaning and general
              positions.
            </p>
            <h2>How we recruit</h2>
            <p>
              Every assignment begins with the employer&apos;s requirements. We look for candidates whose experience and
              availability fit those requirements, screen them against the role, and introduce the people who match. The
              employer interviews and makes the hiring decision.
            </p>
            <p>
              <ArrowLink href={routes.howItWorks()}>Read our full recruitment process</ArrowLink>
            </p>
          </div>
          <Photo image="teamDiscussion" aspect={[4, 5]} sizes="(min-width: 1024px) 45vw, 100vw" reveal className="aspect-[4/5] self-start" />
        </div>
      </section>

      <section aria-labelledby="focus-heading" className="border-y border-line bg-surface-muted py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            id="focus-heading"
            eyebrow="Areas of specialisation"
            title="Hospitality recruitment"
            lead="The roles we recruit most closely for, from the kitchen to the front desk."
            data-aos="fade-up"
          />
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {hospitalityRoleGroups.map((group, i) => (
              <div key={group.title} className="border-t-2 border-ink pt-4" data-aos="fade-up" data-aos-delay={i * 100}>
                <h3 className="font-display text-sm font-bold tracking-[0.14em] uppercase">{group.title}</h3>
                <ul className="mt-3 space-y-1.5 text-ink-muted">
                  {group.roles.map((role) => (
                    <li key={role}>{role}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <ArrowLink href={routes.service(serviceSlugs.hospitality)} className="mt-10" data-aos="fade-up">
            Hospitality recruitment services
          </ArrowLink>
        </div>
      </section>

      <section aria-labelledby="principles-heading" className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading id="principles-heading" eyebrow="Our approach" title="What we hold ourselves to" data-aos="fade-up" />
          <ul className="mt-10 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => (
              <li key={p.title} className="bg-surface p-6" data-aos="fade-up" data-aos-delay={i * 100}>
                <span aria-hidden="true" className="block h-0.5 w-8 bg-brand-red" />
                <h3 className="mt-4 text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-ink-muted">{p.text}</p>
              </li>
            ))}
          </ul>
          {isLicenceValid(domestic) && (
            <p className="mt-10 border-l-4 border-brand-yellow bg-surface-muted p-5" data-aos="fade-up">
              Licensed by {domestic.issuer}, licence no. <strong>{domestic.number}</strong>.
            </p>
          )}
        </div>
      </section>

      <AudienceCta />
    </>
  )
}
