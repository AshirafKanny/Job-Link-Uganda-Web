import { WhatsAppLink } from '@/components/contact/WhatsAppLink'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { formatUgx, type TrainingPackage } from '@/content/training'
import { cn } from '@/lib/cn'
import { routes } from '@/lib/routes'

type Props = {
  packages: TrainingPackage[]
  /** Individuals enquire on WhatsApp (no personal data is collected on the site); employers use the booking form. */
  audience: 'individual' | 'workplace'
  whatsapp: string
  tone?: 'default' | 'inverse'
  /** Heading level of each package name, to keep the page outline correct. */
  headingLevel?: 'h3' | 'h4'
}

/**
 * Training packages as a service price list: one row per package, with the
 * price, duration, audience and contents side by side. Prices are rendered
 * from the same data as the structured data, so the two always match.
 */
export function TrainingPackageList({ packages, audience, whatsapp, tone = 'default', headingLevel: Heading = 'h3' }: Props) {
  const inverse = tone === 'inverse'
  return (
    <div className={cn('border-b', inverse ? 'border-white/15' : 'border-line')}>
      {packages.map((pkg, i) => (
        <article
          key={pkg.id}
          id={pkg.id}
          aria-labelledby={`${pkg.id}-name`}
          className={cn(
            'grid scroll-mt-28 gap-6 border-t py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_15rem] lg:gap-10',
            inverse ? 'border-white/15' : 'border-line',
          )}
          data-aos="fade-up"
          data-aos-delay={i * 80}
        >
          <div>
            <Heading id={`${pkg.id}-name`} className="text-xl font-extrabold">
              {pkg.name}
            </Heading>
            <p className={cn('mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[0.95rem]', inverse ? 'text-white/75' : 'text-ink-muted')}>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="clock" size={17} className={inverse ? 'text-brand-yellow' : 'text-brand-red'} />
                {pkg.duration}
              </span>
              {pkg.groupSize && (
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="users" size={17} className={inverse ? 'text-brand-yellow' : 'text-brand-red'} />
                  {pkg.groupSize}
                </span>
              )}
            </p>
            <p className={cn('mt-5 font-display text-xs font-bold tracking-[0.14em] uppercase', inverse ? 'text-white/60' : 'text-ink-subtle')}>
              Suitable for
            </p>
            <p className={cn('mt-1 text-[0.95rem]', inverse ? 'text-white/85' : 'text-ink')}>{pkg.suitableFor.join(' · ')}</p>
          </div>

          <div>
            <p className={cn('font-display text-xs font-bold tracking-[0.14em] uppercase lg:sr-only', inverse ? 'text-white/60' : 'text-ink-subtle')}>
              Includes
            </p>
            <ul className="mt-2 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:mt-0">
              {pkg.includes.map((item) => (
                <li key={item} className={cn('flex gap-2.5 text-[0.95rem]', inverse ? 'text-white/85' : 'text-ink')}>
                  <Icon name="check" size={18} className={cn('mt-0.5 shrink-0', inverse ? 'text-brand-yellow' : 'text-brand-red')} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-end lg:justify-start lg:text-right">
            <p>
              <span className="block font-display text-2xl font-extrabold tabular-nums">{formatUgx(pkg.price)}</span>
              <span className={cn('text-sm', inverse ? 'text-white/60' : 'text-ink-subtle')}>{pkg.priceUnit}</span>
            </p>
            {audience === 'workplace' ? (
              <ButtonLink href={`${routes.bookTraining()}?package=${pkg.id}`} variant={inverse ? 'light' : 'dark'} className="whitespace-nowrap" arrow>
                Request this training
              </ButtonLink>
            ) : (
              <WhatsAppLink
                number={whatsapp}
                message={`Hello Job Link Uganda, I'm interested in the ${pkg.name} training (${formatUgx(pkg.price)}). Please share the next dates.`}
                label="Enquire on WhatsApp"
                variant={inverse ? 'solid' : 'outline'}
                className="whitespace-nowrap"
              />
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
