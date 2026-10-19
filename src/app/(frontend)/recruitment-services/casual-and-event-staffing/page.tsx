import type { Metadata } from 'next'
import Link from 'next/link'
import { WhatsAppLink } from '@/components/contact/WhatsAppLink'
import { generalWhatsApp } from '@/components/contact/whatsapp-number'
import { RecruitmentRequestForm } from '@/components/forms/RecruitmentRequestForm'
import { FaqList } from '@/components/sections/FaqList'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ArrowLink, ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Photo } from '@/components/ui/Photo'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { employerEnquiriesEnabled } from '@/config/features'
import {
  staffingCategories,
  staffingClients,
  staffingFaqs,
  staffingReasons,
  staffingSteps,
} from '@/content/staffing'
import { settingsRepo } from '@/data'
import { categorySlugs, routes, serviceSlugs } from '@/lib/routes'
import { turnstileEnabled, turnstileSiteKey } from '@/lib/security/turnstile'
import { staffingServiceJsonLd } from '@/lib/seo/jsonld/content'
import { buildMetadata } from '@/lib/seo/metadata'
import { stockShareImage } from '@/config/visuals'

type Props = { searchParams: Promise<{ type?: string | string[] }> }

const DESCRIPTION =
  'Need casual workers, wedding ushers, event staff or waiters in Uganda? Talk to Job Link Uganda about staffing for your event or short-term assignment.'

export const metadata: Metadata = buildMetadata({
  title: 'Casual Staffing & Event Ushers in Uganda | Job Link Uganda',
  description: DESCRIPTION,
  path: routes.casualStaffing(),
  image: stockShareImage('weddingReception'),
  absoluteTitle: true,
})

