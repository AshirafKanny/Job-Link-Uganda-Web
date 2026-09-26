import type { ReactNode } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { formatDate } from '@/lib/format'

type Props = { title: string; path: string; reviewed: boolean; lastUpdated: string; children: ReactNode }

export function LegalPage({ title, path, reviewed, lastUpdated, children }: Props) {
  return (
    <>
      <PageHeader breadcrumbs={[{ name: title, path }]} title={title} lead={`Last updated ${formatDate(lastUpdated)}`} />
      <div className="container-page py-12 lg:py-16">
        {!reviewed && (
          <p role="note" className="mb-10 max-w-3xl border-l-4 border-brand-yellow bg-surface-muted p-4 text-[0.95rem]">
            <strong>Draft:</strong> this document is being finalised and will be updated after review. Contact us if you
            have any questions about it.
          </p>
        )}
        <div className="prose-content max-w-3xl">{children}</div>
      </div>
    </>
  )
}
