/**
 * Hospitality training: the service as offered by Job Link Uganda.
 *
 * Programme content, packages and prices were supplied by the business on
 * 2026-10-02. They are Job Link Uganda's own training prices, not official or
 * industry fees. The certificate is a Job Link Uganda Certificate of
 * Completion: never describe it as accredited or government-recognised unless
 * verified documentation is added to src/config/business.ts.
 */

export type TrainingModule = { title: string; topics: string[] }

/** The full curriculum. Each programme draws on these modules. */
export const trainingModules: TrainingModule[] = [
  {
    title: 'Hospitality professionalism',
    topics: ['Professional conduct and attitude', 'Personal responsibility and discipline', 'Time management', 'Teamwork', 'Workplace ethics'],
  },
  {
    title: 'Customer service excellence',
    topics: [
      'Understanding guest expectations',
      'Welcoming guests and professional communication',
      'Active listening',
      'Handling difficult guests and complaints',
      'Service recovery',
    ],
  },
  {
    title: 'Food & beverage service',
    topics: [
      'Table setup and service standards',
      'Taking orders accurately',
      'Menu knowledge',
      'Serving and clearing techniques',
      'Bill handling',
    ],
  },
  {
    title: 'Food safety & hygiene',
    topics: [
      'Personal and hand hygiene',
      'Uniforms and grooming',
      'Preventing food contamination',
      'Safe food handling and storage',
      'Cleaning and sanitation',
    ],
  },
  {
    title: 'Restaurant operations',
    topics: ['Opening and closing procedures', 'Station preparation', 'Order accuracy and service flow', 'Order systems and stock awareness', 'Reducing waste'],
  },
  {
    title: 'Hotel front office',
    topics: ['Guest reception', 'Check-in and check-out', 'Reservations', 'Telephone etiquette', 'Handling guest requests'],
  },
  {
    title: 'Housekeeping',
    topics: ['Room preparation', 'Cleaning standards', 'Linen handling', 'Guest privacy', 'Room inspection'],
  },
  {
    title: 'Barista & beverage service',
    topics: ['Coffee fundamentals', 'Beverage preparation and presentation', 'Equipment hygiene', 'Beverage service standards'],
  },
  {
    title: 'Workplace communication',
    topics: ['Communication between departments', 'Shift handovers', 'Managing conflict', 'Working under pressure'],
  },
  {
    title: 'Sales & upselling',
    topics: ['Understanding what guests want', 'Suggestive selling and menu recommendations', 'Cross-selling', 'Selling without pressuring guests'],
  },
  {
    title: 'Health, safety & responsibility',
    topics: ['Basic workplace safety', 'Preventing accidents', 'Safe work practices', 'Emergency awareness'],
  },
  {
    title: 'Practical assessment',
    topics: ['Participants demonstrate the skills for their role', 'Feedback on what to keep improving'],
  },
]

/** The four areas we lead with in summaries (home page, page intro). */
export const trainingFocusAreas = [
  { title: 'Customer service', text: 'Welcoming guests, communicating clearly and handling complaints calmly.' },
  { title: 'Food & beverage service', text: 'Table setup, order taking, menu knowledge and serving standards.' },
  { title: 'Food safety & hygiene', text: 'Personal hygiene, safe food handling, cleaning and storage.' },
  { title: 'Workplace professionalism', text: 'Discipline, grooming, teamwork and reliability on every shift.' },
]

export type RoleTrack = { role: string; focus: string[] }

export const restaurantRoleTracks: RoleTrack[] = [
  {
    role: 'Waiters and waitresses',
    focus: ['Customer care', 'Table service and order taking', 'Menu knowledge', 'Upselling', 'Complaint handling', 'Professional grooming'],
  },
  {
    role: 'Restaurant supervisors',
    focus: ['Team leadership', 'Shift management', 'Service quality', 'Staff discipline', 'Handling complaints', 'Stock awareness'],
  },
  {
    role: 'Kitchen staff',
    focus: ['Food safety and hygiene', 'Kitchen discipline', 'Preparation standards', 'Waste control', 'Team communication'],
  },
  {
    role: 'Baristas',
    focus: ['Beverage preparation', 'Coffee service', 'Equipment care and hygiene', 'Customer service', 'Upselling'],
  },
]

