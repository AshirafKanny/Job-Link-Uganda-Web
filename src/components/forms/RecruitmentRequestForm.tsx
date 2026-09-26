'use client'

import Link from 'next/link'
import Script from 'next/script'
import { useActionState, useEffect, useRef, useState, type ReactNode } from 'react'
import { submitRecruitmentRequest } from '@/app/(frontend)/hire-staff/actions'
import { Icon } from '@/components/ui/Icon'
import type { RecruitmentRequestFields, RecruitmentRequestState } from '@/lib/forms/recruitment-request'
import { cn } from '@/lib/cn'
import { routes } from '@/lib/routes'

type Props = {
  services: { slug: string; title: string }[]
  defaultService?: string
  turnstileSiteKey: string | null
}

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

export function RecruitmentRequestForm({ services, defaultService, turnstileSiteKey }: Props) {
  const [state, formAction, pending] = useActionState<RecruitmentRequestState, FormData>(submitRecruitmentRequest, {
    status: 'idle',
  })
  const [startedAt, setStartedAt] = useState(0)
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
        <h2 className="mt-3 text-2xl font-extrabold">Thank you, we have received your enquiry</h2>
        <p className="mt-2 text-ink-muted">
          A member of the recruitment team will contact you to discuss your requirements. Please keep your phone nearby.
        </p>
        <Link href={routes.services()} className="mt-5 inline-block font-display font-bold text-brand-red-dark underline-offset-4 hover:underline">
          Back to recruitment services
        </Link>
      </div>
    )
  }

  const errors = state.status === 'error' ? state.fieldErrors : {}
  const values = state.status === 'error' ? state.values : {}
  const describe = (id: RecruitmentRequestFields, hint = false) =>
    [hint && `${id}-hint`, errors[id] && `${id}-error`].filter(Boolean).join(' ') || undefined
  const invalid = (id: RecruitmentRequestFields) => (errors[id] ? true : undefined)
  const border = (id: RecruitmentRequestFields) => (errors[id] ? 'border-danger' : 'border-line-strong')

  return (
    <form action={formAction} noValidate className="space-y-6">
      {state.status === 'error' && (
        <div ref={statusRef} tabIndex={-1} role="alert" className="border-l-4 border-danger bg-surface-muted p-4 font-medium">
          {state.message}
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

      <Field id="rolesNeeded" label="Which roles do you need to fill?" hint="For example: 2 waitresses and 1 cook for evening shifts" error={errors.rolesNeeded}>
        <textarea id="rolesNeeded" name="rolesNeeded" rows={3} required defaultValue={values.rolesNeeded}
          aria-invalid={invalid('rolesNeeded')} aria-describedby={describe('rolesNeeded', true)} className={cn(inputClass, border('rolesNeeded'))} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-3">
        <Field id="numberOfPositions" label="Number of staff" optional error={errors.numberOfPositions}>
          <input id="numberOfPositions" name="numberOfPositions" type="number" min={1} max={500} inputMode="numeric" defaultValue={values.numberOfPositions}
            aria-invalid={invalid('numberOfPositions')} aria-describedby={describe('numberOfPositions')} className={cn(inputClass, border('numberOfPositions'))} />
        </Field>
        <Field id="location" label="Work location" optional error={errors.location}>
          <input id="location" name="location" placeholder="e.g. Kololo, Kampala" defaultValue={values.location}
            aria-invalid={invalid('location')} aria-describedby={describe('location')} className={cn(inputClass, border('location'))} />
        </Field>
        <Field id="preferredStartDate" label="Start date" optional error={errors.preferredStartDate}>
          <input id="preferredStartDate" name="preferredStartDate" type="date" defaultValue={values.preferredStartDate}
            aria-invalid={invalid('preferredStartDate')} aria-describedby={describe('preferredStartDate')} className={cn(inputClass, border('preferredStartDate'))} />
        </Field>
      </div>

      <Field id="message" label="Additional requirements" optional hint="Working hours, experience needed, pay offered, or anything else we should know" error={errors.message}>
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
            I agree that Job Link Uganda may use these details to respond to my recruitment enquiry, as described in the{' '}
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
        {pending ? 'Sending…' : 'Send recruitment request'}
        {!pending && <Icon name="arrow-right" size={18} />}
      </button>
    </form>
  )
}
