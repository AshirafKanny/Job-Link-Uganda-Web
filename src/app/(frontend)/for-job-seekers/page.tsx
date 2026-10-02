import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleCard } from '@/components/cards/ArticleCard'
import { WhatsAppLink } from '@/components/contact/WhatsAppLink'
import { PageHeader } from '@/components/layout/PageHeader'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { SafetyCallout } from '@/components/sections/SafetyCallout'
import { ArrowLink, ButtonLink } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { business } from '@/config/business'
import { jobSeekerSteps } from '@/content/recruitment'
import { articlesRepo, settingsRepo } from '@/data'
import { loadJobBrowseData } from '@/lib/jobs-browse'
import { routes } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo/metadata'

export const revalidate = 600

export const metadata: Metadata = buildMetadata({
  title: 'Guide for Job Seekers: Finding Work in Uganda',
  description:
    'How to find and apply for jobs through Job Link Uganda: browsing vacancies, applying correctly, what happens next and how to avoid recruitment scams.',
  path: routes.forJobSeekers(),
})

const expectations = [
  {
    title: 'Real vacancies',
    text: 'We only advertise roles we are recruiting for. When a vacancy closes, we mark it closed.',
  },
  {
    title: 'Clear information',
    text: 'Each vacancy explains the duties, requirements, location and how to apply, so you can decide before you contact us.',
  },
  {
    title: 'Honest communication',
    text: 'If your application fits the role, we contact you about the next step. We tell you what the role involves before you commit to it.',
  },
  {
    title: 'Respect for your information',
    text: 'Your details are used for recruitment only and are never published on this website.',
  },
]

export default async function ForJobSeekersPage() {
  const [browse, articles, settings] = await Promise.all([
    loadJobBrowseData(),
    articlesRepo.listPublished({ limit: 3 }),
    settingsRepo.get(),
  ])
  const topCategories = browse.categories.filter((c) => !c.parentId || c.slug === 'restaurant' || c.slug === 'hotel').slice(0, 8)

  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: 'For job seekers', path: routes.forJobSeekers() }]}
        eyebrow="For job seekers"
        title="Find genuine work through Job Link Uganda"
        lead="We recruit for employers in Kampala, with a particular focus on hospitality and restaurant jobs. This guide explains how to find vacancies, how to apply, and what to expect from us."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={routes.jobs()} size="lg" arrow>
            Browse current jobs
          </ButtonLink>
          <WhatsAppLink
            number={settings.contact.whatsappCandidates}
            message="Hello Job Link Uganda, I'm looking for work and have a question."
            label="Ask us on WhatsApp"
            className="min-h-13"
          />
        </div>
      </PageHeader>

      <section aria-labelledby="steps-heading" className="py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading
              id="steps-heading"
              eyebrow="How it works"
              title="From finding a vacancy to your interview"
              lead="Every vacancy has its own application instructions. Following them exactly is the single most useful thing you can do."
              data-aos="fade-up"
            />
            <Photo image="jobSeeker" aspect={[4, 3]} sizes="(min-width: 1024px) 40vw, 100vw" reveal className="mt-10 aspect-[4/3]" />
          </div>
          <ProcessSteps steps={jobSeekerSteps} className="self-start" />
        </div>
      </section>

      <section aria-labelledby="expect-heading" className="border-y border-line bg-surface-muted py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading id="expect-heading" eyebrow="Our commitment" title="What you can expect from us" data-aos="fade-up" />
          <ul className="mt-10 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {expectations.map((item, i) => (
              <li key={item.title} className="bg-surface-muted p-6" data-aos="fade-up" data-aos-delay={i * 100}>
                <span aria-hidden="true" className="block h-0.5 w-8 bg-brand-red" />
                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-ink-muted">{item.text}</p>
              </li>
            ))}
          </ul>
          {business.fees.candidates && (
            <p className="mt-8 border-l-4 border-brand-yellow bg-surface p-5" data-aos="fade-up">
              <strong>Fees:</strong> {business.fees.candidates}
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="categories-heading" className="py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              id="categories-heading"
              eyebrow="Where to start"
              title="Browse jobs by category"
              lead="Hospitality roles are our focus, but we also recruit for sales, office, cleaning and general positions."
              data-aos="fade-up"
            />
            <ul className="mt-8 grid gap-x-8 sm:grid-cols-2" data-aos="fade-up">
              {topCategories.map((c) => (
                <li key={c.slug} className="border-b border-line">
                  <Link href={routes.jobCategory(c.slug)} className="flex justify-between py-3 font-semibold hover:text-brand-red-dark">
                    {c.name} jobs
                    {(browse.categoryCounts[c.slug] ?? 0) > 0 && (
                      <span className="font-normal text-ink-subtle tabular-nums">{browse.categoryCounts[c.slug]}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[0.95rem] text-ink-muted" data-aos="fade-up">
              Want to improve your hospitality skills first? Our{' '}
              <Link href={routes.hospitalityTraining()} className="font-semibold text-ink underline underline-offset-2 hover:text-brand-red-dark">
                hospitality training courses
              </Link>{' '}
              cover customer service, food and beverage service and hygiene, with a Certificate of Completion.
            </p>
          </div>
          <div className="self-start lg:pt-16">
            <SafetyCallout variant="full" />
          </div>
        </div>
      </section>

      {articles.items.length > 0 && (
        <section aria-labelledby="advice-heading" className="border-t border-line bg-surface-muted py-16 sm:py-20">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading id="advice-heading" eyebrow="Career resources" title="Prepare your application" data-aos="fade-up" />
              <ArrowLink href={routes.careerResources()} data-aos="fade-up">
                All career resources
              </ArrowLink>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {articles.items.map((a, i) => (
                <ArticleCard key={a.slug} article={a} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