export const hotelRoleTracks: RoleTrack[] = [
  {
    role: 'Front office and reception',
    focus: ['Guest reception', 'Reservations', 'Telephone etiquette', 'Guest communication', 'Complaint handling'],
  },
  {
    role: 'Housekeeping',
    focus: ['Cleaning standards', 'Room preparation', 'Hygiene', 'Guest privacy', 'Inspection standards'],
  },
]

export const deliveryModes = [
  {
    title: 'Individual training',
    text: 'For people who want to start or grow a career in hospitality, and for working staff who want to improve their skills.',
  },
  {
    title: 'Group training',
    text: 'For groups of hospitality workers who want to train together. Tell us the group size and the skills you need, and we will prepare a quotation.',
  },
  {
    title: 'Workplace training',
    text: 'Our trainers come to your restaurant, hotel or café and train your staff on site, using your own setting, menu and way of working.',
  },
]

/** How on-site training runs, from first contact to certificates. */
export const workplaceSteps = [
  { title: 'Tell us about your team', text: 'Which staff, how many, and the problems you want training to solve.' },
  { title: 'Training needs assessment', text: 'We look at how your team works now and agree the modules and focus areas.' },
  { title: 'Agree the schedule', text: 'Dates and times are planned around your service, so the business keeps running.' },
  { title: 'On-site training', text: 'Practical sessions at your premises, using your own tables, menu and equipment.' },
  { title: 'Assessment and certificates', text: 'Each participant is assessed in practice and receives a Certificate of Completion.' },
]

export type TrainingPackage = {
  /** Stable id: used in enquiries and structured data. Never rename once live. */
  id: string
  name: string
  /** Price in Uganda shillings. */
  price: number
  /** Shown after the price, e.g. "per person". */
  priceUnit: string
  duration: string
  /** Workplace packages only. */
  groupSize?: string
  suitableFor: string[]
  includes: string[]
}

export const individualPackages: TrainingPackage[] = [
  {
    id: 'hospitality-essentials',
    name: 'Hospitality Essentials',
    price: 150_000,
    priceUnit: 'per person',
    duration: '2 days',
    suitableFor: ['New hospitality workers', 'Waiters and waitresses', 'Restaurant attendants', 'Hospitality job seekers'],
    includes: [
      'Hospitality professionalism',
      'Customer service',
      'Communication',
      'Grooming',
      'Basic food safety',
      'Service standards',
      'Practical assessment',
      'Certificate of Completion',
    ],
  },
  {
    id: 'hospitality-professional',
    name: 'Hospitality Professional',
    price: 300_000,
    priceUnit: 'per person',
    duration: '4 days',
    suitableFor: ['Working restaurant staff', 'Hotel staff', 'Experienced workers who want to upskill'],
    includes: [
      'Customer service excellence',
      'Food & beverage service',
      'Complaint handling',
      'Food safety & hygiene',
      'Upselling',
      'Teamwork and workplace communication',
      'Practical assessment',
      'Certificate of Completion',
    ],
  },
  {
    id: 'hospitality-professional-plus',
    name: 'Hospitality Professional Plus',
    price: 450_000,
    priceUnit: 'per person',
    duration: '5 days',
    suitableFor: ['Hospitality professionals', 'Supervisors', 'Workers who want broader skills'],
    includes: [
      'Customer service',
      'Food & beverage operations',
      'Hospitality professionalism',
      'Food safety',
      'Sales & upselling',
      'Workplace communication',
      'Department-specific skills',
      'Supervisory fundamentals',
      'Practical assessment',
      'Certificate of Completion',
    ],
  },
]

