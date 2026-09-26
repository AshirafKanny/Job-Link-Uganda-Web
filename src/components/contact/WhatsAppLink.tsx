import { WhatsAppGlyph } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

type Props = {
  /** Digits in international format; when null nothing is rendered. */
  number: string | null
  /** Pre-filled message so the team knows the context of the chat. */
  message: string
  label: string
  variant?: 'solid' | 'outline' | 'link'
  className?: string
}

export function whatsappHref(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

/**
 * WhatsApp is a secondary contact route: it never replaces the page's main
 * action, and it only appears once a verified number is in Site Settings.
 */
export function WhatsAppLink({ number, message, label, variant = 'outline', className }: Props) {
  if (!number) return null
  return (
    <a
      href={whatsappHref(number, message)}
      target="_blank"
      rel="noopener"
      className={cn(
        'inline-flex items-center gap-2 font-display font-bold transition-colors duration-200',
        variant === 'solid' && 'min-h-11 rounded-control bg-[#1f7a4c] px-5 text-white hover:bg-[#186540]',
        variant === 'outline' &&
          'min-h-11 rounded-control border border-line-strong bg-surface px-5 text-ink hover:border-[#1f7a4c] hover:text-[#1f7a4c]',
        variant === 'link' && 'text-[#1a6b42] underline-offset-4 hover:underline',
        className,
      )}
    >
      <WhatsAppGlyph size={19} />
      {label}
      <span className="sr-only">(opens WhatsApp)</span>
    </a>
  )
}
