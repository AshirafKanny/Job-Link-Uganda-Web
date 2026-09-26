import { Montserrat } from 'next/font/google'
import type { BasePayload, TypedUser } from 'payload'
import type { CSSProperties, ReactNode } from 'react'
import { analyticsRepo, jobsRepo, settingsRepo, type AnalyticsSummary } from '@/data'
import { getJobLifecycle, getValidThrough } from '@/domain/jobs/lifecycle'
import { percentChange, sourceName } from '@/domain/analytics'
import { missingSettings } from '@/domain/settings/types'
import { routes } from '@/lib/routes'
import styles from './dashboard.module.css'
import { TrafficChart } from './TrafficChart'

const display = Montserrat({ subsets: ['latin'], weight: ['700', '800'], display: 'swap' })

const RANGES = [7, 30, 90] as const
const num = new Intl.NumberFormat('en-UG')
const shortDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'Africa/Kampala' })

type Props = {
  payload: BasePayload
  user: TypedUser | null
  searchParams?: Record<string, string | string[] | undefined>
}

const ADMIN = '/admin'
const jobsListUrl = `${ADMIN}/collections/jobs`
const requestsUrl = `${ADMIN}/collections/recruitment-requests`

/** Server-rendered per request, so reading the clock here is intentional. */
function requestTime() {
  return Date.now()
}

function greeting() {
  const hour = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Africa/Kampala' }).format(new Date()))
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
}

function Delta({ current, previous }: { current: number; previous: number }) {
  const change = percentChange(current, previous)
  if (change === null) return <p className={styles.tileMeta}>New this period</p>
  if (change === 0) return <p className={styles.tileMeta}>No change vs previous period</p>
  const up = change > 0
  return (
    <p className={styles.tileMeta}>
      <span className={up ? styles.up : styles.down}>
        {up ? '▲' : '▼'} {Math.abs(change)}%
      </span>{' '}
      vs previous period
    </p>
  )
}

function Tile({ label, value, meta, href, accent }: { label: string; value: number | string; meta?: ReactNode; href?: string; accent?: string }) {
  const content = (
    <>
      <p className={styles.tileLabel}>{label}</p>
      <p className={styles.tileValue}>{typeof value === 'number' ? num.format(value) : value}</p>
      {meta}
    </>
  )
  const style = accent ? ({ '--accent': accent } as CSSProperties) : undefined
  return href ? (
    <a href={href} className={styles.tile} style={style}>
      {content}
    </a>
  ) : (
    <div className={styles.tile} style={style}>
      {content}
    </div>
  )
}

function BarList({
  rows,
  empty,
  color,
}: {
  rows: { key: string; label: string; href?: string; value: number; extra?: string }[]
  empty: string
  color?: string
}) {
  if (rows.length === 0) return <p className={styles.empty}>{empty}</p>
  const max = Math.max(...rows.map((r) => r.value), 1)
  return (
    <ul className={styles.bars} style={color ? ({ '--bar': color } as CSSProperties) : undefined}>
      {rows.map((r) => (
        <li key={r.key} className={styles.barRow} title={`${r.label}: ${num.format(r.value)}`}>
          {r.href ? (
            <a href={r.href} className={styles.barLabel}>
              {r.label}
            </a>
          ) : (
            <span className={styles.barLabel}>{r.label}</span>
          )}
          <span className={styles.barValue}>
            {num.format(r.value)} {r.extra && <small>{r.extra}</small>}
          </span>
          <span className={styles.barTrack} aria-hidden="true">
            <span className={styles.barFill} style={{ display: 'block', width: `${(r.value / max) * 100}%` }} />
          </span>
        </li>
      ))}
    </ul>
  )
}

const STATUS: Record<string, { label: string; dot: string }> = {
  new: { label: 'New', dot: '#d91519' },
  contacted: { label: 'Contacted', dot: '#fec106' },
  'in-progress': { label: 'In progress', dot: '#2563eb' },
  closed: { label: 'Closed', dot: '#9ca3af' },
}

const DEVICE_LABEL = { mobile: 'Mobile', tablet: 'Tablet', desktop: 'Desktop' } as const

/**
 * Admin home: recruitment overview, anonymous website traffic, latest
 * enquiries and jobs closing soon. Role-aware: editors see content actions
 * only; traffic and enquiries are for admins and recruiters.
 */
