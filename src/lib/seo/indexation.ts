/**
 * Indexation rules for job hubs and filtered listings. They keep empty, thin
 * and duplicate filter pages out of the index (see discovery doc, Step 7).
 */

/** An intro shorter than this is not substantial enough to justify indexing an empty hub. */
export const MIN_EDITORIAL_INTRO_LENGTH = 280

export function hasEditorialContent(intro: string | null | undefined): boolean {
  return (intro?.trim().length ?? 0) >= MIN_EDITORIAL_INTRO_LENGTH
}

/** Category × location pages are only worth indexing with real inventory. */
export const MIN_JOBS_FOR_COMBINATION_PAGE = 3

/** Query parameters that only refine /jobs. Any of them makes the page noindex. */
export const LISTING_FILTER_PARAMS = ['q', 'type', 'sort', 'page', 'category', 'location'] as const

type HubInput = { liveJobs: number; hasEditorialContent: boolean }

/** /jobs/category/[c] and /jobs/location/[l] */
export function isJobHubIndexable({ liveJobs, hasEditorialContent }: HubInput): boolean {
  return liveJobs > 0 || hasEditorialContent
}

/** /jobs/category/[c]/location/[l] */
export function isJobCombinationIndexable(liveJobs: number): boolean {
  return liveJobs >= MIN_JOBS_FOR_COMBINATION_PAGE
}

/** Combination pages below the threshold are not rendered at all (404), not merely noindexed. */
export function shouldRenderJobCombination(liveJobs: number): boolean {
  return liveJobs > 0
}

/**
 * Listing pages (/jobs and hubs) with any refinement parameter are noindex,
 * follow, and canonicalise to the unfiltered page.
 */
export function isRefinedListing(searchParams: Record<string, string | string[] | undefined>): boolean {
  return LISTING_FILTER_PARAMS.some((key) => {
    const value = searchParams[key]
    if (key === 'page') return value !== undefined && value !== '1'
    return value !== undefined && value !== ''
  })
}
