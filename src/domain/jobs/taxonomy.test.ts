import { describe, expect, it } from 'vitest'
import { orderCategories, rollUpCategoryCounts } from './taxonomy'

const categories = [
  { id: '1', slug: 'hospitality', parentId: null, name: 'Hospitality' },
  { id: '2', slug: 'restaurant', parentId: '1', name: 'Restaurant' },
  { id: '3', slug: 'hotel', parentId: '1', name: 'Hotel' },
  { id: '4', slug: 'sales', parentId: null, name: 'Sales' },
]

describe('rollUpCategoryCounts', () => {
  it('adds child vacancies to the parent category', () => {
    expect(rollUpCategoryCounts(categories, { restaurant: 2, hotel: 1, hospitality: 1, sales: 3 })).toEqual({
      hospitality: 4,
      restaurant: 2,
      hotel: 1,
      sales: 3,
    })
  })

  it('treats missing counts as zero', () => {
    expect(rollUpCategoryCounts(categories, {}).hospitality).toBe(0)
  })
})

describe('orderCategories', () => {
  it('lists each parent followed by its children, alphabetically', () => {
    expect(orderCategories(categories).map((c) => c.slug)).toEqual(['hospitality', 'hotel', 'restaurant', 'sales'])
  })
})
