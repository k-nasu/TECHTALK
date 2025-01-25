import Image from 'next/image'
import SingleArticle from '@/components/Article/SingleArticle'
import Link from 'next/link'
import useSWR from 'swr'
import { fetchArticles, fetchTags } from '@/lib/api-client'
import { useState } from 'react'
import TagGrid from '@/components/Tag/TagGrid'

// 表示したいメインタグのリスト
const MAIN_TAGS = [
  'Rails',
  'TypeScript',
  '初学者向け',
  'React',
  'Next.js',
] as const;

const ArticleSkeleton = () => (
  <div className="h-full bg-white rounded-lg shadow p-4">
    <div className="flex flex-col h-full gap-4">
      <div className="w-3/4 h-6 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded" />
      <div className="space-y-2">
        <div className="w-full h-4 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded" />
        <div className="w-2/3 h-4 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded" />
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div className="w-16 h-4 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded" />
        <div className="flex gap-2">
          <div className="w-12 h-4 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded" />
          <div className="w-12 h-4 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded" />
        </div>
      </div>
    </div>
  </div>
)

const Home = () => {
  const { data: articles, error: articlesError } = useSWR('articles', fetchArticles)
  const { data: tags, error: tagsError } = useSWR('tags', fetchTags)
  const [isLoading, setIsLoading] = useState(false)

  if (articlesError || tagsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2">エラーが発生しました</h1>
          <p className="text-gray-600 mb-4">
            データの取得中にエラーが発生しました。時間をおいて再度お試しください。
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            再読み込み
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 最新の記事 */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">最新の記事</h2>
            <Link
              href="/articles/page/1"
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              もっと見る
              <svg
                className="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!articles ? (
              // ローディング状態
              Array.from({ length: 4 }).map((_, index) => (
                <ArticleSkeleton key={index} />
              ))
            ) : (
              articles.slice(0, 16).map(article => (
                <div key={article.id} className="h-full">
                  <SingleArticle
                    {...article}
                    description={article.description || undefined}
                    content={article.content || undefined}
                    updated_on={article.updated_on || undefined}
                    slug={article.slug || undefined}
                    isPaginationPage={false}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* タグナビゲーション */}
      <section className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-4">
            <TagGrid />
          </div>
        </div>
      </section>

      {/* タグ別記事セクション */}
      {articles && MAIN_TAGS.map((tag, index) => {
        const tagArticles = articles.filter(article => article.tags.includes(tag))
        if (tagArticles.length === 0) return null

        return (
          <section key={tag} className={`py-12 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {tag}の記事
                </h2>
                <Link
                  href={`/articles/tag/${tag}/page/1`}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  もっと見る
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tagArticles.slice(0, 4).map(article => (
                  <div key={article.id} className="h-full">
                    <SingleArticle
                      {...article}
                      description={article.description || undefined}
                      content={article.content || undefined}
                      updated_on={article.updated_on || undefined}
                      slug={article.slug || undefined}
                      isPaginationPage={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default Home
