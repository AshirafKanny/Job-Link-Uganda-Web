import type { HTMLConverters } from '@payloadcms/richtext-lexical/html'
import type {
  SerializedTableCellNode,
  SerializedTableNode,
  SerializedTableRowNode,
} from '@payloadcms/richtext-lexical'

/**
 * Semantic, brand-styled table HTML for rich text (replaces Payload's default
 * table converter, which put every row in <tbody>, used no <thead> or header
 * scope, and hard-coded grey inline styles).
 *
 * Output:  <div class="table-scroll" role="region" tabindex="0" aria-label="…">
 *            <table class="content-table"><thead>…</thead><tbody>…</tbody></table>
 *          </div>
 * The wrapper scrolls horizontally on narrow screens, so a wide table never
 * pushes the page sideways; it is focusable so keyboard users can scroll it.
 *
 * Text inside cells goes through the normal (escaping) text converters; no
 * attributes from the editor are copied except numeric colspan/rowspan.
 */

/** Lexical TableCellHeaderStates: 0 none, 1 row header, 2 column header, 3 both. */
const HEADER_ROW = 1
const HEADER_COLUMN = 2

type Cell = SerializedTableCellNode
type Row = SerializedTableRowNode

const isHeaderCell = (cell: Cell) => (cell.headerState ?? 0) > 0
const span = (name: 'colspan' | 'rowspan', value: unknown) =>
  typeof value === 'number' && Number.isInteger(value) && value > 1 && value <= 50 ? ` ${name}="${value}"` : ''

/** A row is the table head when every cell in it is a row header. */
function isHeadRow(row: Row) {
  const cells = (row.children ?? []) as Cell[]
  return cells.length > 0 && cells.every((c) => ((c.headerState ?? 0) & HEADER_ROW) === HEADER_ROW)
}

export const tableHTMLConverters: HTMLConverters<SerializedTableNode | Row | Cell> = {
  table: ({ node, nodesToHTML }) => {
    const rows = (node.children ?? []) as Row[]
    // Leading rows made only of row headers form <thead>; the rest are the body.
    let headCount = 0
    while (headCount < rows.length - 1 && isHeadRow(rows[headCount]!)) headCount++
    const head = rows.slice(0, headCount)
    const body = rows.slice(headCount)
    const headHtml = head.length ? `<thead>${nodesToHTML({ nodes: head }).join('')}</thead>` : ''
    const bodyHtml = `<tbody>${nodesToHTML({ nodes: body }).join('')}</tbody>`
    return `<div class="table-scroll" role="region" tabindex="0" aria-label="Table, scroll sideways to see all columns"><table class="content-table">${headHtml}${bodyHtml}</table></div>`
  },

  tablerow: ({ node, nodesToHTML }) => `<tr>${nodesToHTML({ nodes: node.children ?? [] }).join('')}</tr>`,

  tablecell: ({ node, nodesToHTML }) => {
    const content = nodesToHTML({ nodes: node.children ?? [] }).join('')
    const spans = span('colspan', node.colSpan) + span('rowspan', node.rowSpan)
    if (!isHeaderCell(node)) return `<td${spans}>${content}</td>`
    const state = node.headerState ?? 0
    // Column titles (row header state) label the column; row titles label the row.
    const scope = (state & HEADER_ROW) === HEADER_ROW ? 'col' : (state & HEADER_COLUMN) === HEADER_COLUMN ? 'row' : 'col'
    return `<th scope="${scope}"${spans}>${content}</th>`
  },
}
