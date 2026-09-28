import Image from 'next/image'
import { settingsRepo } from '@/data'
import { whatsappHref } from './WhatsAppLink'

/**
 * Number supplied by the business on 2026-09-28 (0744 429808). A WhatsApp
 * number saved in Site Settings takes precedence, so staff can change it
 * without a code release.
 */
const DEFAULT_WHATSAPP = '256744429808'

/** Floating "Chat on WhatsApp" button, fixed to the bottom-right of every public page. */
export async function FloatingWhatsApp() {
  const settings = await settingsRepo.get().catch(() => null)
  const number = settings?.contact.whatsappCandidates ?? settings?.contact.whatsappEmployers ?? DEFAULT_WHATSAPP

  return (
    <a
      href={whatsappHref(number, 'Hello Job Link Uganda, I found you on your website.')}
      target="_blank"
      rel="noopener"
      className="wa-float"
      aria-label="Chat with Job Link Uganda on WhatsApp (opens WhatsApp)"
    >
      <span aria-hidden="true" className="wa-float__ring" />
      <span aria-hidden="true" className="wa-float__ring wa-float__ring--late" />
      <span aria-hidden="true" className="wa-float__label">
        Chat with us
      </span>
      <Image src="/brand/whatsapp-icon.svg" alt="" width={64} height={64} className="wa-float__icon" />
    </a>
  )
}
