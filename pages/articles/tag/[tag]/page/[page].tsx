import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types'
import {
  getArticlesByTagAndPage,
  getPageNumbersByTag,
  getAllArticles
} from '@/lib/notionAPI'
import SingleArticle from '@/components/Article/SingleArticle'
import Pagination from '@/components/Pagination/Pagination'
import { useState } from 'react'
import useSWR from 'swr'
import { getTags } from '@/lib/notionAPI'
import TagGrid from '@/components/Tag/TagGrid'
import ArticleList from '@/components/Article/ArticleList'

type Props = {
  articles: Article[]
  tag: string
  currentPage: number
  totalPages: number
}

const ARTICLES_PER_PAGE = 10

const TagPage = ({ articles, tag, currentPage, totalPages }: Props) => {
  const [showAllTags, setShowAllTags] = useState(false)
  const { data: allTags } = useSWR('tags', getTags)

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
        <ArticleList articles={articles.map(article => ({
          ...article,
          description: article.description || undefined,
          content: article.content || undefined,
          updated_on: article.updated_on || undefined,
          slug: article.slug || undefined,
          isPaginationPage: true
        }))} />
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            pageNumbers={totalPages}
            paginationLink={`/articles/tag/${tag.toLowerCase().replace(/\s+/g, '-')}/page`}
          />
        </div>
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
  const allArticles = await getAllArticles()
  const allTags = Array.from(new Set(allArticles.flatMap(article => article.tags)))

  const paths: { params: { tag: string; page: string } }[] = []

  for (const tag of allTags) {
    const tagArticles = allArticles.filter(article =>
      article.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    )
    const totalPages = Math.max(1, Math.ceil(tagArticles.length / ARTICLES_PER_PAGE))

    for (let page = 1; page <= totalPages; page++) {
      paths.push({
        params: {
          tag: tag.toLowerCase().replace(/\s+/g, '-'),
          page: page.toString()
        }
      })
    }
  }

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const tag = (params?.tag as string).replace(/-/g, ' ')
    const currentPage = parseInt(params?.page as string, 10)
    const allArticles = await getAllArticles()

    const tagArticles = allArticles.filter(article =>
      article.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    ).sort((a, b) => {
      const dateA = new Date(a.updated_on || '').getTime()
      const dateB = new Date(b.updated_on || '').getTime()
      return dateB - dateA
    })

    const totalPages = Math.max(1, Math.ceil(tagArticles.length / ARTICLES_PER_PAGE))

    if (currentPage < 1 || currentPage > totalPages) {
      return { notFound: true }
    }

    const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE
    const endIndex = startIndex + ARTICLES_PER_PAGE
    const paginatedArticles = tagArticles.slice(startIndex, endIndex)

    return {
      props: {
        articles: paginatedArticles.map(article => ({
          ...article,
          description: article.description ?? null,
          content: article.content ?? null,
          updated_on: article.updated_on ?? null,
          slug: article.slug ?? null,
          isPaginationPage: true
        })),
        tag,
        currentPage,
        totalPages
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    return { notFound: true }
  }
}

export default TagPage
