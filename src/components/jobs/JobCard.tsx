import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { getValidThrough } from '@/domain/jobs/lifecycle'
import type { JobSummary } from '@/domain/jobs/types'
import { cn } from '@/lib/cn'
import { daysUntil, formatEmploymentTypes, formatPosted, formatSalary, formatShortDate } from '@/lib/format'
import { routes } from '@/lib/routes'

type Props = {
  job: JobSummary
  /** Heading level inside the list (h2 on listing pages, h3 under a section heading). */
  headingLevel?: 'h2' | 'h3'
  className?: string
}

/**
 * Job listing row. The title dominates; supporting facts sit in one quiet
 * meta line. Only one status marker is ever shown ("Closes in N days").
 */
export function JobCard({ job, headingLevel: Heading = 'h3', className }: Props) {
  const closesIn = job.closingDate ? daysUntil(getValidThrough(job).toISOString()) : null
  const employer = job.hiringOrganization.kind === 'named' ? job.hiringOrganization.name : null

  return (
    <article
      className={cn(
        'group relative flex flex-col gap-3 border border-line bg-surface p-5 transition-[border-color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-ink sm:p-6',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-xs font-bold tracking-[0.12em] text-brand-red-dark uppercase">
            {job.category.name}
          </p>
          <Heading className="mt-1.5 text-xl leading-snug font-bold sm:text-[1.35rem]">
            <Link href={routes.job(job)} className="after:absolute after:inset-0 group-hover:underline group-hover:underline-offset-4">
              {job.title}
            </Link>
          </Heading>
          {employer && <p className="mt-1 text-ink-muted">{employer}</p>}
        </div>
        <Icon
          name="arrow-up-right"
          size={22}
          className="mt-1 shrink-0 text-ink-subtle transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-red"
        />
      </div>

      <p className="line-clamp-2 text-[0.975rem] text-ink-muted">{job.summary}</p>

      <dl className="mt-1 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-muted">
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Location</dt>
          <Icon name="map-pin" size={16} className="text-ink-subtle" />
          <dd>{job.location.name}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Employment type</dt>
          <Icon name="briefcase" size={16} className="text-ink-subtle" />
          <dd>{formatEmploymentTypes(job.employmentTypes)}</dd>
        </div>
        {job.salary && (
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Salary</dt>
            <Icon name="wallet" size={16} className="text-ink-subtle" />
            <dd className="font-medium text-ink">{formatSalary(job.salary)}</dd>
          </div>
        )}
      </dl>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-sm">
        <span className="text-ink-subtle">{formatPosted(job.datePosted)}</span>
        {job.closingDate && closesIn !== null && (
          <span className={cn(closesIn <= 3 ? 'font-semibold text-brand-red-dark' : 'text-ink-muted')}>
            {closesIn <= 3
              ? closesIn <= 0
                ? 'Closes today'
                : `Closes in ${closesIn} day${closesIn === 1 ? '' : 's'}`
              : `Apply by ${formatShortDate(job.closingDate)}`}
          </span>
        )}
      </div>
    </article>
  )
}
