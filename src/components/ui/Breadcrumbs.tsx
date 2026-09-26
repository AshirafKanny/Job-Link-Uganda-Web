import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbJsonLd, type Crumb } from '@/lib/seo/jsonld/breadcrumbs'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/cn'

type Props = { items: Crumb[]; tone?: 'default' | 'inverse'; className?: string }

/**
 * Visible breadcrumb trail plus matching BreadcrumbList JSON-LD, generated
 * from the same array so they can never disagree. "Home" is prepended.
 */
export function Breadcrumbs({ items, tone = 'default', className }: Props) {
  const trail: Crumb[] = [{ name: 'Home', path: routes.home() }, ...items]
  const inverse = tone === 'inverse'
  return (
    <>
      <nav aria-label="Breadcrumb" className={cn('text-sm', className)}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {trail.map((crumb, index) => {
            const isLast = index === trail.length - 1
            return (
              <li key={crumb.path} className="flex items-center gap-2">
                {index > 0 && (
                  <span aria-hidden="true" className={inverse ? 'text-white/40' : 'text-line-strong'}>
                    /
                  </span>
                )}
                {isLast ? (
                  <span aria-current="page" className={inverse ? 'text-white/80' : 'text-ink-muted'}>
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.path}
                    className={cn(
                      'underline-offset-4 hover:underline',
                      inverse ? 'text-white/65 hover:text-white' : 'text-ink-subtle hover:text-ink',
                    )}
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(trail)} />
    </>
  )
}
