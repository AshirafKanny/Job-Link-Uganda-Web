import { cn } from '@/lib/cn'

export type Step = { title: string; text: string }

type Props = { steps: Step[]; tone?: 'default' | 'inverse'; className?: string }

/** Ordered process, numbered with the display face. */
export function ProcessSteps({ steps, tone = 'default', className }: Props) {
  const inverse = tone === 'inverse'
  return (
    <ol className={cn('grid gap-px', inverse ? 'bg-white/10' : 'bg-line', className)}>
      {steps.map((step, index) => (
        <li
          key={step.title}
          data-aos="fade-up"
          className={cn('flex gap-5 p-5 sm:p-6', inverse ? 'bg-brand-black' : 'bg-surface')}
          data-aos-delay={index * 100}
        >
          <span
            aria-hidden="true"
            className={cn(
              'font-display text-3xl leading-none font-extrabold tabular-nums',
              inverse ? 'text-brand-yellow' : 'text-brand-red',
            )}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 className={cn('text-lg font-bold', inverse && 'text-white')}>{step.title}</h3>
            <p className={cn('mt-1', inverse ? 'text-white/70' : 'text-ink-muted')}>{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
