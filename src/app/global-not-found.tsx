import type { Metadata } from 'next'
import { site } from '@/config/site'
import { routes } from '@/lib/routes'
import './(frontend)/globals.css'

/**
 * 404 for URLs that match no route. Rendered fully on the server (unlike a
 * thrown notFound(), which currently ships an empty HTML body in production —
 * see docs/02-technical-architecture.md, "Known upstream issues").
 */
// Next.js adds the noindex robots tag to 404 responses itself.
export const metadata: Metadata = {
  title: `Page not found | ${site.name}`,
}

export default function GlobalNotFound() {
  return (
    <html lang={site.language}>
      <body>
        <main id="main" className="mx-auto max-w-2xl px-4 py-24">
          <h1 className="text-3xl font-semibold">We couldn&apos;t find that page</h1>
          <p className="mt-4 text-ink-muted">The link may be out of date, or the vacancy may have closed.</p>
          <p className="mt-6">
            {/* Plain anchor: this page renders outside the app router. */}
            <a href={routes.home()} className="underline underline-offset-4">
              Go to the home page
            </a>
          </p>
        </main>
      </body>
    </html>
  )
}
