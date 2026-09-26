import { business, isLicenceValid } from './business'

/**
 * Feature gates for capabilities that carry legal or operational
 * preconditions. Each gate needs BOTH an explicit environment switch AND,
 * where applicable, verified evidence in the business profile. A gate that is
 * off removes the capability entirely: no routes, no CMS collections, no
 * public API, no structured data.
 */

const envFlag = (name: string) => process.env[name] === 'true'

/**
 * Overseas vacancies are only legal through a firm holding a valid MGLSD
 * external employment licence registered on EEMIS. The env flag alone is not
 * enough: the licence must be recorded in src/config/business.ts.
 */
export const overseasRecruitmentEnabled =
  envFlag('FEATURE_OVERSEAS_RECRUITMENT') && isLicenceValid(business.licences.externalRecruitment)

/**
 * Online applications, CV uploads and candidate records. Needs confirmed PDPO
 * registration, a privacy notice and an agreed retention policy.
 */
export const candidateSystemEnabled = envFlag('FEATURE_CANDIDATE_SYSTEM') && business.pdpoRegistration !== null

/** Employer recruitment-request form (Phase 3). */
export const employerEnquiriesEnabled = envFlag('FEATURE_EMPLOYER_ENQUIRIES')

export const features = {
  overseasRecruitment: overseasRecruitmentEnabled,
  candidateSystem: candidateSystemEnabled,
  employerEnquiries: employerEnquiriesEnabled,
} as const
