import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleCard } from '@/components/cards/ArticleCard'
import { HomeHero } from '@/components/home/HomeHero'
import { ServiceCard } from '@/components/cards/ServiceCard'
import { JobCard } from '@/components/jobs/JobCard'
import { NoJobsState } from '@/components/jobs/NoJobsState'
import { AudienceCta } from '@/components/sections/AudienceCta'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { JsonLd } from '@/components/seo/JsonLd'
import { ArrowLink, ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Photo } from '@/components/ui/Photo'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { business } from '@/config/business'
import { employerReasons, employerSteps, hospitalityRoleGroups, jobSeekerSteps } from '@/content/recruitment'
import { formatUgx, individualPackages, trainingFocusAreas, workplacePackages } from '@/content/training'
import { articlesRepo, jobsRepo, servicesRepo, settingsRepo } from '@/data'
import { categorySlugs, routes, serviceSlugs } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo/metadata'
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/jsonld/organization'

// Featured jobs expire on their own dates; refresh at least every 10 minutes.
export const revalidate = 600

export const metadata: Metadata = buildMetadata({
  title: 'Recruitment Agency in Kampala, Uganda | Job Link Uganda',
  description:
    'Job Link Uganda helps businesses hire screened staff and helps job seekers find genuine vacancies. Specialists in hospitality recruitment in Kampala.',
  path: routes.home(),
  absoluteTitle: true,
})

