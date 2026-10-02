import { z } from 'zod'
import { allTrainingPackages } from '@/content/training'

/** Employer enquiries arrive through one form in two modes: staff to hire, or staff to train. */
export const ENQUIRY_TYPES = ['recruitment', 'training'] as const
export type EnquiryType = (typeof ENQUIRY_TYPES)[number]

/** Collapses whitespace and strips control characters from free text. */
const text = (max: number) =>
  z
    .string()
    .transform((v) => v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim())
    .pipe(z.string().max(max, `Please keep this under ${max} characters.`))

const optionalText = (max: number) =>
  text(max)
    .optional()
    .transform((v) => (v ? v : null))

/**
 * Server-side validation for the employer recruitment request. Only what is
 * needed to respond to the enquiry is collected.
 */
export const recruitmentRequestSchema = z.object({
  contactName: text(100).pipe(z.string().min(2, 'Please enter your name.')),
  businessName: text(150).pipe(z.string().min(2, 'Please enter your business name.')),
  phone: text(30).pipe(
    z.string().regex(/^\+?[0-9\s()-]{9,20}$/, 'Please enter a valid phone number, e.g. 07XX XXX XXX or +256 7XX XXX XXX.'),
  ),
  email: optionalText(150).pipe(z.union([z.null(), z.email('Please enter a valid email address, or leave it empty.')])),
  rolesNeeded: text(1000).pipe(z.string().min(3, 'Please tell us which roles or staff this is for.')),
  numberOfPositions: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() ? Number(v) : null))
    .pipe(z.union([z.null(), z.number().int('Please enter a whole number.').min(1).max(500)])),
  location: optionalText(150),
  preferredStartDate: optionalText(10).pipe(
    z.union([z.null(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please choose a valid date.')]),
  ),
  message: optionalText(2000),
  serviceSlug: optionalText(80).pipe(z.union([z.null(), z.string().regex(/^[a-z0-9-]+$/)])),
  enquiryType: z
    .string()
    .optional()
    .transform((v) => v || 'recruitment')
    .pipe(z.enum(ENQUIRY_TYPES)),
  /** A training package id, only for training enquiries. */
  trainingPackage: optionalText(60).pipe(
    z.union([z.null(), z.enum(allTrainingPackages.map((p) => p.id) as [string, ...string[]])]),
  ),
  consent: z.literal('on', { error: 'Please confirm you agree to us using these details to respond to your enquiry.' }),
})

export type RecruitmentRequestFields = keyof z.input<typeof recruitmentRequestSchema>

export type RecruitmentRequestState =
  | { status: 'idle' }
  | { status: 'success' }
  | {
      status: 'error'
      message: string
      fieldErrors: Partial<Record<RecruitmentRequestFields, string>>
      values: Partial<Record<RecruitmentRequestFields, string>>
    }

/** Minimum time a human takes to fill the form; faster submissions are treated as bots. */
export const MIN_FILL_TIME_MS = 3000

/** Every field the form submits, in on-screen order (used by the server action and the browser check). */
export const RECRUITMENT_REQUEST_FIELDS: RecruitmentRequestFields[] = [
  'contactName',
  'businessName',
  'phone',
  'email',
  'serviceSlug',
  'rolesNeeded',
  'numberOfPositions',
  'location',
  'preferredStartDate',
  'message',
  'enquiryType',
  'trainingPackage',
  'consent',
]

/** Reads the form's string fields; missing fields stay undefined, exactly as the server sees them. */
export function readRecruitmentRequestValues(formData: FormData): Partial<Record<RecruitmentRequestFields, string>> {
  return Object.fromEntries(
    RECRUITMENT_REQUEST_FIELDS.map((f) => {
      const value = formData.get(f)
      return [f, typeof value === 'string' ? value : undefined]
    }),
  )
}

/** First error message per field. */
export function fieldErrorsFrom(issues: readonly { path: readonly PropertyKey[]; message: string }[]) {
  const fieldErrors: Partial<Record<RecruitmentRequestFields, string>> = {}
  for (const issue of issues) {
    const field = issue.path[0] as RecruitmentRequestFields
    fieldErrors[field] ??= issue.message
  }
  return fieldErrors
}
