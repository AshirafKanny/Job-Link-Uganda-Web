/** Pure helpers for anonymous visit statistics. */

export type Device = 'mobile' | 'tablet' | 'desktop'

const BOT = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|whatsapp|telegram|curl|wget|python|axios|node-fetch|go-http|java\//i

export function isBot(userAgent: string | null): boolean {
  return !userAgent || BOT.test(userAgent)
}

export function classifyDevice(userAgent: string): Device {
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(userAgent)) return 'tablet'
  if (/mobi|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(userAgent)) return 'mobile'
  return 'desktop'
}

/** External referrer host, or null for direct visits and internal navigation. */
export function referrerHost(referrer: string | null | undefined, siteHost: string): string | null {
  if (!referrer) return null
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '').toLowerCase()
    if (!host || host === siteHost.replace(/^www\./, '').toLowerCase()) return null
    return host.slice(0, 100)
  } catch {
    return null
  }
}

const SOURCES: [RegExp, string][] = [
  [/(^|\.)google\./, 'Google'],
  [/(^|\.)bing\.com$/, 'Bing'],
  [/(^|\.)(facebook\.com|fb\.com|m\.facebook\.com|l\.facebook\.com)$/, 'Facebook'],
  [/(^|\.)(whatsapp\.com|wa\.me|l\.wl\.co)$/, 'WhatsApp'],
  [/(^|\.)linkedin\.com$|(^|\.)lnkd\.in$/, 'LinkedIn'],
  [/(^|\.)instagram\.com$/, 'Instagram'],
  [/(^|\.)(x\.com|twitter\.com|t\.co)$/, 'X (Twitter)'],
  [/(^|\.)tiktok\.com$/, 'TikTok'],
  [/(^|\.)(yahoo|duckduckgo)\./, 'Other search'],
]

/** Friendly traffic-source name for a referrer host ("Direct" when none). */
export function sourceName(host: string | null): string {
  if (!host) return 'Direct'
  for (const [pattern, name] of SOURCES) if (pattern.test(host)) return name
  return host
}

/** Extracts the job reference from a job page path, e.g. /jobs/waiter-kampala-jl12 → "12". */
export function jobRefFromPath(path: string): string | null {
  return /^\/jobs\/[a-z0-9-]+-jl(\d+)$/.exec(path)?.[1] ?? null
}

/** Paths that are counted: public pages only. */
export function isTrackablePath(path: string): boolean {
  return /^\/[\w\-/]*$/.test(path) && path.length <= 300 && !/^\/(admin|api|track|_next)(\/|$)/.test(path)
}

/** Percentage change, or null when there is no previous value to compare with. */
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null
  return Math.round(((current - previous) / previous) * 100)
}
