'use client'

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import styles from './dashboard.module.css'

type Point = { date: string; pageViews: number; visitors: number }

/** Drawn at the container's real pixel width, so text never scales with the card. */
const H = 260
const PAD = { top: 12, right: 12, bottom: 28, left: 40 }

const fmtDay = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const fmtFull = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })
const num = new Intl.NumberFormat('en-UG')

/** Rounds the axis maximum up to a clean value (1, 2, 5 × 10ⁿ). */
function niceMax(value: number): number {
  if (value <= 4) return 4
  const exp = 10 ** Math.floor(Math.log10(value))
  const step = [1, 2, 5, 10].find((s) => s * exp >= value / 4)! * exp
  return Math.ceil(value / step) * step
}

/**
 * Visitors per day: single-series area chart in brand red with a crosshair
 * tooltip (pointer and keyboard), recessive grid, and a table view so the
 * values never depend on hovering.
 */
export function TrafficChart({ data }: { data: Point[] }) {
  const [active, setActive] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [W, setW] = useState(760)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => entry && setW(Math.max(280, Math.round(entry.contentRect.width))))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  const titleId = useId()

  const { max, ticks, x, y, line, area } = useMemo(() => {
    const max = niceMax(Math.max(...data.map((d) => d.visitors), 0))
    const ticks = [0, max / 4, max / 2, (max * 3) / 4, max]
    const innerW = W - PAD.left - PAD.right
    const innerH = H - PAD.top - PAD.bottom
    const x = (i: number) => PAD.left + (data.length <= 1 ? innerW / 2 : (i / (data.length - 1)) * innerW)
    const y = (v: number) => PAD.top + innerH - (v / max) * innerH
    const pts = data.map((d, i) => `${x(i).toFixed(1)},${y(d.visitors).toFixed(1)}`)
    const line = `M${pts.join(' L')}`
    const area = `${line} L${x(data.length - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`
    return { max, ticks, x, y, line, area }
  }, [data, W])

  const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(3, Math.floor(W / 110))))
  const total = data.reduce((s, d) => s + d.visitors, 0)

  function onPointer(e: PointerEvent<SVGSVGElement>) {
    const rect = svgRef.current!.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * W
    const innerW = W - PAD.left - PAD.right
    const i = Math.round(((px - PAD.left) / innerW) * (data.length - 1))
    setActive(Math.min(data.length - 1, Math.max(0, i)))
  }

  function onKey(e: KeyboardEvent<SVGSVGElement>) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      setActive((a) => {
        const current = a ?? data.length - 1
        return Math.min(data.length - 1, Math.max(0, current + (e.key === 'ArrowRight' ? 1 : -1)))
      })
    }
    if (e.key === 'Escape') setActive(null)
  }

  const point = active !== null ? data[active] : null

  return (
    <div className={styles.chartWrap} ref={wrapRef}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        className={styles.chartSvg}
        role="img"
        aria-labelledby={titleId}
        tabIndex={0}
        onPointerMove={onPointer}
        onPointerLeave={() => setActive(null)}
        onFocus={() => setActive((a) => a ?? data.length - 1)}
        onBlur={() => setActive(null)}
        onKeyDown={onKey}
      >
        <title id={titleId}>
          {`Visitors per day over the last ${data.length} days: ${num.format(total)} in total. Use the left and right arrow keys to read each day.`}
        </title>

        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--theme-elevation-100)" strokeWidth={1} />
            <text x={PAD.left - 8} y={y(t)} textAnchor="end" dominantBaseline="middle" fontSize={11} fill="var(--theme-elevation-500)">
              {num.format(t)}
            </text>
          </g>
        ))}

        {data.map((d, i) =>
          i % labelEvery === 0 || i === data.length - 1 ? (
            <text
              key={d.date}
              x={x(i)}
              y={H - 8}
              textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'} fontSize={11} fill="var(--theme-elevation-500)">
              {fmtDay.format(new Date(`${d.date}T00:00:00Z`))}
            </text>
          ) : null,
        )}

        <path d={area} fill="#d91519" fillOpacity={0.1} />
        <path d={line} fill="none" stroke="#d91519" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {point && active !== null && (
          <g pointerEvents="none">
            <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={y(0)} stroke="var(--theme-elevation-400)" strokeWidth={1} />
            <circle cx={x(active)} cy={y(point.visitors)} r={5} fill="#d91519" stroke="var(--theme-elevation-0)" strokeWidth={2} />
          </g>
        )}
        {max === 4 && total === 0 && (
          <text x={W / 2} y={H / 2 - 6} textAnchor="middle" fontSize={13} fill="var(--theme-elevation-500)">
            No visits recorded in this period yet
          </text>
        )}
      </svg>

      {point && active !== null && (
        <div
          className={styles.tooltip}
          style={{
            left: `${(x(active) / W) * 100}%`,
            // Anchor inward near the edges so the tooltip never leaves the card.
            transform: x(active) / W > 0.8 ? 'translateX(calc(-100% - 12px))' : x(active) / W < 0.2 ? 'translateX(12px)' : 'translateX(-50%)',
          }}
          role="status"
          aria-live="polite"
        >
          <p className={styles.tooltipDate}>{fmtFull.format(new Date(`${point.date}T00:00:00Z`))}</p>
          <p className={styles.tooltipRow}>
            <span className={styles.key} aria-hidden="true" />
            <strong>{num.format(point.visitors)}</strong> visitors
          </p>
          <p className={styles.tooltipRow}>
            <span className={styles.keyNone} aria-hidden="true" />
            <strong>{num.format(point.pageViews)}</strong> page views
          </p>
        </div>
      )}

      <details className={styles.tableToggle}>
        <summary>Show as table</summary>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Visitors</th>
                <th scope="col">Page views</th>
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().map((d) => (
                <tr key={d.date}>
                  <td>{fmtFull.format(new Date(`${d.date}T00:00:00Z`))}</td>
                  <td>{num.format(d.visitors)}</td>
                  <td>{num.format(d.pageViews)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
