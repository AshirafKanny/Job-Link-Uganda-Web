import type { MetadataRoute } from 'next'
import { absoluteUrl, isSiteIndexable, site } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  // Previews, staging and local builds are never crawlable.
  if (!isSiteIndexable) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: {
      userAgent: '*',
      // Uploaded images must stay crawlable for image search.
      allow: ['/', '/api/media/file/'],
      // Filtered /jobs URLs are NOT blocked here: they must be crawlable so
      // search engines can see their noindex and canonical tags.
      disallow: ['/admin', '/api/', '/track', '/*?*sort='],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: site.url,
  }
}
