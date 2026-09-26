import { describe, expect, it } from 'vitest'
import type { Job } from '@/domain/jobs/types'
import { jobPostingJsonLd } from './job-posting'

const job: Job = {
  id: '1',
  ref: '1042',
  title: 'Restaurant Supervisor',
  summary: 'Supervise floor service during lunch and dinner shifts.',
  category: { name: 'Restaurant', slug: 'restaurant' },
  location: { name: 'Kampala', slug: 'kampala', region: 'Central Region', countryCode: 'UG' },
  employmentTypes: ['FULL_TIME'],
  hiringOrganization: { kind: 'confidential' },
  responsibilities: ['Plan shift rotas <and> brief the team'],
  requirements: ['Previous supervisory experience'],
  experience: null,
  benefits: [],
  additionalDetails: null,
  salary: null,
  application: { method: 'instructions', instructions: 'Follow the instructions on this page.' },
  status: 'open',
  featured: false,
  closeReason: null,
  datePosted: '2026-09-01T08:00:00.000Z',
  closingDate: '2026-09-30T00:00:00.000Z',
  closedAt: null,
  updatedAt: '2026-09-01T08:00:00.000Z',
  retirement: 'gone',
}

describe('jobPostingJsonLd', () => {
  it('emits markup for an open job with validThrough and escaped description', () => {
    const data = jobPostingJsonLd(job, new Date('2026-09-15T00:00:00Z'))
    expect(data).not.toBeNull()
    expect(data?.validThrough).toBe('2026-09-30T20:59:59.999Z')
    expect(data?.description).toContain('Plan shift rotas &lt;and&gt; brief the team')
    expect(data?.url).toMatch(/\/jobs\/restaurant-supervisor-kampala-jl1042$/)
  })

  it('never invents a salary when none is published', () => {
    expect(jobPostingJsonLd(job, new Date('2026-09-15T00:00:00Z'))).not.toHaveProperty('baseSalary')
  })

  it('emits nothing once the job has closed', () => {
    expect(jobPostingJsonLd(job, new Date('2026-10-02T00:00:00Z'))).toBeNull()
    expect(jobPostingJsonLd({ ...job, status: 'closed', closeReason: 'filled', closedAt: '2026-09-10T00:00:00Z' }, new Date('2026-09-15T00:00:00Z'))).toBeNull()
  })
})
