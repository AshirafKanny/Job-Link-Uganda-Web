import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon, type IconName } from './Icon'

type Props = {
  icon?: IconName
  title: string
  children?: ReactNode
  actions?: ReactNode
  className?: string
}

/** Intentional "nothing here yet" state with useful next steps. */
export function EmptyState({ icon = 'briefcase', title, children, actions, className }: Props) {
  return (
    <div className={cn('border border-dashed border-line-strong bg-surface-muted px-6 py-10 sm:px-10', className)}>
      <div className="flex max-w-2xl flex-col gap-4 sm:flex-row sm:gap-6">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-brand-red ring-1 ring-line">
          <Icon name={icon} size={22} />
        </span>
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          {children && <div className="mt-2 text-ink-muted">{children}</div>}
          {actions && <div className="mt-5 flex flex-wrap gap-3">{actions}</div>}
        </div>
      </div>
    </div>
  )
}
