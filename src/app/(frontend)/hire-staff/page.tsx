import type { Metadata } from 'next'
import { WhatsAppLink } from '@/components/contact/WhatsAppLink'
import { RecruitmentRequestForm } from '@/components/forms/RecruitmentRequestForm'
import { PageHeader } from '@/components/layout/PageHeader'
import { ArrowLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { employerEnquiriesEnabled } from '@/config/features'
import { servicesRepo, settingsRepo } from '@/data'
import { routes } from '@/lib/routes'
import { turnstileEnabled, turnstileSiteKey } from '@/lib/security/turnstile'
import { buildMetadata } from '@/lib/seo/metadata'

type Props = { searchParams: Promise<{ service?: string | string[] }> }

export const metadata: Metadata = buildMetadata({
  title: 'Request Staff for Your Business',
  description:
    'Tell Job Link Uganda which staff your business needs. Send the roles, number of people and start date, and our recruitment team will contact you to discuss your requirements.',
  path: routes.hireStaff(),
})

const nextSteps = [
  'We contact you to discuss the roles and your requirements in more detail.',
  'We agree how the recruitment will work, including timing.',
  'We find and screen suitable candidates.',
  'You interview the shortlist and decide who to hire.',
]

export default async function HireStaffPage({ searchParams }: Props) {
  const [services, settings, params] = await Promise.all([servicesRepo.listPublished(), settingsRepo.get(), searchParams])
  const requested = Array.isArray(params.service) ? params.service[0] : params.service
  const defaultService = services.some((s) => s.slug === requested) ? requested : undefined
  const { contact } = settings

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { name: 'Recruitment services', path: routes.services() },
          { name: 'Request staff', path: routes.hireStaff() },
        ]}
        eyebrow="Hire through Job Link"
        title="Tell us about the staff you need"
        lead="Complete the form and our recruitment team will get in touch to discuss your requirements. It takes about two minutes, and there is no obligation."
      />

      <div className="container-page grid gap-14 py-12 lg:grid-cols-[1fr_22rem] lg:gap-20 lg:py-16">
        <section aria-label="Recruitment request form" className="max-w-2xl">
          {employerEnquiriesEnabled ? (
            <RecruitmentRequestForm
              services={services.map((s) => ({ slug: s.slug, title: s.title }))}
              defaultService={defaultService}
              turnstileSiteKey={turnstileEnabled ? turnstileSiteKey : null}
            />
          ) : (
            <div className="border-l-4 border-brand-yellow bg-surface-muted p-6">
              <h2 className="text-xl font-bold">Online enquiries are not available yet</h2>
              <p className="mt-2 text-ink-muted">Please contact us using the details on our contact page.</p>
              <ArrowLink href={routes.contact()} className="mt-4">
                Contact Job Link Uganda
              </ArrowLink>
            </div>
          )}
        </section>

        <aside className="space-y-10" aria-label="What happens next">
          <div>
            <h2 className="font-display text-xs font-bold tracking-[0.16em] uppercase">What happens next</h2>
            <ol className="mt-4 space-y-4">
              {nextSteps.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="font-display text-xl leading-none font-extrabold text-brand-red tabular-nums">{i + 1}</span>
                  <span className="text-[0.95rem] text-ink-muted">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="border-t border-line pt-8">
            <h2 className="font-display text-xs font-bold tracking-[0.16em] uppercase">Your information</h2>
            <p className="mt-3 flex gap-3 text-[0.95rem] text-ink-muted">
              <Icon name="shield" size={20} className="mt-0.5 shrink-0 text-ink" />
              We only use these details to respond to your enquiry. They are never published.
            </p>
          </div>

          {(contact.whatsappEmployers || contact.phone || contact.email) && (
            <div className="border-t border-line pt-8">
              <h2 className="font-display text-xs font-bold tracking-[0.16em] uppercase">Prefer to talk?</h2>
              <div className="mt-4 space-y-3">
                <WhatsAppLink
                  number={contact.whatsappEmployers}
                  message="Hello Job Link Uganda, I'd like to discuss hiring staff for my business."
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
            </div>
          )}
        </aside>
      </div>
    </>
  )
}
