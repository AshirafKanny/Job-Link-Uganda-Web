import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import type { JobCategory, Location } from '@/domain/content/types'
import { EMPLOYMENT_TYPE_LABELS, EMPLOYMENT_TYPES, POSTED_WITHIN_OPTIONS, type JobFilters } from '@/domain/jobs/types'
import { routes } from '@/lib/routes'

type Props = {
  categories: Pick<JobCategory, 'slug' | 'name' | 'parentId'>[]
  locations: Pick<Location, 'slug' | 'name'>[]
  values: JobFilters
}

const fieldClass =
  'mt-1.5 block h-12 w-full rounded-control border border-line-strong bg-surface px-3 text-[0.975rem] text-ink focus:border-ink focus:outline-none'

/**
 * Plain GET form: works without JavaScript, produces shareable URLs, and the
 * resulting filtered pages are noindex + canonical to /jobs (see indexation rules).
 */
export function JobSearchForm({ categories, locations, values }: Props) {
  const refined = Boolean(
    values.query || values.categorySlug || values.locationSlug || values.employmentType || values.postedWithinDays,
  )
  return (
    <form action={routes.jobs()} method="get" role="search" aria-label="Search jobs" className="grid gap-4 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <label htmlFor="q" className="font-display text-sm font-bold">
          Keyword
        </label>
        <div className="relative">
          <Icon name="search" size={18} className="pointer-events-none absolute top-1/2 left-3 mt-0.75 -translate-y-1/2 text-ink-subtle" />
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={values.query}
            placeholder="e.g. waiter, barista, supervisor"
            className={`${fieldClass} pl-10`}
            maxLength={80}
          />
        </div>
      </div>
      <div className="lg:col-span-2">
        <label htmlFor="category" className="font-display text-sm font-bold">
          Category
        </label>
        <select id="category" name="category" defaultValue={values.categorySlug ?? ''} className={fieldClass}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.parentId ? `  ${c.name}` : c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="lg:col-span-2">
        <label htmlFor="location" className="font-display text-sm font-bold">
          Location
        </label>
        <select id="location" name="location" defaultValue={values.locationSlug ?? ''} className={fieldClass}>
          <option value="">All locations</option>
          {locations.map((l) => (
            <option key={l.slug} value={l.slug}>
              {l.name}
            </option>
          ))}
        </select>
      </div>
      <div className="lg:col-span-2">
        <label htmlFor="type" className="font-display text-sm font-bold">
          Job type
        </label>
        <select id="type" name="type" defaultValue={values.employmentType ?? ''} className={fieldClass}>
          <option value="">Any type</option>
          {EMPLOYMENT_TYPES.filter((t) => t !== 'OTHER').map((t) => (
            <option key={t} value={t}>
              {EMPLOYMENT_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>
      <div className="lg:col-span-2">
        <label htmlFor="posted" className="font-display text-sm font-bold">
          Date posted
        </label>
        <select id="posted" name="posted" defaultValue={values.postedWithinDays ? String(values.postedWithinDays) : ''} className={fieldClass}>
          <option value="">Any time</option>
          {POSTED_WITHIN_OPTIONS.map((o) => (
            <option key={o.days} value={o.days}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-4 lg:col-span-12">
        <button
          type="submit"
          className="inline-flex min-h-12 items-center gap-2 rounded-control bg-brand-red px-6 font-display font-bold text-white transition-colors hover:bg-brand-red-dark"
        >
          <Icon name="search" size={18} />
          Search jobs
        </button>
        {refined && (
          <Link href={routes.jobs()} className="font-display text-sm font-bold text-ink-muted underline-offset-4 hover:text-ink hover:underline">
            Clear filters
          </Link>
        )}
      </div>
    </form>
  )
}
