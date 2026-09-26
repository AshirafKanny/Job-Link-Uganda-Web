import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { business } from '@/config/business'
import { headerCta, mainNav } from '@/config/navigation'
import { routes } from '@/lib/routes'
import { HeaderNav } from './HeaderNav'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface [--header-height:4.5rem]">
      <div className="flag-bar h-1" aria-hidden="true" />
      <div className="container-page flex h-[calc(var(--header-height)-0.25rem)] items-center justify-between gap-6">
        <Link href={routes.home()} className="flex shrink-0 items-center gap-3" aria-label={`${business.name}, home`}>
          <Logo size={48} eager />
          <span className="font-display text-[1.05rem] leading-none font-extrabold tracking-tight uppercase">
            Job <span className="text-brand-red">Link</span>
            <span className="mt-1 block text-[0.625rem] font-semibold tracking-[0.34em] text-ink-muted">Uganda</span>
          </span>
        </Link>
        <HeaderNav items={mainNav} cta={headerCta} />
      </div>
    </header>
  )
}
