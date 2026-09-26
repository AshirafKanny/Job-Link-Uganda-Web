import type { Metadata } from 'next'
import Link from 'next/link'
import { routes } from '@/lib/routes'

// Next.js adds the noindex robots tag to 404 responses itself.
export const metadata: Metadata = {
  title: 'Page not found',
}

// Links to /jobs etc. are added once those pages ship (Phase 1–2).
export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24">
      <h1 className="text-3xl font-semibold">We couldn&apos;t find that page</h1>
      <p className="mt-4 text-ink-muted">The link may be out of date, or the vacancy may have closed.</p>
      <p className="mt-6">
        <Link href={routes.home()} className="underline underline-offset-4">
          Go to the home page
        </Link>
      </p>
    </div>
  )
}
