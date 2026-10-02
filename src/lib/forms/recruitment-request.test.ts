import { describe, expect, it } from 'vitest'
import { rateLimit, resetRateLimits } from '@/lib/security/rate-limit'
import { recruitmentRequestSchema } from './recruitment-request'

const valid = {
  contactName: 'Test Contact',
  businessName: 'Test Restaurant',
  phone: '+256 700 000000',
  email: '',
  rolesNeeded: 'Two waiters for evening shifts',
  numberOfPositions: '2',
  location: 'Kampala',
  preferredStartDate: '2026-10-15',
  message: '',
  serviceSlug: 'restaurant-staff-recruitment',
  consent: 'on',
}

describe('recruitmentRequestSchema', () => {
  it('accepts a complete, valid enquiry and normalises optional fields', () => {
    const result = recruitmentRequestSchema.safeParse(valid)
    expect(result.success).toBe(true)
    expect(result.data).toMatchObject({ email: null, message: null, numberOfPositions: 2 })
  })

  it('requires consent', () => {
    expect(recruitmentRequestSchema.safeParse({ ...valid, consent: undefined }).success).toBe(false)
  })

  it('rejects invalid phone numbers and emails', () => {
    expect(recruitmentRequestSchema.safeParse({ ...valid, phone: 'call me' }).success).toBe(false)
    expect(recruitmentRequestSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false)
  })

  it('strips control characters and rejects oversized input', () => {
    const cleaned = recruitmentRequestSchema.parse({ ...valid, rolesNeeded: 'Chef\u0000\u0007 x2' })
    expect(cleaned.rolesNeeded).toBe('Chef x2')
    expect(recruitmentRequestSchema.safeParse({ ...valid, message: 'x'.repeat(2001) }).success).toBe(false)
  })

  it('defaults to a recruitment enquiry', () => {
    expect(recruitmentRequestSchema.parse(valid)).toMatchObject({ enquiryType: 'recruitment', trainingPackage: null })
  })

  it('accepts training enquiries with a known package only', () => {
    const training = { ...valid, enquiryType: 'training', trainingPackage: 'workplace-starter' }
    expect(recruitmentRequestSchema.parse(training)).toMatchObject({ enquiryType: 'training', trainingPackage: 'workplace-starter' })
    expect(recruitmentRequestSchema.safeParse({ ...training, trainingPackage: 'free-course' }).success).toBe(false)
    expect(recruitmentRequestSchema.safeParse({ ...valid, enquiryType: 'newsletter' }).success).toBe(false)
  })

  it('rejects unexpected service slugs', () => {
    expect(recruitmentRequestSchema.safeParse({ ...valid, serviceSlug: '<script>' }).success).toBe(false)
  })
})

describe('rateLimit', () => {
  it('blocks after the limit within a window, then resets', () => {
    resetRateLimits()
    const t = 1_000_000
    for (let i = 0; i < 3; i++) expect(rateLimit('ip', 3, 60_000, t).allowed).toBe(true)
    expect(rateLimit('ip', 3, 60_000, t + 1).allowed).toBe(false)
    expect(rateLimit('ip', 3, 60_000, t + 60_001).allowed).toBe(true)
  })
})
