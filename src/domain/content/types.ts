/**
 * CMS-agnostic content types. The frontend depends only on these types, never
 * on CMS-generated types, so the CMS can be replaced behind src/data.
 */

export type ImageAsset = {
  url: string
  alt: string
  width: number | null
  height: number | null
  /** Attribution for third-party imagery (e.g. Unsplash). */
  credit: { name: string; url: string | null } | null
}


/** Rich content, already rendered to sanitised HTML by the CMS adapter. */
export type RichText = { html: string }

export type SeoFields = {
  title: string | null
  description: string | null
  image: ImageAsset | null
}

export type Faq = { question: string; answer: string }

export type JobCategory = {
  id: string
  name: string
  slug: string
  parentId: string | null
  intro: string | null
  seo: SeoFields
  /** Employer-side service for this job family (cluster link). */
  relatedServiceSlug: string | null
}

export type Location = {
  id: string
  name: string
  slug: string
  region: string | null
  countryCode: string
  /** Dedicated location landing page exists (only with genuine local activity). */
  hasLandingPage: boolean
  intro: string | null
}

export type Service = {
  id: string
  title: string
  slug: string
  parentSlug: string | null
  summary: string
  body: RichText | null
  faqs: Faq[]
  featuredImage: ImageAsset | null
  relatedJobCategorySlugs: string[]
  seo: SeoFields
  updatedAt: string
}

export type ArticleCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  seo: SeoFields
}

export type ArticleCta = 'jobs' | 'hire-staff' | 'none'

export type Article = {
  id: string
  title: string
  slug: string
  excerpt: string
  body: RichText | null
  category: Pick<ArticleCategory, 'name' | 'slug'> | null
  featuredImage: ImageAsset | null
  authorName: string | null
  publishedAt: string
  updatedAt: string
  relatedJobCategorySlug: string | null
  relatedServiceSlug: string | null
  primaryCta: ArticleCta
  seo: SeoFields
}

export type Paginated<T> = {
  items: T[]
  page: number
  totalPages: number
  totalItems: number
}
