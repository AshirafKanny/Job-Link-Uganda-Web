import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'
import { site } from './src/config/site'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Canonical origin guard. Canonical tags, the sitemap, Open Graph and
 * structured data are all built from site.url (NEXT_PUBLIC_SITE_URL, with a
 * production fallback in src/config/site.ts), so it must be the real public
 * domain before the site is indexable. Fail the build rather than ship
 * canonicals that point search engines at the wrong host.
 */
const siteUrl = site.url
const siteHost = new URL(siteUrl).hostname
const isPublicDomain = !/(^|\.)vercel\.app$|^localhost$|^127\.0\.0\.1$/.test(siteHost)
if (process.env.SITE_INDEXABLE === 'true' && !isPublicDomain) {
  throw new Error(
    `SITE_INDEXABLE=true but NEXT_PUBLIC_SITE_URL is "${siteUrl}". Set it to the public domain (e.g. https://www.joblinkuganda.com) before allowing indexing.`,
  )
}

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  ...(process.env.NODE_ENV === 'production'
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }]
    : []),
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The local dev URL is 127.0.0.1 (see README); allow its hot-reload connection.
  allowedDevOrigins: ['127.0.0.1'],
  experimental: {
    // Server-rendered 404 for unmatched URLs across both root layouts (site + admin).
    globalNotFound: true,
  },
  trailingSlash: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    localPatterns: [{ pathname: '/api/media/file/**' }, { pathname: '/images/**' }],
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  async redirects() {
    // Production only: send any *.vercel.app alias to the real domain so search
    // engines never see duplicate copies of the site on a second host.
    if (process.env.VERCEL_ENV !== 'production' || !isPublicDomain) return []
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: '(?<vercelHost>.+\\.vercel\\.app)' }],
        destination: `${siteUrl}/:path*`,
        permanent: true,
      },
    ]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
