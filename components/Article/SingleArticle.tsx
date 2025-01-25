import Link from 'next/link'
import React from 'react'
import { Article } from '@/types/types'
import { getRelativeTimeString } from '@/lib/utils'
import Image from 'next/image'

const SingleArticle = ({ title, description, slug, updated_on, tags = [], isPaginationPage }: Article) => {
  const displayTags = tags.slice(0, 4)
  const remainingCount = tags.length - displayTags.length

  return (
    <Link href={`/articles/${slug}`}>
      <article className="h-full bg-surface rounded-lg shadow hover:shadow-md transition-shadow p-4">
        <div className="flex flex-col h-full">
          <h2 className="text-lg font-bold mb-2 line-clamp-2 text-primary leading-snug">
            {title}
          </h2>
          <div className="min-h-0 mb-3">
            <p className="text-sm text-secondary line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 mt-auto">
            {updated_on && (
              <time className="text-xs text-tertiary shrink-0">
                {getRelativeTimeString(updated_on)}
              </time>
            )}
            <div className="flex flex-wrap gap-2 justify-end overflow-hidden">
              {displayTags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-secondary"
                >
                  <div className="w-4 h-4 relative flex items-center justify-center">
                    <Image
                      src={`/tag_images/${tag}.svg`}
                      width={12}
                      height={12}
                      alt=""
                      className="w-3 h-3"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.parentElement?.classList.add('default-icon')
                      }}
                    />
                  </div>
                  <span>{tag}</span>
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="text-xs text-tertiary">
                  +{remainingCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default SingleArticle
