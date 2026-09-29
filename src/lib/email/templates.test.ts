import { describe, expect, it } from 'vitest'
import { escapeHtml, recruitmentRequestConfirmation, recruitmentRequestNotification, type RecruitmentRequestEmailData } from './templates'

const SITE = 'https://www.joblinkuganda.com'

const data: RecruitmentRequestEmailData = {
  id: 42,
  contactName: 'Jane Namubiru',
  businessName: 'Cafe <script>alert(1)</script>',
  phone: '0700 000 000',
  email: 'jane@example.com',
  rolesNeeded: 'Two waiters\nOne barista',
  numberOfPositions: 3,
  location: 'Kampala',
  preferredStartDate: '2026-10-15',
  message: '<img src=x onerror=alert(1)> "quoted" & more',
  serviceTitle: 'Restaurant staff recruitment',
  sourcePath: '/hire-staff',
  submittedAt: new Date('2026-09-30T07:05:00Z'),
}

describe('escapeHtml', () => {
  it('escapes every HTML-significant character', () => {
    expect(escapeHtml(`<a href="x" onclick='y'>&</a>`)).toBe('&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;&lt;/a&gt;')
  })
})

describe('recruitmentRequestNotification', () => {
  const email = recruitmentRequestNotification(data, SITE)

  it('uses a descriptive subject naming the business', () => {
    expect(email.subject).toBe('NEW EMPLOYER INQUIRY — Cafe <script>alert(1)</script>')
  })

  it('never injects visitor text as markup', () => {
    expect(email.html).not.toContain('<script>')
    expect(email.html).not.toContain('<img src=x')
    expect(email.html).toContain('Cafe &lt;script&gt;alert(1)&lt;/script&gt;')
    expect(email.html).toContain('&lt;img src=x onerror=alert(1)&gt; &quot;quoted&quot; &amp; more')
  })

  it('keeps line breaks and shows all details, time in Kampala', () => {
    expect(email.html).toContain('Two waiters<br>One barista')
    expect(email.html).toContain('30 September 2026 at 10:05')
    expect(email.html).toContain(`${SITE}/admin/collections/recruitment-requests/42`)
    for (const value of ['Jane Namubiru', '0700 000 000', 'jane@example.com', 'Restaurant staff recruitment', '#42']) {
      expect(email.html).toContain(value)
      expect(email.text).toContain(value)
    }
  })

  it('has a plain-text version with the raw values', () => {
    expect(email.text).toContain('Roles needed:\nTwo waiters\nOne barista')
    expect(email.text).not.toContain('&lt;')
  })

  it('omits empty optional fields and says how to reach employers without email', () => {
    const noEmail = recruitmentRequestNotification({ ...data, email: null, message: null }, SITE)
    expect(noEmail.text).not.toContain('Email:')
    expect(noEmail.text).not.toContain('Message:')
    expect(noEmail.text).toContain('did not leave an email address')
  })
})

describe('recruitmentRequestConfirmation', () => {
  it('contains no visitor-supplied content', () => {
    const email = recruitmentRequestConfirmation(SITE)
    expect(email.subject).toBe('We received your recruitment request — Job Link Uganda')
    expect(email.html).not.toContain('Jane')
    expect(email.text).toContain('we have received your recruitment request')
  })
})
