'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * AOS-style scroll animations ("Animate On Scroll"), built on
 * IntersectionObserver instead of the unmaintained `aos` package.
 *
 * Mark elements with data-aos="fade-up" (see globals.css for the list), and
 * optionally data-aos-delay / data-aos-duration in milliseconds. Each element
 * animates once, the first time it scrolls into view. Re-scans after every
 * client-side navigation. Does nothing for reduced-motion users.
 */
export function ScrollAnimations() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      root.classList.remove('aos-ready')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-aos-in', '')
          observer.unobserve(entry.target)
        }
      },
      // Trigger slightly before the element is fully on screen, like AOS's default offset.
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )

    const prepare = (el: HTMLElement) => {
      if (el.hasAttribute('data-aos-in') || el.dataset.aosBound) return
      el.dataset.aosBound = '1'
      const delay = Number(el.dataset.aosDelay)
      const duration = Number(el.dataset.aosDuration)
      if (delay > 0) el.style.setProperty('--aos-delay', `${Math.min(delay, 1500)}ms`)
      if (duration > 0) el.style.setProperty('--aos-duration', `${Math.min(duration, 3000)}ms`)
      observer.observe(el)
    }

    const scan = () => document.querySelectorAll<HTMLElement>('[data-aos]').forEach(prepare)
    // Content streamed in or rendered later (e.g. after a filter) is picked up too.
    const mutations = new MutationObserver(scan)

    const start = () => {
      // Content already on screen when the page loads is shown as-is, not hidden
      // and re-animated: hiding it would flash content and delay Largest
      // Contentful Paint. Only content the visitor scrolls to animates.
      document.querySelectorAll<HTMLElement>('[data-aos]:not([data-aos-in])').forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) el.setAttribute('data-aos-in', '')
      })
      scan()
      // Hide not-yet-seen elements only after they are being observed.
      root.classList.add('aos-ready')
      mutations.observe(document.body, { childList: true, subtree: true })
    }

    // Start only after the page has loaded, so no attribute is added to markup
    // React has not hydrated yet (that causes hydration-mismatch warnings).
    // Until then nothing is hidden: content simply shows without animation.
    let frame = 0
    const startSoon = () => {
      frame = requestAnimationFrame(start)
    }
    if (document.readyState === 'complete') startSoon()
    else window.addEventListener('load', startSoon, { once: true })

    return () => {
      window.removeEventListener('load', startSoon)
      cancelAnimationFrame(frame)
      observer.disconnect()
      mutations.disconnect()
      document.querySelectorAll<HTMLElement>('[data-aos-bound]').forEach((el) => delete el.dataset.aosBound)
    }
  }, [pathname])

  return null
}