export default async function CasualStaffingPage({ searchParams }: Props) {
  const [settings, params] = await Promise.all([settingsRepo.get(), searchParams])
  const requested = Array.isArray(params.type) ? params.type[0] : params.type
  const defaultStaffingType = staffingCategories.some((c) => c.id === requested) ? requested : undefined
  const { contact } = settings
  const whatsapp = generalWhatsApp(contact)

  return (
    <>
      <JsonLd data={staffingServiceJsonLd(DESCRIPTION, staffingCategories.map((c) => c.title))} />

      {/* Hero: the photo carries the mood; text sits on a directional overlay for contrast. */}
      <section aria-labelledby="staffing-heading" className="relative isolate overflow-hidden bg-brand-black text-white">
        <Photo image="weddingReception" fill priority decorative sizes="100vw" className="-z-20" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(13,13,13,0.55)_0%,rgba(13,13,13,0.88)_100%)] lg:bg-[linear-gradient(90deg,rgba(13,13,13,0.94)_0%,rgba(13,13,13,0.82)_42%,rgba(13,13,13,0.3)_100%)]"
        />
        <div className="container-page py-12 sm:py-16 lg:py-24">
          <Breadcrumbs
            tone="inverse"
            items={[
              { name: 'Recruitment services', path: routes.services() },
              { name: 'Casual & event staffing', path: routes.casualStaffing() },
            ]}
          />
          <div className="mt-10 max-w-2xl lg:mt-14">
            <p className="enter flex items-center gap-3 font-display text-xs font-bold tracking-[0.18em] text-brand-yellow uppercase">
              <span aria-hidden="true" className="h-0.5 w-6 bg-brand-yellow" />
              Casual & event staffing
            </p>
            <h1
              id="staffing-heading"
              className="enter mt-4 text-4xl leading-[1.06] font-extrabold text-white [--enter-step:1] sm:text-5xl lg:text-6xl"
            >
              Reliable casual workers & event staff, when you need them
            </h1>
            <p className="enter mt-6 text-lg leading-relaxed text-white/80 [--enter-step:2]">
              From weddings and corporate functions to hospitality assignments and temporary staffing needs, Job Link Uganda
              helps clients in Kampala find suitable workers for events and short-term assignments.
            </p>
            <div className="enter mt-9 flex flex-wrap gap-3 [--enter-step:3]">
              <ButtonLink href="#request" size="lg" arrow>
                Request staff
              </ButtonLink>
              <ButtonLink href="#services" size="lg" variant="outline-light">
                Explore our staffing services
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" aria-labelledby="services-heading" className="scroll-mt-24 py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            id="services-heading"
            eyebrow="Staffing services"
            title="Staffing services we offer"
            lead="Wedding ushers, event ushers, waiters and other casual workers for occasions and short-term assignments. Tell us what you need and we will discuss what we can arrange."
            data-aos="fade-up"
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {staffingCategories.map((category, i) => (
              <li key={category.id} className="group relative flex flex-col border border-line bg-surface transition-colors duration-300 hover:border-ink" data-aos="fade-up" data-aos-delay={(i % 4) * 80}>
                {category.image ? (
                  <Photo
                    image={category.image}
                    aspect={[4, 3]}
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                    decorative
                    className="aspect-[4/3]"
                    imgClassName="photo-hover"
                  />
                ) : (
                  // Typographic panel where no honest, brand-free photo exists.
                  <div aria-hidden="true" className="flex aspect-[4/3] flex-col justify-between bg-brand-black p-5">
                    <span className="flag-bar h-1 w-12" />
                    <span className="font-display text-xl leading-tight font-extrabold text-white">{category.title}</span>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold">{category.title}</h3>
                  <p className="mt-2 text-[0.95rem] text-ink-muted">{category.text}</p>
                  <Link
                    href={`${routes.casualStaffing()}?type=${category.id}#request`}
                    className="mt-auto inline-flex items-center gap-1.5 pt-5 font-display text-[0.95rem] font-bold text-brand-red-dark after:absolute after:inset-0 hover:underline hover:underline-offset-4"
                  >
                    Request this staff
                    <Icon name="arrow-right" size={17} />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-ink-subtle" data-aos="fade-up">
            Availability depends on the role, the number of workers and the date. We confirm what we can arrange before
            anything is agreed.
          </p>
        </div>
      </section>

      {/* Why Job Link */}
      <section aria-labelledby="why-heading" className="border-y border-line bg-surface-muted py-20 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.4fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              id="why-heading"
              eyebrow="Why Job Link Uganda"
              title="Staffing arranged around your event"
              lead="The same careful approach we use for recruitment, applied to short-term and event staffing."
              data-aos="fade-up"
            />
          </div>
          <ul className="grid gap-px bg-line sm:grid-cols-2">
            {staffingReasons.map((reason, i) => (
              <li key={reason.title} className="bg-surface-muted p-6" data-aos="fade-up" data-aos-delay={(i % 2) * 100}>
                <span aria-hidden="true" className="block h-0.5 w-8 bg-brand-red" />
                <h3 className="mt-4 text-lg font-bold">{reason.title}</h3>
                <p className="mt-2 text-ink-muted">{reason.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section aria-labelledby="process-heading" className="py-20 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.3fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              id="process-heading"
              eyebrow="How it works"
              title="From your request to the day itself"
              lead="Four clear steps. Availability and timelines depend on each request, so we confirm them with you before anything is arranged."
              data-aos="fade-up"
            />
            <Photo
              image="eventTableSetting"
              aspect={[4, 3]}
              sizes="(min-width: 1024px) 34vw, 100vw"
              reveal
              className="mt-10 hidden aspect-[4/3] lg:block"
            />
          </div>
          <ProcessSteps steps={staffingSteps} className="self-start" />
        </div>
      </section>

      {/* Clients */}
      <section aria-labelledby="clients-heading" className="bg-brand-black py-20 text-white sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-20">
          <SectionHeading
            id="clients-heading"
            tone="inverse"
            eyebrow="Who we work with"
            title="For couples, planners, businesses and organisations"
            lead="Whether it is one wedding or a series of corporate functions, we work with the person organising the occasion."
            data-aos="fade-up"
          />
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {staffingClients.map((client, i) => (
              <li key={client} className="flex gap-3 border-t border-white/15 py-4 text-white/85" data-aos="fade-up" data-aos-delay={(i % 2) * 80}>
                <Icon name="check" size={20} className="mt-0.5 shrink-0 text-brand-yellow" />
                {client}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Inquiry */}
      <section id="request" aria-labelledby="request-heading" className="scroll-mt-24 py-20 sm:py-24">
        <div className="container-page grid gap-14 lg:grid-cols-[1fr_22rem] lg:gap-20">
          <div className="max-w-2xl">
            <SectionHeading
              id="request-heading"
              eyebrow="Request staff"
              title="Planning an event? Let's help you find the right staff."
              lead="Tell us about your event or temporary staffing needs, and our team will discuss suitable staffing options with you."
            />
            <div className="mt-10">
              {employerEnquiriesEnabled ? (
                <RecruitmentRequestForm
                  kind="staffing"
                  staffingTypes={staffingCategories.map((c) => ({ id: c.id, label: c.title }))}
                  defaultStaffingType={defaultStaffingType}
                  turnstileSiteKey={turnstileEnabled ? turnstileSiteKey : null}
                />
              ) : (
                <div className="border-l-4 border-brand-yellow bg-surface-muted p-6">
                  <h3 className="text-xl font-bold">Online requests are not available yet</h3>
                  <p className="mt-2 text-ink-muted">Please contact us on WhatsApp or by phone.</p>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-10" aria-label="Other ways to reach us">
            <div>
              <h2 className="font-display text-xs font-bold tracking-[0.16em] uppercase">Prefer to talk?</h2>
              <div className="mt-4 space-y-3">
                <WhatsAppLink
                  number={whatsapp}
                  message="Hello Job Link Uganda, I'd like to discuss casual or event staff."
                  label="WhatsApp our team"
                />
                {contact.phone && (
                  <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 font-semibold">
                    <Icon name="phone" size={18} className="text-brand-red" /> {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-2 font-semibold">
                    <Icon name="mail" size={18} className="text-brand-red" /> {contact.email}
                  </a>
                )}
              </div>
              <ButtonLink href={routes.contact()} variant="outline" className="mt-6">
                Contact Job Link Uganda
              </ButtonLink>
            </div>
            <div className="border-t border-line pt-8">
              <h2 className="font-display text-xs font-bold tracking-[0.16em] uppercase">Your information</h2>
              <p className="mt-3 flex gap-3 text-[0.95rem] text-ink-muted">
                <Icon name="shield" size={20} className="mt-0.5 shrink-0 text-ink" />
                We only use these details to respond to your request. They are never published.
              </p>
            </div>
            <div className="border-t border-line pt-8">
              <h2 className="font-display text-xs font-bold tracking-[0.16em] uppercase">Related services</h2>
              <ul className="mt-3 space-y-2">
                <li>
                  <ArrowLink href={routes.service(serviceSlugs.hospitality)}>Permanent hospitality recruitment</ArrowLink>
                </li>
                <li>
                  <ArrowLink href={routes.hospitalityTraining()}>Hospitality staff training</ArrowLink>
                </li>
                <li>
                  <ArrowLink href={routes.jobCategory(categorySlugs.hospitality)}>Hospitality jobs</ArrowLink>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* FAQ */}
      <div className="border-t border-line bg-surface-muted">
        <div className="container-page py-20 sm:py-24">
          <div className="max-w-3xl">
            <FaqList faqs={staffingFaqs} title="Casual & event staffing: frequently asked questions" />
          </div>
        </div>
      </div>
    </>
  )
}
