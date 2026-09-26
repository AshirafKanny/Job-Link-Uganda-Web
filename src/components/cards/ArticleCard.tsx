import Link from 'next/link'
import type { Article } from '@/domain/content/types'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/format'
import { routes } from '@/lib/routes'

type Props = {
  article: Pick<Article, 'title' | 'slug' | 'excerpt' | 'category' | 'publishedAt'>
  index?: number
  headingLevel?: 'h2' | 'h3'
  className?: string
}

export function ArticleCard({ article, index = 0, headingLevel: Heading = 'h3', className }: Props) {
  return (
    <article
      data-aos="fade-up"
      className={cn('group relative flex flex-col border border-line bg-surface p-6 transition-colors duration-300 hover:border-ink', className)}
      data-aos-delay={index * 100}
    >
      {article.category && (
        <p className="font-display text-xs font-bold tracking-[0.12em] text-brand-red-dark uppercase">
          {article.category.name}
        </p>
      )}
      <Heading className="mt-2 text-xl leading-snug font-bold">
        <Link href={routes.article(article.slug)} className="after:absolute after:inset-0 group-hover:underline group-hover:underline-offset-4">
          {article.title}
        </Link>
      </Heading>
      <p className="mt-2 line-clamp-3 text-ink-muted">{article.excerpt}</p>
      <p className="mt-auto pt-4 text-sm text-ink-subtle">
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      </p>
    </article>
  )
}
