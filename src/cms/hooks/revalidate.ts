import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/**
 * On-demand revalidation of the public pages (and the sitemap) affected by a CMS change.
 * Hooks also run outside Next.js (seed scripts, migrations), where
 * revalidatePath is unavailable, so failures are logged and ignored.
 */
async function revalidate(paths: string[], log: (msg: string) => void) {
  try {
    const { revalidatePath } = await import('next/cache')
    for (const path of paths) revalidatePath(path, 'layout')
    // The sitemap is a route handler outside the page layouts, so it is not
    // covered above; without this a new job waits up to an hour to be listed.
    revalidatePath('/sitemap.xml')
  } catch (error) {
    log(`Skipped revalidation outside Next.js runtime: ${(error as Error).message}`)
  }
}

export function revalidateOnChange(paths: string[]): {
  afterChange: CollectionAfterChangeHook
  afterDelete: CollectionAfterDeleteHook
} {
  return {
    afterChange: async ({ doc, req }) => {
      if (!req.context?.disableRevalidate) await revalidate(paths, (m) => req.payload.logger.debug(m))
      return doc
    },
    afterDelete: async ({ doc, req }) => {
      await revalidate(paths, (m) => req.payload.logger.debug(m))
      return doc
    },
  }
}
