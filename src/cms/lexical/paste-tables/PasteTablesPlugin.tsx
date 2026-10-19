'use client'

import { useEditorConfigContext } from '@payloadcms/richtext-lexical/client'
import { $getSelection, $insertNodes, $setSelection, COMMAND_PRIORITY_HIGH, PASTE_COMMAND } from '@payloadcms/richtext-lexical/lexical'
import { $generateNodesFromDOM } from '@payloadcms/richtext-lexical/lexical/html'
import { $convertFromMarkdownString } from '@payloadcms/richtext-lexical/lexical/markdown'
import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext'
import { $createQuoteNode } from '@payloadcms/richtext-lexical/lexical/rich-text'
import { useEffect } from 'react'
import { htmlHasTable, markdownForPlainTextPaste, UNSAFE_URL } from './detect'

/**
 * Paste handling for rich text:
 *
 * 1. Clipboard HTML (select + Ctrl+C in ChatGPT, Claude, Docs, Word): Lexical
 *    imports it natively, including <table> through the table feature. If it
 *    contains links to javascript:/vbscript:/data: URLs (unwrapped to plain
 *    text) or embedded images/media (removed), it is cleaned first; otherwise
 *    the editor would refuse to save the article with only "Body is invalid".
 * 2. Plain text containing a Markdown or tab-separated table (AI "Copy"
 *    buttons, spreadsheets): converted with the editor's own Markdown
 *    importer, so the table and the headings, lists and formatting around it
 *    become real rich text.
 * 3. Anything else pastes exactly as before.
 */
export function PasteTablesPlugin() {
  const [editor] = useLexicalComposerContext()
  const { editorConfig } = useEditorConfigContext()

  useEffect(() => {
    const transformers = editorConfig.features.markdownTransformers
    return editor.registerCommand(
      PASTE_COMMAND,
      (event) => {
        if (!(event instanceof ClipboardEvent) || !event.clipboardData) return false
        const html = event.clipboardData.getData('text/html')

        if (html) {
          const doc = new DOMParser().parseFromString(html, 'text/html')
          const unsafeLinks = [...doc.querySelectorAll('a[href]')].filter((a) => UNSAFE_URL.test(a.getAttribute('href') ?? ''))
          // Remote images become upload nodes without a media document, which makes the
          // article impossible to save ("Body is invalid"). Media is added via the media
          // library instead; embedded frames, scripts and styles are never pasted.
          const embedded = [...doc.querySelectorAll('img, picture, svg, video, audio, iframe, object, embed, script, style')]
          if (unsafeLinks.length > 0 || embedded.length > 0) {
            for (const a of unsafeLinks) a.replaceWith(...a.childNodes)
            for (const el of embedded) el.remove()
            event.preventDefault()
            editor.update(() => {
              $insertNodes($generateNodesFromDOM(editor, doc))
            })
            return true
          }
          if (htmlHasTable(html)) return false // native HTML table import
        }

        const markdown = markdownForPlainTextPaste(event.clipboardData.getData('text/plain'))
        if (!markdown) return false

        event.preventDefault()
        editor.update(() => {
          // Convert into a detached container, then move the resulting blocks
          // to the current selection: the rest of the document is untouched.
          // The importer moves the selection into the (detached) container, so
          // the caret is saved first and restored before inserting.
          const caret = $getSelection()?.clone() ?? null
          const container = $createQuoteNode()
          $convertFromMarkdownString(markdown, transformers, container)
          $setSelection(caret)
          $insertNodes(container.getChildren())
        })
        return true
      },
      COMMAND_PRIORITY_HIGH,
    )
  }, [editor, editorConfig])

  return null
}
