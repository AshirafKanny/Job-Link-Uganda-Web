import Link from 'next/link'
import { Photo } from '@/components/ui/Photo'
import { articleImageFor } from '@/config/visuals'
import type { Article } from '@/domain/content/types'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/format'
import { routes } from '@/lib/routes'

type Props = {
  article: Pick<Article, 'title' | 'slug' | 'excerpt' | 'category' | 'publishedAt'> & {
    featuredImage?: Article['featuredImage']
  }
  index?: number
  headingLevel?: 'h2' | 'h3'
  className?: string
}

export function ArticleCard({ article, index = 0, headingLevel: Heading = 'h3', className }: Props) {
  return (
    <article
      data-aos="fade-up"
      className={cn('group relative flex flex-col border border-line bg-surface transition-colors duration-300 hover:border-ink', className)}
      data-aos-delay={index * 100}
    >
      {article.featuredImage ? (
        <figure className="relative aspect-[16/10] overflow-hidden bg-surface-sunken">
          {/* eslint-disable-next-line @next/next/no-img-element -- CMS media is already resized on upload */}
          <img
            src={article.featuredImage.url}
            alt=""
            width={article.featuredImage.width ?? 1600}
            height={article.featuredImage.height ?? 1000}
            loading="lazy"
            decoding="async"
            className="photo-hover h-full w-full object-cover"
          />
        </figure>
      ) : (
        // The title carries the meaning; the photo is illustrative, so its alt is empty.
        <Photo
          image={articleImageFor(article)}
          aspect={[16, 10]}
          sizes="(min-width: 768px) 30vw, 100vw"
          decorative
          className="aspect-[16/10]"
          imgClassName="photo-hover"
        />
      )}
      <div className="flex flex-1 flex-col p-6">
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
      </div>
    </article>
  )
}
