import 'server-only'
import { overseasRecruitmentEnabled } from '@/config/features'
import { jobsRepo, taxonomyRepo } from '@/data'
import { orderCategories, rollUpCategoryCounts } from '@/domain/jobs/taxonomy'

/** Taxonomy and live counts shared by /jobs and every job hub page. */
export async function loadJobBrowseData() {
  const [categories, locations, counts] = await Promise.all([
    taxonomyRepo.listJobCategories(),
    taxonomyRepo.listLocations(),
    jobsRepo.openCounts(),
  ])
  return {
    categories: orderCategories(categories),
    locations: locations.filter((l) => overseasRecruitmentEnabled || l.countryCode === 'UG'),
    categoryCounts: rollUpCategoryCounts(categories, counts.byCategory),
    locationCounts: counts.byLocation,
    counts,
  }
}
