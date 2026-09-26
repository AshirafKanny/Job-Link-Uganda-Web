import type { Metadata } from 'next'
import { WhatsAppLink } from '@/components/contact/WhatsAppLink'
import { PageHeader } from '@/components/layout/PageHeader'
import { ArrowLink, ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { settingsRepo } from '@/data'
import { routes } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({
  title: 'Contact Us',
  description:
    'Contact Job Link Uganda about recruiting staff for your business or about current job vacancies in Kampala.',
  path: routes.contact(),
})

export default async function ContactPage() {
  const { contact, office, openingHours } = await settingsRepo.get()
  const hasDirectContact = Boolean(contact.phone || contact.email || contact.whatsappCandidates || contact.whatsappEmployers)

  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: 'Contact', path: routes.contact() }]}
        eyebrow="Contact"
        title="Contact Job Link Uganda"
        lead="Choose the option that fits what you need, so your message reaches the right place."
      />

      <div className="container-page py-12 lg:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <section aria-labelledby="employers-contact" className="flex flex-col bg-brand-black p-6 text-white sm:p-8">
            <h2 id="employers-contact" className="text-2xl font-extrabold text-white">
              Employers
            </h2>
            <p className="mt-2 text-white/70">
              Need staff? Send a recruitment request with the roles you need and we will contact you to discuss them.
            </p>
            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              <ButtonLink href={routes.hireStaff()} variant="primary" arrow>
                Request staff
              </ButtonLink>
              <WhatsAppLink
                number={contact.whatsappEmployers}
                message="Hello Job Link Uganda, I'd like to discuss hiring staff for my business."
                label="WhatsApp"
                className="border-white/35 bg-transparent text-white hover:border-white hover:text-white"
              />
            </div>
          </section>

          <section aria-labelledby="seekers-contact" className="flex flex-col border border-line bg-surface-muted p-6 sm:p-8">
            <h2 id="seekers-contact" className="text-2xl font-extrabold">
              Job seekers
            </h2>
            <p className="mt-2 text-ink-muted">
              Looking for work? Browse current vacancies. Each one explains exactly how to apply for that role.
            </p>
            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              <ButtonLink href={routes.jobs()} variant="dark" arrow>
                Browse jobs
              </ButtonLink>
              <WhatsAppLink
                number={contact.whatsappCandidates}
                message="Hello Job Link Uganda, I'm looking for work and have a question."
                label="WhatsApp"
              />
            </div>
          </section>
        </div>

        <section aria-labelledby="details-heading" className="mt-14 grid gap-10 border-t border-line pt-12 lg:grid-cols-3">
          <h2 id="details-heading" className="text-2xl font-extrabold">
            Contact details
          </h2>
          {hasDirectContact || office ? (
            <dl className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
              {contact.phone && (
                <div>
                  <dt className="flex items-center gap-2 text-sm text-ink-subtle">
                    <Icon name="phone" size={16} /> Phone
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="hover:underline">
                      {contact.phone}
                    </a>
                  </dd>
                </div>
              )}
              {contact.email && (
                <div>
                  <dt className="flex items-center gap-2 text-sm text-ink-subtle">
                    <Icon name="mail" size={16} /> Email
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    <a href={`mailto:${contact.email}`} className="hover:underline">
                      {contact.email}
                    </a>
                  </dd>
                </div>
              )}
              {office && (
                <div>
                  <dt className="flex items-center gap-2 text-sm text-ink-subtle">
                    <Icon name="map-pin" size={16} /> Office
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    <address className="not-italic">
                      {office.streetAddress}
                      <br />
                      {office.locality}, {office.region}
                    </address>
                    {office.mapUrl && (
                      <a href={office.mapUrl} target="_blank" rel="noopener" className="mt-1 inline-block text-base text-brand-red-dark underline-offset-4 hover:underline">
                        View on map
                      </a>
                    )}
                  </dd>
                </div>
              )}
              {openingHours.length > 0 && (
                <div>
                  <dt className="flex items-center gap-2 text-sm text-ink-subtle">
                    <Icon name="clock" size={16} /> Hours
                  </dt>
                  <dd className="mt-1 space-y-0.5 font-semibold">
                    {openingHours.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-ink-muted lg:col-span-2">
              Our phone and email details will be published here shortly. Until then, employers can use the online recruitment
              request.
            </p>
          )}
        </section>

        <p className="mt-12 flex items-start gap-3 border-l-4 border-brand-yellow bg-surface-muted p-5 text-[0.95rem]">
          <Icon name="shield" size={20} className="mt-0.5 shrink-0" />
          <span>
            Job Link Uganda only uses the contact details shown on this page. If someone contacts you in our name using other
            details, please check with us first.{' '}
            <ArrowLink href={routes.recruitmentSafety()} className="text-sm">
              Recruitment safety
            </ArrowLink>
          </span>
        </p>
      </div>
    </>
  )
}
