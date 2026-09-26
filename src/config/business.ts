/**
 * Verified business identity and compliance facts about Job Link Uganda.
 *
 * Editable operational details (phone, email, WhatsApp, address, hours,
 * social links) live in the CMS "Site Settings" global and are read through
 * `settingsRepo`. What stays here is deliberately code-reviewed: brand identity
 * and anything that switches legally sensitive features on.
 *
 * RULE: never fill a field with an invented or "example" value. Unknown facts
 * stay `null` and every consumer omits them.
 */

export type Licence = {
  /** Licence number exactly as printed on the certificate. */
  number: string
  issuer: string
  /** ISO date. Licences with a past expiry are treated as absent. */
  validUntil: string
  /** Public page where visitors can verify the licence, e.g. the EEMIS listing. */
  verificationUrl: string | null
}

export type BusinessIdentity = {
  name: string
  /** Official tagline, as printed on the logo. */
  tagline: string
  legalName: string | null
  /** Raster logo for structured data and social cards. */
  logoPath: string
  /** Places genuinely served. */
  areasServed: string[]
  licences: {
    domesticRecruitment: Licence | null
    externalRecruitment: Licence | null
  }
  /** Personal Data Protection Office registration (Data Protection and Privacy Act, 2019). */
  pdpoRegistration: { number: string; validUntil: string } | null
  /**
   * Plain-language fee statements, published on the transparency pages once
   * confirmed by the business. Until then no fee claim of any kind is shown.
   */
  fees: {
    candidates: string | null
    employers: string | null
  }
}

export const business: BusinessIdentity = {
  name: 'Job Link Uganda',
  tagline: 'Connecting talent to opportunity', // From the official logo
  legalName: null, // REQUIRES BUSINESS INPUT
  logoPath: '/brand/job-link-uganda-logo.png', // Supplied 2026-09-25 (source: assets/brand)
  areasServed: ['Kampala'], // Confirmed by the business brief
  licences: {
    domesticRecruitment: null, // REQUIRES BUSINESS INPUT
    externalRecruitment: null, // REQUIRES BUSINESS INPUT — keep null until verified documentation is supplied
  },
  pdpoRegistration: null, // REQUIRES BUSINESS INPUT
  fees: {
    candidates: null, // REQUIRES BUSINESS INPUT
    employers: null, // REQUIRES BUSINESS INPUT
  },
}

export function isLicenceValid(licence: Licence | null, now: Date = new Date()): licence is Licence {
  if (!licence) return false
  const expiry = new Date(licence.validUntil)
  return !Number.isNaN(expiry.getTime()) && expiry.getTime() > now.getTime()
}
