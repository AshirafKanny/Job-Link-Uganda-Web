/**
 * Email templates. Pure functions (no I/O) so they are unit-tested.
 *
 * SECURITY: every visitor-supplied value goes through escapeHtml() before it
 * reaches the HTML body; nothing a visitor types is ever treated as markup.
 * Inline styles and tables only, because many email clients ignore <style>.
 */

const BRAND = { name: 'Job Link Uganda', red: '#d91519', ink: '#141414', muted: '#5c5c5c', line: '#e4e2dc', soft: '#f6f5f1' }

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Escapes, then keeps the visitor's line breaks. */
const multiline = (value: string) => escapeHtml(value).replace(/\r?\n/g, '<br>')

export function formatKampalaDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Africa/Kampala',
  }).format(date)
}

type Row = { label: string; value: string | null | undefined; multiline?: boolean }

type Layout = {
  siteUrl: string
  /** Small heading above the title, e.g. "New employer enquiry". */
  eyebrow: string
  title: string
  intro?: string
  rows?: Row[]
  action?: { label: string; url: string }
  footerNote: string
}

function renderHtml({ siteUrl, eyebrow, title, intro, rows = [], action, footerNote }: Layout): string {
  const body = rows
    .filter((r) => r.value)
    .map(
      (r) => `<tr>
  <td style="padding:10px 0;border-bottom:1px solid ${BRAND.line};vertical-align:top;width:34%;font-size:13px;color:${BRAND.muted};">${escapeHtml(r.label)}</td>
  <td style="padding:10px 0 10px 12px;border-bottom:1px solid ${BRAND.line};vertical-align:top;font-size:15px;color:${BRAND.ink};">${r.multiline ? multiline(r.value!) : escapeHtml(r.value!)}</td>
</tr>`,
    )
    .join('\n')

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${BRAND.soft};font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.soft};padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-top:4px solid ${BRAND.red};">
  <tr><td style="padding:24px 28px 8px;">
    <div style="font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${BRAND.ink};">${BRAND.name.toUpperCase()}</div>
    <div style="margin-top:18px;font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.red};">${escapeHtml(eyebrow)}</div>
    <h1 style="margin:6px 0 0;font-size:22px;line-height:1.3;color:${BRAND.ink};">${escapeHtml(title)}</h1>
    ${intro ? `<p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:${BRAND.ink};">${escapeHtml(intro)}</p>` : ''}
  </td></tr>
  ${body ? `<tr><td style="padding:8px 28px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${body}</table></td></tr>` : ''}
  ${
    action
      ? `<tr><td style="padding:24px 28px 0;"><a href="${escapeHtml(action.url)}" style="display:inline-block;background:${BRAND.red};color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:12px 20px;">${escapeHtml(action.label)}</a></td></tr>`
      : ''
  }
  <tr><td style="padding:28px;font-size:12px;line-height:1.6;color:${BRAND.muted};">
    ${escapeHtml(footerNote)}<br>
    <a href="${escapeHtml(siteUrl)}" style="color:${BRAND.muted};">${escapeHtml(siteUrl.replace(/^https?:\/\//, ''))}</a>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`
}

function renderText({ siteUrl, eyebrow, title, intro, rows = [], action, footerNote }: Layout): string {
  const rule = '----------------------------------------'
  const lines = [rule, BRAND.name.toUpperCase(), eyebrow, rule, '', title]
  if (intro) lines.push('', intro)
  for (const r of rows.filter((row) => row.value)) lines.push('', `${r.label}:`, r.value!)
  if (action) lines.push('', `${action.label}: ${action.url}`)
  lines.push('', rule, footerNote, siteUrl, rule)
  return lines.join('\n')
}

export type RecruitmentRequestEmailData = {
  id: number | string
  enquiryType: 'recruitment' | 'training'
  contactName: string
  businessName: string
  phone: string
  email: string | null
  rolesNeeded: string
  numberOfPositions: number | null
  location: string | null
  preferredStartDate: string | null
  message: string | null
  serviceTitle: string | null
  /** Display name of the chosen training package, e.g. "Workplace Starter — UGX 1,200,000". */
  trainingPackageName: string | null
  sourcePath: string
  submittedAt: Date
}

/** Staff notification: sent to the team inbox, Reply-To the employer when they gave an email. */
export function recruitmentRequestNotification(data: RecruitmentRequestEmailData, siteUrl: string) {
  const training = data.enquiryType === 'training'
  const layout: Layout = {
    siteUrl,
    eyebrow: training ? 'New training enquiry' : 'New employer enquiry',
    title: training ? `${data.businessName} wants hospitality training` : `${data.businessName} wants to hire staff`,
    intro: data.email
      ? `Reply to this email to answer ${data.contactName} directly.`
      : `${data.contactName} did not leave an email address. Please call them on the number below.`,
    rows: [
      { label: 'Business', value: data.businessName },
      { label: 'Contact person', value: data.contactName },
      { label: 'Phone', value: data.phone },
      { label: 'Email', value: data.email },
      ...(training
        ? [
            { label: 'Training package', value: data.trainingPackageName ?? 'Not sure yet' },
            { label: 'Staff to train', value: data.rolesNeeded, multiline: true },
            { label: 'Number of staff', value: data.numberOfPositions?.toString() },
            { label: 'Training location', value: data.location },
            { label: 'Preferred start date', value: data.preferredStartDate },
            { label: 'Training needs', value: data.message, multiline: true },
          ]
        : [
            { label: 'Recruitment service', value: data.serviceTitle },
            { label: 'Roles needed', value: data.rolesNeeded, multiline: true },
            { label: 'Number of positions', value: data.numberOfPositions?.toString() },
            { label: 'Work location', value: data.location },
            { label: 'Preferred start date', value: data.preferredStartDate },
            { label: 'Message', value: data.message, multiline: true },
          ]),
      { label: 'Submitted', value: `${formatKampalaDateTime(data.submittedAt)} (Kampala time)` },
      { label: 'Sent from page', value: data.sourcePath },
      { label: 'Enquiry reference', value: `#${data.id}` },
    ],
    action: { label: 'Open in admin', url: `${siteUrl}/admin/collections/recruitment-requests/${data.id}` },
    footerNote:
      'Sent automatically by the Job Link Uganda website. This email contains an employer’s personal details: do not forward it outside the team.',
  }
  return {
    subject: training ? `NEW TRAINING ENQUIRY — ${data.businessName}` : `NEW EMPLOYER INQUIRY — ${data.businessName}`,
    html: renderHtml(layout),
    text: renderText(layout),
  }
}

/**
 * Confirmation to the employer. Deliberately contains NO visitor-supplied
 * text (not even their name), so the form cannot be abused to send
 * arbitrary content to someone else's inbox.
 */
export function recruitmentRequestConfirmation(siteUrl: string, enquiryType: 'recruitment' | 'training' = 'recruitment') {
  const training = enquiryType === 'training'
  const layout: Layout = {
    siteUrl,
    eyebrow: 'Enquiry received',
    title: training
      ? 'Thank you, we have received your training request'
      : 'Thank you, we have received your recruitment request',
    intro: training
      ? 'A member of the Job Link Uganda team will contact you to discuss your team, the training you need and suitable dates. You can reply to this email if you need to add anything.'
      : 'A member of the Job Link Uganda recruitment team will review your request and contact you to discuss your requirements. You can reply to this email if you need to add anything.',
    footerNote: 'You are receiving this because this email address was entered on the Job Link Uganda website. If that was not you, you can ignore this email.',
  }
  return {
    subject: training
      ? 'We received your training request — Job Link Uganda'
      : 'We received your recruitment request — Job Link Uganda',
    html: renderHtml(layout),
    text: renderText(layout),
  }
}
