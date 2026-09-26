import { createHash } from 'node:crypto'
import { site } from '@/config/site'
import { analyticsRepo } from '@/data'
import { classifyDevice, isBot, isTrackablePath, jobRefFromPath, referrerHost } from '@/domain/analytics'
import { rateLimit } from '@/lib/security/rate-limit'

/**
 * Receives anonymous page-view beacons. Stores no IP address or identifier:
 * the visitor ID is a salted hash that changes every day. Staff (logged into
 * the admin), bots and malformed requests are ignored. Always answers 204 so
 * the endpoint reveals nothing.
 */
const noContent = () => new Response(null, { status: 204 })

export async function POST(request: Request) {
  try {
    const ua = request.headers.get('user-agent')
    if (isBot(ua)) return noContent()
    // Staff browsing their own site are not counted.
    if (request.headers.get('cookie')?.includes('payload-token=')) return noContent()

    const body = (await request.json().catch(() => null)) as { p?: unknown; r?: unknown } | null
    const path = typeof body?.p === 'string' ? body.p : ''
    if (!isTrackablePath(path)) return noContent()

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '0.0.0.0'
    const day = new Intl.DateTimeFormat('en-CA', { timeZone: site.timeZone }).format(new Date())
    const visitorId = createHash('sha256')
      .update(`${process.env.PAYLOAD_SECRET}|${day}|${ip}|${ua}`)
      .digest('hex')
      .slice(0, 24)

    if (!rateLimit(`track:${visitorId}`, 120, 10 * 60 * 1000).allowed) return noContent()

    await analyticsRepo.recordView({
      path,
      jobRef: jobRefFromPath(path),
      visitorId,
      referrerHost: referrerHost(typeof body?.r === 'string' ? body.r : null, new URL(site.url).hostname),
      device: classifyDevice(ua ?? ''),
    })
  } catch {
    // Statistics must never break anything for visitors.
  }
  return noContent()
}
