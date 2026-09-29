import 'server-only'

/**
 * Transactional email through Resend's HTTP API (https://resend.com/docs/api-reference/emails/send-email).
 * Plain fetch, so there is no SDK dependency and nothing opens SMTP
 * connections from serverless functions.
 *
 * Configuration (server-only, never NEXT_PUBLIC_*):
 *   RESEND_API_KEY  Resend API key with "sending access" only.
 *   EMAIL_FROM      Verified sender, e.g. "Job Link Uganda <notifications@joblinkuganda.com>".
 *   ADMIN_EMAIL     Team inbox that receives website submissions.
 * Email is sent only when all three are set; otherwise sending is skipped
 * (and logged) so local development and previews never email the team.
 */
const apiKey = process.env.RESEND_API_KEY || null
const from = process.env.EMAIL_FROM || null

/** The one place the team inbox is configured. */
export const adminEmail = process.env.ADMIN_EMAIL || null

export const emailConfigured = Boolean(apiKey && from && adminEmail)

export type EmailMessage = {
  to: string
  subject: string
  html: string
  text: string
  /** Where "Reply" goes. The sender is always EMAIL_FROM, never a visitor's address. */
  replyTo?: string | null
  /** Makes retries safe: the provider sends at most one email per key (24 h). */
  idempotencyKey?: string
}

export type SendResult = { ok: true; id: string | null } | { ok: false; error: string } | { ok: false; skipped: true }

/** Header values must be single-line; strips CR/LF so no header can be injected. */
const oneLine = (value: string) => value.replace(/[\r\n]+/g, ' ').trim()

export async function sendEmail(message: EmailMessage): Promise<SendResult> {
  if (!apiKey || !from) return { ok: false, skipped: true }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...(message.idempotencyKey ? { 'Idempotency-Key': message.idempotencyKey.slice(0, 256) } : {}),
      },
      body: JSON.stringify({
        from,
        to: [message.to],
        subject: oneLine(message.subject).slice(0, 200),
        html: message.html,
        text: message.text,
        ...(message.replyTo ? { reply_to: oneLine(message.replyTo) } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) {
      // Status code and the provider's error name only; never the request body or key.
      const body = (await res.json().catch(() => null)) as { name?: string } | null
      return { ok: false, error: `Email provider returned ${res.status}${body?.name ? ` (${body.name})` : ''}` }
    }
    const data = (await res.json().catch(() => null)) as { id?: string } | null
    return { ok: true, id: data?.id ?? null }
  } catch (error) {
    const reason = error instanceof Error && error.name === 'TimeoutError' ? 'timed out' : 'network error'
    return { ok: false, error: `Email provider ${reason}` }
  }
}
