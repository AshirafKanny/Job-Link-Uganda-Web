import 'server-only'
import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { redirectsRepo } from '@/data'

/**
 * Call from a dynamic page when its content is missing: follows a CMS
 * redirect (e.g. recorded after a slug change) or falls through to a 404.
 */
export async function redirectOrNotFound(path: string): Promise<never> {
  let match: Awaited<ReturnType<typeof redirectsRepo.find>> = null
  try {
    match = await redirectsRepo.find(path)
  } catch {
    // CMS unreachable: a 404 is safer than an error page for a missing URL.
  }
  if (match && match.destination !== path) {
    if (match.permanent) permanentRedirect(match.destination)
    redirect(match.destination)
  }
  notFound()
}
