import Link from 'next/link'
import { SafetyCallout } from '@/components/sections/SafetyCallout'
import { ButtonLink } from '@/components/ui/Button'
import type { JobCategory, Location } from '@/domain/content/types'
import { cn } from '@/lib/cn'
import { routes } from '@/lib/routes'

type Props = {
  categories: Pick<JobCategory, 'slug' | 'name' | 'parentId'>[]
  categoryCounts: Record<string, number>
  locations: Pick<Location, 'slug' | 'name'>[]
  locationCounts: Record<string, number>
  activeCategory?: string
  activeLocation?: string
}

/**
 * Browse links to the category and location hubs. Hubs without live
 * vacancies are still listed (they may carry guidance) but show no count.
 */
export function JobsSidebar({ categories, categoryCounts, locations, locationCounts, activeCategory, activeLocation }: Props) {
  const linkClass = (active: boolean, child: boolean) =>
    cn(
      'flex items-center justify-between gap-3 py-2 text-[0.95rem] transition-colors',
      child && 'pl-4',
      active ? 'font-bold text-brand-red-dark' : 'text-ink-muted hover:text-ink',
    )

  return (
    <aside className="space-y-10" aria-label="Browse jobs">
      <nav aria-labelledby="browse-category">
        <h2 id="browse-category" className="font-display text-xs font-bold tracking-[0.16em] uppercase">
          Jobs by category
        </h2>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={routes.jobCategory(c.slug)}
                aria-current={activeCategory === c.slug ? 'page' : undefined}
                className={linkClass(activeCategory === c.slug, Boolean(c.parentId))}
              >
                {c.name}
                {(categoryCounts[c.slug] ?? 0) > 0 && (
                  <span className="text-sm text-ink-subtle tabular-nums">{categoryCounts[c.slug]}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {locations.length > 0 && (
        <nav aria-labelledby="browse-location">
          <h2 id="browse-location" className="font-display text-xs font-bold tracking-[0.16em] uppercase">
            Jobs by location
          </h2>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {locations.map((l) => (
              <li key={l.slug}>
                <Link
                  href={routes.jobLocation(l.slug)}
                  aria-current={activeLocation === l.slug ? 'page' : undefined}
                  className={linkClass(activeLocation === l.slug, false)}
                >
                  {l.name}
                  {(locationCounts[l.slug] ?? 0) > 0 && (
                    <span className="text-sm text-ink-subtle tabular-nums">{locationCounts[l.slug]}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <SafetyCallout />

      <div className="bg-brand-black p-6 text-white">
        <h2 className="text-lg font-bold text-white">Hiring staff?</h2>
        <p className="mt-2 text-[0.95rem] text-white/70">Tell us about the roles you need to fill and we will discuss your requirements.</p>
        <ButtonLink href={routes.hireStaff()} variant="light" arrow className="mt-5">
          Request staff
        </ButtonLink>
      </div>
    </aside>
  )
}
