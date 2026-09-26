import { WhatsAppLink } from '@/components/contact/WhatsAppLink'
import { ButtonLink } from '@/components/ui/Button'
import { routes } from '@/lib/routes'

type Props = {
  title?: string
  text?: string
  whatsapp: string | null
  /** Pre-selects the service on the enquiry form. */
  serviceSlug?: string
}

/** Employer-journey conversion band: always ends in a recruitment enquiry. */
export function EmployerCtaBand({
  title = 'Tell us what your business needs',
  text = 'Share the roles, the number of people and your start date. We will come back to you to discuss the requirements before recruitment starts.',
  whatsapp,
  serviceSlug,
}: Props) {
  return (
    <section aria-label="Request staff" className="bg-brand-black text-white">
      <div className="flag-bar h-1" aria-hidden="true" />
      <div className="container-page flex flex-col gap-8 py-14 sm:py-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl" data-aos="fade-right">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{title}</h2>
          <p className="mt-3 text-lg text-white/70">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3" data-aos="fade-left" data-aos-delay="150">
          <ButtonLink
            href={serviceSlug ? `${routes.hireStaff()}?service=${serviceSlug}` : routes.hireStaff()}
            variant="primary"
            size="lg"
            arrow
          >
            Request staff
          </ButtonLink>
          <WhatsAppLink
            number={whatsapp}
            message="Hello Job Link Uganda, I'd like to discuss hiring staff for my business."
            label="WhatsApp our team"
            className="min-h-13 border-white/35 bg-transparent text-white hover:border-white hover:text-white"
          />
        </div>
      </div>
    </section>
  )
}
