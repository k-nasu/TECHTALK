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

export default function Home() {
  const { data: articles, error: articlesError } = useSWR('articles', fetchArticles)
  const { data: allTags, error: tagsError } = useSWR('tags', fetchTags)
  const [showAllTags, setShowAllTags] = useState(false)

  if (articlesError || tagsError) return <div>エラーが発生しました</div>

  // タグ別記事を取得
  const getArticlesByTag = (tag: string) => {
    if (!articles) return []
    return articles.filter(article => article.tags.includes(tag)).slice(0, 5)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* メインコンテンツセクション */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              トレンドの記事
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {!articles ? (
                // ローディング状態
                [...Array(16)].map((_, i) => (
                  <div key={i} className="h-full">
                    <ArticleSkeleton />
                  </div>
                ))
              ) : (
                // 記事一覧
                articles.slice(0, 16).map(article => (
                  <div key={article.id} className="h-full">
                    <SingleArticle {...article} isPaginationPage={false} />
                  </div>
                ))
              )}
            </div>
            <div className="text-right mt-8">
              <Link
                href="/articles/page/1"
                className="inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                <span>一覧を見る</span>
                <svg
                  className="w-4 h-4 ml-1"
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
      {MAIN_TAGS.map((tag, index) => {
        const tagArticles = getArticlesByTag(tag)
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
                {tagArticles.map(article => (
                  <div key={article.id} className="h-full">
                    <SingleArticle {...article} isPaginationPage={false} />
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
