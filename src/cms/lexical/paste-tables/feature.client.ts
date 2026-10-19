'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { PasteTablesPlugin } from './PasteTablesPlugin'

export const PasteTablesFeatureClient = createClientFeature({
  plugins: [{ Component: PasteTablesPlugin, position: 'normal' }],
})
