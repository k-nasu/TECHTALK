import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types'
import {
  getArticlesByTagAndPage,
  getPageNumbersByTag
} from '@/lib/notionAPI'
import SingleArticle from '@/components/Article/SingleArticle'
import Pagination from '@/components/Pagination/Pagination'
import { useState } from 'react'
import useSWR from 'swr'
import { getAllTags } from '@/lib/notionAPI'
import TagGrid from '@/components/Tag/TagGrid'

type Props = {
  articles: Article[]
  tag: string
  numberOfPage: number
  currentPage: number
}

const TagPage = ({ articles, tag, numberOfPage, currentPage }: Props) => {
  const [showAllTags, setShowAllTags] = useState(false)
  const { data: allTags } = useSWR('tags', getAllTags)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダーセクション */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
              <Image
                src={`/tag_images/${tag}.svg`}
                width={32}
                height={32}
                alt={tag}
                className="w-8 h-8"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement?.classList.add('default-icon')
                }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {tag}
              </h1>
              <div className="text-gray-600">
                {articles.length}件の記事
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 記事一覧セクション */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {articles.map(article => (
                <div key={article.id}>
                  <SingleArticle {...article} isPaginationPage={true} />
                </div>
              ))}
            </div>
            <Pagination
              pageNumbers={numberOfPage}
              currentPage={currentPage}
              paginationLink={`/articles/tag/${tag}/page/${currentPage}`}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">
              このタグの記事はまだありません
            </p>
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              トップページに戻る
            </Link>
          </div>
        )}
      </div>

      {/* タグ一覧セクション */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <TagGrid currentTag={tag} />
        </div>
      </section>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allTags = await getAllTags()
  const paths = []

  for (const tag of allTags) {
    const numberOfPage = await getPageNumbersByTag(tag)

    for (let i = 1; i <= numberOfPage; i++) {
      paths.push({
        params: {
          tag: tag,
          page: i.toString(),
        },
      })
    }
  }

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const tag = context.params?.tag as string
  const page = parseInt(context.params?.page as string, 10)
  const articles = await getArticlesByTagAndPage(tag, page)
  const numberOfPage = await getPageNumbersByTag(tag)

  return {
    props: {
      articles,
      tag,
      numberOfPage,
      currentPage: page,
    },
    revalidate: 60,
  }
}

export default TagPage
