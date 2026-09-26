import Image from 'next/image'
import { business } from '@/config/business'

/** Vector master, clipped to the circle (source: assets/brand/JBU logo-original.svg). */
const LOGO_SVG = '/brand/job-link-uganda-logo.svg'

type Props = {
  /** Rendered size in CSS pixels (the logo is circular, so width = height). */
  size?: number
  /** Above-the-fold images (e.g. the header) load eagerly instead of lazily. */
  eager?: boolean
  className?: string
}

/**
 * Official circular logo, rendered from the SVG so it stays sharp at every
 * size and screen density. SVGs are served as-is by next/image (no resizing).
 *
 * Logo usage rules:
 * - Always on a light background (white or surface-muted), never on red or yellow.
 * - Minimum size 40px; below ~80px pair it with the text name (as the header does).
 * - Never recolour, stretch, crop or add effects.
 */
export function Logo({ size = 48, eager = false, className }: Props) {
  return (
    <Image
      src={LOGO_SVG}
      alt={`${business.name} logo`}
      width={size}
      height={size}
      loading={eager ? 'eager' : 'lazy'}
      className={className}
    />
  )
}
