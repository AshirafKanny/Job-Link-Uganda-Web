import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { WhatsAppLink } from '@/components/contact/WhatsAppLink'
import { Icon } from '@/components/ui/Icon'
import { business } from '@/config/business'
import { footerNav } from '@/config/navigation'
import { settingsRepo } from '@/data'
import { routes } from '@/lib/routes'

const socialLabel: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  x: 'X',
  tiktok: 'TikTok',
  youtube: 'YouTube',
}

/**
 * Footer. Contact details, office and social links render only from verified
 * values in Site Settings; nothing is shown in their place when they are empty.
 */
export async function SiteFooter() {
  const settings = await settingsRepo.get()
  const { contact, office, socialLinks } = settings
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-brand-black text-white">
      <div className="flag-bar h-1" aria-hidden="true" />
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.2fr_2fr]">
        <div className="max-w-sm">
          <Link href={routes.home()} className="inline-flex items-center gap-3" aria-label={`${business.name}, home`}>
            <span className="rounded-full bg-white p-0.5">
              <Logo size={56} />
            </span>
            <span className="font-display text-lg leading-none font-extrabold uppercase">
              Job <span className="text-brand-yellow">Link</span>
              <span className="mt-1 block text-[0.625rem] font-semibold tracking-[0.34em] text-white/60">Uganda</span>
            </span>
          </Link>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-white/70">
            A recruitment agency connecting employers with suitable staff and job seekers with genuine vacancies. Our
            main focus is hospitality and restaurant recruitment in Kampala.
          </p>

          {(contact.phone || contact.email || office) && (
            <ul className="mt-6 space-y-2.5 text-[0.95rem]">
              {contact.phone && (
                <li className="flex items-center gap-3">
                  <Icon name="phone" size={18} className="text-brand-yellow" />
                  <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="hover:underline">
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.email && (
                <li className="flex items-center gap-3">
                  <Icon name="mail" size={18} className="text-brand-yellow" />
                  <a href={`mailto:${contact.email}`} className="hover:underline">
                    {contact.email}
                  </a>
                </li>
              )}
              {office && (
                <li className="flex items-start gap-3">
                  <Icon name="map-pin" size={18} className="mt-0.5 text-brand-yellow" />
                  <span>
                    {office.streetAddress}, {office.locality}
                  </span>
                </li>
              )}
            </ul>
          )}
          <WhatsAppLink
            number={contact.whatsappCandidates}
            message="Hello Job Link Uganda, I have a question."
            label="Chat on WhatsApp"
            variant="link"
            className="mt-5 text-[#6fd39c]"
          />
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {footerNav.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="font-display text-xs font-bold tracking-[0.18em] text-brand-yellow uppercase">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-[0.95rem] text-white/75 transition-colors hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-4 py-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.legalName ?? business.name}. {business.tagline}.
          </p>
          {socialLinks.length > 0 && (
            <ul className="flex flex-wrap gap-5">
              {socialLinks.map((link) => (
                <li key={link.url}>
                  <a href={link.url} rel="noopener me" target="_blank" className="hover:text-white">
                    {socialLabel[link.platform]}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  )
}
