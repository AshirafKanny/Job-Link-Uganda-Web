import type { Metadata } from 'next'
import Link from 'next/link'
import { WhatsAppLink } from '@/components/contact/WhatsAppLink'
import { generalWhatsApp } from '@/components/contact/whatsapp-number'
import { PageHeader } from '@/components/layout/PageHeader'
import { FaqList } from '@/components/sections/FaqList'
import { JsonLd } from '@/components/seo/JsonLd'
import { TrainingPackageList } from '@/components/training/TrainingPackageList'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Photo } from '@/components/ui/Photo'
import { SectionHeading } from '@/components/ui/SectionHeading'
import {
  allTrainingPackages,
  deliveryModes,
  hotelRoleTracks,
  individualPackages,
  restaurantRoleTracks,
  trainingFaqs,
  trainingModules,
  workplacePackages,
  workplaceSteps,
  type RoleTrack,
} from '@/content/training'
import { settingsRepo } from '@/data'
import { categorySlugs, routes, serviceSlugs } from '@/lib/routes'
import { trainingServiceJsonLd } from '@/lib/seo/jsonld/content'
import { buildMetadata } from '@/lib/seo/metadata'

export const revalidate = 3600

const DESCRIPTION =
  'Practical hospitality training in Uganda for restaurant and hotel staff: customer service, food & beverage, hygiene and on-site training at your workplace.'

export const metadata: Metadata = buildMetadata({
  title: 'Hospitality Training in Uganda | Restaurant & Hotel Staff | Job Link Uganda',
  description: DESCRIPTION,
  path: routes.hospitalityTraining(),
  absoluteTitle: true,
})

const workplaceBenefits = [
  'Customer service',
  'Staff professionalism',
  'Food and beverage service',
  'Hygiene practices',
  'Teamwork',
  'Upselling',
  'Consistent service',
]

