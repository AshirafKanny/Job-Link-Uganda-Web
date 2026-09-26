import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'

type Variant = 'primary' | 'dark' | 'outline' | 'outline-light' | 'light'
type Size = 'md' | 'lg'

const base =
  'group/btn inline-flex items-center justify-center gap-2 rounded-control font-display font-bold tracking-tight transition-[background-color,border-color,color,transform] duration-200 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'bg-brand-red text-white hover:bg-brand-red-dark',
  dark: 'bg-brand-black text-white hover:bg-ink/85',
  outline: 'border border-line-strong bg-surface text-ink hover:border-ink',
  'outline-light': 'border border-white/35 text-white hover:border-white hover:bg-white/5',
  light: 'bg-white text-brand-black hover:bg-surface-muted',
}

const sizes: Record<Size, string> = {
  md: 'min-h-11 px-5 text-[0.95rem]',
  lg: 'min-h-13 px-6 text-base',
}

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}

type Common = { variant?: Variant; size?: Size; arrow?: boolean; children: ReactNode; className?: string }

function Arrow() {
  return (
    <Icon
      name="arrow-right"
      size={18}
      className="transition-transform duration-200 ease-out group-hover/btn:translate-x-0.5"
    />
  )
}

export function ButtonLink({
  variant,
  size,
  arrow,
  children,
  className,
  ...props
}: Common & Omit<ComponentProps<typeof Link>, 'className' | 'children'>) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {children}
      {arrow && <Arrow />}
    </Link>
  )
}

export function Button({
  variant,
  size,
  arrow,
  children,
  className,
  ...props
}: Common & Omit<ComponentProps<'button'>, 'className' | 'children'>) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props}>
      {children}
      {arrow && <Arrow />}
    </button>
  )
}

/** Inline text link with an arrow, for "Read more"-type actions. */
export function ArrowLink({
  children,
  className,
  ...props
}: { children: ReactNode; className?: string } & Omit<ComponentProps<typeof Link>, 'className' | 'children'>) {
  return (
    <Link
      className={cn(
        'group/link inline-flex items-center gap-1.5 font-display font-bold text-brand-red-dark underline-offset-4 hover:underline',
        className,
      )}
      {...props}
    >
      {children}
      <Icon
        name="arrow-right"
        size={17}
        className="transition-transform duration-200 ease-out group-hover/link:translate-x-0.5"
      />
    </Link>
  )
}
