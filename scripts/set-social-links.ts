/**
 * Saves Job Link Uganda's official social profiles in Site Settings, where
 * the footer and the Organization structured data (sameAs) read them.
 *
 * Idempotent: replaces only the LinkedIn, Facebook and TikTok entries and
 * keeps any other platforms staff have added. Safe to run more than once.
 *
 * Usage (PowerShell), against the live database:
 *   $env:DATABASE_URL="<Neon connection string>"; $env:NODE_ENV="production"; npx payload run scripts/set-social-links.ts
 */
import config from '@payload-config'
import { getPayload } from 'payload'
import type { SocialPlatform } from '../src/domain/settings/types'

// Official profiles, confirmed by the business on 2026-10-02. Exact URLs; do not edit.
const OFFICIAL: { platform: SocialPlatform; url: string }[] = [
  { platform: 'linkedin', url: 'https://www.linkedin.com/company/job-link-uganda/' },
  { platform: 'facebook', url: 'https://www.facebook.com/profile.php?id=61591646698079' },
  { platform: 'tiktok', url: 'https://www.tiktok.com/@jonlinkuganda/' },
]

const payload = await getPayload({ config })
const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true })
const others = (settings.socialLinks ?? [])
  .filter((l) => !OFFICIAL.some((o) => o.platform === l.platform))
  .map(({ platform, url }) => ({ platform, url }))
const next = [...OFFICIAL, ...others]

const current = JSON.stringify((settings.socialLinks ?? []).map(({ platform, url }) => ({ platform, url })))
if (current === JSON.stringify(next)) {
  payload.logger.info('Social links already up to date.')
} else {
  await payload.updateGlobal({ slug: 'site-settings', data: { socialLinks: next }, overrideAccess: true })
  payload.logger.info(`Social links saved: ${next.map((l) => l.platform).join(', ')}`)
}
process.exit(0)
