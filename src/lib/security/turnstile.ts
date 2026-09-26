import 'server-only'

export const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || null
const secret = process.env.TURNSTILE_SECRET_KEY || null

/** Turnstile is enforced only when both keys are configured. */
export const turnstileEnabled = Boolean(turnstileSiteKey && secret)

/** Verifies a Cloudflare Turnstile token server-side. */
export async function verifyTurnstile(token: string | null, ip: string | null): Promise<boolean> {
  if (!turnstileEnabled) return true
  if (!token) return false
  try {
    const body = new URLSearchParams({ secret: secret!, response: token })
    if (ip) body.set('remoteip', ip)
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(5000),
    })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return false
  }
}
