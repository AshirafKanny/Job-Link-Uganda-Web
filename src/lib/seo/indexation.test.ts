import { describe, expect, it } from 'vitest'
import { isJobCombinationIndexable, isJobHubIndexable, isRefinedListing, shouldRenderJobCombination } from './indexation'

describe('job hub indexation', () => {
  it('indexes category and location hubs only while they list open vacancies', () => {
    expect(isJobHubIndexable(1)).toBe(true)
    // An empty listing page is a soft-404 risk, whatever intro text it carries.
    expect(isJobHubIndexable(0)).toBe(false)
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
