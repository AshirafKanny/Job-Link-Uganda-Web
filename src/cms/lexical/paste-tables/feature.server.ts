import { createServerFeature } from '@payloadcms/richtext-lexical'

/**
 * Paste support for tables arriving as plain text (Markdown from AI "Copy"
 * buttons, tab-separated text). Requires the table feature, whose nodes and
 * Markdown transformer it relies on.
 */
export const PasteTablesFeature = createServerFeature({
  key: 'pasteTables',
  feature: {
    ClientFeature: '/cms/lexical/paste-tables/feature.client#PasteTablesFeatureClient',
  },
  dependencies: ['experimental_table'],
})