export async function Dashboard({ payload, user, searchParams }: Props) {
  const roles = ((user as { roles?: string[] } | null)?.roles ?? []) as string[]
  const canSeeRecruitment = roles.includes('admin') || roles.includes('recruiter')
  const isAdmin = roles.includes('admin')
  const rawRange = Number(Array.isArray(searchParams?.range) ? searchParams?.range[0] : searchParams?.range)
  const range = (RANGES as readonly number[]).includes(rawRange) ? rawRange : 30
  const name = (user as { displayName?: string | null; email?: string } | null)?.displayName || user?.email?.split('@')[0] || 'there'

  const now = requestTime()
  const rangeStart = new Date(now - range * 86_400_000).toISOString()

  const [markedOpen, counts, openJobs, drafts, newRequests, periodRequests, latestRequests, settings, analytics] = await Promise.all([
    payload.find({
      collection: 'jobs',
      where: { status: { equals: 'open' } },
      depth: 0,
      limit: 100,
      overrideAccess: true,
      select: { title: true, publishedAt: true, closingDate: true, createdAt: true },
    }),
    jobsRepo.openCounts(),
    jobsRepo.listOpen({}),
    payload.count({ collection: 'jobs', where: { status: { equals: 'draft' } }, overrideAccess: true }),
    canSeeRecruitment
      ? payload.count({ collection: 'recruitment-requests', where: { status: { equals: 'new' } }, overrideAccess: true })
      : Promise.resolve({ totalDocs: 0 }),
    canSeeRecruitment
      ? payload.count({ collection: 'recruitment-requests', where: { createdAt: { greater_than: rangeStart } }, overrideAccess: true })
      : Promise.resolve({ totalDocs: 0 }),
    canSeeRecruitment
      ? payload.find({ collection: 'recruitment-requests', sort: '-createdAt', limit: 5, depth: 0, overrideAccess: true })
      : Promise.resolve({ docs: [] as never[] }),
    settingsRepo.get(),
    canSeeRecruitment ? analyticsRepo.summary(range).catch(() => null) : Promise.resolve(null),
  ])

  const closingSoon = openJobs.items
    .filter((j) => j.closingDate && getValidThrough(j).getTime() - now < 7 * 86_400_000)
    .sort((a, b) => getValidThrough(a).getTime() - getValidThrough(b).getTime())

  // Marked Open by staff but past their deadline: hidden from the site, so flag them.
  const expired = markedOpen.docs.filter(
    (j) =>
      getJobLifecycle(
        {
          status: 'open',
          closeReason: null,
          datePosted: j.publishedAt ?? j.createdAt,
          closingDate: j.closingDate ?? null,
          closedAt: null,
          retirement: 'gone',
          category: { name: '', slug: '' },
        },
        new Date(now),
      ).state !== 'open',
  )

  const missing = missingSettings(settings)
  const topJobTitles = await jobTitles(payload, analytics)

  return (
    <div className={styles.root}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <p className={styles.eyebrow}>Job Link Uganda admin</p>
            <h1 className={`${styles.greeting} ${display.className}`}>
              {greeting()}, {name}
            </h1>
            <p className={styles.heroSub}>Here is what is happening across your jobs, enquiries and website.</p>
          </div>
          <div className={styles.actions}>
            {canSeeRecruitment && (
              <a href={`${jobsListUrl}/create`} className={styles.btn}>
                + Post a job
              </a>
            )}
            {!canSeeRecruitment && (
              <a href={`${ADMIN}/collections/articles/create`} className={styles.btn}>
                + Write an article
              </a>
            )}
            <a href="/" target="_blank" rel="noopener" className={styles.btnGhost}>
              View website ↗
            </a>
          </div>
        </div>
      </header>

      {isAdmin && missing.length > 0 && (
        <div className={styles.notice} role="note">
          <div>
            <strong>Finish setting up the website</strong>
            <span>Not yet added: {missing.join(', ')}. These are hidden on the site until you add them.</span>
          </div>
          <a href={`${ADMIN}/globals/site-settings`} className={styles.textLink}>
            Open Site Settings →
          </a>
        </div>
      )}

      <section className={styles.section} aria-labelledby="dash-recruitment">
        <div className={styles.sectionHead}>
          <h2 id="dash-recruitment" className={`${styles.sectionTitle} ${display.className}`}>
            Recruitment
          </h2>
        </div>
        <div className={styles.tiles}>
          <Tile label="Open vacancies" value={counts.total} href={`${jobsListUrl}?where[status][equals]=open`} meta={<p className={styles.tileMeta}>Live on the website now</p>} />
          <Tile
            label="Closing within 7 days"
            value={closingSoon.length}
            accent="#fec106"
            meta={<p className={styles.tileMeta}>{closingSoon.length ? 'Extend or close them' : 'Nothing urgent'}</p>}
          />
          {canSeeRecruitment && (
            <Tile
              label="New enquiries"
              value={newRequests.totalDocs}
              href={`${requestsUrl}?where[status][equals]=new`}
              accent="var(--jl-ink-mark)"
              meta={<p className={styles.tileMeta}>{newRequests.totalDocs ? 'Waiting for a reply' : 'All caught up'}</p>}
            />
          )}
          <Tile
            label="Draft jobs"
            value={drafts.totalDocs}
            href={`${jobsListUrl}?where[status][equals]=draft`}
            accent="#9ca3af"
            meta={<p className={styles.tileMeta}>Not yet published</p>}
          />
        </div>
      </section>

      {canSeeRecruitment && analytics && (
        <section className={styles.section} aria-labelledby="dash-traffic">
          <div className={styles.sectionHead}>
            <h2 id="dash-traffic" className={`${styles.sectionTitle} ${display.className}`}>
              Website traffic
            </h2>
            <nav className={styles.range} aria-label="Date range">
              {RANGES.map((r) => (
                <a key={r} href={`${ADMIN}?range=${r}`} aria-current={r === range ? 'true' : undefined}>
                  {r} days
                </a>
              ))}
            </nav>
          </div>

          <div className={styles.tiles}>
            <Tile label="Visitors" value={analytics.totals.visitors} meta={<Delta current={analytics.totals.visitors} previous={analytics.previous.visitors} />} />
            <Tile label="Page views" value={analytics.totals.pageViews} accent="var(--jl-ink-mark)" meta={<Delta current={analytics.totals.pageViews} previous={analytics.previous.pageViews} />} />
            <Tile label="Job views" value={analytics.totals.jobViews} accent="#fec106" meta={<Delta current={analytics.totals.jobViews} previous={analytics.previous.jobViews} />} />
            <Tile
              label="Enquiries received"
              value={periodRequests.totalDocs}
              accent="#9ca3af"
              href={requestsUrl}
              meta={<p className={styles.tileMeta}>In the last {range} days</p>}
            />
          </div>

          <div className={styles.card} style={{ marginTop: '1rem' }}>
            <div className={styles.cardHead}>
              <div>
                <h3 className={styles.cardTitle}>Visitors per day</h3>
                <p className={styles.cardSub}>Last {range} days · hover or use the arrow keys for daily figures</p>
              </div>
            </div>
            <TrafficChart data={analytics.daily} />
          </div>

          <div className={styles.grid2}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <div>
                  <h3 className={styles.cardTitle}>Most viewed jobs</h3>
                  <p className={styles.cardSub}>Views, with unique visitors alongside</p>
                </div>
              </div>
              <BarList
                empty="No job views in this period yet."
                rows={analytics.topJobs.map((j) => ({
                  key: j.ref,
                  label: topJobTitles.get(j.ref) ?? `Job JL${j.ref} (deleted)`,
                  href: topJobTitles.has(j.ref) ? `${jobsListUrl}/${j.ref}` : undefined,
                  value: j.views,
                  extra: `${num.format(j.visitors)} visitors`,
                }))}
              />
            </div>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <div>
                  <h3 className={styles.cardTitle}>Where visitors come from</h3>
                  <p className={styles.cardSub}>Page views by traffic source</p>
                </div>
              </div>
              <BarList
                empty="No visits in this period yet."
                color="var(--jl-ink-mark)"
                rows={groupSources(analytics.sources).map((s) => ({ key: s.name, label: s.name, value: s.views }))}
              />
            </div>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <div>
                  <h3 className={styles.cardTitle}>Most visited pages</h3>
                  <p className={styles.cardSub}>Page views</p>
                </div>
              </div>
              <BarList
                empty="No visits in this period yet."
                color="var(--jl-ink-mark)"
                rows={analytics.topPages.map((p) => ({ key: p.path, label: pageLabel(p.path), href: p.path, value: p.views }))}
              />
            </div>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <div>
                  <h3 className={styles.cardTitle}>Devices</h3>
                  <p className={styles.cardSub}>Share of page views</p>
                </div>
              </div>
              <BarList
                empty="No visits in this period yet."
                rows={analytics.devices.map((d) => ({
                  key: d.device,
                  label: DEVICE_LABEL[d.device],
                  value: d.views,
                  extra: `${Math.round((d.views / Math.max(analytics.totals.pageViews, 1)) * 100)}%`,
                }))}
              />
            </div>
          </div>
        </section>
      )}

      <section className={styles.section} aria-labelledby="dash-activity">
        <div className={styles.sectionHead}>
          <h2 id="dash-activity" className={`${styles.sectionTitle} ${display.className}`}>
            Needs attention
          </h2>
        </div>
        <div className={styles.grid2} style={{ marginTop: 0 }}>
          {canSeeRecruitment && (
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>Latest employer enquiries</h3>
                <a href={requestsUrl} className={styles.textLink}>
                  View all →
                </a>
              </div>
              {latestRequests.docs.length === 0 ? (
                <p className={styles.empty}>No enquiries yet. They appear here when employers use the Request staff form.</p>
              ) : (
                <ul className={styles.list}>
                  {latestRequests.docs.map((r) => {
                    const status = STATUS[r.status ?? 'new'] ?? STATUS.new!
                    return (
                      <li key={r.id}>
                        <div className={styles.listMain}>
                          <a href={`${requestsUrl}/${r.id}`}>{r.businessName}</a>
                          <span>
                            {r.rolesNeeded} · {shortDate.format(new Date(r.createdAt))}
                          </span>
                        </div>
                        <span className={styles.badge} style={{ '--dot': status.dot } as CSSProperties}>
                          {status.label}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>Job deadlines</h3>
              <a href={`${jobsListUrl}?where[status][equals]=open`} className={styles.textLink}>
                Open jobs →
              </a>
            </div>
            {expired.length > 0 && (
              <ul className={styles.list} style={{ marginBottom: '1rem' }}>
                {expired.map((j) => (
                  <li key={j.id}>
                    <div className={styles.listMain}>
                      <a href={`${jobsListUrl}/${j.id}`}>{j.title}</a>
                      <span>Marked open, but the closing date has passed, so it is hidden from the website</span>
                    </div>
                    <span className={styles.badge} style={{ '--dot': '#d91519' } as CSSProperties}>
                      Expired
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {closingSoon.length === 0 && expired.length === 0 ? (
              <p className={styles.empty}>No open jobs close in the next 7 days.</p>
            ) : (
              <ul className={styles.list}>
                {closingSoon.map((j) => (
                  <li key={j.id}>
                    <div className={styles.listMain}>
                      <a href={`${jobsListUrl}/${j.id}`}>{j.title}</a>
                      <span>
                        {j.category.name} · {j.location.name}
                      </span>
                    </div>
                    <span className={styles.badge} style={{ '--dot': '#fec106' } as CSSProperties}>
                      Closes {shortDate.format(new Date(j.closingDate!))}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {canSeeRecruitment && (
        <p className={styles.privacy}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z" />
          </svg>
          Visitor statistics are anonymous: no cookies and no personal data are collected, so individual visitors cannot be
          identified. Visits from logged-in staff, bots and people who opt out of tracking are not counted.
        </p>
      )}
    </div>
  )
}

async function jobTitles(payload: BasePayload, analytics: AnalyticsSummary | null) {
  const refs = analytics?.topJobs.map((j) => Number(j.ref)).filter(Number.isFinite) ?? []
  if (refs.length === 0) return new Map<string, string>()
  const { docs } = await payload.find({
    collection: 'jobs',
    where: { id: { in: refs } },
    depth: 0,
    limit: refs.length,
    overrideAccess: true,
    select: { title: true },
  })
  return new Map(docs.map((d) => [String(d.id), d.title]))
}

function groupSources(sources: AnalyticsSummary['sources']) {
  const totals = new Map<string, number>()
  for (const s of sources) totals.set(sourceName(s.host), (totals.get(sourceName(s.host)) ?? 0) + s.views)
  return [...totals.entries()]
    .map(([name, views]) => ({ name, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8)
}

const PAGE_NAMES: Record<string, string> = {
  [routes.home()]: 'Home',
  [routes.jobs()]: 'Jobs',
  [routes.services()]: 'Recruitment services',
  [routes.hireStaff()]: 'Request staff',
  [routes.forJobSeekers()]: 'For job seekers',
  [routes.careerResources()]: 'Career resources',
  [routes.about()]: 'About',
  [routes.contact()]: 'Contact',
}

function pageLabel(path: string) {
  return PAGE_NAMES[path] ?? path
}
