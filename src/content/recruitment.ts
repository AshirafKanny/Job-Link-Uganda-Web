import type { Step } from '@/components/sections/ProcessSteps'

/**
 * Shared recruitment copy. Kept in one place so every page describes the
 * process in the same words. Statements are limited to how the process works;
 * no outcomes, numbers or guarantees are claimed.
 */

export const jobSeekerSteps: Step[] = [
  {
    title: 'Find an opportunity',
    text: 'Browse current vacancies by category, location and type of work. Each one is a role we are recruiting for.',
  },
  {
    title: 'Review the requirements',
    text: 'Read the duties, requirements and working arrangements. Apply for roles that genuinely match your experience.',
  },
  {
    title: 'Follow the application process',
    text: 'Apply exactly as the vacancy describes. Employers ask for different things, so the instructions differ between roles.',
  },
  {
    title: 'Hear from the recruitment team',
    text: 'If your application fits what the employer needs, we contact you about the next step, such as an interview.',
  },
]

export const employerSteps: Step[] = [
  {
    title: 'Tell us what you need',
    text: 'The roles, number of people, location, start date and the standards you expect from new staff.',
  },
  {
    title: 'We identify suitable candidates',
    text: 'We look for people whose experience and availability match the requirements you have set.',
  },
  {
    title: 'Candidates are screened for the role',
    text: 'We check candidates against your requirements before introducing them, so you only meet people who fit the brief.',
  },
  {
    title: 'You decide who to hire',
    text: 'You interview the shortlisted candidates and make the hiring decision. The final choice is always yours.',
  },
]

export const hospitalityRoleGroups: { title: string; roles: string[] }[] = [
  { title: 'Front of house', roles: ['Waiters and waitresses', 'Hosts and hostesses', 'Baristas', 'Bartenders', 'Cashiers'] },
  { title: 'Kitchen', roles: ['Chefs and cooks', 'Kitchen assistants', 'Kitchen stewards'] },
  { title: 'Supervision', roles: ['Restaurant supervisors', 'Shift leaders', 'Floor managers'] },
  { title: 'Hotels', roles: ['Front desk and reception', 'Housekeeping', 'Restaurant and bar service'] },
]

export const employerReasons: { title: string; text: string }[] = [
  {
    title: 'Screening against your requirements',
    text: 'Candidates are checked against the role you described before you spend time interviewing them.',
  },
  {
    title: 'The brief comes first',
    text: 'We discuss the role, the working conditions and your standards before we start looking for anyone.',
  },
  {
    title: 'Hospitality experience',
    text: 'We have practical experience recruiting for restaurants and hospitality businesses, so we understand shift work, service standards and busy kitchens.',
  },
  {
    title: 'Local focus',
    text: 'We recruit in Kampala and understand what candidates here expect from a role and what employers need from them.',
  },
  {
    title: 'A clear process',
    text: 'You know each step, who is responsible for it, and what happens next.',
  },
  {
    title: 'Professional communication',
    text: 'Candidates are told what the role involves and employers get straightforward updates. No surprises for either side.',
  },
]
