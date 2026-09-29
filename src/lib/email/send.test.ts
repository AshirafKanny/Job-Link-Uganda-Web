import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

const message = { to: 'info@joblinkuganda.com', subject: 'Hello', html: '<p>Hi</p>', text: 'Hi' }

async function loadSender(env: Record<string, string | undefined>) {
  vi.resetModules()
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value ?? '')
  return import('./send')
}

describe('sendEmail', () => {
  beforeEach(() => vi.stubGlobal('fetch', vi.fn()))
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('skips sending (and never calls the provider) when not configured', async () => {
    const { sendEmail, emailConfigured } = await loadSender({ RESEND_API_KEY: '', EMAIL_FROM: '', ADMIN_EMAIL: '' })
    expect(emailConfigured).toBe(false)
    expect(await sendEmail(message)).toEqual({ ok: false, skipped: true })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('sends from the configured sender with Reply-To and an idempotency key', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ id: 'msg_1' }), { status: 200 }))
    const { sendEmail } = await loadSender({
      RESEND_API_KEY: 're_test',
      EMAIL_FROM: 'Job Link Uganda <notifications@joblinkuganda.com>',
      ADMIN_EMAIL: 'info@joblinkuganda.com',
    })
    const result = await sendEmail({ ...message, subject: 'Line\r\nBcc: evil@example.com', replyTo: 'jane@example.com', idempotencyKey: 'k1' })
    expect(result).toEqual({ ok: true, id: 'msg_1' })

    const [url, init] = vi.mocked(fetch).mock.calls[0]!
    expect(url).toBe('https://api.resend.com/emails')
    const headers = init!.headers as Record<string, string>
    expect(headers.Authorization).toBe('Bearer re_test')
    expect(headers['Idempotency-Key']).toBe('k1')
    const body = JSON.parse(init!.body as string)
    expect(body.from).toBe('Job Link Uganda <notifications@joblinkuganda.com>')
    expect(body.to).toEqual(['info@joblinkuganda.com'])
    expect(body.reply_to).toBe('jane@example.com')
    // Header injection attempt is flattened onto one line.
    expect(body.subject).toBe('Line Bcc: evil@example.com')
  })

  it('reports provider errors without leaking the request', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ name: 'validation_error', message: 'x' }), { status: 422 }))
    const { sendEmail } = await loadSender({ RESEND_API_KEY: 're_test', EMAIL_FROM: 'a@joblinkuganda.com', ADMIN_EMAIL: 'b@joblinkuganda.com' })
    const result = await sendEmail(message)
    expect(result).toEqual({ ok: false, error: 'Email provider returned 422 (validation_error)' })
    expect(JSON.stringify(result)).not.toContain('re_test')
  })

  it('survives network failures', async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError('fetch failed'))
    const { sendEmail } = await loadSender({ RESEND_API_KEY: 're_test', EMAIL_FROM: 'a@joblinkuganda.com', ADMIN_EMAIL: 'b@joblinkuganda.com' })
    expect(await sendEmail(message)).toEqual({ ok: false, error: 'Email provider network error' })
  })
})