function RoleGroup({ id, title, intro, tracks }: { id: string; title: string; intro: string; tracks: RoleTrack[] }) {
  return (
    <section aria-labelledby={id}>
      <h3 id={id} className="text-2xl font-extrabold">
        {title}
      </h3>
      <p className="mt-2 text-ink-muted">{intro}</p>
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {tracks.map((track) => (
          <li key={track.role} className="grid gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
            <span className="font-display font-bold">{track.role}</span>
            <span className="text-[0.95rem] text-ink-muted">{track.focus.join(' · ')}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default async function HospitalityTrainingPage() {
  const settings = await settingsRepo.get()
  const whatsapp = generalWhatsApp(settings.contact)

  return (
    <>
      <JsonLd data={trainingServiceJsonLd(DESCRIPTION, allTrainingPackages)} />
      <PageHeader
        breadcrumbs={[{ name: 'Hospitality training', path: routes.hospitalityTraining() }]}
        eyebrow="Hospitality training & workforce development"
        title="Hospitality Training in Uganda"
        lead="Practical training for restaurant, hotel and food service workers in customer service, food and beverage service, hygiene and professionalism. Join a short course, or have our trainers come to your workplace and train your whole team."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={routes.bookTraining()} size="lg" arrow>
            Book workplace training
          </ButtonLink>
          <ButtonLink href="#prices" size="lg" variant="outline">
            See training prices
          </ButtonLink>
        </div>
      </PageHeader>

      {/* Intro + delivery modes */}
      <section aria-labelledby="practical-heading" className="py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
          <div>
            <SectionHeading
              id="practical-heading"
              title="Practical hospitality training for restaurant and hotel workers"
              data-aos="fade-up"
            />
            <div className="mt-6 space-y-4 text-lg text-ink-muted" data-aos="fade-up">
              <p>
                Good service depends on people who know what to do and why it matters. Job Link Uganda recruits waiters,
                cooks, supervisors and hotel staff for hospitality businesses, and our training is built on the same
                understanding of what employers expect from their teams.
              </p>
              <p>
                The training is short, practical and about the work itself: welcoming guests, taking orders accurately,
                handling food safely and keeping standards up on a busy shift. Every programme ends with a practical
                assessment, and participants who complete it receive a Job Link Uganda Certificate of Completion.
              </p>
            </div>
          </div>
          <Photo image="tableService" aspect={[4, 3]} sizes="(min-width: 1024px) 42vw, 100vw" reveal className="aspect-[4/3]" />
        </div>

        <div className="container-page mt-16">
          <h2 className="sr-only">Ways to train</h2>
          <ul className="grid gap-px bg-line sm:grid-cols-3">
            {deliveryModes.map((mode, i) => (
              <li key={mode.title} className="bg-surface p-6 sm:pr-8" data-aos="fade-up" data-aos-delay={i * 100}>
                <span aria-hidden="true" className="block h-0.5 w-8 bg-brand-red" />
                <h3 className="mt-4 text-lg font-bold">{mode.title}</h3>
                <p className="mt-2 text-ink-muted">{mode.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Workplace training */}
      <section id="workplace" aria-labelledby="workplace-heading" className="scroll-mt-24 bg-brand-black py-20 text-white sm:py-24">
        <div className="container-page grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <SectionHeading
              id="workplace-heading"
              tone="inverse"
              eyebrow="Workplace training"
              title="On-site hospitality training: we train your team where they work"
              lead="Instead of sending staff away, our trainers come to your restaurant, hotel or café. Your team learns with your own tables, menu and equipment, and sessions are planned around your service so the business keeps running."
              data-aos="fade-up"
            />
            <h3 className="mt-10 font-display text-xs font-bold tracking-[0.16em] text-brand-yellow uppercase" data-aos="fade-up">
              What workplace training helps improve
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2" data-aos="fade-up">
              {workplaceBenefits.map((benefit) => (
                <li key={benefit} className="border border-white/20 px-3 py-1.5 text-[0.95rem] text-white/85">
                  {benefit}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3" data-aos="fade-up">
              <ButtonLink href={routes.bookTraining()} variant="primary" size="lg" arrow>
                Request workplace training
              </ButtonLink>
              <ButtonLink href="#workplace-prices" variant="outline-light" size="lg">
                Workplace prices
              </ButtonLink>
            </div>
          </div>

          <div>
            <h3 className="font-display text-xs font-bold tracking-[0.16em] text-brand-yellow uppercase">How it works</h3>
            <ol className="mt-5 space-y-6">
              {workplaceSteps.map((step, i) => (
                <li key={step.title} className="flex gap-5" data-aos="fade-up" data-aos-delay={i * 80}>
                  <span className="font-display text-2xl leading-none font-extrabold text-brand-yellow tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="block font-bold">{step.title}</span>
                    <span className="mt-1 block text-white/70">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section aria-labelledby="modules-heading" className="py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            id="modules-heading"
            eyebrow="Curriculum"
            title="What the hospitality training covers"
            lead="Twelve practical modules, from customer service and food and beverage service to food safety and hygiene. Each programme combines the modules that fit the participants and their roles."
            data-aos="fade-up"
          />
          <ol className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {trainingModules.map((module, i) => (
              <li key={module.title} className="border-t border-line pt-5" data-aos="fade-up" data-aos-delay={(i % 3) * 80}>
                <span className="font-display text-sm font-bold text-brand-red tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-1 text-lg font-bold">{module.title}</h3>
                <ul className="mt-3 space-y-1.5 text-[0.95rem] text-ink-muted">
                  {module.topics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Role-specific training */}
      <section aria-labelledby="roles-heading" className="border-y border-line bg-surface-muted py-20 sm:py-24">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                id="roles-heading"
                eyebrow="Role-specific training"
                title="Training for waiters, supervisors, kitchen staff and hotel teams"
                lead="A waiter, a supervisor and a housekeeper need different skills. Training is adapted to each participant's role, so the time is spent on what they actually do at work."
                data-aos="fade-up"
              />
              <Photo
                image="kitchenCook"
                aspect={[4, 5]}
                sizes="(min-width: 1024px) 30vw, 100vw"
                reveal
                className="mt-10 hidden aspect-[4/5] max-w-sm lg:block"
              />
            </div>
            <div className="space-y-14">
              <RoleGroup
                id="restaurant-staff-training"
                title="Restaurant staff training"
                intro="For restaurants, cafés, bars and catering teams."
                tracks={restaurantRoleTracks}
              />
              <RoleGroup
                id="hotel-staff-training"
                title="Hotel staff training"
                intro="For hotel teams, alongside the food and beverage modules for hotel restaurants and bars."
                tracks={hotelRoleTracks}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Prices */}
      <section id="prices" aria-labelledby="prices-heading" className="scroll-mt-24 py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            id="prices-heading"
            eyebrow="Prices"
            title="Hospitality training prices"
            lead="Job Link Uganda's training prices, in Uganda shillings. We confirm the dates, venue and schedule with you before any training begins."
            data-aos="fade-up"
          />

          <div id="individual" className="mt-14 scroll-mt-24">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h3 className="text-2xl font-extrabold">Individual training</h3>
              <p className="text-[0.95rem] text-ink-muted">For job seekers and working staff. Enquire on WhatsApp for the next dates.</p>
            </div>
            <div className="mt-6">
              <TrainingPackageList packages={individualPackages} audience="individual" whatsapp={whatsapp} headingLevel="h4" />
            </div>
          </div>
        </div>

        <div id="workplace-prices" className="mt-16 scroll-mt-24 bg-brand-black py-14 text-white sm:py-16">
          <div className="container-page">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h3 className="text-2xl font-extrabold text-white">Workplace training for restaurants and hotels</h3>
              <p className="text-[0.95rem] text-white/70">Delivered at your premises. One price for the team.</p>
            </div>
            <div className="mt-6">
              <TrainingPackageList packages={workplacePackages} audience="workplace" whatsapp={whatsapp} tone="inverse" headingLevel="h4" />
            </div>
            <div className="mt-8 flex flex-col gap-4 border-l-4 border-brand-yellow bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-white/85">
                <strong className="text-white">Training more than 20 staff, or a group from several businesses?</strong> Contact
                us for a customised quotation.
              </p>
              <ButtonLink href={routes.bookTraining()} variant="light" className="shrink-0" arrow>
                Request a quotation
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate */}
      <section aria-labelledby="certificate-heading" className="pb-20 sm:pb-24">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <SectionHeading id="certificate-heading" eyebrow="Certificate" title="Job Link Uganda Certificate of Completion" data-aos="fade-up" />
          <div className="space-y-4 text-lg text-ink-muted" data-aos="fade-up">
            <p>
              Participants who complete their programme and its practical assessment receive a Job Link Uganda Certificate
              of Completion. It confirms the training they completed with us, which is useful when applying for hospitality
              work or showing an employer the skills you have built.
            </p>
            <p>
              It is not a government, UVTAB or other accredited qualification. We say so plainly, so participants and
              employers know exactly what it represents.
            </p>
          </div>
        </div>
      </section>

      {/* Recruitment + training */}
      <section aria-labelledby="together-heading" className="border-y border-line bg-surface-muted py-20 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-20">
          <div>
            <SectionHeading
              id="together-heading"
              eyebrow="Recruitment and training"
              title="Hiring and training hospitality staff, in one place"
              lead="Need more people as well as better-trained ones? Job Link Uganda also recruits for restaurants and hotels. Job seekers who complete training can browse current hospitality vacancies."
              data-aos="fade-up"
            />
          </div>
          <ul className="divide-y divide-line border-y border-line" data-aos="fade-up">
            {[
              { label: 'Hospitality recruitment', href: routes.service(serviceSlugs.hospitality) },
              { label: 'Request staff for your business', href: routes.hireStaff() },
              { label: 'Restaurant jobs', href: routes.jobCategory(categorySlugs.restaurant) },
              { label: 'Hotel jobs', href: routes.jobCategory(categorySlugs.hotel) },
              { label: 'Career resources for job seekers', href: routes.careerResources() },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="group flex items-center justify-between gap-4 py-4 font-display font-bold hover:text-brand-red-dark">
                  {link.label}
                  <Icon name="arrow-right" size={18} className="shrink-0 text-brand-red transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <div className="container-page py-20 sm:py-24">
        <div className="max-w-3xl">
          <FaqList faqs={trainingFaqs} title="Hospitality training: frequently asked questions" />
        </div>
      </div>

      {/* Final CTA */}
      <section aria-labelledby="training-cta-heading" className="bg-brand-black text-white">
        <div className="flag-bar h-1" aria-hidden="true" />
        <div className="container-page flex flex-col gap-8 py-14 sm:py-16 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl" data-aos="fade-up">
            <h2 id="training-cta-heading" className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to train your team?
            </h2>
            <p className="mt-3 text-lg text-white/70">
              Tell us about your staff and what you want to improve. We will come back to you with a plan and dates.
            </p>
          </div>
          <div className="flex flex-wrap gap-3" data-aos="fade-up" data-aos-delay="100">
            <ButtonLink href={routes.bookTraining()} variant="primary" size="lg" arrow>
              Book workplace training
            </ButtonLink>
            <WhatsAppLink
              number={whatsapp}
              message="Hello Job Link Uganda, I'd like to know more about your hospitality training."
              label="WhatsApp us"
              className="min-h-13"
            />
          </div>
        </div>
      </section>
    </>
  )
}
