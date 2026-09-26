/**
 * Site-level settings that are safe to import anywhere (client or server).
 */
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const site = {
  name: 'Job Link Uganda',
  /** Canonical origin without trailing slash. */
  url: rawSiteUrl.replace(/\/+$/, ''),
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
