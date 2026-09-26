/**
 * Launch taxonomy. Intros describe the kind of work, never specific vacancies,
 * pay levels or numbers. Hubs with no live vacancies stay noindex unless their
 * intro is substantial (see src/lib/seo/indexation.ts).
 */
export type SeedJobCategory = {
  name: string
  slug: string
  parentSlug?: string
  relatedServiceSlug?: string
  intro: string
  meta?: { title: string; description: string }
}

export const seedJobCategories: SeedJobCategory[] = [
  {
    name: 'Hospitality',
    slug: 'hospitality',
    relatedServiceSlug: 'hospitality-recruitment',
    meta: {
      title: 'Hospitality Jobs in Uganda',
      description:
        'Hospitality job vacancies in Kampala and Uganda: restaurant, hotel, kitchen, bar and café roles recruited by Job Link Uganda. See requirements and how to apply.',
    },
    intro: `Hospitality jobs cover everyone who looks after guests: waiters and waitresses, baristas and bartenders, chefs and kitchen staff, hotel receptionists, housekeeping teams and the supervisors who run each shift.

Most hospitality roles involve shift work, including evenings, weekends and public holidays, and employers look for reliability, good presentation and a genuine interest in serving people. Many positions value experience, but some entry-level roles are open to people who are willing to learn. Each vacancy below lists its own requirements and how to apply.`,
  },
  {
    name: 'Restaurant',
    slug: 'restaurant',
    parentSlug: 'hospitality',
    relatedServiceSlug: 'restaurant-staff-recruitment',
    meta: {
      title: 'Restaurant Jobs in Kampala and Uganda',
      description:
        'Restaurant jobs in Kampala: waiter, waitress, host, cashier and restaurant supervisor vacancies recruited by Job Link Uganda. See requirements and how to apply.',
    },
    intro: `Restaurant jobs include waiters and waitresses, hosts and hostesses, cashiers and restaurant supervisors. Service staff take orders, serve food and drinks, and make sure guests are looked after from arrival to payment.

Restaurants usually look for people who communicate well, stay calm when it is busy and can work shifts that include evenings and weekends. Supervisors also need experience of leading a team. Read each vacancy carefully, because restaurants set different requirements for experience, availability and presentation.`,
  },
  {
    name: 'Hotel',
    slug: 'hotel',
    parentSlug: 'hospitality',
    relatedServiceSlug: 'hotel-staff-recruitment',
    meta: {
      title: 'Hotel Jobs in Kampala and Uganda',
      description:
        'Hotel jobs in Kampala and Uganda: front desk, housekeeping and food-and-beverage vacancies recruited by Job Link Uganda. See requirements and how to apply.',
    },
    intro: `Hotel jobs span the front desk, housekeeping, food and beverage, and the kitchen. Receptionists welcome guests and manage bookings; housekeeping staff prepare rooms and public areas; restaurant and bar staff serve guests throughout the day.

Hotels operate every day of the year, so many roles involve shifts, including nights and weekends. Guest-facing positions call for good communication and presentation. Each vacancy explains its duties, requirements and application process.`,
  },
  {
    name: 'Kitchen',
    slug: 'kitchen',
    parentSlug: 'hospitality',
    relatedServiceSlug: 'restaurant-staff-recruitment',
    intro: `Kitchen jobs include chefs, cooks, kitchen assistants and kitchen stewards. Cooks prepare food to the kitchen's standards and timings, assistants support preparation, and stewards keep equipment and work areas clean and safe.

Kitchens are fast-paced and hygiene matters at every step. Employers typically value relevant cooking experience, an understanding of food safety, and the ability to work well under pressure during service.`,
  },
  {
    name: 'Bar and Café',
    slug: 'bar-and-cafe',
    parentSlug: 'hospitality',
    relatedServiceSlug: 'restaurant-staff-recruitment',
    intro: `Bar and café jobs include baristas and bartenders. Baristas prepare coffee and other drinks and often serve customers directly; bartenders prepare drinks, manage the bar and keep it stocked and clean.

These roles combine practical skill with customer service. Experience with espresso machines or cocktail preparation helps, and so does being friendly, quick and organised.`,
  },
  {
    name: 'Sales',
    slug: 'sales',
    relatedServiceSlug: 'general-recruitment',
    intro: 'Sales jobs include sales representatives and shop attendants who help customers, promote products and meet sales targets.',
  },
  {
    name: 'Office and Administration',
    slug: 'office-and-administration',
    relatedServiceSlug: 'general-recruitment',
    intro: 'Office and administration jobs include receptionists, administrative assistants and office support roles that keep a business organised day to day.',
  },
  {
    name: 'Cleaning and Facilities',
    slug: 'cleaning-and-facilities',
    relatedServiceSlug: 'general-recruitment',
    intro: 'Cleaning and facilities jobs keep workplaces, hotels and public areas clean, safe and well maintained.',
  },
  {
    name: 'General Work',
    slug: 'general-work',
    relatedServiceSlug: 'general-recruitment',
    intro: 'General work covers practical roles that support a business’s day-to-day operations.',
  },
]

export const seedLocations = [
  {
    name: 'Kampala',
    slug: 'kampala',
    region: 'Central Region',
    intro: `Kampala is Uganda's capital and largest city, and home to a wide range of restaurants, hotels, cafés, shops and offices. Job Link Uganda recruits for employers in Kampala, with a particular focus on hospitality and restaurant roles.

Before you apply, check where exactly the job is based and whether the working hours suit your journey to and from work, especially for early or late shifts.`,
  },
]

export const seedArticleCategories = [
  { name: 'Job Search', slug: 'job-search', description: 'Finding genuine vacancies and applying effectively in Uganda.' },
  { name: 'CVs and Applications', slug: 'cvs-and-applications', description: 'Preparing a CV and application that employers take seriously.' },
  { name: 'Interviews', slug: 'interviews', description: 'Preparing for interviews and answering common questions well.' },
  { name: 'Hospitality Careers', slug: 'hospitality-careers', description: 'Building a career in restaurants, hotels and hospitality.' },
  { name: 'Hiring Advice', slug: 'hiring-advice', description: 'Practical recruitment guidance for employers.' },
  { name: 'Recruitment Safety', slug: 'recruitment-safety', description: 'Recognising genuine opportunities and avoiding recruitment scams.' },
]
