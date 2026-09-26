import 'server-only'
import { sql } from '@payloadcms/db-postgres'
import { site } from '@/config/site'
import type { AnalyticsRepository, AnalyticsTotals } from '../repositories'
import { getPayloadClient } from './client'

/** Raw visits are kept for about 13 months, then removed. */
const RETENTION_DAYS = 400

type Row = Record<string, unknown>

async function query(statement: ReturnType<typeof sql>): Promise<Row[]> {
  const payload = await getPayloadClient()
  // Aggregations run in the database rather than loading every visit into memory.
  const db = payload.db as unknown as { drizzle: { execute: (q: unknown) => Promise<{ rows: Row[] }> } }
  const result = await db.drizzle.execute(statement)
  return result.rows
}

const n = (v: unknown) => Number(v ?? 0)

async function totals(from: Date, to: Date): Promise<AnalyticsTotals> {
  const [row] = await query(sql`
    SELECT count(*) AS page_views,
           count(DISTINCT visitor_id) AS visitors,
           count(*) FILTER (WHERE job_ref IS NOT NULL) AS job_views
    FROM page_views
    WHERE created_at >= ${from.toISOString()} AND created_at < ${to.toISOString()}`)
  return { pageViews: n(row?.page_views), visitors: n(row?.visitors), jobViews: n(row?.job_views) }
}

/** YYYY-MM-DD of a date in Kampala time. */
const kampalaDay = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: site.timeZone }).format(d)

export const payloadAnalyticsRepository: AnalyticsRepository = {
  async recordView(input) {
    const payload = await getPayloadClient()
    await payload.create({ collection: 'page-views', overrideAccess: true, data: input })
    // Occasional housekeeping instead of a scheduler.
    if (Math.random() < 0.01) {
      const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000).toISOString()
      await payload.delete({ collection: 'page-views', overrideAccess: true, where: { createdAt: { less_than: cutoff } } })
    }
  },

  async summary(rangeDays) {
    const now = new Date()
    const from = new Date(now.getTime() - rangeDays * 86_400_000)
    const prevFrom = new Date(from.getTime() - rangeDays * 86_400_000)
    const f = from.toISOString()
    const t = now.toISOString()
    const tz = site.timeZone

    const [current, previous, dailyRows, jobRows, pageRows, sourceRows, deviceRows] = await Promise.all([
      totals(from, now),
      totals(prevFrom, from),
      query(sql`
        SELECT to_char((created_at AT TIME ZONE ${tz})::date, 'YYYY-MM-DD') AS day,
               count(*) AS page_views, count(DISTINCT visitor_id) AS visitors
        FROM page_views WHERE created_at >= ${f} AND created_at < ${t}
        GROUP BY 1 ORDER BY 1`),
      query(sql`
        SELECT job_ref, count(*) AS views, count(DISTINCT visitor_id) AS visitors
        FROM page_views WHERE job_ref IS NOT NULL AND created_at >= ${f} AND created_at < ${t}
        GROUP BY job_ref ORDER BY views DESC LIMIT 8`),
      query(sql`
        SELECT path, count(*) AS views FROM page_views
        WHERE created_at >= ${f} AND created_at < ${t}
        GROUP BY path ORDER BY views DESC LIMIT 8`),
      query(sql`
        SELECT referrer_host, count(*) AS views FROM page_views
        WHERE created_at >= ${f} AND created_at < ${t}
        GROUP BY referrer_host ORDER BY views DESC LIMIT 12`),
      query(sql`
        SELECT device, count(*) AS views FROM page_views
        WHERE created_at >= ${f} AND created_at < ${t}
        GROUP BY device ORDER BY views DESC`),
    ])

    // Zero-fill every day in the range so the chart has no gaps.
    const byDay = new Map(dailyRows.map((r) => [String(r.day), r]))
    const daily = Array.from({ length: rangeDays }, (_, i) => {
      const date = kampalaDay(new Date(now.getTime() - (rangeDays - 1 - i) * 86_400_000))
      const row = byDay.get(date)
      return { date, pageViews: n(row?.page_views), visitors: n(row?.visitors) }
    })

    return {
      rangeDays,
      totals: current,
      previous,
      daily,
      topJobs: jobRows.map((r) => ({ ref: String(r.job_ref), views: n(r.views), visitors: n(r.visitors) })),
      topPages: pageRows.map((r) => ({ path: String(r.path), views: n(r.views) })),
      sources: sourceRows.map((r) => ({ host: (r.referrer_host as string | null) ?? null, views: n(r.views) })),
      devices: deviceRows.map((r) => ({ device: r.device as 'mobile' | 'tablet' | 'desktop', views: n(r.views) })),
    }
  },
}
