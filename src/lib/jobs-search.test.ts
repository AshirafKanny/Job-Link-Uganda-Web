import { describe, expect, it } from 'vitest'
import { jobFiltersQuery, parseJobFilters } from './jobs-search'

describe('parseJobFilters', () => {
  it('keeps valid values', () => {
    expect(parseJobFilters({ q: ' waiter ', category: 'restaurant', location: 'kampala', type: 'FULL_TIME', posted: '7', page: '2' })).toEqual({
      query: 'waiter',
      categorySlug: 'restaurant',
      locationSlug: 'kampala',
      employmentType: 'FULL_TIME',
      postedWithinDays: 7,
      page: 2,
    })
  })

  it('drops malformed or unexpected values', () => {
    const filters = parseJobFilters({ category: '../admin', location: 'Kampala City', type: 'ANY', posted: '3', page: '-4' })
    expect(filters).toEqual({
      query: undefined,
      categorySlug: undefined,
      locationSlug: undefined,
      employmentType: undefined,
      postedWithinDays: undefined,
      page: 1,
    })
  })

  it('truncates very long keywords', () => {
    expect(parseJobFilters({ q: 'a'.repeat(200) }).query).toHaveLength(80)
  })
})

describe('jobFiltersQuery', () => {
  it('round-trips filters for pagination links', () => {
    expect(jobFiltersQuery({ query: 'chef', categorySlug: 'kitchen' }, 3)).toBe('?q=chef&category=kitchen&page=3')
    expect(jobFiltersQuery({}, 1)).toBe('')
  })
})
