import { PhotoBand } from '@/components/sections/PhotoBand'
import { ButtonLink } from '@/components/ui/Button'
import { routes } from '@/lib/routes'

/**
 * Closing call to action that splits the two audiences cleanly, set over the
 * Kampala skyline. Each path sits on its own solid panel, so the text never
 * depends on the photograph for contrast.
 */
export function AudienceCta() {
  return (
    <PhotoBand image="kampalaSkyline" parallax overlay="light" aria-label="Next steps">
      <div className="container-page grid gap-5 py-16 sm:py-24 md:grid-cols-2 md:gap-6">
        <div className="flex flex-col justify-between gap-8 bg-white/95 p-7 text-ink sm:p-10" data-aos="fade-up">
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
        <div
          className="flex flex-col justify-between gap-8 border border-white/15 bg-brand-black/80 p-7 backdrop-blur-sm sm:p-10"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div>
            <p className="font-display text-xs font-bold tracking-[0.18em] text-brand-yellow uppercase">Hiring?</p>
            <h2 className="mt-3 text-3xl font-extrabold text-white">Tell us what your business needs</h2>
            <p className="mt-3 max-w-md text-white/75">
              Share the roles, numbers and start date. We come back to you to discuss the requirements before any
              recruitment starts.
            </p>
          </div>
          <ButtonLink href={routes.hireStaff()} variant="light" size="lg" arrow className="self-start">
            Request staff
          </ButtonLink>
        </div>
      </div>
    </PhotoBand>
  )
}
