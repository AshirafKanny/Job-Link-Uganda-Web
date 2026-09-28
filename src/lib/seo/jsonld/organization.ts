import type { EmploymentAgency, Organization, WebSite, WithContext } from 'schema-dts'
import { business } from '@/config/business'
import { absoluteUrl, site } from '@/config/site'
import type { SiteSettings } from '@/domain/settings/types'

export const ORGANIZATION_ID = `${site.url}/#organization`

/**
 * EmploymentAgency (a LocalBusiness type) is only used once a verified public
 * office exists; until then a plain Organization avoids implying one. Every
 * optional property is omitted while its business fact is unknown.
 */
export function organizationJsonLd(settings: SiteSettings): WithContext<Organization | EmploymentAgency> {
  const { contact, office } = settings
  const common = {
    '@id': ORGANIZATION_ID,
    name: business.name,
    url: site.url,
    slogan: business.tagline,
    logo: absoluteUrl(business.logoPath),
    ...(business.legalName ? { legalName: business.legalName } : {}),
    ...(contact.phone ? { telephone: contact.phone } : {}),
    ...(contact.email ? { email: contact.email } : {}),
    ...(settings.socialLinks.length ? { sameAs: settings.socialLinks.map((l) => l.url) } : {}),
    // Only emitted once real contact details exist in Site Settings.
    ...(contact.phone || contact.email
      ? {
          contactPoint: {
            '@type': 'ContactPoint' as const,
            contactType: 'customer service',
            ...(contact.phone ? { telephone: contact.phone } : {}),
            ...(contact.email ? { email: contact.email } : {}),
            areaServed: 'UG',
            availableLanguage: ['English'],
          },
        }
      : {}),
    areaServed: business.areasServed.map((name) => ({ '@type': 'Place' as const, name })),
  }

  if (office) {
    return {
      '@context': 'https://schema.org',
      '@type': 'EmploymentAgency',
      ...common,
      address: {
        '@type': 'PostalAddress',
        streetAddress: office.streetAddress,
        addressLocality: office.locality,
        addressRegion: office.region,
        addressCountry: 'UG',
        ...(office.postalCode ? { postalCode: office.postalCode } : {}),
      },
      ...(settings.openingHours.length ? { openingHours: settings.openingHours } : {}),
    }
  }

  return { '@context': 'https://schema.org', '@type': 'Organization', ...common }
}

export function websiteJsonLd(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    name: site.name,
    url: site.url,
    inLanguage: 'en-UG',
    publisher: { '@id': ORGANIZATION_ID },
  }
}
