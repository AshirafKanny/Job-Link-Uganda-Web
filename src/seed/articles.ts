/**
 * Launch articles: one per priority cluster. Practical guidance only; no
 * statistics, salary figures or research claims.
 */
export type SeedArticle = {
  title: string
  slug: string
  categorySlug: string
  excerpt: string
  relatedJobCategorySlug?: string
  relatedServiceSlug?: string
  primaryCta: 'jobs' | 'hire-staff' | 'none'
  meta: { title: string; description: string }
  body: string
}

export const seedArticles: SeedArticle[] = [
  {
    title: 'How to Write a CV for Hospitality Jobs in Uganda',
    slug: 'cv-for-hospitality-jobs',
    categorySlug: 'cvs-and-applications',
    relatedJobCategorySlug: 'hospitality',
    primaryCta: 'jobs',
    excerpt:
      'What restaurant and hotel employers look for in a CV, how to structure it on one or two pages, and how to present experience even if your first job was informal.',
    meta: {
      title: 'How to Write a CV for Hospitality Jobs in Uganda',
      description:
        'A practical guide to writing a CV for waiter, waitress, barista, cook and hotel jobs in Uganda: structure, what to include, and common mistakes to avoid.',
    },
    body: `
A hospitality employer usually reads a CV quickly, looking for three things: can this person do the job, will they turn up for their shifts, and will they look after our guests? A good CV answers those questions in the first minute.

## Keep it short and easy to read

One page is enough for most service roles; two pages if you have several years of experience. Use a simple layout with clear headings, one font, and no photos, colours or graphics unless the employer asks for them. Save and send it as a PDF so the layout does not change on the employer's phone.

## What to include

### 1. Contact details

Your full name, a phone number you answer, and an email address you check. A professional email address, ideally based on your name, makes a better impression than a nickname.

### 2. A short profile

Two or three sentences at the top describing who you are and the role you want. For example:

> Friendly and reliable waitress with two years' experience in a busy Kampala restaurant. Comfortable with evening and weekend shifts and handling payments at the table. Looking for a front-of-house role where good service matters.

Change this profile for each role you apply for, so it matches what the employer is asking for.

### 3. Work experience

List your most recent job first. For each role, include the job title, the employer, the town, and the dates you worked there. Then add two to four points on what you did, starting each with an action word:

- Served up to a full section of tables during lunch and dinner shifts
- Took orders and payments accurately using the till system
- Trained new waiting staff on the menu and service standards

Include informal and part-time work too. Helping in a family restaurant, working at events or serving at a café all count as hospitality experience. Describe the work honestly.

### 4. Skills

Hospitality employers value practical skills. Only list the ones you can demonstrate, for example:

- Customer service and handling complaints calmly
- Cash handling and using a till or mobile-money payments
- Food hygiene and safe food handling
- Espresso machine and coffee preparation
- Languages you speak with guests

### 5. Education and training

Your highest qualification, plus any hospitality, catering or food-safety training. Short courses count; include the name of the course, the institution and the year.

### 6. References

Name two people who can confirm your work, ideally former supervisors, with their phone numbers. Ask them before you list them. If you prefer, write "References available on request".

## Mistakes that cost interviews

- **Spelling mistakes.** In a job that involves taking orders accurately, careless errors make a poor impression. Ask someone to read your CV before you send it.
- **Unexplained gaps.** If you took time away from work, a short honest line is better than a gap.
- **Sending the same CV everywhere.** Adjust your profile and skills to match each vacancy.
- **Exaggerating.** Employers check. Stick to what you have actually done.

## Before you apply

Read the vacancy carefully and follow its application instructions exactly. If it asks you to state the job title or a reference number, do so. It shows you pay attention to detail, which is exactly what hospitality employers look for.
`,
  },
  {
    title: 'Restaurant Job Interview Questions and How to Answer Them',
    slug: 'restaurant-interview-questions',
    categorySlug: 'interviews',
    relatedJobCategorySlug: 'restaurant',
    primaryCta: 'jobs',
    excerpt:
      'The questions restaurant employers commonly ask waiters, waitresses and other service staff, what they are really asking, and how to prepare honest, confident answers.',
    meta: {
      title: 'Restaurant Job Interview Questions and Answers',
      description:
        'Common interview questions for waiter, waitress and restaurant jobs, what employers want to hear, and how to prepare. Practical advice for Uganda.',
    },
    body: `
Restaurant interviews are usually short and practical. The interviewer wants to know whether you can serve guests well, work as part of a team, and be relied on for your shifts. Preparing answers to the common questions below will help you speak with confidence.

## Before the interview

- **Know where and when.** Confirm the address and the name of the person you are meeting, and plan to arrive ten minutes early.
- **Look the part.** Clean, neat and simple clothes. For a service role, presentation is part of the job.
- **Learn about the restaurant.** Look at the menu and the type of guests it serves, so you can say why you want to work there.
- **Bring copies**, not originals, of your CV and any certificates.

## Common questions and how to approach them

### "Tell me about yourself."

Keep it to about a minute and make it about work: your experience, what you enjoy about serving people, and why you are applying.

### "Why do you want to work here?"

Show that you have looked at the restaurant. Mention something specific, such as the menu, the atmosphere or its reputation for service, and link it to what you want to do.

### "What would you do if a guest complained about their food?"

The interviewer wants to see that you stay calm and put the guest first. A good answer: listen without interrupting, apologise, offer to fix the problem by informing the kitchen or the supervisor, and check back with the guest afterwards.

### "How do you handle busy periods?"

Give a real example if you have one. Explain how you prioritise: greeting new tables quickly, grouping tasks when you walk through the restaurant, and communicating with the kitchen and your team.

### "Are you available to work evenings, weekends and public holidays?"

Answer honestly. If there are hours you cannot work, say so now. It is better than accepting a job you cannot keep.

### "Tell me about a time you worked as part of a team."

Describe a specific situation: what happened, what you did, and the result. Hospitality is teamwork, so show that you help colleagues when it is busy.

### "Do you have any questions for us?"

Always ask one or two. Good examples: "What would a typical shift look like?" or "How do you train new staff?" You can also ask about working hours and pay if they have not been explained.

## Practical tests

Some restaurants ask candidates to do a short trial, such as carrying plates, describing a dish or making a coffee. Stay calm, move carefully and be polite to everyone, including other staff. They may be asked for their impression of you.

## A note on safety

A genuine employer or recruiter will explain the job, the pay and the working hours clearly. Be cautious if you are asked to pay money to be interviewed or to secure a job. Read our guidance on [recognising genuine opportunities](/recruitment-safety).
`,
  },
  {
    title: 'How to Write a Job Description That Attracts the Right Restaurant Staff',
    slug: 'job-description-for-restaurant-staff',
    categorySlug: 'hiring-advice',
    relatedServiceSlug: 'restaurant-staff-recruitment',
    primaryCta: 'hire-staff',
    excerpt:
      'A clear job description saves restaurant owners and managers time. What to include, what to leave out, and a simple structure you can reuse for every role.',
    meta: {
      title: 'How to Write a Job Description for Restaurant Staff',
      description:
        'A practical guide for restaurant owners and managers in Uganda: how to write a job description that attracts suitable waiters, cooks and supervisors.',
    },
    body: `
When a vacancy says little more than "Waitress needed, apply now", it attracts many applications and few suitable ones. A clear job description does part of the screening for you: the right people recognise themselves in it, and the wrong ones decide not to apply.

## Start with the job title

Use the title candidates actually search for: "Waiter / Waitress", "Restaurant Supervisor", "Barista", "Cook". Avoid internal titles that mean nothing outside your business.

## Describe the role in two or three sentences

Say what the person will do and where. For example:

> We are looking for an experienced waiter or waitress to join our team at a busy family restaurant in Kampala. You will serve guests at lunch and dinner, take orders and payments, and help keep the restaurant clean and welcoming.

## List the main responsibilities

Four to seven points is enough. Be specific:

- Welcome guests and show them to their tables
- Take food and drink orders and serve them promptly
- Handle payments accurately, including mobile money
- Keep your section clean and set up for the next service

## Separate essential requirements from nice-to-haves

This is where most job descriptions fall short. If everything is "required", good candidates who lack one minor skill will not apply, while others will apply anyway.

- **Essential:** at least one year of experience in a restaurant; available for evening and weekend shifts
- **Desirable:** barista skills; experience using a till system

## Be clear about hours, pay and benefits

Candidates want to know the working pattern, how many days a week, and whether there are night shifts. Stating the pay, or at least a range, saves time for both sides and attracts people for whom the job is realistic. Mention meals, transport or accommodation if you provide them.

## Explain how to apply and by when

State exactly what applicants should send, where to send it, and the closing date. If you want a reference number in the message, say so.

## A simple structure to reuse

1. Job title
2. Location and working pattern
3. About the role (two or three sentences)
4. Responsibilities
5. Essential and desirable requirements
6. Pay and benefits
7. How to apply and the closing date

## When to get help

If you need to fill several roles, or you do not have time to sift applications and screen candidates, a recruitment agency can manage that process for you. Job Link Uganda recruits restaurant staff in Kampala. See [restaurant staff recruitment](/recruitment-services/restaurant-staff-recruitment) or [tell us what you need](/hire-staff).
`,
  },
]
