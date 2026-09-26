import type { BreadcrumbList, WithContext } from 'schema-dts'
import { absoluteUrl } from '@/config/site'

export type Crumb = { name: string; path: string }

/** Built from the same crumb array that renders the visible breadcrumb. */
export function breadcrumbJsonLd(crumbs: Crumb[]): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  }
}