export const workplacePackages: TrainingPackage[] = [
  {
    id: 'workplace-starter',
    name: 'Workplace Starter',
    price: 1_200_000,
    priceUnit: 'per team',
    duration: '2 days on site',
    groupSize: 'Up to 10 staff',
    suitableFor: ['Small restaurants', 'Cafés', 'Small hospitality teams'],
    includes: [
      'Training needs assessment',
      'Customer service',
      'Professionalism',
      'Hygiene',
      'Department-specific service skills',
      'Practical assessment',
      'Certificates of Completion',
    ],
  },
  {
    id: 'workplace-professional',
    name: 'Workplace Professional',
    price: 1_800_000,
    priceUnit: 'per team',
    duration: '3 days on site',
    groupSize: 'Up to 15 staff',
    suitableFor: ['Restaurants and hotels with several departments'],
    includes: [
      'Training needs assessment',
      'Customer service',
      'Food & beverage service',
      'Food safety',
      'Team communication',
      'Upselling',
      'Role-specific modules',
      'Practical assessment',
      'Certificates of Completion',
    ],
  },
  {
    id: 'workplace-premium',
    name: 'Workplace Premium',
    price: 2_500_000,
    priceUnit: 'per team',
    duration: '5 days on site',
    groupSize: 'Up to 20 staff',
    suitableFor: ['Larger restaurants and hotels', 'Teams that need a customised programme'],
    includes: [
      'Full training needs assessment',
      'Customised curriculum',
      'Customer service',
      'Food & beverage',
      'Food safety',
      'Hospitality professionalism',
      'Sales & upselling',
      'Department-specific modules',
      'Supervisory and team leadership module',
      'Practical assessments',
      'Certificates of Completion',
      'Post-training performance recommendations',
    ],
  },
]

export const allTrainingPackages = [...individualPackages, ...workplacePackages]

export const formatUgx = (amount: number) => `UGX ${new Intl.NumberFormat('en-UG').format(amount)}`

/** Answers describe the service exactly as offered; no accreditation claims. */
export const trainingFaqs = [
  {
    question: 'What hospitality training does Job Link Uganda offer?',
    answer:
      'Practical short training for people who work, or want to work, in restaurants, hotels, cafés, bars and catering. It covers customer service, food and beverage service, food safety and hygiene, professionalism, workplace communication and upselling, with role-specific modules for front office, housekeeping, kitchen and barista teams.',
  },
  {
    question: 'Can you train our restaurant or hotel staff at our workplace?',
    answer:
      'Yes. Workplace training is a core part of the service. Our trainers come to your premises and train your staff in their own setting, with sessions planned around your opening hours. Every workplace package starts with a training needs assessment so the training matches your business.',
  },
  {
    question: 'Do participants receive a certificate?',
    answer:
      'Participants who complete their training and the practical assessment receive a Job Link Uganda Certificate of Completion. It confirms the training they completed with us. It is not a government, UVTAB or other accredited qualification.',
  },
  {
    question: 'How long does hospitality training take?',
    answer:
      'Individual programmes run for 2, 4 or 5 days. Workplace packages run on site for 2, 3 or 5 days, depending on the package and the number of staff.',
  },
  {
    question: 'How much does hospitality training cost?',
    answer:
      'Individual training costs UGX 150,000 (Hospitality Essentials), UGX 300,000 (Hospitality Professional) or UGX 450,000 (Hospitality Professional Plus) per person. Workplace training costs UGX 1,200,000 for up to 10 staff, UGX 1,800,000 for up to 15 staff and UGX 2,500,000 for up to 20 staff. For larger teams we prepare a quotation.',
  },
  {
    question: 'Do you train waiters, supervisors, kitchen staff and hotel teams?',
    answer:
      'Yes. Training is adapted to each role: table service and menu knowledge for waiters and waitresses, leadership and shift management for supervisors, food safety and preparation standards for kitchen staff, and reception or housekeeping standards for hotel teams.',
  },
  {
    question: 'Can the training be customised for our business?',
    answer:
      'Yes. Workplace training is built around your team, your service style and the areas you want to improve. The Workplace Premium package includes a fully customised curriculum and recommendations after the training.',
  },
  {
    question: 'Is the training practical or classroom-based?',
    answer:
      'Practical. Participants learn by doing the tasks of their role, and every programme ends with a practical assessment rather than only a written test.',
  },
]
