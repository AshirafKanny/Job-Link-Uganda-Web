'use client'

import Link from 'next/link'
import Script from 'next/script'
import { useActionState, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { submitRecruitmentRequest } from '@/app/(frontend)/hire-staff/actions'
import { Icon } from '@/components/ui/Icon'
import {
  fieldErrorsFrom,
  readRecruitmentRequestValues,
  recruitmentRequestSchema,
  type EnquiryType,
  type RecruitmentRequestFields,
  type RecruitmentRequestState,
} from '@/lib/forms/recruitment-request'
import { cn } from '@/lib/cn'
import { routes } from '@/lib/routes'

type Props = {
  /** "recruitment" asks for staff to hire; "training" asks for existing staff to train. */
  kind?: EnquiryType
  services?: { slug: string; title: string }[]
  defaultService?: string
  /** Training mode: packages the employer can choose from. */
  trainingPackages?: { id: string; label: string }[]
  defaultPackage?: string
  turnstileSiteKey: string | null
}

/** Wording per mode; the fields and validation are shared. */
const copy = {
  recruitment: {
    rolesLabel: 'Which roles do you need to fill?',
    rolesHint: 'For example: 2 waitresses and 1 cook for evening shifts',
    countLabel: 'Number of staff',
    locationLabel: 'Work location',
    dateLabel: 'Start date',
    messageLabel: 'Additional requirements',
    messageHint: 'Working hours, experience needed, pay offered, or anything else we should know',
    consent: 'my recruitment enquiry',
    submit: 'Send recruitment request',
    successTitle: 'Thank you, we have received your enquiry',
    successText: 'A member of the recruitment team will contact you to discuss your requirements. Please keep your phone nearby.',
    back: { label: 'Back to recruitment services', href: routes.services() },
  },
  training: {
    rolesLabel: 'Which staff need training?',
    rolesHint: 'For example: 6 waiters, 2 supervisors and the kitchen team',
    countLabel: 'Number of staff',
    locationLabel: 'Training location',
    dateLabel: 'Preferred start',
    messageLabel: 'What should the training improve?',
    messageHint: 'Customer service, hygiene, order accuracy, upselling, or anything else you have noticed',
    consent: 'my training enquiry',
    submit: 'Request workplace training',
    successTitle: 'Thank you, we have received your training request',
    successText: 'A member of our team will contact you to discuss your staff, the training you need and suitable dates. Please keep your phone nearby.',
    back: { label: 'Back to hospitality training', href: routes.hospitalityTraining() },
  },
} as const

const inputClass =
  'mt-1.5 block w-full rounded-control border bg-surface px-3.5 py-3 text-base text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none'

function Field({
  id,
  label,
  optional,
  hint,
  error,
  children,
}: {
  id: RecruitmentRequestFields
  label: string
  optional?: boolean
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="font-display text-[0.95rem] font-bold">
        {label}
        {optional && <span className="ml-1.5 font-sans text-sm font-normal text-ink-subtle">(optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-0.5 text-sm text-ink-subtle">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-danger">
          <Icon name="info" size={16} />
          {error}
        </p>
      )}
    </div>
  )
}

export function RecruitmentRequestForm({
  kind = 'recruitment',
  services = [],
  defaultService,
  trainingPackages = [],
  defaultPackage,
  turnstileSiteKey,
}: Props) {
  const text = copy[kind]
  const [state, formAction, pending] = useActionState<RecruitmentRequestState, FormData>(submitRecruitmentRequest, {
    status: 'idle',
  })
  const [startedAt, setStartedAt] = useState(0)
  // Instant browser check with the server's own schema. Tied to the server state
  // it was made against, so a newer server response always takes over.
  const [clientCheck, setClientCheck] = useState<{
    against: RecruitmentRequestState
    errors: Partial<Record<RecruitmentRequestFields, string>>
  } | null>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  // eslint-disable-next-line react-hooks/set-state-in-effect -- time-trap starts when the form is actually on screen
  useEffect(() => setStartedAt(Date.now()), [])
  useEffect(() => {
    if (state.status !== 'idle') statusRef.current?.focus()
  }, [state])

  if (state.status === 'success') {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="border-l-4 border-success bg-success-soft p-6 sm:p-8">
        <Icon name="check" size={28} className="text-success" />
        <h2 className="mt-3 text-2xl font-extrabold">{text.successTitle}</h2>
        <p className="mt-2 text-ink-muted">{text.successText}</p>
        <Link href={text.back.href} className="mt-5 inline-block font-display font-bold text-brand-red-dark underline-offset-4 hover:underline">
          {text.back.label}
        </Link>
      </div>
    )
  }

  const clientErrors = clientCheck?.against === state ? clientCheck.errors : null
  const errors = clientErrors ?? (state.status === 'error' ? state.fieldErrors : {})
  const values = state.status === 'error' ? state.values : {}
  const alertMessage = clientErrors ? 'Please check the highlighted fields.' : state.status === 'error' ? state.message : null

  function checkBeforeSending(event: FormEvent<HTMLFormElement>) {
    const parsed = recruitmentRequestSchema.safeParse(readRecruitmentRequestValues(new FormData(event.currentTarget)))
    if (parsed.success) {
      setClientCheck(null)
      return
    }
    // Invalid: keep what was typed, show the errors and move focus to the first problem.
    event.preventDefault()
    const fieldErrors = fieldErrorsFrom(parsed.error.issues)
    setClientCheck({ against: state, errors: fieldErrors })
    const first = Object.keys(fieldErrors)[0]
    event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
  }
  const describe = (id: RecruitmentRequestFields, hint = false) =>
    [hint && `${id}-hint`, errors[id] && `${id}-error`].filter(Boolean).join(' ') || undefined
  const invalid = (id: RecruitmentRequestFields) => (errors[id] ? true : undefined)
  const border = (id: RecruitmentRequestFields) => (errors[id] ? 'border-danger' : 'border-line-strong')

  return (
    <form action={formAction} onSubmit={checkBeforeSending} noValidate className="space-y-6">
      {alertMessage && (
        <div ref={statusRef} tabIndex={-1} role="alert" className="border-l-4 border-danger bg-surface-muted p-4 font-medium">
          {alertMessage}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="contactName" label="Your name" error={errors.contactName}>
          <input id="contactName" name="contactName" autoComplete="name" required defaultValue={values.contactName}
            aria-invalid={invalid('contactName')} aria-describedby={describe('contactName')} className={cn(inputClass, border('contactName'))} />
        </Field>
        <Field id="businessName" label="Business name" error={errors.businessName}>
          <input id="businessName" name="businessName" autoComplete="organization" required defaultValue={values.businessName}
            aria-invalid={invalid('businessName')} aria-describedby={describe('businessName')} className={cn(inputClass, border('businessName'))} />
        </Field>
        <Field id="phone" label="Phone number" error={errors.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required defaultValue={values.phone}
            placeholder="07XX XXX XXX" aria-invalid={invalid('phone')} aria-describedby={describe('phone')} className={cn(inputClass, border('phone'))} />
        </Field>
        <Field id="email" label="Email" optional error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" defaultValue={values.email}
            aria-invalid={invalid('email')} aria-describedby={describe('email')} className={cn(inputClass, border('email'))} />
        </Field>
      </div>

      <input type="hidden" name="enquiryType" value={kind} />
      {kind === 'training' ? (
        <Field id="trainingPackage" label="Training package" optional error={errors.trainingPackage}>
          <select id="trainingPackage" name="trainingPackage" defaultValue={values.trainingPackage ?? defaultPackage ?? ''}
            aria-describedby={describe('trainingPackage')} className={cn(inputClass, border('trainingPackage'))}>
            <option value="">Not sure yet, please advise</option>
            {trainingPackages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>
      ) : (
        <Field id="serviceSlug" label="Type of recruitment" optional error={errors.serviceSlug}>
          <select id="serviceSlug" name="serviceSlug" defaultValue={values.serviceSlug ?? defaultService ?? ''}
            aria-describedby={describe('serviceSlug')} className={cn(inputClass, border('serviceSlug'))}>
            <option value="">Not sure yet</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
        </Field>
      )}

      <Field id="rolesNeeded" label={text.rolesLabel} hint={text.rolesHint} error={errors.rolesNeeded}>
        <textarea id="rolesNeeded" name="rolesNeeded" rows={3} required defaultValue={values.rolesNeeded}
          aria-invalid={invalid('rolesNeeded')} aria-describedby={describe('rolesNeeded', true)} className={cn(inputClass, border('rolesNeeded'))} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-3">
        <Field id="numberOfPositions" label={text.countLabel} optional error={errors.numberOfPositions}>
          <input id="numberOfPositions" name="numberOfPositions" type="number" min={1} max={500} inputMode="numeric" defaultValue={values.numberOfPositions}
            aria-invalid={invalid('numberOfPositions')} aria-describedby={describe('numberOfPositions')} className={cn(inputClass, border('numberOfPositions'))} />
        </Field>
        <Field id="location" label={text.locationLabel} optional error={errors.location}>
          <input id="location" name="location" placeholder="e.g. Kololo, Kampala" defaultValue={values.location}
            aria-invalid={invalid('location')} aria-describedby={describe('location')} className={cn(inputClass, border('location'))} />
        </Field>
        <Field id="preferredStartDate" label={text.dateLabel} optional error={errors.preferredStartDate}>
          <input id="preferredStartDate" name="preferredStartDate" type="date" defaultValue={values.preferredStartDate}
            aria-invalid={invalid('preferredStartDate')} aria-describedby={describe('preferredStartDate')} className={cn(inputClass, border('preferredStartDate'))} />
        </Field>
      </div>

      <Field id="message" label={text.messageLabel} optional hint={text.messageHint} error={errors.message}>
        <textarea id="message" name="message" rows={4} defaultValue={values.message}
          aria-invalid={invalid('message')} aria-describedby={describe('message', true)} className={cn(inputClass, border('message'))} />
      </Field>

      {/* Spam traps: hidden from people and assistive technology. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company_website">Leave this field empty</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />

      <div>
        <label className="flex items-start gap-3">
          <input type="checkbox" name="consent" required aria-invalid={invalid('consent')} aria-describedby={describe('consent')}
            className="mt-1 size-5 shrink-0 accent-brand-red" />
          <span className="text-[0.95rem] text-ink-muted">
            I agree that Job Link Uganda may use these details to respond to {text.consent}, as described in the{' '}
            <Link href={routes.privacy()} className="font-semibold text-ink underline underline-offset-2">
              privacy policy
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="mt-1.5 text-sm font-medium text-danger">
            {errors.consent}
          </p>
        )}
      </div>

      {turnstileSiteKey && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
          <div className="cf-turnstile" data-sitekey={turnstileSiteKey} />
        </>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-control bg-brand-red px-6 font-display text-base font-bold text-white transition-colors hover:bg-brand-red-dark disabled:opacity-70 sm:w-auto"
      >
        {pending ? 'Sending…' : text.submit}
        {!pending && <Icon name="arrow-right" size={18} />}
      </button>
    </form>
  )
}
