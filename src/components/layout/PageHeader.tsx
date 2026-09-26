import type { ReactNode } from 'react'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import type { Crumb } from '@/lib/seo/jsonld/breadcrumbs'
import { cn } from '@/lib/cn'

type Props = {
  breadcrumbs: Crumb[]
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  children?: ReactNode
  tone?: 'default' | 'inverse'
  className?: string
}

/** Standard inner-page header: breadcrumbs, the page's single H1, and a lead. */
export function PageHeader({ breadcrumbs, eyebrow, title, lead, children, tone = 'default', className }: Props) {
  const inverse = tone === 'inverse'
  return (
    <header className={cn('border-b', inverse ? 'border-white/10 bg-brand-black text-white' : 'border-line bg-surface-muted', className)}>
      <div className="container-page py-10 sm:py-14">
        <Breadcrumbs items={breadcrumbs} tone={tone} />
        {eyebrow && (
          <p
            className={cn(
              'enter mt-8 flex items-center gap-3 font-display text-xs font-bold tracking-[0.18em] uppercase',
              inverse ? 'text-brand-yellow' : 'text-brand-red-dark',
            )}
          >
            <span aria-hidden="true" className="h-0.5 w-6 bg-brand-yellow" />
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
          <div className={cn('enter mt-5 max-w-3xl text-lg leading-relaxed [--enter-step:2]', inverse ? 'text-white/75' : 'text-ink-muted')}>
            {lead}
          </div>
        )}
        {children && <div className="enter mt-8 [--enter-step:3]">{children}</div>}
      </div>
    </header>
  )
}
