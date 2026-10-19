/**
 * Plain-text paste detection for tables. Pure functions (no Lexical), unit-tested.
 *
 * When the clipboard carries HTML (select + Ctrl+C in ChatGPT, Claude, Google
 * Docs, Word), Lexical imports <table> elements itself once the table feature
 * is enabled. This module only handles clipboards WITHOUT HTML, mainly the
 * "Copy" buttons of AI tools, which put Markdown on the clipboard:
 *
 *   | Job Position | Monthly Salary |
 *   |---|---|
 *   | Waiter | UGX 280,000 |
 *
 * and tab-separated text copied from spreadsheets. Anything ambiguous is left
 * alone so it pastes as ordinary text.
 */

/** A Markdown pipe-table row: starts and ends with a pipe. */
const PIPE_ROW = /^\s*\|.*\|\s*$/
/** The header divider: | --- | :---: | ---: | */
const PIPE_DIVIDER = /^\s*\|(\s*:?-{3,}:?\s*\|)+\s*$/

/** True when the text contains at least one Markdown table (header row + divider row). */
export function hasMarkdownTable(text: string): boolean {
  const lines = text.split(/\r?\n/)
  return lines.some((line, i) => i > 0 && PIPE_DIVIDER.test(line) && PIPE_ROW.test(lines[i - 1]!))
}

const cellsOf = (row: string) =>
  row
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    // Split on pipes that are not escaped (\|).
    .split(/(?<!\\)\|/)
    .map((c) => c.trim())

/**
 * Normalises Markdown tables (cells trimmed, no padding around pipes, which the
 * editor would otherwise keep as spaces) so every row has exactly as many cells as the
 * header: short rows are padded with empty cells, long rows keep their extra
 * content in the last cell (never dropped). Text outside tables is unchanged.
 */
export function normaliseMarkdownTables(text: string): string {
  const lines = text.split(/\r?\n/)
  const out: string[] = []
  for (let i = 0; i < lines.length; i++) {
    const header = lines[i]!
    const divider = lines[i + 1]
    if (!PIPE_ROW.test(header) || divider === undefined || !PIPE_DIVIDER.test(divider)) {
      out.push(header)
      continue
    }
    const width = cellsOf(header).length
    const fit = (cells: string[]) => {
      const fitted = cells.slice(0, width)
      if (cells.length > width) fitted[width - 1] = cells.slice(width - 1).join(' / ')
      while (fitted.length < width) fitted.push('')
      return `|${fitted.join('|')}|`
    }
    out.push(fit(cellsOf(header)), `|${Array(width).fill('---').join('|')}|`)
    i += 2
    while (i < lines.length && PIPE_ROW.test(lines[i]!)) {
      out.push(fit(cellsOf(lines[i]!)))
      i++
    }
    i-- // the for-loop increments
  }
  return out.join('\n')
}

/**
 * Tab-separated table: at least 2 non-empty lines, every line with the same
 * number of tabs (at least 1). Prose that happens to contain a tab does not
 * qualify, because its lines will not line up.
 */
export function isTabSeparatedTable(text: string): boolean {
  const lines = text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((l) => l.trim() !== '')
  if (lines.length < 2) return false
  const counts = lines.map((l) => (l.match(/\t/g) ?? []).length)
  return counts[0]! >= 1 && counts.every((c) => c === counts[0])
}

/** Converts tab-separated text to a Markdown table (first line becomes the header). */
export function tabSeparatedToMarkdown(text: string): string {
  const rows = text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((l) => l.trim() !== '')
    .map((l) => l.split('\t').map((c) => c.trim().replace(/\|/g, '\\|')))
  const [header, ...body] = rows
  return [
    `|${header!.join('|')}|`,
    `|${header!.map(() => '---').join('|')}|`,
    ...body.map((r) => `|${r.join('|')}|`),
  ].join('\n')
}

/**
 * Decides how a paste without HTML should be handled. Returns Markdown to
 * import, or null to let the editor paste plain text as usual.
 */
export function markdownForPlainTextPaste(text: string): string | null {
  if (hasMarkdownTable(text)) return stripUnsafeMarkdownLinks(normaliseMarkdownTables(text))
  if (isTabSeparatedTable(text)) return tabSeparatedToMarkdown(text)
  return null
}

/** Link targets that must never be pasted into content (script execution, embedded payloads). */
export const UNSAFE_URL = /^\s*(javascript|vbscript|data):/i

/** Turns Markdown links with unsafe targets into their plain text. */
export function stripUnsafeMarkdownLinks(markdown: string): string {
  return markdown.replace(/\[([^\]]*)\]\(\s*(?:javascript|vbscript|data):[^)]*\)/gi, '$1')
}

/** Does this clipboard HTML contain a table Lexical can import? */
export function htmlHasTable(html: string): boolean {
  return /<table[\s>]/i.test(html)
}
