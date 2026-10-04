import type { ReactNode } from 'react'
import { Photo } from '@/components/ui/Photo'
import type { StockImageKey } from '@/config/images'
import { cn } from '@/lib/cn'

type Props = {
  image: StockImageKey
  children: ReactNode
  /** Gentle scroll parallax (CSS scroll-driven; static where unsupported or with reduced motion). */
  parallax?: boolean
  /** The photo is decorative behind meaningful text: empty alt. */
  decorative?: boolean
  /**
   * "full" darkens evenly; "left" keeps the right side brighter (text on the left);
   * "light" only when the text sits on its own solid panels.
   */
  overlay?: 'full' | 'left' | 'light'
  className?: string
  'aria-labelledby'?: string
  'aria-label'?: string
}

/**
 * Full-width photographic band with a dark overlay for text contrast. Used
 * sparingly for visual breaks: the closing call to action and the Kampala
 * banner. Text always sits on the overlay, never directly on the photo, and
 * the dark background behind the photo keeps text readable if it fails to load.
 */
export function PhotoBand({
  image,
  children,
  parallax = false,
  decorative = true,
  overlay = 'full',
  className,
  ...aria
}: Props) {
  return (
    <section className={cn('relative isolate overflow-hidden bg-brand-black text-white', className)} {...aria}>
      <Photo
        image={image}
        fill
        decorative={decorative}
        sizes="100vw"
        className="-z-20 bg-brand-black"
        imgClassName={parallax ? 'photo-parallax' : undefined}
      />
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 -z-10',
          overlay === 'full' &&
            'bg-[linear-gradient(180deg,rgba(13,13,13,0.72)_0%,rgba(13,13,13,0.82)_100%)]',
          overlay === 'light' &&
            'bg-[linear-gradient(180deg,rgba(13,13,13,0.25)_0%,rgba(13,13,13,0.5)_100%)]',
          overlay === 'left' && 'bg-[linear-gradient(180deg,rgba(13,13,13,0.78)_0%,rgba(13,13,13,0.86)_100%)] md:bg-[linear-gradient(90deg,rgba(13,13,13,0.92)_0%,rgba(13,13,13,0.78)_45%,rgba(13,13,13,0.35)_100%)]',
        )}
      />
      <div className="flag-bar h-1" aria-hidden="true" />
      {children}
    </section>
  )
}
