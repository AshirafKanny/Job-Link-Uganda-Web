import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/PageHeader'
import { ArrowLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { overseasRecruitmentEnabled } from '@/config/features'
import { settingsRepo } from '@/data'
import { routes } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({
  title: 'How to Recognise a Genuine Job Offer',
  description:
    'Practical checks to tell a genuine job offer from a recruitment scam in Uganda: warning signs, how to verify a recruiter, protecting your documents and what to do if something seems wrong.',
  path: routes.recruitmentSafety(),
})

const checks = [
  {
    title: 'Check who you are dealing with',
    text: 'A genuine recruiter or employer has a business name, a way to contact them that you can verify, and can explain who the employer is (even if they cannot name them yet).',
  },
  {
    title: 'Expect a clear description of the job',
    text: 'You should be told the role, the workplace, the working hours and the pay before you commit. Vague offers of "good jobs" or "quick money" are a warning sign.',
  },
  {
    title: 'Be cautious about payments',
    text: 'Be very careful if anyone asks you to pay money to be interviewed, to "reserve" a position, or to secure a job. Ask exactly what the payment is for, and get it in writing, before paying anything.',
  },
  {
    title: 'Take your time',
    text: 'Pressure to decide immediately, pay today or keep the offer secret are common tactics in scams. A genuine opportunity can wait for you to check it.',
  },
  {
    title: 'Protect your documents',
    text: 'Never hand over your original national ID, passport or certificates. Share copies only when you understand why they are needed.',
  },
  {
    title: 'Meet in the right places',
    text: 'Interviews should take place at a business address or a public place. Tell someone where you are going.',
  },
]

export default async function RecruitmentSafetyPage() {
  const settings = await settingsRepo.get()
  const { contact } = settings

  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: 'Recruitment safety', path: routes.recruitmentSafety() }]}
        eyebrow="Recruitment safety"
        title="How to recognise a genuine job opportunity"
        lead="Most employers and recruiters are genuine, but some people use the promise of a job to take money or documents from job seekers. These practical checks help you protect yourself, whoever you are dealing with."
      />

      <div className="container-page grid gap-14 py-14 lg:grid-cols-[1fr_20rem] lg:gap-20 lg:py-16">
        <div className="max-w-3xl space-y-14">
          <section aria-labelledby="checks-heading">
            <h2 id="checks-heading" className="text-3xl font-extrabold">
              Six checks before you accept a job offer
            </h2>
            <ol className="mt-8 space-y-6">
              {checks.map((check, i) => (
                <li key={check.title} className="flex gap-5 border-t border-line pt-6" data-aos="fade-up" data-aos-delay={(i % 2) * 100}>
                  <span aria-hidden="true" className="font-display text-3xl leading-none font-extrabold text-brand-red tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold">{check.title}</h3>
                    <p className="mt-2 text-ink-muted">{check.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="abroad-heading" className="border-l-4 border-brand-yellow bg-surface-muted p-6 sm:p-8">
            <h2 id="abroad-heading" className="text-2xl font-extrabold">
              If you are offered work abroad
            </h2>
            <p className="mt-4 text-ink-muted">
              In Uganda, recruiting people for jobs in other countries must be done by a company licensed by the Ministry of
              Gender, Labour and Social Development. Before you apply or pay anything, check that the company appears on the
              Ministry&apos;s External Employment Management Information System (EEMIS).
            </p>
            <a
              href="https://eemis.mglsd.go.ug/companies"
              target="_blank"
              rel="noopener"
              className="mt-4 inline-flex items-center gap-2 font-display font-bold text-brand-red-dark underline-offset-4 hover:underline"
            >
              Check licensed companies on EEMIS
              <Icon name="arrow-up-right" size={18} />
            </a>
            {!overseasRecruitmentEnabled && (
              <p className="mt-4 text-[0.95rem] text-ink-muted">
                Job Link Uganda does not currently advertise overseas vacancies. The jobs on this website are in Uganda.
              </p>
            )}
          </section>

          <section aria-labelledby="wrong-heading">
            <h2 id="wrong-heading" className="text-2xl font-extrabold">
              If something seems wrong
            </h2>
            <ul className="mt-4 space-y-3 text-ink-muted">
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-brand-red" />
                Stop and do not send money or documents until you have checked.
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-brand-red" />
                Keep messages, receipts and phone numbers as a record.
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-brand-red" />
                If you have lost money or feel threatened, report it to the police.
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-brand-red" />
                If someone claims to represent Job Link Uganda, check their contact details against those on our{' '}
                <Link href={routes.contact()} className="font-semibold text-ink underline underline-offset-2">
                  contact page
                </Link>
                .
              </li>
            </ul>
          </section>
        </div>

        <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start" aria-label="Related">
          <div className="bg-brand-black p-6 text-white">
            <Icon name="shield" size={28} className="text-brand-yellow" />
            <h2 className="mt-3 text-lg font-bold text-white">Our contact details</h2>
            <p className="mt-2 text-[0.95rem] text-white/70">
              Job Link Uganda only contacts candidates using the details published on this website.
            </p>
            {contact.phone && <p className="mt-3 font-semibold">{contact.phone}</p>}
            {contact.email && <p className="mt-1 font-semibold">{contact.email}</p>}
            <ArrowLink href={routes.contact()} className="mt-4 text-brand-yellow">
              Contact page
            </ArrowLink>
          </div>
          <nav aria-labelledby="more-heading">
            <h2 id="more-heading" className="font-display text-xs font-bold tracking-[0.16em] uppercase">
              Related
            </h2>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              <li>
                <Link href={routes.howItWorks()} className="block py-3 font-semibold hover:text-brand-red-dark">
                  How our recruitment works
                </Link>
              </li>
              <li>
                <Link href={routes.forJobSeekers()} className="block py-3 font-semibold hover:text-brand-red-dark">
                  Guide for job seekers
                </Link>
              </li>
              <li>
                <Link href={routes.jobs()} className="block py-3 font-semibold hover:text-brand-red-dark">
                  Current vacancies
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </>
  )
}
