import { describe, expect, it } from 'vitest'
import { jobSlug, parseJobRef } from './slug'

describe('jobSlug', () => {
  it('builds /jobs/[title-location-id] slugs', () => {
    expect(jobSlug({ ref: '1042', title: 'Restaurant Supervisor', location: { name: 'Kampala' } as never })).toBe(
      'restaurant-supervisor-kampala-jl1042',
    )
  })

  it('normalises punctuation and ampersands', () => {
    expect(jobSlug({ ref: '7', title: 'Waiter / Waitress (Night Shift) & Host', location: { name: 'Entebbe' } as never })).toBe(
      'waiter-waitress-night-shift-and-host-entebbe-jl7',
    )
  })
})

describe('parseJobRef', () => {
  it('reads the trailing reference', () => {
    expect(parseJobRef('restaurant-supervisor-kampala-jl1042')).toBe('1042')
  })

  it('rejects slugs without a reference', () => {
    expect(parseJobRef('restaurant-supervisor-kampala')).toBeNull()
  })
})
