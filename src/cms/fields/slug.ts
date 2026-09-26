import type { TextField } from 'payload'
import { slugify } from '@/lib/slugify'

/** URL slug, generated from `sourceField` when left empty and always normalised. */
export function slugField(sourceField = 'title'): TextField {
  return {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    index: true,
    admin: {
      position: 'sidebar',
      description: 'Used in the page URL. Changing it on a published page creates a 301 redirect from the old URL.',
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          const source = typeof value === 'string' && value.trim() ? value : data?.[sourceField]
          return typeof source === 'string' ? slugify(source) : value
        },
      ],
    },
  }
}
