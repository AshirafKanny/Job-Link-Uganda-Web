import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/**
 * On-demand revalidation of the public pages affected by a CMS change.
 * Hooks also run outside Next.js (seed scripts, migrations), where
 * revalidatePath is unavailable, so failures are logged and ignored.
 */
async function revalidate(paths: string[], log: (msg: string) => void) {
  try {
    const { revalidatePath } = await import('next/cache')
    for (const path of paths) revalidatePath(path, 'layout')
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
