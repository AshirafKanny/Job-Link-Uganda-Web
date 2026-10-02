import type { SiteSettings } from '@/domain/settings/types'

/**
 * Number supplied by the business on 2026-09-28 (0744 429808). A WhatsApp
 * number saved in Site Settings takes precedence, so staff can change it
 * without a code release.
 */
export const DEFAULT_WHATSAPP = '256744429808'

/** The general-enquiries WhatsApp number: Site Settings first, then the default. */
export function generalWhatsApp(contact: SiteSettings['contact'] | undefined | null): string {
  return contact?.whatsappCandidates ?? contact?.whatsappEmployers ?? DEFAULT_WHATSAPP
}
