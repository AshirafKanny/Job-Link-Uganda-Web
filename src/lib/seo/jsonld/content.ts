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

/**
 * Hospitality training as a Service with its visible price list. Offers are
 * built from the same package data the page renders, so structured data can
 * never disagree with what visitors see. No Course/Event markup: there are no
 * published course dates, and the certificate is not an accredited award.
 */
export function trainingServiceJsonLd(
  description: string,
  packages: { id: string; name: string; price: number; priceUnit: string; duration: string; groupSize?: string }[],
): WithContext<Service> {
  const url = absoluteUrl(routes.hospitalityTraining())
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Hospitality training',
    serviceType: 'Hospitality staff training',
    description,
    url,
    provider: { '@id': ORGANIZATION_ID },
    areaServed: business.areasServed.map((name) => ({ '@type': 'Place' as const, name })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Hospitality training packages',
      itemListElement: packages.map((p) => ({
        '@type': 'Offer' as const,
        name: p.name,
        description: [p.duration, p.groupSize, p.priceUnit].filter(Boolean).join(', '),
        price: p.price,
        priceCurrency: 'UGX',
        url: `${url}#${p.id}`,
        itemOffered: { '@type': 'Service' as const, name: `${p.name} hospitality training` },
      })),
    },
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
