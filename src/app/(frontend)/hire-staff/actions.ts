'use server'

import { headers } from 'next/headers'
import { employerEnquiriesEnabled } from '@/config/features'
import { enquiriesRepo } from '@/data'
import {
  MIN_FILL_TIME_MS,
  recruitmentRequestSchema,
  type RecruitmentRequestFields,
  type RecruitmentRequestState,
} from '@/lib/forms/recruitment-request'
import { rateLimit } from '@/lib/security/rate-limit'
import { verifyTurnstile } from '@/lib/security/turnstile'

const FIELDS: RecruitmentRequestFields[] = [
  'contactName',
  'businessName',
  'phone',
  'email',
  'rolesNeeded',
  'numberOfPositions',
  'location',
  'preferredStartDate',
  'message',
  'serviceSlug',
  'consent',
]

export async function submitRecruitmentRequest(
  _prev: RecruitmentRequestState,
  formData: FormData,
): Promise<RecruitmentRequestState> {
  const values = Object.fromEntries(
    FIELDS.map((f) => [f, typeof formData.get(f) === 'string' ? String(formData.get(f)) : undefined]),
  ) as Partial<Record<RecruitmentRequestFields, string>>
  const fail = (
    message: string,
    fieldErrors: Partial<Record<RecruitmentRequestFields, string>> = {},
  ): RecruitmentRequestState => ({ status: 'error', message, fieldErrors, values })

  if (!employerEnquiriesEnabled) return fail('Online enquiries are not available at the moment. Please contact us directly.')

  // Spam traps: bots get a normal-looking success response and nothing is stored.
  const honeypot = formData.get('company_website')
  const startedAt = Number(formData.get('startedAt'))
  if ((typeof honeypot === 'string' && honeypot.length > 0) || (startedAt > 0 && Date.now() - startedAt < MIN_FILL_TIME_MS)) {
    return { status: 'success' }
  }

  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
  if (!rateLimit(`recruitment-request:${ip}`, 5, 15 * 60 * 1000).allowed) {
    return fail('You have sent several enquiries in a short time. Please wait a few minutes and try again.')
  }

  const token = formData.get('cf-turnstile-response')
  if (!(await verifyTurnstile(typeof token === 'string' ? token : null, ip))) {
    return fail('We could not verify the form submission. Please try again.')
  }

  const parsed = recruitmentRequestSchema.safeParse(values)
  if (!parsed.success) {
    const fieldErrors: Partial<Record<RecruitmentRequestFields, string>> = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as RecruitmentRequestFields
      fieldErrors[field] ??= issue.message
    }
    return fail('Please check the highlighted fields.', fieldErrors)
  }

  const referer = h.get('referer')
  let sourcePath = '/hire-staff'
  try {
    if (referer) sourcePath = new URL(referer).pathname.slice(0, 200)
  } catch {
    // Keep the default.
  }

  try {
    const { consent: _consent, ...data } = parsed.data
    await enquiriesRepo.createRecruitmentRequest({ ...data, sourcePath })
  } catch {
    return fail('Something went wrong while sending your enquiry. Please try again, or contact us directly.')
  }

  return { status: 'success' }
}
