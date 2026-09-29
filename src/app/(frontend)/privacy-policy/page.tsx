import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/layout/LegalPage'
import { business } from '@/config/business'
import { legal } from '@/config/legal'
import { settingsRepo } from '@/data'
import { routes } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'How Job Link Uganda collects, uses and protects personal information submitted through this website.',
  path: routes.privacy(),
})

/**
 * Describes only what this website actually does today. Update it before
 * enabling any new data collection (e.g. the candidate system).
 */
export default async function PrivacyPolicyPage() {
  const { contact } = await settingsRepo.get()
  const controller = business.legalName ?? business.name

  return (
    <LegalPage title="Privacy policy" path={routes.privacy()} reviewed={legal.privacy.reviewed} lastUpdated={legal.privacy.lastUpdated}>
      <p>
        This policy explains how {controller} (&ldquo;we&rdquo;) handles personal information submitted through this
        website. We handle personal information in line with Uganda&apos;s Data Protection and Privacy Act, 2019.
      </p>

      <h2>Information we collect</h2>
      <p>
        <strong>Recruitment requests from employers.</strong> When you send a recruitment request, we collect the details
        you enter: your name, business name, phone number, email address (optional), and information about the roles you
        need to fill.
      </p>
      <p>
        <strong>Browsing this website.</strong> This website does not use cookies for advertising or analytics. We keep
        anonymous visit statistics (which pages are viewed, the type of device, and the website that referred the visit) to
        understand how the site is used. These statistics contain no names, contact details or IP addresses, and are counted
        with a code that changes every day, so individual visitors cannot be identified or followed. If your browser sends a
        Do Not Track or Global Privacy Control signal, your visit is not counted. Our hosting provider may keep standard
        technical logs (such as IP addresses) to keep the website secure and running.
      </p>
      <p>
        We do not collect CVs or job applications through this website. Vacancies explain how to apply for each role.
      </p>

      <h2>How we use it</h2>
      <p>We use the information in a recruitment request only to respond to it and to carry out any recruitment you ask us to do.</p>
      <p>We do not sell personal information, and we never publish it on this website.</p>

      <h2>Who can see it</h2>
      <p>
        Recruitment requests are stored in a private system that only authorised Job Link Uganda staff can access. They are
        not available through any public page or public interface.
      </p>
      <p>
        So that our team can respond quickly, a copy of each request is emailed to our business inbox. We use an email
        delivery service to send it, and if you give us your email address, to send you a short confirmation that we
        received your request. These services handle the information only to deliver those emails.
      </p>

      <h2>How long we keep it</h2>
      <p>
        {legal.enquiryRetention ??
          'We keep recruitment requests only for as long as needed to respond to them and to manage any resulting recruitment.'}
      </p>

      <h2>Your rights</h2>
      <p>
        You may ask to see the personal information we hold about you, ask us to correct it, or ask us to delete it. To make
        a request,{' '}
        {contact.email ? (
          <>
            email <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </>
        ) : (
          <>
            use the details on our <Link href={routes.contact()}>contact page</Link>
          </>
        )}
        .
      </p>

      <h2>Changes to this policy</h2>
      <p>We will update this page if the way we handle personal information changes, and show the date of the latest update at the top.</p>
    </LegalPage>
  )
}
