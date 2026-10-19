import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { describe, expect, it } from 'vitest'
import { tableHTMLConverters } from './table-html'

const text = (t: string, format = 0) => ({ type: 'text', text: t, format, detail: 0, mode: 'normal', style: '', version: 1 })
const para = (...children: unknown[]) => ({ type: 'paragraph', children, direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0 })
const cell = (headerState: number, ...children: unknown[]) => ({
  type: 'tablecell',
  headerState,
  colSpan: 1,
  rowSpan: 1,
  children: [para(...children)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})
const row = (...cells: unknown[]) => ({ type: 'tablerow', children: cells, direction: 'ltr', format: '', indent: 0, version: 1 })

const SAMPLE = [
  ['Restaurant Supervisor', 'Relevant experience and leadership skills', 'UGX 600,000'],
  ['Waiter', 'Good communication and customer service', 'UGX 280,000'],
  ['Storekeeper', 'Stock management and record keeping', 'UGX 350,000'],
  ['Sales Executive', 'Sales experience and communication skills', 'UGX 800,000'],
]

function render(rows: unknown[]) {
  return convertLexicalToHTML({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { root: { type: 'root', children: [{ type: 'table', children: rows, direction: 'ltr', format: '', indent: 0, version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 } } as any,
    disableContainer: true,
    converters: ({ defaultConverters }) => ({ ...defaultConverters, ...tableHTMLConverters }),
  })
}

describe('table HTML', () => {
  const html = render([
    row(cell(1, text('Job Position')), cell(1, text('Minimum Qualification')), cell(1, text('Monthly Salary'))),
    ...SAMPLE.map((r) => row(...r.map((v, i) => cell(0, text(v, i === 2 ? 1 : 0))))),
  ])

  it('wraps the table in a focusable horizontal scroll region', () => {
    expect(html).toMatch(/^<div class="table-scroll" role="region" tabindex="0" aria-label="[^"]+"><table class="content-table">/)
  })

  it('puts the header row in <thead> with column-scoped <th>', () => {
    expect(html).toContain('<thead><tr><th scope="col"><p>Job Position</p></th><th scope="col"><p>Minimum Qualification</p></th><th scope="col"><p>Monthly Salary</p></th></tr></thead>')
  })

  it('renders every body value in order, with inline formatting kept', () => {
    const body = html.split('<tbody>')[1]!
    let last = -1
    for (const value of SAMPLE.flat()) {
      const at = body.indexOf(value)
      expect(at).toBeGreaterThan(last)
      last = at
    }
    expect(body).toContain('<strong>UGX 600,000</strong>')
    expect((body.match(/<tr>/g) ?? []).length).toBe(4)
  })

  it('adds no inline styles', () => {
    expect(html).not.toContain('style=')
  })

  it('escapes text in cells (no script injection)', () => {
    const evil = render([row(cell(0, text('<script>alert(1)</script><img src=x onerror=alert(1)>')))])
    expect(evil).not.toContain('<script>')
    expect(evil).not.toContain('<img')
  })

  it('marks row titles with scope="row" and keeps colspan/rowspan', () => {
    const titled = render([row({ ...cell(2, text('Waiter')), colSpan: 2 }, cell(0, text('UGX 280,000')))])
    expect(titled).toContain('<th scope="row" colspan="2">')
    expect(titled).not.toContain('<thead>')
  })
})
