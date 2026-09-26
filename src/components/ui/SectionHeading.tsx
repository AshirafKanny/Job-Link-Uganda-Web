import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  /** Heading level; sections under the page H1 use h2 (default). */
  as?: 'h1' | 'h2' | 'h3'
  id?: string
  align?: 'left' | 'center'
  tone?: 'default' | 'inverse'
  className?: string
  'data-aos'?: string
  'data-aos-delay'?: number | string
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Tag = 'h2',
  id,
  align = 'left',
  tone = 'default',
  className,
  ...aos
}: Props) {
  const inverse = tone === 'inverse'
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)} {...aos}>
      {eyebrow && (
        <p
          className={cn(
            'flex items-center gap-3 font-display text-xs font-bold tracking-[0.18em] uppercase',
            align === 'center' && 'justify-center',
            inverse ? 'text-brand-yellow' : 'text-brand-red-dark',
          )}
        >
          <span aria-hidden="true" className="h-0.5 w-6 bg-brand-yellow" />
          {eyebrow}
        </p>
      )}
      <Tag
        id={id}
        className={cn(
          'mt-3 font-extrabold',
          Tag === 'h1' ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-[2.5rem]',
          inverse ? 'text-white' : 'text-ink',
        )}
      >
        {title}
      </Tag>
      {lead && (
        <div className={cn('mt-4 text-lg leading-relaxed', inverse ? 'text-white/75' : 'text-ink-muted')}>{lead}</div>
      )}
    </div>
  )
}
