import type { BlogPosting, FAQPage, Service, WithContext } from 'schema-dts'
import { business } from '@/config/business'
import { absoluteUrl } from '@/config/site'
import type { Article, Faq, Service as ServiceContent } from '@/domain/content/types'
import { routes } from '@/lib/routes'
import { ORGANIZATION_ID } from './organization'

export function articleJsonLd(article: Article): WithContext<BlogPosting> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: absoluteUrl(routes.article(article.slug)),
    ...(article.featuredImage ? { image: absoluteUrl(article.featuredImage.url) } : {}),
    // A named author only when the article genuinely has one; otherwise the organisation.
    author: article.authorName
      ? { '@type': 'Person', name: article.authorName }
      : { '@type': 'Organization', '@id': ORGANIZATION_ID, name: business.name },
    publisher: { '@id': ORGANIZATION_ID },
  }
}

export function serviceJsonLd(service: ServiceContent): WithContext<Service> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.summary,
    url: absoluteUrl(routes.service(service.slug)),
    serviceType: service.title,
    provider: { '@id': ORGANIZATION_ID },
    areaServed: business.areasServed.map((name) => ({ '@type': 'Place' as const, name })),
  }
}

/** Only for pages that visibly render these exact questions and answers. */
export function faqJsonLd(faqs: Faq[]): WithContext<FAQPage> | null {
  if (faqs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}
