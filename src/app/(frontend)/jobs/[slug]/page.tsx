import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { cache } from 'react'
import { WhatsAppLink } from '@/components/contact/WhatsAppLink'
import { JobCard } from '@/components/jobs/JobCard'
import { SafetyCallout } from '@/components/sections/SafetyCallout'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ArrowLink, ButtonLink } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/ui/Icon'
import { jobsRepo, settingsRepo } from '@/data'
import { getJobLifecycle } from '@/domain/jobs/lifecycle'
import { jobSlug, parseJobRef } from '@/domain/jobs/slug'
import type { Job } from '@/domain/jobs/types'
import { redirectOrNotFound } from '@/lib/cms-redirect'
import { formatDate, formatEmploymentTypes, formatSalary } from '@/lib/format'
import { routes } from '@/lib/routes'
import { jobPostingJsonLd } from '@/lib/seo/jsonld/job-posting'
import { buildMetadata } from '@/lib/seo/metadata'

// Deadlines pass without any CMS action; re-render at least every 5 minutes.
export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

const getJob = cache(async (slug: string) => {
  const ref = parseJobRef(slug)
  return ref ? jobsRepo.getByRef(ref) : null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJob((await params).slug)
  if (!job) return { title: 'Page not found' }
  const lifecycle = getJobLifecycle(job)
  const closed = lifecycle.state !== 'open'
  return buildMetadata({
    title: `${closed ? 'Closed: ' : ''}${job.title} Job in ${job.location.name}`,
    description: job.summary,
    path: routes.job(job),
    // Closed vacancies stay reachable for people with the link but leave the index.
    indexable: lifecycle.state === 'open',
  })
}

function ListSection({ id, title, items }: { id: string; title: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="text-2xl font-extrabold">
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-brand-red" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Fact({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <Icon name={icon} size={20} className="mt-0.5 shrink-0 text-brand-red" />
      <div>
        <dt className="text-sm text-ink-subtle">{label}</dt>
        <dd className="font-semibold">{value}</dd>
      </div>
    </div>
  )
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params
  const job = await getJob(slug)
  if (!job) return redirectOrNotFound(`/jobs/${slug}`)

  const lifecycle = getJobLifecycle(job)
  if (lifecycle.state === 'unpublished') notFound()
  if (lifecycle.state === 'retired') {
    // 410 Gone is planned (docs/02, "Known upstream issues"); until then retired jobs 404.
    if (lifecycle.response.type === 'redirect') permanentRedirect(lifecycle.response.location)
    notFound()
  }
  // Title or location changed since the link was shared: move to the canonical slug.
  if (slug !== jobSlug(job)) permanentRedirect(routes.job(job))

  const [related, settings] = await Promise.all([jobsRepo.listRelatedOpen(job, 3), settingsRepo.get()])
  const open = lifecycle.state === 'open'
  const employer = job.hiringOrganization.kind === 'named' ? job.hiringOrganization.name : null

  return (
    <>
      <JsonLd data={jobPostingJsonLd(job)} />

      <header className="border-b border-line bg-surface-muted">
        <div className="container-page py-10 sm:py-12">
          <Breadcrumbs
            items={[
              { name: 'Jobs', path: routes.jobs() },
              { name: `${job.category.name} jobs`, path: routes.jobCategory(job.category.slug) },
              { name: job.title, path: routes.job(job) },
            ]}
          />

          {!open && lifecycle.state === 'closed' && (
            <div role="status" className="mt-8 flex items-start gap-3 border-l-4 border-ink bg-surface p-4">
              <Icon name="info" size={22} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">This vacancy is closed</p>
                <p className="text-ink-muted">
                  {lifecycle.reason === 'filled'
                    ? 'The position has been filled and is no longer accepting applications.'
                    : 'Applications for this vacancy are no longer being accepted.'}{' '}
                  See the open roles below.
                </p>
              </div>
            </div>
          )}

          <p className="enter mt-8 font-display text-xs font-bold tracking-[0.16em] text-brand-red-dark uppercase">
            {job.category.name}
          </p>
          <h1 className="enter mt-2 max-w-4xl text-4xl leading-[1.1] font-extrabold [--enter-step:1] sm:text-5xl">
            {job.title}
          </h1>
          <p className="enter mt-3 text-lg text-ink-muted [--enter-step:1]">
            {employer ? `${employer} · ` : 'Recruiting on behalf of an employer · '}
            {job.location.name}
          </p>

          <dl className="enter mt-8 grid gap-5 border-t border-line pt-6 [--enter-step:2] sm:grid-cols-2 lg:grid-cols-4">
            <Fact icon="map-pin" label="Location" value={job.location.region ? `${job.location.name}, ${job.location.region}` : job.location.name} />
            <Fact icon="briefcase" label="Job type" value={formatEmploymentTypes(job.employmentTypes)} />
            {job.salary && <Fact icon="wallet" label="Salary" value={formatSalary(job.salary)} />}
            <Fact icon="calendar" label="Date posted" value={formatDate(job.datePosted)} />
            {job.closingDate && <Fact icon="clock" label="Closing date" value={formatDate(job.closingDate)} />}
          </dl>
        </div>
      </header>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_22rem] lg:gap-16 lg:py-16">
        <article className="prose-flow max-w-3xl space-y-12 text-[1.0625rem] leading-relaxed">
          <section aria-labelledby="overview">
            <h2 id="overview" className="text-2xl font-extrabold">
              Overview
            </h2>
            <p className="mt-4">{job.summary}</p>
            {job.additionalDetails && (
              <div className="prose-content mt-4" dangerouslySetInnerHTML={{ __html: job.additionalDetails.html }} />
            )}
          </section>

          <ListSection id="responsibilities" title="Responsibilities" items={job.responsibilities} />
          <ListSection id="requirements" title="Requirements" items={job.requirements} />

          {job.experience && (
            <section aria-labelledby="experience">
              <h2 id="experience" className="text-2xl font-extrabold">
                Experience
              </h2>
              <p className="mt-4">{job.experience}</p>
            </section>
          )}

          <ListSection id="benefits" title="Benefits" items={job.benefits} />

          <section aria-labelledby="how-to-apply" className="scroll-mt-28">
            <h2 id="how-to-apply" className="text-2xl font-extrabold">
              How to apply
            </h2>
            {open ? (
              <>
                <p className="mt-4 whitespace-pre-line">{job.application.instructions}</p>
                {job.closingDate && (
                  <p className="mt-3 font-semibold">Applications close at the end of {formatDate(job.closingDate)}.</p>
                )}
              </>
            ) : (
              <p className="mt-4 text-ink-muted">This vacancy is closed, so applications are no longer accepted.</p>
            )}
          </section>

          <SafetyCallout variant="full" />
        </article>

        <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Apply for this job">
          <div className="border border-line bg-surface p-6">
            {open ? (
              <>
                <h2 className="text-xl font-bold">Interested in this role?</h2>
                <p className="mt-2 text-[0.95rem] text-ink-muted">
                  Check the requirements, then follow the application instructions for this vacancy.
                </p>
                <div className="mt-5 grid gap-3">
                  <ButtonLink href="#how-to-apply" size="lg" arrow>
                    How to apply
                  </ButtonLink>
                  <WhatsAppLink
                    number={settings.contact.whatsappCandidates}
                    message={`Hello Job Link Uganda, I'm interested in the ${job.title} vacancy (ref. JL${job.ref}).`}
                    label="Ask about this job"
                    className="justify-center"
                  />
                </div>
                {job.closingDate && (
                  <p className="mt-5 flex items-center gap-2 text-sm text-ink-muted">
                    <Icon name="clock" size={16} /> Apply by {formatDate(job.closingDate)}
                  </p>
                )}
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold">This vacancy has closed</h2>
                <p className="mt-2 text-[0.95rem] text-ink-muted">Browse current vacancies instead.</p>
                <ButtonLink href={routes.jobCategory(job.category.slug)} className="mt-5 w-full" arrow>
                  Open {job.category.name.toLowerCase()} jobs
                </ButtonLink>
              </>
            )}
            <p className="mt-6 border-t border-line pt-4 text-sm text-ink-subtle">
              Reference: <span className="font-semibold text-ink">JL{job.ref}</span>
            </p>
          </div>
          <ArrowLink href={routes.jobs()} className="mt-6">
            All vacancies
          </ArrowLink>
        </aside>
      </div>

      {related.length > 0 && <RelatedJobs jobs={related} job={job} />}
    </>
  )
}

function RelatedJobs({ jobs, job }: { jobs: Awaited<ReturnType<typeof jobsRepo.listRelatedOpen>>; job: Job }) {
  return (
    <section aria-labelledby="related-jobs" className="border-t border-line bg-surface-muted py-14">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="related-jobs" className="text-2xl font-extrabold">
            Similar vacancies
          </h2>
          <ArrowLink href={routes.jobCategory(job.category.slug)}>More {job.category.name.toLowerCase()} jobs</ArrowLink>
        </div>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {jobs.map((j) => (
            <li key={j.id}>
              <JobCard job={j} className="h-full" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
