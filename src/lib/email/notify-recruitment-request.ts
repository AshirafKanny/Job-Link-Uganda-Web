import 'server-only'
import { site } from '@/config/site'
import { allTrainingPackages, formatUgx } from '@/content/training'
import { enquiriesRepo, servicesRepo } from '@/data'
import type { RecruitmentRequestInput } from '@/data/repositories'
import { adminEmail, emailConfigured, sendEmail } from './send'
import { recruitmentRequestConfirmation, recruitmentRequestNotification } from './templates'

type Options = {
  id: number | string
  input: RecruitmentRequestInput
  submittedAt: Date
  /** Only send the employer a confirmation when bot protection is active (prevents mail-bombing third parties). */
  sendConfirmation: boolean
}

/**
 * Emails a saved enquiry to the team inbox (Reply-To: the employer), then
 * records the outcome on the enquiry. The enquiry is already stored, so a
 * failed email never loses it: staff still see it in the admin with
 * "Email notification: Failed". Logs contain the record id and a short
 * reason only, never the employer's personal details.
 */
export async function notifyRecruitmentRequest({ id, input, submittedAt, sendConfirmation }: Options): Promise<void> {
  if (!emailConfigured || !adminEmail) {
    console.warn(`[email] Recruitment request #${id}: not emailed, email is not configured (RESEND_API_KEY, EMAIL_FROM, ADMIN_EMAIL).`)
    await enquiriesRepo.recordNotification(id, { status: 'skipped', reason: 'Email not configured' }).catch(() => {})
    return
  }

  const service = input.serviceSlug ? await servicesRepo.getBySlug(input.serviceSlug).catch(() => null) : null
  const trainingPackage = allTrainingPackages.find((p) => p.id === input.trainingPackage)
  const message = recruitmentRequestNotification(
    {
      ...input,
      id,
      serviceTitle: service?.title ?? input.serviceSlug,
      trainingPackageName: trainingPackage ? `${trainingPackage.name} — ${formatUgx(trainingPackage.price)}` : null,
      submittedAt,
    },
    site.url,
  )
  const result = await sendEmail({
    to: adminEmail,
    ...message,
    replyTo: input.email,
    idempotencyKey: `recruitment-request-${id}`,
  })

  if (result.ok) {
    await enquiriesRepo.recordNotification(id, { status: 'sent', providerId: result.id }).catch(() => {})
  } else {
    const error = 'error' in result ? result.error : 'Email not configured'
    console.error(`[email] Recruitment request #${id}: team notification failed: ${error}`)
    await enquiriesRepo.recordNotification(id, { status: 'failed', error }).catch(() => {})
  }

  if (sendConfirmation && input.email) {
    const confirmation = await sendEmail({
      to: input.email,
      ...recruitmentRequestConfirmation(site.url, input.enquiryType),
      replyTo: adminEmail,
      idempotencyKey: `recruitment-request-${id}-confirmation`,
    })
    if (!confirmation.ok && 'error' in confirmation) {
      console.error(`[email] Recruitment request #${id}: confirmation email failed: ${confirmation.error}`)
    }
  }
}
