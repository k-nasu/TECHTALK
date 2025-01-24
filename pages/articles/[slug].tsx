import React, { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { NextSeo } from 'next-seo'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getAllArticles, getSingleArticle } from '@/lib/notionAPI'
import { REVALIDATE_INTERVAL } from '@/constants/constants'
import type { Article as ArticleType } from '@/types'
import Markdown from '@/components/Markdown/Markdown'
import ArticleList from '@/components/Article/ArticleList'
import TagGrid from '@/components/Tag/TagGrid'
import { formatDate } from '@/lib/utils'
import { Article } from '@/types'

type ArticleWithMarkdown = {
  title: string
  description: string
  updated_on: string
  tags: string[]
  markdown: string
  slug: string
}

type Props = {
  article: ArticleWithMarkdown
  recommendedArticles: Pick<Article, 'id' | 'title' | 'description' | 'slug'>[]
}

type TableOfContents = {
  text: string
  id: string
}

const extractTableOfContents = (markdown: string): TableOfContents[] => {
  const headings = markdown.match(/^##\s+.+$/gm) || []
  return headings.map(heading => {
    const text = heading.replace(/^##\s+/, '')
    const id = text.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\-]/g, '')
    return { text, id }
  })
}

const ArticleTag = ({ tag }: { tag: string }) => (
  <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100">
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
)

const ArticlePage = ({ article, recommendedArticles }: Props) => {
  const tableOfContents = useMemo(() => extractTableOfContents(article.markdown), [article.markdown])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      // 画面内に表示されている見出しを全て取得
      const visibleHeadings = entries.filter((entry) => entry.isIntersecting)

      if (visibleHeadings.length === 0) {
        // 画面内に見出しがない場合、最も近い見出しをアクティブにする
        const closestHeading = entries.reduce((closest, current) => {
          if (!closest) return current

          const closestDistance = Math.abs(closest.boundingClientRect.top)
          const currentDistance = Math.abs(current.boundingClientRect.top)

          return currentDistance < closestDistance ? current : closest
        })

        if (closestHeading) {
          setActiveId(closestHeading.target.id)
        }
      } else {
        // 画面内に見出しがある場合、最も上にある見出しをアクティブにする
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
        )

        setActiveId(sortedVisibleHeadings[0].target.id)
      }
    }

    const observer = new IntersectionObserver(callback, {
      rootMargin: '-10% 0px -70% 0px',
      threshold: [0, 0.5, 1]
    })

    // 見出し要素を監視
    tableOfContents.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    // 初期表示時のアクティブ項目を設定
    if (tableOfContents.length > 0 && !activeId) {
      setActiveId(tableOfContents[0].id)
    }

    return () => {
      observer.disconnect()
    }
  }, [tableOfContents, activeId])

  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })

      // URLのハッシュを静かに更新
      window.history.replaceState(null, '', `#${id}`)
    }
  }

  const TableOfContentsLinks = () => (
    <div className="pl-3">
      <h2 className="text-xl font-bold text-primary mb-3">目次</h2>
      <div className="space-y-1 relative">
        {tableOfContents.map(({ id, text }) => (
          <div key={id} className="flex items-start group">
            {/* 縦線 */}
            {id !== tableOfContents[tableOfContents.length - 1].id && (
              <div className="absolute left-[0.3125rem] top-3 w-[2px] h-full bg-gray-100 -z-10" />
            )}
            {/* ドット */}
            <div className={`relative w-2.5 h-2.5 rounded-full mt-2 mr-2.5 z-10 transition-all duration-200 ${
              activeId === id
                ? 'bg-primary ring-2 ring-primary/20 ring-offset-2'
                : 'bg-white border-2 border-gray-200 group-hover:border-gray-300 group-hover:scale-110'
            }`} />
            <a
              href={`#${id}`}
              onClick={(e) => handleTocClick(e, id)}
              className={`relative pl-8 py-1 flex items-center text-sm hover:text-primary transition-colors ${
                activeId === id ? 'text-primary' : 'text-gray-600'
              }`}
            >
              {text}
            </a>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="bg-gray-50">
      {/* タイトルセクション */}
      <section className="w-full py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-secondary">
              <time className="text-sm">
                {formatDate(article.updated_on)}
              </time>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/articles/tag/${tag}/page/1`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-white hover:bg-gray-100 text-primary transition-colors duration-200"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 記事本文とモバイル時の目次 */}
            <div className="lg:w-3/4">
              {/* モバイル時の目次（lg:未満で表示） */}
              {tableOfContents.length > 0 && (
                <div className="lg:hidden mb-8">
                  <div className="p-4 bg-white rounded-lg shadow-sm max-w-sm mx-auto">
                    <TableOfContentsLinks />
                  </div>
                </div>
              )}

              {/* 記事本文 */}
              <article>
                <div className="prose prose-lg max-w-none">
                  <Markdown markdown={article.markdown} />
                </div>
              </article>
            </div>

            {/* デスクトップ時の目次（lg:以上で表示） */}
            {tableOfContents.length > 0 && (
              <nav className="lg:w-1/4 hidden lg:block">
                <div className="sticky top-20 p-4 bg-white rounded-lg shadow-sm">
                  <TableOfContentsLinks />
                </div>
              </nav>
            )}
          </div>

          {/* おすすめ記事 */}
          {recommendedArticles.length > 0 && (
            <aside className="mt-16 mx-auto">
              <h2 className="text-2xl font-bold text-primary mb-6">おすすめの記事</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recommendedArticles.map(article => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-primary mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-secondary line-clamp-2">{article.description}</p>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </div>

        {/* タグ一覧 */}
        <section className="bg-surface py-12 mt-12">
          <div className="max-w-6xl mx-auto px-4">
            <TagGrid />
          </div>
        </section>
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getAllArticles()
  const paths = articles.map(article => ({ params: { slug: article.slug } }))
  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string
  const articleData = await getSingleArticle(slug)

  if (!articleData || !articleData.markdown) {
    return { notFound: true }
  }

  const article = {
    title: articleData.metadata.title,
    description: articleData.metadata.description || '',
    updated_on: articleData.metadata.updated_on || '',
    tags: articleData.metadata.tags || [],
    markdown: articleData.markdown,
    slug: articleData.metadata.slug
  }

  const allArticles = await getAllArticles()
  const recommendedArticles = allArticles
    .filter(a => a.slug !== slug)
    .slice(0, 4)
    .map(({ id, title, description, slug }) => ({
      id,
      title,
      description,
      slug
    }))

  return {
    props: {
      article,
      recommendedArticles
    },
    revalidate: 60
  }
}

export default ArticlePage
