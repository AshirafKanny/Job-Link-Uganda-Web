import type { Thing, WithContext } from 'schema-dts'

type Props = { data: WithContext<Thing> | null | undefined }

/** Escapes "<" so CMS-supplied text can never close the script tag. */
export function JsonLd({ data }: Props) {
  if (!data) return null
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
