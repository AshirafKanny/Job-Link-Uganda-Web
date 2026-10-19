import { describe, expect, it } from 'vitest'
import {
  hasMarkdownTable,
  htmlHasTable,
  isTabSeparatedTable,
  markdownForPlainTextPaste,
  normaliseMarkdownTables,
  tabSeparatedToMarkdown,
  UNSAFE_URL,
} from './detect'

const SAMPLE = `## Hospitality pay guide

Typical starting salaries:

| Job Position | Minimum Qualification | Monthly Salary |
|---|---|---|
| Restaurant Supervisor | Relevant experience and leadership skills | UGX 600,000 |
| Waiter | Good communication and customer service | UGX 280,000 |
| Storekeeper | Stock management and record keeping | UGX 350,000 |
| Sales Executive | Sales experience and communication skills | UGX 800,000 |

Salaries vary by employer.`

describe('Markdown tables (AI "Copy" buttons)', () => {
  it('detects a header row followed by a divider', () => {
    expect(hasMarkdownTable(SAMPLE)).toBe(true)
    expect(hasMarkdownTable('| not | a table |\nno divider here')).toBe(false)
    expect(hasMarkdownTable('A sentence with a | pipe in it.')).toBe(false)
  })

  it('accepts aligned dividers', () => {
    expect(hasMarkdownTable('| a | b |\n|:---|---:|\n| 1 | 2 |')).toBe(true)
  })

  it('keeps every cell and pads short rows without dropping content', () => {
    const out = normaliseMarkdownTables('| A | B | C |\n|---|---|---|\n| 1 | 2 |\n| x | y | z | extra |')
    expect(out).toBe('|A|B|C|\n|---|---|---|\n|1|2||\n|x|y|z / extra|')
  })

  it('leaves the surrounding text and the sample values unchanged', () => {
    const md = markdownForPlainTextPaste(SAMPLE)!
    expect(md).toContain('## Hospitality pay guide')
    expect(md).toContain('Salaries vary by employer.')
    for (const value of ['Restaurant Supervisor', 'UGX 600,000', 'Waiter', 'UGX 280,000', 'Storekeeper', 'UGX 350,000', 'Sales Executive', 'UGX 800,000'])
      expect(md).toContain(value)
  })
})

describe('Tab-separated tables (spreadsheets)', () => {
  const tsv = 'Job Position\tMonthly Salary\nWaiter\tUGX 280,000\nStorekeeper\tUGX 350,000'

  it('detects lines with the same number of tabs', () => {
    expect(isTabSeparatedTable(tsv)).toBe(true)
  })

  it('does not turn prose with stray tabs into a table', () => {
    expect(isTabSeparatedTable('Dear team,\n\tPlease find the notes.\nRegards\tJoy\tand Sam')).toBe(false)
    expect(isTabSeparatedTable('One line\twith a tab')).toBe(false)
  })

  it('converts to a Markdown table with a header row and escapes pipes', () => {
    expect(tabSeparatedToMarkdown('A\tB|C\n1\t2')).toBe('|A|B\\|C|\n|---|---|\n|1|2|')
  })
})

describe('Unsafe links', () => {
  it('turns javascript:/data: Markdown links into plain text, keeping safe links', () => {
    const md = markdownForPlainTextPaste(
      '| A | B |\n|---|---|\n| [click](javascript:alert(1)) | [guide](https://www.joblinkuganda.com) |\n| [x](data:text/html,hi) | y |',
    )!
    expect(md).not.toMatch(/javascript:|data:/i)
    expect(md).toContain('click')
    expect(md).toContain('[guide](https://www.joblinkuganda.com)')
  })

  it('flags unsafe URL schemes', () => {
    expect(UNSAFE_URL.test(' JavaScript:alert(1)')).toBe(true)
    expect(UNSAFE_URL.test('https://example.com')).toBe(false)
  })
})

describe('Decision', () => {
  it('leaves ordinary text alone', () => {
    expect(markdownForPlainTextPaste('Just a normal paragraph.\nAnd another.')).toBeNull()
  })

  it('recognises HTML tables (handled natively by the editor)', () => {
    expect(htmlHasTable('<meta charset="utf-8"><table><tr><td>1</td></tr></table>')).toBe(true)
    expect(htmlHasTable('<p>No table here</p>')).toBe(false)
  })
})
