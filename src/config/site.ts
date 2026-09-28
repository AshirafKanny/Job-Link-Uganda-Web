/**
 * Site-level settings that are safe to import anywhere (client or server).
 */

/** The public domain the production deployment is served from. */
export const PRODUCTION_ORIGIN = 'https://www.joblinkuganda.com'

/**
 * Canonical origin. Normally NEXT_PUBLIC_SITE_URL, but the production
 * deployment never uses a *.vercel.app address (or no address at all):
 * canonicals, the sitemap and structured data would then point search
 * engines at the wrong host, so it falls back to the real domain.
 */
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (process.env.VERCEL_ENV === 'production') {
    const host = raw ? URL.parse(raw)?.hostname : undefined
    if (!host || /(^|\.)vercel\.app$/i.test(host)) return PRODUCTION_ORIGIN
  }
  return raw || 'http://localhost:3000'
}

export const site = {
  name: 'Job Link Uganda',
  /** Canonical origin without trailing slash. */
  url: resolveSiteUrl().replace(/\/+$/, ''),
  locale: 'en_UG',
  language: 'en',
  country: 'UG',
  defaultCurrency: 'UGX',
  timeZone: 'Africa/Kampala',
} as const

/**
 * Indexing is opt-in. Only the production deployment sets SITE_INDEXABLE=true,
 * so previews and local builds can never leak into search results.
 */
export const isSiteIndexable = process.env.SITE_INDEXABLE === 'true'

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`
}
