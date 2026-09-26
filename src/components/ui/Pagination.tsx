import Link from 'next/link'
import { Icon } from './Icon'

type Props = {
  page: number
  totalPages: number
  /** Builds the URL for a given page number. */
  hrefFor: (page: number) => string
}

export function Pagination({ page, totalPages, hrefFor }: Props) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  )
  const itemClass = 'inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border px-3 font-display text-sm font-bold'

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center gap-2">
      {page > 1 && (
        <Link href={hrefFor(page - 1)} rel="prev" className={`${itemClass} border-line-strong hover:border-ink`}>
          <Icon name="arrow-right" size={16} className="rotate-180" />
          <span className="sr-only">Previous page</span>
        </Link>
      )}
      {pages.map((p, i) => (
        <span key={p} className="contents">
          {i > 0 && p - pages[i - 1]! > 1 && <span className="px-1 text-ink-subtle">…</span>}
          {p === page ? (
            <span aria-current="page" className={`${itemClass} border-ink bg-ink text-white`}>
              {p}
            </span>
          ) : (
            <Link href={hrefFor(p)} className={`${itemClass} border-line-strong hover:border-ink`}>
              {p}
            </Link>
          )}
        </span>
      ))}
      {page < totalPages && (
        <Link href={hrefFor(page + 1)} rel="next" className={`${itemClass} border-line-strong hover:border-ink`}>
          <Icon name="arrow-right" size={16} />
          <span className="sr-only">Next page</span>
        </Link>
      )}
    </nav>
  )
}
