import { postgresAdapter } from '@payloadcms/db-postgres'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { EXPERIMENTAL_TableFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig, type Plugin } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { features } from './config/features'
import { site } from './config/site'
import { isAdmin, isStaff } from './cms/access'
import { Articles, Services } from './cms/collections/content'
import { Jobs } from './cms/collections/Jobs'
import { Media } from './cms/collections/Media'
import { storageCheckEndpoint } from './cms/endpoints/storage-check'
import { PasteTablesFeature } from './cms/lexical/paste-tables/feature.server'
import { candidateCollections } from './cms/collections/private/candidates'
import { Employers } from './cms/collections/private/Employers'
import { PageViews } from './cms/collections/private/PageViews'
import { RecruitmentRequests } from './cms/collections/private/RecruitmentRequests'
import { ArticleCategories, JobCategories, Locations } from './cms/collections/taxonomy'
import { SiteSettings } from './cms/globals/SiteSettings'
import { Users } from './cms/collections/Users'

const dirname = path.dirname(fileURLToPath(import.meta.url))

if (!process.env.PAYLOAD_SECRET) throw new Error('PAYLOAD_SECRET is not set. See .env.example.')
if (features.candidateSystem && candidateCollections.length === 0) {
  throw new Error('FEATURE_CANDIDATE_SYSTEM is enabled, but the candidate system has not been implemented.')
}

// In development the admin also works on localhost and 127.0.0.1 (same port);
// production accepts only the canonical origin.
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [site.url]
    : Array.from(
        new Set([
          site.url,
          site.url.replace('127.0.0.1', 'localhost'),
          site.url.replace('localhost', '127.0.0.1'),
        ]),
      )

const plugins: Plugin[] = [
  seoPlugin({
    collections: ['services', 'articles', 'job-categories', 'article-categories'],
    uploadsCollection: 'media',
    generateTitle: ({ doc }) =>
      (doc as { title?: string; name?: string })?.title ?? (doc as { name?: string })?.name ?? '',
    generateDescription: ({ doc }) => {
      const d = doc as { excerpt?: string; summary?: string; intro?: string; description?: string }
      return d?.excerpt ?? d?.summary ?? d?.intro ?? d?.description ?? ''
    },
  }),
  redirectsPlugin({
    collections: ['articles', 'services', 'job-categories'],
    redirectTypes: ['301', '302'],
    overrides: {
      admin: { group: 'Settings' },
      access: { read: isStaff, create: isStaff, update: isStaff, delete: isAdmin },
    },
  }),
]

// Public media goes to S3-compatible storage in production; local disk in development.
// Trimmed: a stray space or line break pasted into a Vercel variable (it happened with
// S3_ENDPOINT) silently broke every upload.
const storageEnv = (name: string) => process.env[name]?.trim() || undefined

// Always registered, enabled only when a bucket is configured. alwaysInsertFields keeps
// the plugin's hidden `_objectKey` field in the schema either way, so the database is
// the same locally (no bucket) and in production. Without it, migrations generated
// locally lacked the column and the media library failed in production.
plugins.push(
  s3Storage({
    enabled: Boolean(storageEnv('S3_BUCKET')),
    alwaysInsertFields: true,
    collections: { media: true },
    // The browser uploads straight to the bucket with a short-lived signed URL.
    // Vercel rejects request bodies over 4.5 MB, so routing files through the
    // server failed (HTTP 413) for ordinary photos and designed graphics.
    // Requires a CORS rule on the bucket allowing PUT from the site (docs/04, Step 2).
    clientUploads: true,
    bucket: storageEnv('S3_BUCKET') ?? '',
    config: {
      region: storageEnv('S3_REGION') ?? 'auto',
      endpoint: storageEnv('S3_ENDPOINT'),
      // Cloudflare R2 compatibility (also valid for AWS S3): path-style URLs, and only
      // the checksums the operation requires (newer SDK defaults add headers R2 may reject).
      forcePathStyle: true,
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
      credentials: {
        accessKeyId: storageEnv('S3_ACCESS_KEY_ID') ?? '',
        secretAccessKey: storageEnv('S3_SECRET_ACCESS_KEY') ?? '',
      },
    },
  }),
)

export default buildConfig({
  serverURL: site.url,
  cors: allowedOrigins,
  csrf: allowedOrigins,
  // Temporary admin-only image storage diagnostic (see the file).
  endpoints: [storageCheckEndpoint],
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' — Job Link Uganda Admin',
      icons: [{ rel: 'icon', type: 'image/png', url: '/icon.png' }],
    },
    components: {
      graphics: {
        Logo: '/cms/admin/graphics/AdminLogo#AdminLogo',
        Icon: '/cms/admin/graphics/AdminIcon#AdminIcon',
      },
      beforeDashboard: ['/cms/admin/dashboard/Dashboard#Dashboard'],
    },
  },
  collections: [
    // Public content (read through src/data only)
    Jobs,
    JobCategories,
    Locations,
    Services,
    Articles,
    ArticleCategories,
    Media,
    // Private records
    Employers,
    RecruitmentRequests,
    PageViews,
    ...(features.candidateSystem ? candidateCollections : []),
    // Staff
    Users,
  ],
  globals: [SiteSettings],
  // Tables: pasted HTML tables import as real table nodes; PasteTablesFeature handles
  // Markdown / tab-separated tables from plain-text clipboards (AI "Copy" buttons).
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, EXPERIMENTAL_TableFeature(), PasteTablesFeature()],
  }),
  graphQL: { disable: true },
  secret: process.env.PAYLOAD_SECRET,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
  }),
  sharp,
  plugins,
})
