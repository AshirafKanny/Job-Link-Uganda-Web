import { describe, expect, it } from 'vitest'
import { endOfKampalaDay, getJobLifecycle, getValidThrough, RETIRE_AFTER_DAYS } from './lifecycle'

const base = {
  status: 'open' as const,
  closeReason: null,
  datePosted: '2026-09-01T08:00:00.000Z',
  closingDate: '2026-09-30T00:00:00.000Z',
  closedAt: null,
  retirement: 'gone' as const,
  category: { name: 'Restaurant', slug: 'restaurant' },
}
const at = (iso: string) => new Date(iso)

describe('getValidThrough', () => {
  it('keeps a job open until the end of its closing day in Kampala time', () => {
    expect(getValidThrough(base).toISOString()).toBe('2026-09-30T20:59:59.999Z')
  })

  it('uses the Kampala calendar day when the stored instant falls late on the previous UTC day', () => {
    // 22:00 UTC on 29 Sep is 01:00 on 30 Sep in Kampala.
    expect(endOfKampalaDay('2026-09-29T22:00:00.000Z').toISOString()).toBe('2026-09-30T20:59:59.999Z')
  })

  it('defaults to 30 days after posting when there is no closing date', () => {
    expect(getValidThrough({ ...base, closingDate: null }).toISOString()).toBe('2026-10-01T08:00:00.000Z')
  })
})

describe('getJobLifecycle', () => {
  it('hides drafts entirely', () => {
    expect(getJobLifecycle({ ...base, status: 'draft' }, at('2026-09-10T00:00:00Z')).state).toBe('unpublished')
  })

  it('treats an open job before its deadline as indexable with structured data', () => {
    const lifecycle = getJobLifecycle(base, at('2026-09-30T20:00:00Z'))
    expect(lifecycle).toMatchObject({ state: 'open', indexable: true, includeStructuredData: true, includeInSitemap: true })
  })

  it('closes a job automatically once its deadline passes, without staff action', () => {
    const lifecycle = getJobLifecycle(base, at('2026-10-01T00:00:00Z'))
    expect(lifecycle).toMatchObject({
      state: 'closed',
      reason: 'deadline',
      indexable: false,
      includeStructuredData: false,
      includeInSitemap: false,
      includeInListings: false,
    })
  })

  it('closes a job immediately when staff mark it filled', () => {
    const lifecycle = getJobLifecycle(
      { ...base, status: 'closed', closeReason: 'filled', closedAt: '2026-09-10T09:00:00Z' },
      at('2026-09-11T00:00:00Z'),
    )
    expect(lifecycle).toMatchObject({ state: 'closed', reason: 'filled' })
  })

  it('retires closed jobs as gone after the retention window', () => {
    const closedAt = '2026-09-10T00:00:00.000Z'
    const later = new Date(new Date(closedAt).getTime() + RETIRE_AFTER_DAYS * 86_400_000)
    const lifecycle = getJobLifecycle({ ...base, status: 'closed', closeReason: 'filled', closedAt }, later)
    expect(lifecycle).toEqual({ state: 'retired', response: { type: 'gone' } })
  })

  it('redirects retired jobs to their category when configured', () => {
    const lifecycle = getJobLifecycle({ ...base, retirement: 'redirect-to-category' }, at('2027-06-01T00:00:00Z'))
    expect(lifecycle).toEqual({ state: 'retired', response: { type: 'redirect', location: '/jobs/category/restaurant' } })
  })

  it('measures retirement from the deadline when a job was closed after it had already expired', () => {
    const lifecycle = getJobLifecycle(
      { ...base, status: 'closed', closeReason: 'filled', closedAt: '2026-12-15T00:00:00Z' },
      at('2027-01-05T00:00:00Z'),
    )
    expect(lifecycle.state).toBe('retired')
  })
})
