import 'server-only'
import { convertLexicalToHTML, LinkHTMLConverter } from '@payloadcms/richtext-lexical/html'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type {
  Article as ArticleDoc,
  ArticleCategory as ArticleCategoryDoc,
  Job as JobDoc,
  JobCategory as JobCategoryDoc,
  Location as LocationDoc,
  Media as MediaDoc,
  Service as ServiceDoc,
} from '@/payload-types'
import type {
  Article,
  ArticleCategory,
  ImageAsset,
  JobCategory,
  Location,
  RichText,
  SeoFields,
  Service,
} from '@/domain/content/types'
import type { HiringOrganization, Job, JobSummary } from '@/domain/jobs/types'
import { routes } from '@/lib/routes'

/**
 * Converts CMS documents into domain objects. This is the privacy boundary:
 * only fields listed here can reach a public page. Internal notes, employer
 * contact details and anything else not mapped stays on the server.
 */

type Populated<T> = T | number | null | undefined

function populated<T extends object>(value: Populated<T>): T | null {
  return value && typeof value === 'object' ? value : null
}

const idOf = (value: Populated<{ id: number }>) =>
  value == null ? null : String(typeof value === 'object' ? value.id : value)

export function toImage(value: Populated<MediaDoc>): ImageAsset | null {
  const media = populated(value)
  if (!media?.url) return null
  return {
    url: media.url,
    alt: media.alt,
    width: media.width ?? null,
    height: media.height ?? null,
    credit:
      media.source !== 'job-link' && media.creditName
        ? { name: media.creditName, url: media.creditUrl ?? null }
        : null,
  }
}

const internalHref: Record<string, (slug: string) => string> = {
  articles: routes.article,
  services: routes.service,
  'job-categories': routes.jobCategory,
}

/** Renders CMS rich text to HTML here, so pages never depend on the CMS format. */
function toRichText(value: unknown): RichText | null {
  const state = value as SerializedEditorState | null | undefined
  if (!state?.root?.children?.length) return null
  const html = convertLexicalToHTML({
    data: state,
    disableContainer: true,
    disableIndent: true,
    disableTextAlign: true,
    converters: ({ defaultConverters }) => ({
      ...defaultConverters,
      ...LinkHTMLConverter({
        internalDocToHref: ({ linkNode }) => {
          const { relationTo, value: doc } = linkNode.fields.doc ?? {}
          const slug = doc && typeof doc === 'object' && 'slug' in doc ? String(doc.slug) : null
          const build = relationTo ? internalHref[relationTo] : undefined
          return slug && build ? build(slug) : '#'
        },
      }),
    }),
  })
  return html.trim() ? { html } : null
}

function toSeo(meta: { title?: string | null; description?: string | null; image?: Populated<MediaDoc> } | undefined): SeoFields {
  return { title: meta?.title ?? null, description: meta?.description ?? null, image: toImage(meta?.image) }
}

const items = (list: { item: string }[] | null | undefined) => (list ?? []).map((entry) => entry.item)

export function toJobCategory(doc: JobCategoryDoc): JobCategory {
  return {
    id: String(doc.id),
    name: doc.name,
    slug: doc.slug,
    parentId: idOf(doc.parent),
    intro: doc.intro ?? null,
    seo: toSeo(doc.meta),
    relatedServiceSlug: populated(doc.relatedService)?.slug ?? null,
  }
}

export function toLocation(doc: LocationDoc): Location {
  return {
    id: String(doc.id),
    name: doc.name,
    slug: doc.slug,
    region: doc.region ?? null,
    countryCode: doc.countryCode,
    hasLandingPage: Boolean(doc.hasLandingPage),
    intro: doc.intro ?? null,
  }
}

function toHiringOrganization(doc: JobDoc): HiringOrganization {
  const employer = populated(doc.employer)
  if (doc.employerVisibility === 'named' && employer?.publicName) {
    return { kind: 'named', name: employer.publicName, url: employer.website ?? null }
  }
  return { kind: 'confidential' }
}

export function toJob(doc: JobDoc): Job {
  const category = populated(doc.category)
  const location = populated(doc.location)
  if (!category || !location) throw new Error(`Job ${doc.id} was loaded without its category or location.`)

  const salary =
    doc.showSalary && doc.salary?.min != null
      ? {
          currency: doc.salary.currency || 'UGX',
          min: doc.salary.min,
          max: doc.salary.max ?? null,
          unit: doc.salary.unit ?? 'MONTH',
          note: doc.salary.note ?? null,
        }
      : null

  return {
    id: String(doc.id),
    ref: String(doc.id),
    title: doc.title,
    summary: doc.summary,
    category: { name: category.name, slug: category.slug },
    location: { name: location.name, slug: location.slug, region: location.region ?? null, countryCode: location.countryCode },
    employmentTypes: doc.employmentTypes,
    hiringOrganization: toHiringOrganization(doc),
    responsibilities: items(doc.responsibilities),
    requirements: items(doc.requirements),
    experience: doc.experience?.trim() || null,
    benefits: items(doc.benefits),
    additionalDetails: toRichText(doc.additionalDetails),
    salary,
    application: { method: doc.applicationMethod, instructions: doc.applicationInstructions },
    status: doc.status,
    featured: Boolean(doc.featured),
    closeReason: doc.closeReason ?? null,
    datePosted: doc.publishedAt ?? doc.createdAt,
    closingDate: doc.closingDate ?? null,
    closedAt: doc.closedAt ?? null,
    updatedAt: doc.updatedAt,
    retirement: doc.retirement,
  }
}

export function toJobSummary(job: Job): JobSummary {
  const { id, ref, title, summary, category, location, employmentTypes, hiringOrganization, salary, datePosted, closingDate } =
    job
  return { id, ref, title, summary, category, location, employmentTypes, hiringOrganization, salary, datePosted, closingDate }
}

export function toService(doc: ServiceDoc): Service {
  return {
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
    parentSlug: populated(doc.parent)?.slug ?? null,
    summary: doc.summary,
    body: toRichText(doc.body),
    faqs: (doc.faqs ?? []).map(({ question, answer }) => ({ question, answer })),
    featuredImage: toImage(doc.featuredImage),
    relatedJobCategorySlugs: (doc.relatedJobCategories ?? [])
      .map((c) => populated(c)?.slug)
      .filter((slug): slug is string => Boolean(slug)),
    seo: toSeo(doc.meta),
    updatedAt: doc.updatedAt,
  }
}

export function toArticleCategory(doc: ArticleCategoryDoc): ArticleCategory {
  return {
    id: String(doc.id),
    name: doc.name,
    slug: doc.slug,
    description: doc.description ?? null,
    seo: toSeo(doc.meta),
  }
}

export function toArticle(doc: ArticleDoc): Article {
  const category = populated(doc.category)
  return {
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    body: toRichText(doc.body),
    category: category ? { name: category.name, slug: category.slug } : null,
    featuredImage: toImage(doc.featuredImage),
    authorName: doc.authorName ?? null,
    publishedAt: doc.publishedAt ?? doc.createdAt,
    updatedAt: doc.updatedAt,
    relatedJobCategorySlug: populated(doc.relatedJobCategory)?.slug ?? null,
    relatedServiceSlug: populated(doc.relatedService)?.slug ?? null,
    primaryCta: doc.primaryCta ?? 'jobs',
    seo: toSeo(doc.meta),
  }
}
