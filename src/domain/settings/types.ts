/** Operational business details managed in the CMS "Site Settings" global. */

export const SOCIAL_PLATFORMS = ['facebook', 'instagram', 'linkedin', 'x', 'tiktok', 'youtube'] as const
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]

export type SiteSettings = {
  contact: {
    phone: string | null
    email: string | null
    /** International format digits only, e.g. 2567XXXXXXXX. */
    whatsappCandidates: string | null
    whatsappEmployers: string | null
  }
  /** Null unless the business has a verified public office. */
  office: {
    streetAddress: string
    locality: string
    region: string
    postalCode: string | null
    /** Map link only when a verified physical location exists. */
    mapUrl: string | null
  } | null
  openingHours: string[]
  socialLinks: { platform: SocialPlatform; url: string }[]
  seo: { defaultDescription: string }
}

export const EMPTY_SETTINGS: SiteSettings = {
  contact: { phone: null, email: null, whatsappCandidates: null, whatsappEmployers: null },
  office: null,
  openingHours: [],
  socialLinks: [],
  seo: {
    defaultDescription:
      'Job Link Uganda is a recruitment agency connecting employers with suitable staff and job seekers with genuine vacancies, with a focus on hospitality and restaurant roles in Kampala.',
  },
}

/** Lists business facts still missing, for the admin notice and build warnings. */
export function missingSettings(settings: SiteSettings): string[] {
  const missing: string[] = []
  if (!settings.contact.phone) missing.push('Phone number')
  if (!settings.contact.email) missing.push('Email address')
  if (!settings.contact.whatsappCandidates && !settings.contact.whatsappEmployers) missing.push('WhatsApp number')
  if (settings.socialLinks.length === 0) missing.push('Social media links')
  return missing
}