export default async function HomePage() {
  const [featuredJobs, services, articles, settings] = await Promise.all([
    jobsRepo.listFeatured(4),
    servicesRepo.listPublished(),
    articlesRepo.listPublished({ limit: 3 }),
    settingsRepo.get(),
  ])
  const topLevelServices = services.filter((s) => !s.parentSlug)
  const hospitalityChildren = services.filter((s) => s.parentSlug === serviceSlugs.hospitality)

  return (
    <>
      <JsonLd data={organizationJsonLd(settings)} />
      <JsonLd data={websiteJsonLd()} />

      {/* 01 — Hero */}
      <HomeHero />

      {/* 02 — Two audience pathways */}
      <section aria-labelledby="pathways-heading" className="py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            id="pathways-heading"
            eyebrow="Two ways we help"
            title="Whether you need work or need staff, start here"
            data-aos="fade-up"
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <article className="flex flex-col border border-line bg-surface" data-aos="fade-up">
              <Photo image="jobSeeker" aspect={[3, 2]} sizes="(min-width: 1024px) 45vw, 100vw" reveal className="aspect-[3/2]" />
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h3 className="text-2xl font-extrabold">Looking for a job?</h3>
                <p className="mt-2 text-ink-muted">Find legitimate employment opportunities with employers who are hiring now.</p>
                <ul className="mt-5 space-y-2.5">
                  {[
                    'Vacancies with clear duties, requirements and locations',
                    'Hospitality, restaurant, hotel and other roles',
                    'Practical advice on CVs, interviews and staying safe',
                  ].map((point) => (
                    <li key={point} className="flex gap-3">
                      <Icon name="check" size={20} className="mt-0.5 shrink-0 text-brand-red" />
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap gap-3 pt-8">
                  <ButtonLink href={routes.jobs()} arrow>
                    Browse jobs
                  </ButtonLink>
                  <ButtonLink href={routes.forJobSeekers()} variant="outline">
                    How it works for job seekers
                  </ButtonLink>
                </div>
              </div>
            </article>

            <article className="flex flex-col border border-line bg-surface" data-aos="fade-up" data-aos-delay="100">
              <Photo image="employersPlanning" aspect={[3, 2]} sizes="(min-width: 1024px) 45vw, 100vw" reveal className="aspect-[3/2]" />
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h3 className="text-2xl font-extrabold">Looking for staff?</h3>
                <p className="mt-2 text-ink-muted">Tell Job Link what kind of people your business needs.</p>
                <ul className="mt-5 space-y-2.5">
                  {[
                    'Candidates sourced to match your requirements',
                    'Screening before anyone reaches your interview',
                    'Hospitality and restaurant recruitment experience',
                  ].map((point) => (
                    <li key={point} className="flex gap-3">
                      <Icon name="check" size={20} className="mt-0.5 shrink-0 text-brand-red" />
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap gap-3 pt-8">
                  <ButtonLink href={routes.hireStaff()} variant="dark" arrow>
                    Request staff
                  </ButtonLink>
                  <ButtonLink href={routes.services()} variant="outline">
                    Recruitment services
                  </ButtonLink>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 03 — How it works */}
      <section aria-labelledby="how-heading" className="border-y border-line bg-surface-muted py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            id="how-heading"
            eyebrow="How Job Link works"
            title="A clear process on both sides"
            lead="Recruitment works best when everyone knows what happens next. This is how we work with candidates and with employers."
            data-aos="fade-up"
          />
          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 font-display text-sm font-bold tracking-[0.14em] uppercase">
                <Icon name="users" size={20} className="text-brand-red" /> For job seekers
              </h3>
              <ProcessSteps steps={jobSeekerSteps} className="mt-4" />
            </div>
            <div>
              <h3 className="flex items-center gap-2 font-display text-sm font-bold tracking-[0.14em] uppercase">
                <Icon name="briefcase" size={20} className="text-brand-red" /> For employers
              </h3>
              <ProcessSteps steps={employerSteps} className="mt-4" />
            </div>
          </div>
          <ArrowLink href={routes.howItWorks()} className="mt-8" data-aos="fade-up">
            Read the full recruitment process
          </ArrowLink>
        </div>
      </section>

      {/* 04 — Featured jobs */}
      <section aria-labelledby="jobs-heading" className="py-20 sm:py-24">
        <div className="container-page">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              id="jobs-heading"
              eyebrow="Current vacancies"
              title="Jobs we are recruiting for"
              data-aos="fade-up"
            />
            {featuredJobs.length > 0 && (
              <ArrowLink href={routes.jobs()} className="shrink-0" data-aos="fade-up">
                View all jobs
              </ArrowLink>
            )}
          </div>
          <div className="mt-10">
            {featuredJobs.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2">
                {featuredJobs.map((job, i) => (
                  <div key={job.id} data-aos="fade-up" data-aos-delay={(i % 2) * 100}>
                    <JobCard job={job} />
                  </div>
                ))}
              </div>
            ) : (
              <NoJobsState />
            )}
          </div>
          <nav aria-label="Popular job categories" className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.95rem]" data-aos="fade-up">
            <span className="text-ink-subtle">Popular:</span>
            <Link href={routes.jobCategory(categorySlugs.hospitality)} className="font-semibold underline-offset-4 hover:underline">
              Hospitality jobs
            </Link>
            <Link href={routes.jobCategory(categorySlugs.restaurant)} className="font-semibold underline-offset-4 hover:underline">
              Restaurant jobs
            </Link>
            <Link href={routes.jobCategory(categorySlugs.hotel)} className="font-semibold underline-offset-4 hover:underline">
              Hotel jobs
            </Link>
            <Link href={routes.jobLocation('kampala')} className="font-semibold underline-offset-4 hover:underline">
              Jobs in Kampala
            </Link>
          </nav>
        </div>
      </section>

      {/* 05 — Hospitality recruitment */}
      <section aria-labelledby="hospitality-heading" className="overflow-hidden bg-brand-black py-20 text-white sm:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="grid grid-cols-5 gap-4 self-start">
            <Photo
              image="chef"
              aspect={[4, 5]}
              sizes="(min-width: 1024px) 26vw, 60vw"
              reveal
              className="col-span-3 aspect-[4/5]"
            />
            <Photo
              image="hotelHost"
              aspect={[3, 4]}
              sizes="(min-width: 1024px) 18vw, 40vw"
              reveal
              className="col-span-2 mt-16 aspect-[3/4]"
            />
          </div>
          <div>
            <SectionHeading
              id="hospitality-heading"
              tone="inverse"
              eyebrow="Our specialism"
              title="Hospitality recruitment for restaurants, hotels and service businesses"
              lead="Job Link Uganda has practical recruitment experience with restaurants and hospitality businesses in Kampala. We know how much a good service team depends on reliable people, from the kitchen to the front desk."
              data-aos="fade-up"
            />
            <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {hospitalityRoleGroups.map((group, i) => (
                <div key={group.title} className="border-t border-white/15 pt-4" data-aos="fade-up" data-aos-delay={i * 100}>
                  <h3 className="font-display text-sm font-bold tracking-[0.14em] text-brand-yellow uppercase">{group.title}</h3>
                  <ul className="mt-3 space-y-1.5 text-white/80">
                    {group.roles.map((role) => (
                      <li key={role}>{role}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3" data-aos="fade-up">
              <ButtonLink href={routes.service(serviceSlugs.hospitality)} variant="primary" arrow>
                Hospitality recruitment
              </ButtonLink>
              <ButtonLink href={routes.jobCategory(categorySlugs.hospitality)} variant="outline-light">
                Hospitality jobs
              </ButtonLink>
            </div>
            {hospitalityChildren.length > 0 && (
              <p className="mt-6 text-sm text-white/60" data-aos="fade-up">
                Also see:{' '}
                {hospitalityChildren.map((s, i) => (
                  <span key={s.slug}>
                    {i > 0 && ' · '}
                    <Link href={routes.service(s.slug)} className="text-white underline-offset-4 hover:underline">
                      {s.title}
                    </Link>
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 06 — Hospitality training: the natural next step after hospitality recruitment */}
      <section aria-labelledby="training-heading" className="py-20 sm:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          <div>
            <SectionHeading
              id="training-heading"
              eyebrow="Hospitality training"
              title="Build a more professional hospitality team"
              lead="Practical training for restaurant, hotel and food service workers, through short courses or delivered on site at your business."
              data-aos="fade-up"
            />
            <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {trainingFocusAreas.map((area, i) => (
                <li key={area.title} data-aos="fade-up" data-aos-delay={(i % 2) * 100}>
                  <span aria-hidden="true" className="block h-0.5 w-8 bg-brand-red" />
                  <h3 className="mt-3 text-lg font-bold">{area.title}</h3>
                  <p className="mt-1 text-[0.95rem] text-ink-muted">{area.text}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3" data-aos="fade-up">
              <ButtonLink href={routes.bookTraining()} variant="dark" arrow>
                Book workplace training
              </ButtonLink>
              <ButtonLink href={routes.hospitalityTraining()} variant="outline">
                Explore hospitality training
              </ButtonLink>
            </div>
          </div>

          <div className="lg:pt-2">
            <Photo
              image="restaurantTeam"
              aspect={[4, 3]}
              sizes="(min-width: 1024px) 42vw, 100vw"
              reveal
              className="aspect-[4/3]"
            />
            <div className="mt-6 border-l-4 border-brand-yellow bg-surface-muted p-6" data-aos="fade-up">
              <h3 className="text-lg font-bold">Already have a team? We train them where they work.</h3>
              <p className="mt-2 text-[0.95rem] text-ink-muted">
                Our trainers come to your restaurant, hotel or café and train your staff on site, using your own setting
                and menu. Every participant who completes the training receives a Certificate of Completion.
              </p>
              <dl className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-ink-subtle">Workplace training</dt>
                  <dd className="mt-0.5 font-display font-extrabold">
                    From {formatUgx(workplacePackages[0]!.price)}
                    <span className="block font-sans text-sm font-normal text-ink-muted">for up to 10 staff</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-subtle">Individual courses</dt>
                  <dd className="mt-0.5 font-display font-extrabold">
                    From {formatUgx(individualPackages[0]!.price)}
                    <span className="block font-sans text-sm font-normal text-ink-muted">per person</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* 07 — Recruitment services */}
      {topLevelServices.length > 0 && (
        <section aria-labelledby="services-heading" className="py-20 sm:py-24">
          <div className="container-page">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                id="services-heading"
                eyebrow="For employers"
                title="Recruitment services"
                lead="Every assignment starts with your requirements. These are the ways we can help you hire."
                data-aos="fade-up"
              />
              <ArrowLink href={routes.services()} className="shrink-0" data-aos="fade-up">
                All services
              </ArrowLink>
            </div>
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {services.slice(0, 6).map((service, i) => (
                <ServiceCard key={service.slug} service={service} index={i % 3} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 08 — Why businesses work with Job Link */}
      <section aria-labelledby="why-heading" className="border-y border-line bg-surface-muted py-20 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.4fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              id="why-heading"
              eyebrow="Why employers work with us"
              title="Recruitment built around your requirements"
              lead="No inflated promises. Just a careful process that respects your time and your standards."
              data-aos="fade-up"
            />
            <ButtonLink href={routes.hireStaff()} variant="dark" arrow className="mt-8" data-aos="fade-up">
              Talk to our recruitment team
            </ButtonLink>
          </div>
          <ul className="grid gap-px bg-line sm:grid-cols-2">
            {employerReasons.map((reason, i) => (
              <li key={reason.title} className="bg-surface-muted p-6" data-aos="fade-up" data-aos-delay={(i % 2) * 100}>
                <span aria-hidden="true" className="block h-0.5 w-8 bg-brand-red" />
                <h3 className="mt-4 text-lg font-bold">{reason.title}</h3>
                <p className="mt-2 text-ink-muted">{reason.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 09 — Career resources */}
      <section aria-labelledby="resources-heading" className="py-20 sm:py-24">
        <div className="container-page">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              id="resources-heading"
              eyebrow="Career resources"
              title="Practical advice for job seekers"
              lead="Guidance on CVs, interviews, finding work in Uganda and recognising genuine opportunities."
              data-aos="fade-up"
            />
            <ArrowLink href={routes.careerResources()} className="shrink-0" data-aos="fade-up">
              All resources
            </ArrowLink>
          </div>
          {articles.items.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {articles.items.map((article, i) => (
                <ArticleCard key={article.slug} article={article} index={i} />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-ink-muted">New guides are being prepared.</p>
          )}
        </div>
      </section>

      {/* 10 — Transparency */}
      <section aria-labelledby="transparency-heading" className="border-t border-line bg-surface-muted py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            id="transparency-heading"
            eyebrow="Recruitment transparency"
            title="Know how recruitment should work"
            lead="Legitimate recruitment is open about its process. We explain ours in full, so candidates and employers can hold us, and anyone else, to that standard."
            data-aos="fade-up"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'How recruitment works', text: 'Each stage of our process, from the first brief to the hiring decision.', href: routes.howItWorks(), icon: 'document' as const },
              { title: 'What employers can expect', text: 'What we need from you, what we do, and what you receive.', href: `${routes.howItWorks()}#employers`, icon: 'briefcase' as const },
              { title: 'What candidates can expect', text: 'How applications are handled and how we keep in touch.', href: routes.forJobSeekers(), icon: 'users' as const },
              { title: 'Recognising genuine opportunities', text: 'Practical checks that help you avoid recruitment scams.', href: routes.recruitmentSafety(), icon: 'shield' as const },
            ].map((item, i) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex flex-col border border-line bg-surface p-6 transition-colors duration-300 hover:border-ink" data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <Icon name={item.icon} size={26} className="text-brand-red" />
                <h3 className="mt-4 text-lg font-bold group-hover:underline group-hover:underline-offset-4">{item.title}</h3>
                <p className="mt-2 text-[0.95rem] text-ink-muted">{item.text}</p>
              </Link>
            ))}
          </div>
          {(business.fees.candidates || business.fees.employers) && (
            <div className="mt-8 border-l-4 border-brand-yellow bg-surface p-5" data-aos="fade-up">
              <h3 className="font-bold">Fees</h3>
              {business.fees.candidates && <p className="mt-1 text-ink-muted">{business.fees.candidates}</p>}
              {business.fees.employers && <p className="mt-1 text-ink-muted">{business.fees.employers}</p>}
            </div>
          )}
        </div>
      </section>

      {/* 11 — Final CTA */}
      <AudienceCta />
    </>
  )
}
