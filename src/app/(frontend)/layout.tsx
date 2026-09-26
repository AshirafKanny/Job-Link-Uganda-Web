import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import type { ReactNode } from 'react'
import { preconnect } from 'react-dom'
import { PageViewTracker } from '@/components/analytics/PageViewTracker'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ScrollAnimations } from '@/components/motion/ScrollAnimations'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { site } from '@/config/site'
import './globals.css'

// Self-hosted at build time by next/font: no request to Google from visitors' browsers.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
// Geometric sans matching the logo's wordmark; headings only.
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { template: `%s | ${site.name}`, default: site.name },
  applicationName: site.name,
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  // Stock photography is served from the Unsplash CDN.
  preconnect('https://images.unsplash.com')
  return (
    <html lang={site.language} className={`${inter.variable} ${montserrat.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-surface focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <PageViewTracker />
        <ScrollAnimations />
      </body>
    </html>
  )
}
