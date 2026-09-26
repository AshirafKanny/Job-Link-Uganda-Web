import { categorySlugs, routes, serviceSlugs } from '@/lib/routes'

/**
 * Site navigation. Kept in code (not the CMS) because every entry must point
 * at a route that exists in the codebase; a CMS-edited menu could link to
 * pages that were never built.
 */
export type NavItem = { label: string; href: string; description?: string }

export const mainNav: NavItem[] = [
  { label: 'Jobs', href: routes.jobs() },
  { label: 'Recruitment Services', href: routes.services() },
  { label: 'For Job Seekers', href: routes.forJobSeekers() },
  { label: 'Career Resources', href: routes.careerResources() },
  { label: 'About', href: routes.about() },
  { label: 'Contact', href: routes.contact() },
]

export const headerCta: NavItem = { label: 'Hire Through Job Link', href: routes.hireStaff() }

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: 'Job seekers',
    items: [
      { label: 'Find jobs', href: routes.jobs() },
      { label: 'Hospitality jobs', href: routes.jobCategory(categorySlugs.hospitality) },
      { label: 'Restaurant jobs', href: routes.jobCategory(categorySlugs.restaurant) },
      { label: 'Guide for job seekers', href: routes.forJobSeekers() },
      { label: 'Career resources', href: routes.careerResources() },
    ],
  },
  {
    title: 'Employers',
    items: [
      { label: 'Recruitment services', href: routes.services() },
      { label: 'Hospitality recruitment', href: routes.service(serviceSlugs.hospitality) },
      { label: 'Restaurant staff recruitment', href: routes.service(serviceSlugs.restaurant) },
      { label: 'Request staff', href: routes.hireStaff() },
      { label: 'How we recruit', href: routes.howItWorks() },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About Job Link Uganda', href: routes.about() },
      { label: 'Contact', href: routes.contact() },
      { label: 'Recruitment safety', href: routes.recruitmentSafety() },
      { label: 'Privacy policy', href: routes.privacy() },
      { label: 'Terms of use', href: routes.terms() },
    ],
  },
]
