import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/layout/LegalPage'
import { business } from '@/config/business'
import { legal } from '@/config/legal'
import { routes } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Use',
  description: 'The terms that apply when you use the Job Link Uganda website.',
  path: routes.terms(),
})

export default function TermsPage() {
  const name = business.legalName ?? business.name
  return (
    <LegalPage title="Terms of use" path={routes.terms()} reviewed={legal.terms.reviewed} lastUpdated={legal.terms.lastUpdated}>
      <p>These terms apply to your use of the {name} website. By using the website, you agree to them.</p>

      <h2>Vacancies</h2>
      <p>
        We take care to publish accurate vacancy information, based on what employers tell us. Details such as duties,
        requirements and closing dates can change. A vacancy marked as closed is no longer accepting applications.
      </p>
      <p>
        Publishing a vacancy does not guarantee an interview or a job. Hiring decisions are made by the employer.
      </p>

      <h2>Using the website responsibly</h2>
      <p>
        Please provide accurate information in any form you submit, and do not use the website to send spam or harmful
        content, or to try to access areas that are not public.
      </p>

      <h2>Career resources</h2>
      <p>
        Our guides offer general information and practical advice. They are not legal or professional advice for your
        specific situation.
      </p>

      <h2>Links to other websites</h2>
      <p>Where we link to other websites, we are not responsible for their content.</p>

      <h2>Privacy</h2>
      <p>
        Our <Link href={routes.privacy()}>privacy policy</Link> explains how we handle personal information.
      </p>
    </LegalPage>
  )
}
