import { site } from '@/config/site'
import type { EmploymentType, Salary } from '@/domain/jobs/types'
import { EMPLOYMENT_TYPE_LABELS } from '@/domain/jobs/types'

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: site.timeZone,
})

const shortDateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: site.timeZone })

/** e.g. "25 Sept 2026" in Kampala time. */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso))
}

export function formatShortDate(iso: string): string {
  return shortDateFormatter.format(new Date(iso))
}

/** "Today", "Yesterday", "3 days ago", else the date. */
export function formatPosted(iso: string, now: Date = new Date()): string {
  const days = Math.floor((now.getTime() - new Date(iso).getTime()) / 86_400_000)
  if (days <= 0) return 'Posted today'
  if (days === 1) return 'Posted yesterday'
  if (days < 14) return `Posted ${days} days ago`
  return `Posted ${formatDate(iso)}`
}

const unitLabel: Record<Salary['unit'], string> = {
  HOUR: 'per hour',
  DAY: 'per day',
  WEEK: 'per week',
  MONTH: 'per month',
  YEAR: 'per year',
}

/** e.g. "UGX 600,000 – 800,000 per month". Only ever called with a confirmed salary. */
export function formatSalary(salary: Salary): string {
  const n = (v: number) => new Intl.NumberFormat('en-UG', { maximumFractionDigits: 0 }).format(v)
  const amount = salary.max && salary.max !== salary.min ? `${n(salary.min)} – ${n(salary.max)}` : n(salary.min)
  return `${salary.currency} ${amount} ${unitLabel[salary.unit]}`
}

export function formatEmploymentTypes(types: EmploymentType[]): string {
  return types.map((t) => EMPLOYMENT_TYPE_LABELS[t]).join(' · ')
}

/** Days left until a closing date, for "closing soon" notices. */
export function daysUntil(iso: string, now: Date = new Date()): number {
  return Math.ceil((new Date(iso).getTime() - now.getTime()) / 86_400_000)
}
