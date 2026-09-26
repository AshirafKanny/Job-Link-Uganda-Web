import 'server-only'
import { cache } from 'react'
import { EMPTY_SETTINGS, SOCIAL_PLATFORMS, type SiteSettings } from '@/domain/settings/types'
import type { SettingsRepository } from '../repositories'
import { getPayloadClient } from './client'

const clean = (value: string | null | undefined) => (value && value.trim() ? value.trim() : null)

/** One CMS read per request, however many components ask for settings. */
const loadSettings = cache(async (): Promise<SiteSettings> => {
  const payload = await getPayloadClient()
  const doc = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true, depth: 0 })

  const office =
    doc.hasPublicOffice && clean(doc.office?.streetAddress)
      ? {
          streetAddress: clean(doc.office?.streetAddress)!,
          locality: clean(doc.office?.locality) ?? 'Kampala',
          region: clean(doc.office?.region) ?? 'Central Region',
          postalCode: clean(doc.office?.postalCode),
          mapUrl: clean(doc.office?.mapUrl),
        }
      : null

  return {
    contact: {
      phone: clean(doc.phone),
      email: clean(doc.email),
      whatsappCandidates: clean(doc.whatsappCandidates),
      whatsappEmployers: clean(doc.whatsappEmployers) ?? clean(doc.whatsappCandidates),
    },
    office,
    openingHours: (doc.openingHours ?? []).map((h) => h.line).filter(Boolean),
    socialLinks: (doc.socialLinks ?? [])
      .filter((l) => SOCIAL_PLATFORMS.includes(l.platform) && /^https:\/\//.test(l.url))
      .map((l) => ({ platform: l.platform, url: l.url })),
    seo: { defaultDescription: clean(doc.defaultDescription) ?? EMPTY_SETTINGS.seo.defaultDescription },
  }
})

export const payloadSettingsRepository: SettingsRepository = {
  async get() {
    try {
      return await loadSettings()
    } catch {
      // Settings are presentational; never take the site down because they can't be read.
      return EMPTY_SETTINGS
    }
  },
}
