/**
 * Status of legal pages. While `reviewed` is false, a visible notice tells
 * visitors the text is a draft pending review. Set to true only after the
 * business has had the text reviewed. REQUIRES BUSINESS INPUT.
 */
export const legal = {
  privacy: { reviewed: false, lastUpdated: '2026-09-25' },
  terms: { reviewed: false, lastUpdated: '2026-09-25' },
  /** How long employer enquiries are kept. REQUIRES BUSINESS INPUT; null until decided. */
  enquiryRetention: null as string | null,
}
