import type { Faq } from '@/domain/content/types'
import { Icon } from '@/components/ui/Icon'

type Props = { faqs: Faq[]; headingId?: string; title?: string }

/**
 * Visible FAQ list using native <details>: accessible, no JavaScript.
 * FAQPage structured data is intentionally not emitted (see docs/02).
 */
export function FaqList({ faqs, headingId = 'faq-heading', title = 'Frequently asked questions' }: Props) {
  if (faqs.length === 0) return null
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-2xl font-extrabold">
        {title}
      </h2>
      <div className="mt-6 divide-y divide-line border-y border-line">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-1">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
              {faq.question}
              <Icon
                name="arrow-right"
                size={20}
                className="shrink-0 rotate-90 text-brand-red transition-transform duration-300 group-open:-rotate-90"
              />
            </summary>
            <p className="pb-5 text-ink-muted">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
