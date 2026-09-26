import Link from 'next/link'
import { preload } from 'react-dom'
import { Icon } from '@/components/ui/Icon'
import { business } from '@/config/business'
import { heroSrcSet, homeHero } from '@/config/hero'
import { routes } from '@/lib/routes'

const SIZES = '100vw'
const focusAreas = ['Hospitality', 'Restaurants', 'Hotels', 'General recruitment']

/**
 * Full-bleed photographic hero. The photo is a real <img> (not a CSS
 * background) so it can be the LCP element: preloaded, AVIF/WebP via
 * <picture>, high fetch priority, with a blurred placeholder underneath.
 * A directional overlay guarantees text contrast over the empty left side
 * of the photo on desktop, and over the whole image on mobile.
 */
export function HomeHero() {
  preload(`${homeHero.basePath}-1920.avif`, {
    as: 'image',
    type: 'image/avif',
    imageSrcSet: heroSrcSet('avif'),
    imageSizes: SIZES,
    fetchPriority: 'high',
  })

  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden bg-brand-black text-white">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[24rem] bg-cover sm:h-[30rem] lg:inset-0 lg:h-auto"
        style={{ backgroundImage: `url(${homeHero.placeholder})`, backgroundPosition: homeHero.focus }}
      >
        <picture>
          <source type="image/avif" srcSet={heroSrcSet('avif')} sizes={SIZES} />
          <source type="image/webp" srcSet={heroSrcSet('webp')} sizes={SIZES} />
          <img
            src={`${homeHero.basePath}-1920.jpg`}
            alt=""
            width={homeHero.width}
            height={homeHero.height}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="hero-photo h-full w-full object-cover"
            style={{ objectPosition: homeHero.focus }}
          />
        </picture>
        {/* Mobile: photo band fading into black beneath it. Desktop: dark left for text, clear right for the subject. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,13,0.05)_0%,rgba(13,13,13,0.15)_45%,rgba(13,13,13,0.85)_82%,rgb(13,13,13)_100%)] lg:bg-[linear-gradient(90deg,rgba(13,13,13,0.95)_0%,rgba(13,13,13,0.86)_32%,rgba(13,13,13,0.45)_58%,rgba(13,13,13,0.1)_100%)]" />
      </div>

      <div className="container-page flex pt-[19rem] pb-16 sm:pt-[24rem] sm:pb-20 lg:min-h-[min(88vh,50rem)] lg:items-center lg:py-28">
        <div className="max-w-2xl">
          <p className="enter flex items-center gap-3 font-display text-xs font-bold tracking-[0.2em] text-brand-yellow uppercase">
            <span aria-hidden="true" className="h-0.5 w-8 bg-brand-yellow" />
            {business.tagline}
          </p>
          <h1
            id="hero-heading"
            className="enter mt-5 text-[2.6rem] leading-[1.04] font-extrabold text-white [--enter-step:1] sm:text-6xl lg:text-[4.35rem]"
          >
            The right people for the right jobs in Uganda.
          </h1>
          <p className="enter mt-6 max-w-xl text-lg leading-relaxed text-white/85 [--enter-step:2] sm:text-xl">
            Job Link Uganda is a recruitment agency working in Kampala. We find and screen suitable staff for employers,
            and connect job seekers with genuine vacancies, with a particular focus on restaurants and hospitality.
          </p>

          <div className="enter mt-9 grid gap-3 [--enter-step:3] sm:grid-cols-2">
            <Link
              href={routes.jobs()}
              className="group flex items-center justify-between gap-4 rounded-control bg-brand-red px-5 py-4 text-white transition-colors duration-200 hover:bg-brand-red-dark"
            >
              <span>
                <span className="block font-display text-lg font-extrabold">I&apos;m looking for a job</span>
                <span className="block text-sm text-white">Browse current vacancies</span>
              </span>
              <Icon name="arrow-right" size={22} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href={routes.services()}
              className="group flex items-center justify-between gap-4 rounded-control bg-white px-5 py-4 text-brand-black transition-colors duration-200 hover:bg-surface-muted"
            >
              <span>
                <span className="block font-display text-lg font-extrabold">I&apos;m looking for staff</span>
                <span className="block text-sm text-ink-muted">See our recruitment services</span>
              </span>
              <Icon name="arrow-right" size={22} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          <ul
            aria-label="Recruitment focus"
            className="enter mt-9 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-white/80 [--enter-step:4]"
          >
            {focusAreas.map((area) => (
              <li key={area} className="flex items-center gap-2">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-yellow" />
                {area}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div aria-hidden="true" className="flag-bar absolute inset-x-0 bottom-0 h-1" />
    </section>
  )
}
