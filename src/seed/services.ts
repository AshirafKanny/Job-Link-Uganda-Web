/**
 * Launch content for recruitment services. Loaded into the CMS by
 * `npm run seed` (only when a service does not exist yet), then owned by
 * editors. Describes process only: no outcomes, numbers or guarantees.
 *
 * REQUIRES BUSINESS INPUT: confirm that each service below is offered.
 */
export type SeedService = {
  title: string
  slug: string
  parentSlug?: string
  summary: string
  body: string
  faqs: { question: string; answer: string }[]
  relatedJobCategorySlugs: string[]
  order: number
  meta: { title: string; description: string }
}

export const seedServices: SeedService[] = [
  {
    title: 'Hospitality Recruitment',
    slug: 'hospitality-recruitment',
    order: 10,
    summary:
      'Front-of-house, kitchen and supervisory staff for restaurants, hotels, cafés and other hospitality businesses in Kampala.',
    meta: {
      title: 'Hospitality Recruitment in Kampala, Uganda',
      description:
        'Hospitality recruitment for restaurants, hotels and cafés in Kampala. Job Link Uganda sources and screens waiters, chefs, baristas, supervisors and hotel staff against your requirements.',
    },
    relatedJobCategorySlugs: ['hospitality', 'restaurant', 'hotel', 'kitchen', 'bar-and-cafe'],
    body: `
Hospitality businesses depend on the people who serve guests, cook the food and keep each shift running. When one position stays empty or the wrong person is hired, the whole team feels it. Job Link Uganda recruits hospitality staff for businesses in Kampala. Hospitality is our main focus, based on our practical recruitment experience with restaurants and hospitality businesses.

## Roles we recruit for

**Front of house**

- Waiters and waitresses
- Hosts and hostesses
- Baristas and bartenders
- Cashiers

**Kitchen**

- Chefs and cooks
- Kitchen assistants
- Kitchen stewards

**Supervision**

- Restaurant supervisors and shift leaders
- Floor managers

**Hotels**

- Front desk and reception staff
- Housekeeping staff
- Restaurant and bar service teams

If the role you need is not listed, tell us about it. We will say honestly whether it is something we can recruit for.

## How we recruit hospitality staff

1. **We start with your brief.** We ask about the role, the shifts, the number of people, your service standards and when you need them to start.
2. **We look for candidates who match it.** Experience matters, but so does availability for the hours you work.
3. **We screen candidates for the role.** What we check depends on the position and on what you ask for. For service roles this typically covers relevant experience, availability, presentation and how candidates communicate.
4. **You meet a shortlist.** You interview the candidates we introduce and make the hiring decision.

## What we need from you

The clearer the brief, the better the shortlist. Before we start, we will ask for:

- The job title and main duties
- Working hours and shift patterns
- The pay and any other benefits you offer
- Experience or skills that are essential, and those that are a bonus
- The location and the date you need people to start

## Restaurants, hotels and other hospitality businesses

Restaurants and hotels recruit for different mixes of roles, so we cover them in more detail on their own pages: see [restaurant staff recruitment](/recruitment-services/restaurant-staff-recruitment) and [hotel staff recruitment](/recruitment-services/hotel-staff-recruitment).

Looking for work in hospitality instead? Browse current [hospitality jobs](/jobs/category/hospitality).
`,
    faqs: [
      {
        question: 'Which hospitality roles can you recruit for?',
        answer:
          'Front-of-house, kitchen, supervisory and hotel roles, including waiters and waitresses, baristas, chefs and cooks, restaurant supervisors and front desk staff. If your role is not listed, ask us.',
      },
      {
        question: 'Do you recruit outside Kampala?',
        answer:
          'Our work is focused on Kampala. If you are hiring elsewhere in Uganda, tell us about the role and we will be honest about whether we can help.',
      },
      {
        question: 'How long does recruitment take?',
        answer:
          'It depends on the role, the number of people you need and how specific the requirements are. We agree a realistic timeline with you when we discuss your brief.',
      },
      {
        question: 'Who makes the final hiring decision?',
        answer: 'You do. We introduce candidates who match your requirements, and you decide who to hire.',
      },
    ],
  },
  {
    title: 'Restaurant Staff Recruitment',
    slug: 'restaurant-staff-recruitment',
    parentSlug: 'hospitality-recruitment',
    order: 20,
    summary:
      'Waiters, waitresses, baristas, cooks, kitchen assistants and restaurant supervisors, screened against the standards your restaurant sets.',
    meta: {
      title: 'Restaurant Staff Recruitment in Kampala',
      description:
        'Recruit waiters, waitresses, baristas, cooks and restaurant supervisors in Kampala. Job Link Uganda screens candidates against your restaurant’s requirements before you interview.',
    },
    relatedJobCategorySlugs: ['restaurant', 'kitchen', 'bar-and-cafe'],
    body: `
A restaurant is judged on every table, every shift. Service staff need to be reliable, presentable and good with guests; kitchen staff need to work fast and keep standards under pressure. Job Link Uganda has practical experience recruiting for restaurants in Kampala, and we recruit with those realities in mind.

## Restaurant roles we recruit for

- **Service:** waiters, waitresses, hosts and hostesses
- **Bar and café:** baristas and bartenders
- **Kitchen:** cooks, kitchen assistants and kitchen stewards
- **Supervision:** restaurant supervisors and shift leaders

## What we look at when screening restaurant candidates

Every restaurant is different, so screening follows your brief. For restaurant roles it usually covers:

- **Relevant experience**, for example in a busy restaurant, café or hotel dining room
- **Availability** for your opening hours, including evenings, weekends and public holidays if needed
- **Presentation and communication**, especially for guest-facing roles
- **Practical requirements** you set, such as menu knowledge, till experience or food hygiene awareness

## Recruiting for a new opening or a whole team?

If you are opening a new restaurant or rebuilding a team, tell us how many people you need in each role and when. Recruiting several roles together lets us plan the process around your opening date.

## Before you contact us

Our guide on [writing a job description for restaurant staff](/career-resources/job-description-for-restaurant-staff) explains what candidates look for in a vacancy and what to include, whether you recruit through us or on your own.
`,
    faqs: [
      {
        question: 'Can you recruit several restaurant roles at once?',
        answer:
          'Yes. Tell us how many people you need in each role and your target start date, and we will plan the recruitment around it.',
      },
      {
        question: 'Can I interview candidates before deciding?',
        answer: 'Yes. You interview the candidates we introduce and make the final hiring decision.',
      },
    ],
  },
  {
    title: 'Hotel Staff Recruitment',
    slug: 'hotel-staff-recruitment',
    parentSlug: 'hospitality-recruitment',
    order: 30,
    summary:
      'Front desk, housekeeping and food-and-beverage staff for hotels, guesthouses and lodges, recruited to your service standards.',
    meta: {
      title: 'Hotel Staff Recruitment in Kampala',
      description:
        'Recruit hotel receptionists, housekeeping and restaurant and bar staff in Kampala. Job Link Uganda screens candidates against your hotel’s service standards.',
    },
    relatedJobCategorySlugs: ['hotel'],
    body: `
Hotels run around the clock, and guests notice every part of their stay. Job Link Uganda recruits hotel staff for guest-facing and back-of-house roles, applying the same careful screening we use across hospitality.

## Hotel roles we recruit for

- **Front office:** receptionists and front desk staff
- **Housekeeping:** room attendants and housekeeping staff
- **Food and beverage:** restaurant, bar and room-service staff
- **Kitchen:** cooks and kitchen assistants
- **Supervision:** shift supervisors in the departments above

## Screening for hotel roles

Screening follows your brief. For hotel roles it usually includes relevant experience, availability for shift and weekend work, and, for guest-facing positions, communication and presentation. If a role needs specific skills, such as reservation-system experience or a language, include it in your brief and we will screen for it.

## Working hours and live-in roles

Tell us the shift pattern and whether accommodation or meals are provided. Candidates need this information to decide whether a role is right for them, and it helps us find people who can commit to it.
`,
    faqs: [
      {
        question: 'Can you recruit for night shifts?',
        answer:
          'Yes. Include the shift pattern in your brief and we will only put forward candidates who are available for it.',
      },
    ],
  },
  {
    title: 'General Recruitment',
    slug: 'general-recruitment',
    order: 40,
    summary:
      'Sourcing and screening for roles beyond hospitality, including sales, office and administration, cleaning and general work.',
    meta: {
      title: 'Staff Recruitment Services in Kampala, Uganda',
      description:
        'Staff recruitment in Kampala for sales, office and administration, cleaning and general roles. Job Link Uganda sources and screens candidates against your requirements.',
    },
    relatedJobCategorySlugs: ['sales', 'office-and-administration', 'cleaning-and-facilities', 'general-work'],
    body: `
Hospitality is our specialism, but businesses need good people in every role. Job Link Uganda also recruits staff for other positions, using the same process: understand the brief, find suitable candidates, screen them against your requirements, and introduce a shortlist.

## Roles we recruit for

- **Sales:** sales representatives and shop attendants
- **Office and administration:** receptionists, administrative assistants and office support staff
- **Cleaning and facilities:** cleaners and facilities staff
- **General work:** general workers and assistants for day-to-day operations

## Candidate sourcing and screening

Finding candidates is only half the work. Before anyone reaches your interview, we check them against the requirements you set: experience, skills, availability and anything else essential to the role. This saves you from sifting through applications that were never a good fit.

## Recruitment support for small businesses

Many small businesses do not have an HR team. If you are unsure how to describe a role, what to offer or what to ask in an interview, we can talk it through with you when you send your brief.
`,
    faqs: [
      {
        question: 'Do you only recruit hospitality staff?',
        answer:
          'No. Hospitality is our specialism, but we also recruit for sales, office and administration, cleaning and general roles.',
      },
    ],
  },
]
