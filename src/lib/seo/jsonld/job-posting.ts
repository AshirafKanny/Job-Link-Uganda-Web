import type { JobPosting, WithContext } from 'schema-dts'
import { business } from '@/config/business'
import { absoluteUrl, site } from '@/config/site'
import { getJobLifecycle } from '@/domain/jobs/lifecycle'
import type { Job } from '@/domain/jobs/types'
import { routes } from '@/lib/routes'

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const htmlList = (heading: string, items: string[]) =>
  items.length
    ? `<h3>${escapeHtml(heading)}</h3><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : ''

/**
 * JobPosting.description must match what the page shows, so it is built from
 * the same summary and lists that the job page renders.
 */
export function jobDescriptionHtml(job: Job): string {
  return [
    `<p>${escapeHtml(job.summary)}</p>`,
    htmlList('Responsibilities', job.responsibilities),
    htmlList('Requirements', job.requirements),
    job.experience ? `<h3>Experience</h3><p>${escapeHtml(job.experience)}</p>` : '',
    htmlList('Benefits', job.benefits),
    `<h3>How to apply</h3><p>${escapeHtml(job.application.instructions)}</p>`,
  ].join('')
}

/**
 * Returns null unless the job is currently open. Closed and retired jobs must
 * never emit JobPosting markup.
 */
export function jobPostingJsonLd(job: Job, now: Date = new Date()): WithContext<JobPosting> | null {
  const lifecycle = getJobLifecycle(job, now)
  if (lifecycle.state !== 'open') return null

  const hiringOrganization =
    job.hiringOrganization.kind === 'named'
      ? {
          '@type': 'Organization' as const,
          name: job.hiringOrganization.name,
          ...(job.hiringOrganization.url ? { sameAs: job.hiringOrganization.url } : {}),
        }
      : {
          // Confidential employer: Job Link Uganda is the organisation advertising the role.
          '@type': 'Organization' as const,
          name: business.name,
          sameAs: site.url,
          logo: absoluteUrl(business.logoPath),
        }

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: jobDescriptionHtml(job),
    identifier: { '@type': 'PropertyValue', name: business.name, value: `JL${job.ref}` },
    datePosted: job.datePosted,
    validThrough: lifecycle.validThrough.toISOString(),
    employmentType: job.employmentTypes,
    hiringOrganization,
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location.name,
        ...(job.location.region ? { addressRegion: job.location.region } : {}),
        addressCountry: job.location.countryCode,
      },
    },
    ...(job.salary
      ? {
          baseSalary: {
            '@type': 'MonetaryAmount',
            currency: job.salary.currency,
            value: {
              '@type': 'QuantitativeValue',
              unitText: job.salary.unit,
              ...(job.salary.max
                ? { minValue: job.salary.min, maxValue: job.salary.max }
                : { value: job.salary.min }),
            },
          },
        }
      : {}),
    directApply: job.application.method === 'online',
    url: absoluteUrl(routes.job(job)),
  }
}
