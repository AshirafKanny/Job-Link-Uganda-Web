// Milestone QA: responsive overflow, accessibility (axe, WCAG 2.2 AA),
// heading structure, metadata and JSON-LD validity, plus screenshots.
//
// Usage: node scripts/qa.mjs [baseUrl] [path ...]
//   QA_OUT=<dir> to choose where screenshots go (default: ./.qa)
// Uses the locally installed Google Chrome; no browser download needed.
import AxeBuilder from '@axe-core/playwright'
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

const [base = 'http://127.0.0.1:3001', ...paths] = process.argv.slice(2)
const pages = paths.length ? paths : ['/']
const outDir = process.env.QA_OUT || '.qa'
mkdirSync(outDir, { recursive: true })

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]

const browser = await chromium.launch({ channel: 'chrome' })
let failures = 0

for (const pagePath of pages) {
  const slug = pagePath === '/' ? 'home' : pagePath.replace(/^\//, '').replace(/[/?=&]/g, '_')
  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'reduce' })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
    page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`))

    const response = await page.goto(base + pagePath, { waitUntil: 'networkidle' })
    const status = response?.status()
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    const offenders =
      overflow > 0
        ? await page.evaluate(() =>
            [...document.querySelectorAll('body *')]
              .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
              .slice(0, 5)
              .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(' ').slice(0, 3).join('.')}`),
          )
        : []
    await page.screenshot({ path: path.join(outDir, `${slug}-${vp.name}.png`), fullPage: true })

    const line = [`${pagePath} @${vp.name}`, `status ${status}`]
    if (overflow > 0) {
      failures++
      line.push(`OVERFLOW ${overflow}px → ${offenders.join(', ')}`)
    }

    if (vp.name === 'desktop') {
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
      const seo = await page.evaluate(() => {
        const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
          try {
            return JSON.parse(s.textContent || '')['@type']
          } catch {
            return 'INVALID'
          }
        })
        return {
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? null,
          canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
          robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null,
          h1: [...document.querySelectorAll('h1')].map((h) => h.textContent?.trim()),
          jsonLd: ld,
        }
      })
      if (axe.violations.length) failures += axe.violations.length
      if (seo.h1.length !== 1) failures++
      if (seo.jsonLd.includes('INVALID')) failures++
      line.push(`h1=${seo.h1.length}`, `title="${seo.title}"`, `canonical=${seo.canonical}`, `robots=${seo.robots}`)
      line.push(`jsonld=[${seo.jsonLd.join(',')}]`)
      if (!seo.description) line.push('NO DESCRIPTION')
      for (const v of axe.violations) {
        line.push(`\n    AXE ${v.impact} ${v.id}: ${v.help} (${v.nodes.length}) e.g. ${v.nodes[0]?.target.join(' ')}`)
      }
    }
    if (errors.length) {
      failures += errors.length
      line.push(`\n    ${errors.join('\n    ')}`)
    }
    console.log(line.join(' | '))
    await context.close()
  }
}

await browser.close()
console.log(failures ? `\n${failures} issue(s) found` : '\nAll checks passed')
process.exit(failures ? 1 : 0)
