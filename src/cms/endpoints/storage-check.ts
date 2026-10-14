import { HeadBucketCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { Endpoint } from 'payload'

/**
 * Admin-only diagnostic for image storage (Cloudflare R2): GET /api/storage-check.
 * Reports which S3_* settings are present and well-formed, then tests signing
 * and a real connection to the bucket. NEVER returns secret values, only
 * presence, length and shape. Temporary: remove once uploads work.
 */
const describe = (name: string) => {
  const raw = process.env[name]
  if (raw === undefined) return { set: false, problem: 'missing' }
  if (raw === '') return { set: false, problem: 'empty' }
  return {
    set: true,
    length: raw.length,
    ...(raw !== raw.trim() ? { problem: 'has spaces or a line break at the start or end' } : {}),
  }
}

export const storageCheckEndpoint: Endpoint = {
  path: '/storage-check',
  method: 'get',
  handler: async (req) => {
    const roles = (req.user as { roles?: string[] } | null)?.roles ?? []
    if (!roles.includes('admin')) {
      return Response.json({ error: 'Sign in to the admin as an administrator, then open this page again.' }, { status: 403 })
    }

    const bucket = process.env.S3_BUCKET?.trim() ?? ''
    const endpoint = process.env.S3_ENDPOINT?.trim() ?? ''
    const keyId = process.env.S3_ACCESS_KEY_ID?.trim() ?? ''
    const secret = process.env.S3_SECRET_ACCESS_KEY?.trim() ?? ''

    const settings = {
      S3_BUCKET: { ...describe('S3_BUCKET'), value: bucket || null },
      S3_REGION: { ...describe('S3_REGION'), value: process.env.S3_REGION || null },
      S3_ENDPOINT: describe('S3_ENDPOINT'),
      S3_ACCESS_KEY_ID: describe('S3_ACCESS_KEY_ID'),
      S3_SECRET_ACCESS_KEY: describe('S3_SECRET_ACCESS_KEY'),
    }

    const hints: string[] = []
    let endpointShape: Record<string, unknown> = {}
    try {
      const u = new URL(endpoint)
      endpointShape = {
        https: u.protocol === 'https:',
        isR2Host: u.hostname.endsWith('.r2.cloudflarestorage.com'),
        hasExtraPath: u.pathname !== '/' && u.pathname !== '',
      }
      if (u.protocol !== 'https:') hints.push('S3_ENDPOINT must start with https://')
      if (!u.hostname.endsWith('.r2.cloudflarestorage.com'))
        hints.push('S3_ENDPOINT should look like https://<account-id>.r2.cloudflarestorage.com')
      if (u.pathname !== '/' && u.pathname !== '')
        hints.push('S3_ENDPOINT must not include the bucket name or any path after .com')
    } catch {
      endpointShape = { valid: false }
      if (endpoint) hints.push('S3_ENDPOINT is not a valid URL: it must start with https://')
    }
    // R2 S3 credentials: Access Key ID is 32 characters, Secret Access Key is 64.
    if (keyId && keyId.length !== 32)
      hints.push(`S3_ACCESS_KEY_ID is ${keyId.length} characters; an R2 Access Key ID is 32. It may be a different kind of Cloudflare token.`)
    if (secret && secret.length !== 64)
      hints.push(`S3_SECRET_ACCESS_KEY is ${secret.length} characters; an R2 Secret Access Key is 64.`)
    for (const [name, info] of Object.entries(settings)) {
      if (!info.set && name !== 'S3_REGION') hints.push(`${name} is ${info.problem}.`)
    }

    const tests: Record<string, string> = {}
    if (bucket && endpoint && keyId && secret) {
      const client = new S3Client({
        region: process.env.S3_REGION || 'auto',
        endpoint,
        forcePathStyle: true,
        requestChecksumCalculation: 'WHEN_REQUIRED',
        responseChecksumValidation: 'WHEN_REQUIRED',
        credentials: { accessKeyId: keyId, secretAccessKey: secret },
      })
      try {
        await getSignedUrl(client, new PutObjectCommand({ Bucket: bucket, Key: 'storage-check.txt' }), { expiresIn: 60 })
        tests.signUploadLink = 'ok'
      } catch (e) {
        tests.signUploadLink = `failed: ${(e as Error).message}`
      }
      try {
        await client.send(new HeadBucketCommand({ Bucket: bucket }))
        tests.connectToBucket = 'ok'
      } catch (e) {
        const err = e as { name?: string; $metadata?: { httpStatusCode?: number } }
        tests.connectToBucket = `failed: ${err.name ?? 'error'} (HTTP ${err.$metadata?.httpStatusCode ?? '?'})`
        if (err.$metadata?.httpStatusCode === 404) hints.push('The bucket was not found: S3_BUCKET must match the R2 bucket name exactly.')
        if (err.$metadata?.httpStatusCode === 403)
          hints.push('Access denied: check the Access Key ID/Secret pair, and that the R2 token has Object Read & Write on this bucket.')
      }
    } else {
      tests.skipped = 'Not all four required settings are present.'
    }

    return Response.json({ settings, endpointShape, tests, hints, ok: hints.length === 0 && tests.connectToBucket === 'ok' })
  },
}
