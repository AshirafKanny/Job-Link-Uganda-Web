'use server'

import { headers } from 'next/headers'
import { after } from 'next/server'
import { employerEnquiriesEnabled } from '@/config/features'
import { enquiriesRepo } from '@/data'
import {
  fieldErrorsFrom,
  MIN_FILL_TIME_MS,
  readRecruitmentRequestValues,
  recruitmentRequestSchema,
  type RecruitmentRequestFields,
  type RecruitmentRequestState,
} from '@/lib/forms/recruitment-request'
import { notifyRecruitmentRequest } from '@/lib/email/notify-recruitment-request'
import { rateLimit } from '@/lib/security/rate-limit'
import { turnstileEnabled, verifyTurnstile } from '@/lib/security/turnstile'

/** Identical enquiries (same business and phone) inside this window are treated as one. */
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000

export async function submitRecruitmentRequest(
  _prev: RecruitmentRequestState,
  formData: FormData,
): Promise<RecruitmentRequestState> {
  const values = readRecruitmentRequestValues(formData)
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
  // Always re-validated here: the browser check is a convenience, never a security control.
  if (!parsed.success) return fail('Please check the highlighted fields.', fieldErrorsFrom(parsed.error.issues))

  const referer = h.get('referer')
  let sourcePath = '/hire-staff'
  try {
    if (referer) sourcePath = new URL(referer).pathname.slice(0, 200)
  } catch {
    // Keep the default.
  }

  const { consent: _consent, ...data } = parsed.data
  const input = { ...data, sourcePath }
  try {
    // A double click, a retry after a slow network or a resubmitted page must not
    // create a second enquiry or a second email.
    if (await enquiriesRepo.hasRecentRecruitmentRequest(input, DUPLICATE_WINDOW_MS)) return { status: 'success' }

    const { id } = await enquiriesRepo.createRecruitmentRequest(input)
    const submittedAt = new Date()
    // Email after the response: the visitor never waits on the email provider,
    // and the enquiry is already saved if sending fails.
    after(() => notifyRecruitmentRequest({ id, input, submittedAt, sendConfirmation: turnstileEnabled }))
  } catch (error) {
    console.error('[enquiry] Could not save recruitment request:', error instanceof Error ? error.message : 'unknown error')
    return fail('We couldn’t send your request right now. Please try again in a moment, or contact us by phone or WhatsApp.')
  }

  return { status: 'success' }
}
