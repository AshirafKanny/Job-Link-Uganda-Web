'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useState } from 'react'
import { buttonClasses } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import type { NavItem } from '@/config/navigation'
import { cn } from '@/lib/cn'

type Props = { items: NavItem[]; cta: NavItem }

const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

/**
 * The only client-side part of the header: active-link state and the mobile
 * menu. Everything else in the header is server-rendered.
 */
export function HeaderNav({ items, cta }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const panelId = useId()

  // Close the menu on navigation.
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <nav aria-label="Main" className="hidden lg:block">
        <ul className="flex items-center gap-1">
          {items.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative px-3 py-2 font-display text-[0.9rem] font-semibold transition-colors duration-200',
                    'after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-brand-red after:transition-transform after:duration-300',
                    active
                      ? 'text-ink after:scale-x-100'
                      : 'text-ink-muted after:scale-x-0 hover:text-ink hover:after:scale-x-100',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="flex items-center gap-2">
        {/* Wrapper controls visibility so it can't conflict with the button's own display utility. */}
        <div className="hidden sm:block">
          <Link href={cta.href} className={buttonClasses('primary', 'md')}>
            {cta.label}
          </Link>
        </div>
        <button
          type="button"
          className="menu-toggle inline-flex size-11 items-center justify-center rounded-control border border-line text-ink lg:hidden"
          data-open={open || undefined}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          {/* Three bars that morph into an X. */}
          <span aria-hidden="true" className="menu-toggle__bars">
            <span />
            <span />
            <span />
          </span>
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      {/* Always mounted so it can animate out; inert while closed so nothing inside is focusable or announced. */}
      <div
        id={panelId}
        inert={!open}
        data-open={open || undefined}
        className="menu-panel fixed inset-x-0 top-(--header-height) bottom-0 z-40 overflow-y-auto bg-surface lg:hidden"
      >
        <div aria-hidden="true" className="menu-panel__rule flag-bar h-1" />
        <nav aria-label="Main mobile" className="container-page py-6">
          <ul className="divide-y divide-line">
            {items.map((item, i) => {
              const active = isActive(pathname, item.href)
              return (
                <li key={item.href} className="menu-panel__item" style={{ ['--i' as string]: i }}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group flex items-center justify-between py-4 font-display text-xl font-bold',
                      active ? 'text-brand-red-dark' : 'text-ink',
                    )}
                  >
                    {item.label}
                    <Icon
                      name="arrow-right"
                      size={20}
                      className="text-ink-subtle transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-red"
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="menu-panel__item" style={{ ['--i' as string]: items.length }}>
            <Link href={cta.href} className={buttonClasses('primary', 'lg', 'mt-6 w-full')}>
              {cta.label}
            </Link>
          </div>
        </nav>
      </div>
    </>
  )
}
