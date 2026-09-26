import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/PageHeader'
import { AudienceCta } from '@/components/sections/AudienceCta'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { ArrowLink } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { business } from '@/config/business'
import { employerSteps, jobSeekerSteps } from '@/content/recruitment'
import { routes } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({
  title: 'How Our Recruitment Process Works',
  description:
    'A transparent explanation of how Job Link Uganda recruits: the process for employers, the process for job seekers, what each side can expect, and how to recognise legitimate recruitment.',
  path: routes.howItWorks(),
})

const employerExpectations = [
  'We ask for a clear brief before recruitment starts: duties, hours, pay, requirements and start date.',
  'We only introduce candidates we have checked against that brief.',
  'You interview candidates and make every hiring decision.',
  'You receive straightforward updates while we recruit.',
]

const candidateExpectations = [
  'Vacancies describe the real role, location and requirements.',
  'We contact candidates whose applications fit the role.',
  'We explain what a role involves before you commit to it.',
  'Your details are used for recruitment only and never published.',
]

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: 'How it works', path: routes.howItWorks() }]}
        eyebrow="Recruitment transparency"
        title="How recruitment works at Job Link Uganda"
        lead="Legitimate recruitment is open about its process. This page explains ours in full: what we do for employers, what we do for job seekers, and what both sides can expect."
      />

      <section id="employers" aria-labelledby="employers-heading" className="scroll-mt-28 py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.3fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              id="employers-heading"
              eyebrow="For employers"
              title="The employer process"
              lead="Every assignment follows the same four steps."
              data-aos="fade-up"
            />
            <h3 className="mt-10 font-display text-sm font-bold tracking-[0.14em] uppercase" data-aos="fade-up">What employers can expect</h3>
            <ul className="mt-4 space-y-3" data-aos="fade-up">
              {employerExpectations.map((e) => (
                <li key={e} className="flex gap-3 text-ink-muted">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-brand-red" />
                  {e}
                </li>
              ))}
            </ul>
            {business.fees.employers && <p className="mt-6 font-semibold" data-aos="fade-up">{business.fees.employers}</p>}
            <ArrowLink href={routes.hireStaff()} className="mt-8" data-aos="fade-up">
              Send a recruitment request
            </ArrowLink>
          </div>
          <ProcessSteps steps={employerSteps} />
        </div>
      </section>

      <section id="job-seekers" aria-labelledby="seekers-heading" className="scroll-mt-28 border-y border-line bg-surface-muted py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.3fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              id="seekers-heading"
              eyebrow="For job seekers"
              title="The candidate process"
              lead="How to go from a vacancy to an interview."
              data-aos="fade-up"
            />
            <h3 className="mt-10 font-display text-sm font-bold tracking-[0.14em] uppercase" data-aos="fade-up">What candidates can expect</h3>
            <ul className="mt-4 space-y-3" data-aos="fade-up">
              {candidateExpectations.map((e) => (
                <li key={e} className="flex gap-3 text-ink-muted">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-brand-red" />
                  {e}
                </li>
              ))}
            </ul>
            {business.fees.candidates && <p className="mt-6 font-semibold" data-aos="fade-up">{business.fees.candidates}</p>}
            <ArrowLink href={routes.jobs()} className="mt-8" data-aos="fade-up">
              Browse current vacancies
            </ArrowLink>
          </div>
          <ProcessSteps steps={jobSeekerSteps} />
        </div>
      </section>

      <section aria-labelledby="legit-heading" className="py-16 sm:py-20">
        <div className="container-page max-w-4xl">
          <SectionHeading
            id="legit-heading"
            eyebrow="Recognising legitimate recruitment"
            title="What to expect from any genuine recruiter"
            lead="Whether you work with us or someone else, these are reasonable standards to expect."
            data-aos="fade-up"
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2" data-aos="fade-up">
            {[
              'A named business with contact details you can verify.',
              'A clear description of the role, workplace, pay and hours.',
              'An explanation of how the recruitment process works.',
              'No pressure to decide or pay on the spot.',
            ].map((item) => (
              <li key={item} className="border-l-4 border-brand-yellow bg-surface-muted p-4">
                {item}
              </li>
            ))}
          </ul>
          <ArrowLink href={routes.recruitmentSafety()} className="mt-8" data-aos="fade-up">
            Read our recruitment safety guidance
          </ArrowLink>
        </div>
      </section>

      <AudienceCta />
    </>
  )
}
