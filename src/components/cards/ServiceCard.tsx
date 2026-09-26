import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import type { Service } from '@/domain/content/types'
import { cn } from '@/lib/cn'
import { routes } from '@/lib/routes'

type Props = { service: Pick<Service, 'title' | 'slug' | 'summary'>; index?: number; className?: string }

export function ServiceCard({ service, index = 0, className }: Props) {
  return (
    <article
      className={cn(
        'group relative flex flex-col border-t-2 border-ink bg-surface pt-5 transition-colors duration-300 hover:border-brand-red',
        className,
      )}
      data-aos="fade-up"
      data-aos-delay={index * 100}
    >
      <h3 className="text-xl font-bold">
        <Link href={routes.service(service.slug)} className="after:absolute after:inset-0">
          {service.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-ink-muted">{service.summary}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-bold text-brand-red-dark">
        View service
        <Icon name="arrow-right" size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </article>
  )
}
