import type { JobCategory } from '@/domain/content/types'

/**
 * Adds each category's own open-job count to its parent's, so a parent hub
 * such as "Hospitality" reflects vacancies in "Restaurant", "Hotel" etc.
 * (Categories are at most two levels deep.)
 */
export function rollUpCategoryCounts(
  categories: Pick<JobCategory, 'id' | 'slug' | 'parentId'>[],
  own: Record<string, number>,
): Record<string, number> {
  const byId = new Map(categories.map((c) => [c.id, c]))
  const totals: Record<string, number> = {}
  for (const category of categories) {
    const count = own[category.slug] ?? 0
    totals[category.slug] = (totals[category.slug] ?? 0) + count
    const parent = category.parentId ? byId.get(category.parentId) : undefined
    if (parent) totals[parent.slug] = (totals[parent.slug] ?? 0) + count
  }
  return totals
}

/** Top-level categories first, each followed by its children. */
export function orderCategories<T extends Pick<JobCategory, 'id' | 'parentId' | 'name'>>(categories: T[]): T[] {
  const parents = categories.filter((c) => !c.parentId).sort((a, b) => a.name.localeCompare(b.name))
  return parents.flatMap((parent) => [
    parent,
    ...categories.filter((c) => c.parentId === parent.id).sort((a, b) => a.name.localeCompare(b.name)),
  ])
}
