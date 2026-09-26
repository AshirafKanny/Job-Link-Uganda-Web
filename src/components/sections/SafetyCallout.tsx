import { ArrowLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { routes } from '@/lib/routes'

type Props = { variant?: 'compact' | 'full'; className?: string }

/**
 * Candidate-safety reminder. Practical, not fear-based. Used on job pages,
 * job listings and the job seeker guide.
 */
export function SafetyCallout({ variant = 'compact', className }: Props) {
  return (
    <aside
      aria-labelledby="safety-callout-title"
      className={cn('border-l-4 border-brand-yellow bg-surface-muted p-5 sm:p-6', className)}
    >
      <div className="flex items-start gap-3">
        <Icon name="shield" size={22} className="mt-0.5 shrink-0 text-ink" />
        <div>
          <h2 id="safety-callout-title" className="text-base font-bold">
            Stay safe when applying for jobs
          </h2>
          <ul className="mt-2 space-y-1.5 text-[0.95rem] text-ink-muted">
            <li>Be cautious of anyone who asks you to pay money to secure a job or an interview.</li>
            <li>Check that contact details match those published on this website.</li>
            {variant === 'full' && (
              <>
                <li>Never send original documents. Share copies only when you understand why they are needed.</li>
                <li>A genuine offer states the role, workplace, pay and working hours clearly.</li>
              </>
            )}
          </ul>
          <ArrowLink href={routes.recruitmentSafety()} className="mt-3 text-sm">
            How to recognise a genuine opportunity
          </ArrowLink>
        </div>
      </div>
    </aside>
  )
}
