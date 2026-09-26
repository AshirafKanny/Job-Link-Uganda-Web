import { ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { routes } from '@/lib/routes'

type Props = {
  /** Shown when filters are active, so the visitor can widen the search. */
  filtered?: boolean
  title?: string
}

/** Honest empty state: no vacancies are ever invented to fill space. */
export function NoJobsState({ filtered = false, title }: Props) {
  return (
    <EmptyState
      title={title ?? (filtered ? 'No vacancies match your search' : 'No open vacancies at the moment')}
      actions={
        <>
          {filtered && (
            <ButtonLink href={routes.jobs()} variant="dark">
              See all vacancies
            </ButtonLink>
          )}
          <ButtonLink href={routes.careerResources()} variant="outline">
            Career resources
          </ButtonLink>
          <ButtonLink href={routes.contact()} variant="outline">
            Contact Job Link
          </ButtonLink>
        </>
      }
    >
      {filtered
        ? 'Try a broader keyword, another location or a different category.'
        : 'We only publish vacancies we are actively recruiting for. New roles are added as employers instruct us, so please check back soon.'}
    </EmptyState>
  )
}
