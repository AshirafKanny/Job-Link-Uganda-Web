import { describe, expect, it } from 'vitest'
import { hasEditorialContent, isJobCombinationIndexable, isJobHubIndexable, isRefinedListing, shouldRenderJobCombination } from './indexation'

describe('job hub indexation', () => {
  it('indexes hubs with live jobs or genuine editorial content', () => {
    expect(isJobHubIndexable({ liveJobs: 1, hasEditorialContent: false })).toBe(true)
    expect(isJobHubIndexable({ liveJobs: 0, hasEditorialContent: true })).toBe(true)
    expect(isJobHubIndexable({ liveJobs: 0, hasEditorialContent: false })).toBe(false)
  })

  it('only indexes category × location pages with at least three live jobs', () => {
    expect(isJobCombinationIndexable(2)).toBe(false)
    expect(isJobCombinationIndexable(3)).toBe(true)
    expect(shouldRenderJobCombination(0)).toBe(false)
  })
})

describe('isRefinedListing', () => {
  it('treats the unfiltered first page as canonical', () => {
    expect(isRefinedListing({})).toBe(false)
    expect(isRefinedListing({ page: '1' })).toBe(false)
  })

  it('flags searches, filters, sorting and deeper pages', () => {
    expect(isRefinedListing({ q: 'waiter' })).toBe(true)
    expect(isRefinedListing({ type: 'PART_TIME' })).toBe(true)
    expect(isRefinedListing({ page: '2' })).toBe(true)
  })
})

describe('hasEditorialContent', () => {
  it('requires a substantial intro before an empty hub can be indexed', () => {
    expect(hasEditorialContent('Short stub.')).toBe(false)
    expect(hasEditorialContent('x'.repeat(300))).toBe(true)
    expect(hasEditorialContent(null)).toBe(false)
  })
})
