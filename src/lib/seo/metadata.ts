import type { Metadata } from 'next'
import { absoluteUrl, isSiteIndexable, site } from '@/config/site'

/** Used when a page has no image of its own: the official logo on white, 1200×630. */
const DEFAULT_SHARE_IMAGE = { url: '/brand/og-default.jpg', alt: `${site.name} logo`, width: 1200, height: 630 }

type BuildMetadataInput = {
  /** Page title without the brand suffix; the root layout template appends it. */
  title: string
  description: string
  /** Canonical path, e.g. "/jobs/category/hospitality". */
  path: string
  /** Defaults to true. Ignored (always noindex) unless the site is indexable. */
  indexable?: boolean
  image?: { url: string; alt: string; width?: number | null; height?: number | null } | null
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  /** Skip the brand template (used on the home page). */
  absoluteTitle?: boolean
}

/** Every route builds its metadata through this helper so no page ships without a canonical or robots rule. */
export function buildMetadata({
  title,
  description,
  path,
  indexable = true,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  absoluteTitle = false,
}: BuildMetadataInput): Metadata {
  const canonical = absoluteUrl(path)
  const shouldIndex = isSiteIndexable && indexable
  const shareImage = image ?? DEFAULT_SHARE_IMAGE
  const images = [
    {
      url: absoluteUrl(shareImage.url),
      alt: shareImage.alt,
      width: shareImage.width ?? undefined,
      height: shareImage.height ?? undefined,
    },
  ]

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical },
    robots: shouldIndex ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type,
      url: canonical,
      siteName: site.name,
      locale: site.locale,
      title,
      description,
      images,
      ...(type === 'article' ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map((i) => i.url),
    },
  }
}
