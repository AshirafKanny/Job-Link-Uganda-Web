import type { Metadata } from 'next'
import { WhatsAppLink } from '@/components/contact/WhatsAppLink'
import { generalWhatsApp } from '@/components/contact/whatsapp-number'
import { RecruitmentRequestForm } from '@/components/forms/RecruitmentRequestForm'
import { PageHeader } from '@/components/layout/PageHeader'
import { ArrowLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { employerEnquiriesEnabled } from '@/config/features'
import { formatUgx, workplacePackages } from '@/content/training'
import { settingsRepo } from '@/data'
import { routes } from '@/lib/routes'
import { turnstileEnabled, turnstileSiteKey } from '@/lib/security/turnstile'
import { buildMetadata } from '@/lib/seo/metadata'

type Props = { searchParams: Promise<{ package?: string | string[] }> }

// A form page: the service is described (and indexed) on /hospitality-training.
export const metadata: Metadata = buildMetadata({
  title: 'Book Workplace Hospitality Training',
  description:
    'Ask Job Link Uganda to train your restaurant, hotel or café staff at your workplace. Tell us about your team and we will contact you with a plan and dates.',
  path: routes.bookTraining(),
  indexable: false,
})

const nextSteps = [
  'We contact you to understand your team and what you want to improve.',
  'We agree the package, modules and dates, planned around your service.',
  'Our trainers deliver practical training at your premises.',
  'Staff are assessed in practice and receive Certificates of Completion.',
]

export default async function BookTrainingPage({ searchParams }: Props) {
  const [settings, params] = await Promise.all([settingsRepo.get(), searchParams])
  const requested = Array.isArray(params.package) ? params.package[0] : params.package
  const defaultPackage = workplacePackages.some((p) => p.id === requested) ? requested : undefined
  const { contact } = settings

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { name: 'Hospitality training', path: routes.hospitalityTraining() },
          { name: 'Book workplace training', path: routes.bookTraining() },
        ]}
        eyebrow="Workplace training"
        title="Train your team where they work"
        lead="Tell us about your staff and what you would like them to improve. Our team will contact you to agree the training, the package and the dates. It takes about two minutes, and there is no obligation."
      />

      <div className="container-page grid gap-14 py-12 lg:grid-cols-[1fr_22rem] lg:gap-20 lg:py-16">
        <section aria-label="Workplace training request form" className="max-w-2xl">
          {employerEnquiriesEnabled ? (
            <RecruitmentRequestForm
              kind="training"
              trainingPackages={workplacePackages.map((p) => ({
                id: p.id,
                label: `${p.name} — ${p.groupSize}, ${p.duration} (${formatUgx(p.price)})`,
              }))}
              defaultPackage={defaultPackage}
              turnstileSiteKey={turnstileEnabled ? turnstileSiteKey : null}
            />
          ) : (
            <div className="border-l-4 border-brand-yellow bg-surface-muted p-6">
              <h2 className="text-xl font-bold">Online requests are not available yet</h2>
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
            <h2 className="font-display text-xs font-bold tracking-[0.16em] uppercase">Workplace packages</h2>
            <ul className="mt-4 space-y-3 text-[0.95rem]">
              {workplacePackages.map((p) => (
                <li key={p.id} className="flex justify-between gap-4">
                  <span>
                    <span className="block font-semibold">{p.name}</span>
                    <span className="text-ink-subtle">
                      {p.groupSize}, {p.duration}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums">{formatUgx(p.price)}</span>
                </li>
              ))}
            </ul>
            <ArrowLink href={`${routes.hospitalityTraining()}#workplace-prices`} className="mt-4">
              What each package includes
            </ArrowLink>
          </div>

          <div className="border-t border-line pt-8">
            <h2 className="font-display text-xs font-bold tracking-[0.16em] uppercase">Your information</h2>
            <p className="mt-3 flex gap-3 text-[0.95rem] text-ink-muted">
              <Icon name="shield" size={20} className="mt-0.5 shrink-0 text-ink" />
              We only use these details to respond to your request. They are never published.
            </p>
          </div>

          <div className="border-t border-line pt-8">
            <h2 className="font-display text-xs font-bold tracking-[0.16em] uppercase">Prefer to talk?</h2>
            <div className="mt-4 space-y-3">
              <WhatsAppLink
                number={generalWhatsApp(contact)}
                message="Hello Job Link Uganda, I'd like to discuss hospitality training for my staff."
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
        </aside>
      </div>
    </>
  )
}
