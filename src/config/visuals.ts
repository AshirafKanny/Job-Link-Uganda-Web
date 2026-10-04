import { stockImages, type StockImageKey } from '@/config/images'
import { categorySlugs } from '@/lib/routes'

/**
 * Where illustrative photography is used beyond individual page files.
 * Every mapping must keep the photo's subject relevant to the page; pages
 * not listed here stay text-led on purpose (job pages, forms, legal pages).
 */

/** Header photo for job category hubs. Categories without a fitting photo have none. */
export const jobCategoryImages: Partial<Record<string, StockImageKey>> = {
  [categorySlugs.hospitality]: 'restaurantTeam',
  [categorySlugs.restaurant]: 'tableService',
  [categorySlugs.hotel]: 'hotelHost',
  [categorySlugs.kitchen]: 'kitchenCook',
}

/**
 * Article photo when the CMS article has no featured image of its own
 * (an uploaded featured image always wins). Matched by slug, then category.
 */
const articleImagesBySlug: Partial<Record<string, StockImageKey>> = {
  'cv-for-hospitality-jobs': 'cvWriting',
  'restaurant-interview-questions': 'interview',
  'job-description-for-restaurant-staff': 'tableService',
}

const articleImagesByCategory: Partial<Record<string, StockImageKey>> = {
  'job-search': 'jobSeekerLaptop',
  'cvs-and-applications': 'cvWriting',
  interviews: 'interview',
  'hospitality-careers': 'tableService',
  'hiring-advice': 'employersPlanning',
}

/** A 1200×630 share image (Open Graph) cropped around the photo's focal point. */
export function stockShareImage(key: StockImageKey) {
  const photo = stockImages[key]
  const [fx = '50', fy = '50'] = (photo.focus ?? '50% 50%').split(' ').map((v) => v.replace('%', ''))
  const params = new URLSearchParams({
    auto: 'format',
    fit: 'crop',
    crop: 'focalpoint',
    'fp-x': String(Number(fx) / 100),
    'fp-y': String(Number(fy) / 100),
    w: '1200',
    h: '630',
    q: '75',
  })
  return { url: `${photo.src}?${params.toString()}`, alt: photo.alt, width: 1200, height: 630 }
}

export function articleImageFor(article: { slug: string; category?: { slug: string } | null }): StockImageKey {
  return (
    articleImagesBySlug[article.slug] ??
    (article.category ? articleImagesByCategory[article.category.slug] : undefined) ??
    'jobSeekerLaptop'
  )
}
