import type { ReactNode } from 'react'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Photo } from '@/components/ui/Photo'
import type { StockImageKey } from '@/config/images'
import type { Crumb } from '@/lib/seo/jsonld/breadcrumbs'
import { cn } from '@/lib/cn'

type Props = {
  breadcrumbs: Crumb[]
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  children?: ReactNode
  tone?: 'default' | 'inverse'
  /**
   * Optional illustrative photo beside the heading, desktop only: on phones
   * the page's content (search, form, listings) comes first. Lazy-loaded, so
   * phones never download it.
   */
  image?: StockImageKey
  className?: string
}

/** Standard inner-page header: breadcrumbs, the page's single H1, and a lead. */
export function PageHeader({
  breadcrumbs,
  eyebrow,
  title,
  lead,
  children,
  tone = 'default',
  image,
  className,
}: Props) {
  const inverse = tone === 'inverse'
  return (
    <header
      className={cn(
        'border-b',
        inverse ? 'bg-brand-black border-white/10 text-white' : 'border-line bg-surface-muted',
        className,
      )}
    >
      <div className="container-page py-10 sm:py-14">
        <div
          className={cn(
            image && 'lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-center lg:gap-14',
          )}
        >
          <div>
            <Breadcrumbs items={breadcrumbs} tone={tone} />
            {eyebrow && (
              <p
                className={cn(
                  'enter font-display mt-8 flex items-center gap-3 text-xs font-bold tracking-[0.18em] uppercase',
                  inverse ? 'text-brand-yellow' : 'text-brand-red-dark',
                )}
              >
                <span aria-hidden="true" className="bg-brand-yellow h-0.5 w-6" />
                {eyebrow}
              </p>
            )}
            <h1
              className={cn(
                'enter max-w-4xl text-4xl leading-[1.08] font-extrabold [--enter-step:1] sm:text-5xl',
                eyebrow ? 'mt-3' : 'mt-8',
                inverse && 'text-white',
              )}
            >
              {title}
            </h1>
            {lead && (
              <div
                className={cn(
                  'enter mt-5 max-w-3xl text-lg leading-relaxed [--enter-step:2]',
                  inverse ? 'text-white/75' : 'text-ink-muted',
                )}
              >
                {lead}
              </div>
            )}
          </div>
          {image && (
            <Photo
              image={image}
              aspect={[4, 3]}
              sizes="(min-width: 1280px) 30rem, 38vw"
              className="enter hidden aspect-[4/3] [--enter-step:2] lg:block"
            />
          )}
        </div>
        {children && <div className="enter mt-8 [--enter-step:3]">{children}</div>}
      </div>
    </header>
  )
}
