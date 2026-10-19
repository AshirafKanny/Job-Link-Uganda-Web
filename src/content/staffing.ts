import type { StockImageKey } from '@/config/images'

/**
 * Casual & event staffing: the service as offered by Job Link Uganda
 * (brief supplied by the business on 2026-10-20). No availability, timing or
 * performance guarantees: every request is discussed and confirmed first.
 */

export type StaffingCategory = {
  /** Stable id: stored on enquiries. Never rename once live. */
  id: string
  title: string
  text: string
  /** Illustrative photo; categories without a fitting photo use a typographic panel. */
  image?: StockImageKey
}

export const staffingCategories: StaffingCategory[] = [
  {
    id: 'wedding-ushers',
    title: 'Wedding ushers',
    text: 'Ushers to welcome guests, help with seating, guide attendees and keep the day running in an organised way.',
    image: 'weddingCeremony',
  },
  {
    id: 'corporate-event-ushers',
    title: 'Corporate event ushers',
    text: 'Personnel for conferences, seminars, product launches, exhibitions and business functions.',
    image: 'corporateEvent',
  },
  {
    id: 'waiters-catering',
    title: 'Waiters & catering assistants',
    text: 'Temporary hospitality staff for receptions, weddings, private parties and corporate functions.',
    image: 'waiterTray',
  },
  {
    id: 'event-setup-crew',
    title: 'Event setup & support crew',
    text: 'Casual workers to help with agreed venue preparation, arrangement and clean-up after the event.',
    image: 'eventTableSetting',
  },
  {
    id: 'promotional-staff',
    title: 'Promotional & brand activation staff',
    text: 'Personnel for promotional campaigns, product activations and customer engagement activities.',
  },
  {
    id: 'cleaning-support',
    title: 'Cleaning & general support workers',
    text: 'Casual workers for temporary cleaning and other suitable general support assignments.',
    image: 'housekeeping',
  },
  {
    id: 'hospitality-casuals',
    title: 'Hospitality casual workers',
    text: 'Temporary restaurant, hotel and catering staff, matched to your requirements.',
    image: 'tableService',
  },
  {
    id: 'general-casual-labour',
    title: 'General casual labour',
    text: 'Workers for other lawful temporary assignments, depending on the job and on worker suitability.',
  },
]

export const staffingCategoryIds = staffingCategories.map((c) => c.id) as [string, ...string[]]

/** The three groupings shown on the home page. */
export const staffingOccasions: { title: string; text: string; image: StockImageKey; category: string }[] = [
  {
    title: 'Weddings & private events',
    text: 'Ushers, waiters and support staff for weddings, introductions and family functions.',
    image: 'weddingCeremony',
    category: 'wedding-ushers',
  },
  {
    title: 'Corporate & hospitality events',
    text: 'Ushers and service staff for conferences, launches, dinners and receptions.',
    image: 'corporateEvent',
    category: 'corporate-event-ushers',
  },
  {
    title: 'Temporary & casual staffing',
    text: 'Short-term workers for catering, cleaning, setup and other lawful assignments.',
    image: 'waiterTray',
    category: 'hospitality-casuals',
  },
]

export const staffingReasons = [
  { title: 'Built around your request', text: 'Staffing is arranged for the event or assignment you describe, not from a fixed package.' },
  { title: 'Screening that fits the role', text: 'Workers are screened in a way that suits the assignment, from guest-facing ushers to setup crew.' },
  { title: 'Clear expectations', text: 'Duties, reporting times and arrangements are agreed with you before the day.' },
  { title: 'Coordination support', text: 'We help coordinate the staffing side of your event, so you can focus on everything else.' },
  { title: 'Flexible numbers and hours', text: 'Worker numbers, schedules and assignment length are discussed with you.' },
  { title: 'One point of contact', text: 'A single contact at Job Link Uganda for your staffing request, from first call to follow-up.' },
]

export const staffingSteps = [
  {
    title: 'Tell us what you need',
    text: 'Share the type of event or assignment, how many workers, the location, date, working hours and duties.',
  },
  {
    title: 'Discuss the requirements',
    text: 'We review the request, confirm whether it is feasible, and discuss the proposed arrangements and charges.',
  },
  {
    title: 'Selection and coordination',
    text: 'Suitable workers are identified and screened for the role, the requirements and the agreed process.',
  },
  {
    title: 'Assignment and follow-up',
    text: 'Arrangements are confirmed with you, including reporting time and duties, and we follow up afterwards.',
  },
]

export const staffingClients = [
  'Couples and families planning weddings',
  'Wedding planners and event management companies',
  'Hotels, restaurants and catering businesses',
  'Corporate organisations and conference organisers',
  'NGOs and institutions running events',
  'Brands running promotional campaigns',
  'Businesses needing temporary operational support',
]

export const staffingFaqs = [
  {
    question: 'Can you provide ushers for a wedding in Kampala?',
    answer:
      'Yes. Tell us the date, venue, number of guests and the duties you need covered, and we will discuss how many ushers are suitable and confirm what we can arrange.',
  },
  {
    question: 'How much notice do you need?',
    answer:
      'As much as possible. Availability and timelines depend on the number of workers, the roles and the date, so we confirm what is possible once we have your request.',
  },
  {
    question: 'How much does casual or event staffing cost?',
    answer:
      'Charges depend on the roles, the number of workers, the hours and the location. We discuss and agree the charges with you before any staff are arranged.',
  },
  {
    question: 'Do you provide staff outside Kampala?',
    answer: 'Tell us where the event or assignment is and we will let you know whether we can support it.',
  },
  {
    question: 'Are the workers screened?',
    answer:
      'Workers are screened in a way that suits the assignment and the role. We agree the duties, reporting time and expectations with you in advance.',
  },
]
