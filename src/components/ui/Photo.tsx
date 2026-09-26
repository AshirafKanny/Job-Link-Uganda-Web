import { stockImages, type StockImageKey } from '@/config/images'
import { cn } from '@/lib/cn'

const WIDTHS = [400, 640, 828, 1080, 1440, 1920]

/** Crops server-side around the photo's focal point ("x% y%"), so faces are never cut off. */
function imgixUrl(src: string, width: number, aspect?: [number, number], focus = '50% 50%') {
  const params = new URLSearchParams({ auto: 'format', fit: 'crop', q: '70', w: String(width) })
  if (aspect) {
    const [fx = '50', fy = '50'] = focus.split(' ').map((v) => v.replace('%', ''))
    params.set('h', String(Math.round((width * aspect[1]) / aspect[0])))
    params.set('crop', 'focalpoint')
    params.set('fp-x', String(Number(fx) / 100))
    params.set('fp-y', String(Number(fy) / 100))
  }
  return `${src}?${params.toString()}`
}

type Props = {
  image: StockImageKey
  /** Responsive `sizes` attribute; required for correct image selection. */
  sizes: string
  /** Crop to this aspect ratio (width, height). Defaults to the original. */
  aspect?: [number, number]
  /** Above-the-fold LCP image: eager + high fetch priority. */
  priority?: boolean
  /** Scroll animation: the photo settles from a slight zoom as it enters the viewport. */
  reveal?: boolean
  className?: string
}

/**
 * Stock photo served by the Unsplash image CDN (imgix): responsive srcset,
 * AVIF/WebP via auto=format, explicit dimensions (no layout shift), lazy by
 * default. Rendered as plain HTML — no client JavaScript. No visible credit
 * is shown (the Unsplash License does not require one); attribution is kept
 * in src/config/images.ts.
 */
export function Photo({ image, sizes, aspect, priority = false, reveal = false, className }: Props) {
  const photo = stockImages[image]
  const ratio = aspect ?? [photo.width, photo.height]
  const width = 1200
  const height = Math.round((width * ratio[1]) / ratio[0])

  return (
    <figure
      className={cn('relative overflow-hidden bg-surface-sunken', className)}
      data-aos={reveal ? 'image-reveal' : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- CDN-optimised srcset; next/image would re-process an already optimised source */}
      <img
        src={imgixUrl(photo.src, 1080, aspect, photo.focus)}
        srcSet={WIDTHS.map((w) => `${imgixUrl(photo.src, w, aspect, photo.focus)} ${w}w`).join(', ')}
        sizes={sizes}
        width={width}
        height={height}
        alt={photo.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding={priority ? 'sync' : 'async'}
        className="h-full w-full object-cover"
        style={{ objectPosition: photo.focus }}
      />
    </figure>
  )
}
