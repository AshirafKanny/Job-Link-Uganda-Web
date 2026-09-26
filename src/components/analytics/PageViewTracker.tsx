'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * Sends one anonymous beacon per page view (including client-side
 * navigations). No cookies, no storage, no third parties. Honours
 * Do Not Track and Global Privacy Control, and skips automated browsers.
 */
export function PageViewTracker() {
  const pathname = usePathname()
  const firstView = useRef(true)

  useEffect(() => {
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean }
    if (nav.doNotTrack === '1' || nav.globalPrivacyControl || nav.webdriver) return

    // The external referrer only applies to the page the visitor landed on.
    const referrer = firstView.current ? document.referrer : ''
    firstView.current = false
    const body = JSON.stringify({ p: pathname, r: referrer })

    if (!navigator.sendBeacon?.('/track', new Blob([body], { type: 'application/json' }))) {
      fetch('/track', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {})
    }
  }, [pathname])

  return null
}
