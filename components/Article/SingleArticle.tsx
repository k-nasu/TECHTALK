import Link from 'next/link'
import React from 'react'
import { Article } from '@/types/types'
import Tag from '@/components/Tag/Tag'

const SingleArticle: React.FC<Article> = ({
  title,
  description,
  updated_on,
  slug,
  tags,
  isPaginationPage,
}) => {
  return (
    <>
      {isPaginationPage ? (
        <section className="text-gray-800 mb-8 mx-auto rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300">
          <span className="text-sm text-blue-700">{updated_on}</span>
          <br />
          <h2 className="text-3xl hover:text-blue-600 font-bold mb-3">
            <Link href={`/articles/${slug}`}>{title}</Link>
          </h2>
          <div className="mb-5">{description}.........</div>
          {tags?.map((tag: string, index: number) => (
            <Link key={index} href={`/articles/tag/${tag}/page/1`}>
              <Tag tag={tag} />
            </Link>
          ))}
        </section>
      ) : (
        <section className=" text-gray-800 mb-8 mx-auto rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300">
          <span className="text-sm text-blue-700">{updated_on}</span>
          <br />
          <h2 className="text-3xl hover:text-blue-600 font-bold mb-3">
            <Link href={`/articles/${slug}`}>{title}</Link>
          </h2>
          <div className="mb-5">{description}.........</div>
          {tags?.map((tag: string, index: number) => (
            <Link key={index} href={`/articles/tag/${tag}/page/1`}>
              <Tag tag={tag} />
            </Link>
          ))}
        </section>
      )}
    </>
  )
}

export default SingleArticle
