import { ButtonLink } from '@/components/ui/Button'
import { routes } from '@/lib/routes'

/** Closing call to action that splits the two audiences cleanly. */
export function AudienceCta() {
  return (
    <section aria-label="Next steps" className="bg-surface">
      <div className="container-page grid gap-px bg-line py-0 md:grid-cols-2">
        <div className="flex flex-col justify-between gap-8 bg-surface-muted px-6 py-12 sm:px-10 sm:py-16" data-aos="fade-right">
          <div>
            <p className="font-display text-xs font-bold tracking-[0.18em] text-brand-red-dark uppercase">
              Looking for work?
            </p>
            <h2 className="mt-3 text-3xl font-extrabold">Browse current vacancies</h2>
            <p className="mt-3 max-w-md text-ink-muted">
              Every vacancy lists its requirements, location and how to apply, so you know what the employer is asking for
              before you get in touch.
            </p>
          </div>
          <ButtonLink href={routes.jobs()} variant="primary" size="lg" arrow className="self-start">
            Find a job
          </ButtonLink>
        </div>
        <div className="flex flex-col justify-between gap-8 bg-brand-black px-6 py-12 text-white sm:px-10 sm:py-16" data-aos="fade-left" data-aos-delay="100">
          <div>
            <p className="font-display text-xs font-bold tracking-[0.18em] text-brand-yellow uppercase">Hiring?</p>
            <h2 className="mt-3 text-3xl font-extrabold text-white">Tell us what your business needs</h2>
            <p className="mt-3 max-w-md text-white/70">
              Share the roles, numbers and start date. We come back to you to discuss the requirements before any
              recruitment starts.
            </p>
          </div>
          <ButtonLink href={routes.hireStaff()} variant="light" size="lg" arrow className="self-start">
            Request staff
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
