import React, { useState, useEffect, useRef } from 'react'
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

type Props = {
  article: {
    metadata: {
      title: string
      description: string
      tags: string[]
      updated_on: string
    }
    markdown: string
  }
  recommendedArticles: ArticleType[]
}

interface TocItem {
  id: string
  text: string
}

const ArticleTag = ({ tag }: { tag: string }) => (
  <Link href={`/articles/tag/${tag}/page/1`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
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
  </Link>
)

const ArticlePage = ({ article, recommendedArticles }: Props) => {
  const { title, description, tags, updated_on } = article.metadata
  const [activeId, setActiveId] = useState<string>('')
  const observerEntries = useRef(new Map()).current

  // Extract table of contents from markdown
  const tableOfContents = article.markdown.match(/^##\s+.+$/gm)?.map(heading => {
    const text = heading.replace(/^##\s+/, '')
      .replace(/\*\*/g, '')
    const id = text.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    return { id, text }
  }) || []

  useEffect(() => {
    const headingElements = document.querySelectorAll<HTMLHeadingElement>('h2')
    const headingElementsArray = Array.from(headingElements)

    // スクロール位置に基づいて現在のセクションの見出しを見つける
    const findCurrentSection = () => {
      if (headingElementsArray.length === 0) return null

      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const headerOffset = 100 // ヘッダーの高さ

      // 各見出しの位置を計算
      const headingPositions = headingElementsArray.map((heading, index) => {
        const { top } = heading.getBoundingClientRect()
        const absoluteTop = top + scrollY
        const nextHeading = headingElementsArray[index + 1]
        const bottom = nextHeading
          ? nextHeading.getBoundingClientRect().top + scrollY
          : document.documentElement.scrollHeight

        return {
          id: heading.id,
          top: absoluteTop - headerOffset,
          bottom: bottom - headerOffset
        }
      })

      // スクロール位置が含まれるセクションを探す
      const currentSection = headingPositions.find(
        section => scrollY >= section.top && scrollY < section.bottom
      )

      // スクロール位置が最初のセクションより上の場合
      if (scrollY < headingPositions[0]?.top) {
        return headingPositions[0]?.id
      }

      // スクロール位置が最後のセクションより下の場合
      if (scrollY >= headingPositions[headingPositions.length - 1]?.top) {
        return headingPositions[headingPositions.length - 1]?.id
      }

      return currentSection?.id
    }

    // スクロールハンドラー
    const handleScroll = () => {
      const currentSectionId = findCurrentSection()
      if (currentSectionId && currentSectionId !== activeId) {
        setActiveId(currentSectionId)
      }
    }

    // スクロールイベントリスナーを追加
    window.addEventListener('scroll', handleScroll, { passive: true })

    // 初期状態の設定
    setTimeout(handleScroll, 100)

    // クリーンアップ
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [activeId])

  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      setActiveId(id)
      history.pushState(null, '', `#${id}`)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <NextSeo title={title} description={description} />

      {/* 記事ヘッダー */}
      <header className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map(tag => (
              <ArticleTag key={tag} tag={tag} />
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">{title}</h1>
          {description && (
            <p className="text-lg text-slate-600 mb-4">{description}</p>
          )}
          <time dateTime={updated_on} className="flex items-center gap-2 text-slate-500 text-sm">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(updated_on)}
          </time>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_18rem] gap-8">
          {/* 記事本文 */}
          <article className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 px-6 py-8 sm:px-8 sm:py-10 prose prose-lg prose-slate max-w-none
            prose-headings:scroll-mt-24
            prose-h2:text-2xl prose-h2:font-bold prose-h2:text-slate-900 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-3 prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-xl prose-h3:font-semibold prose-h3:text-slate-800 prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-slate-700 prose-p:leading-relaxed
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-slate-900 prose-strong:font-bold
            prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
            prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
            prose-li:my-2 prose-li:text-slate-700
            prose-code:text-slate-900 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-[''] prose-code:after:content-['']
            prose-pre:bg-slate-900 prose-pre:text-slate-200 prose-pre:p-4 prose-pre:rounded-lg
            prose-img:rounded-lg prose-img:shadow-md
            prose-blockquote:border-l-4 prose-blockquote:border-slate-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600
            prose-hr:my-8 prose-hr:border-slate-200">
            {article.markdown ? <Markdown markdown={article.markdown} /> : '記事準備中'}
          </article>

          {/* 目次 */}
          <nav className="hidden lg:block">
            <div className="sticky top-20">
              <h2 className="text-xl font-bold mb-4">目次</h2>
              <div className="pl-4 space-y-1">
                <div className="relative">
                  <div className="absolute left-1.5 top-3 w-px h-full bg-gray-100 -z-10" />
                  {tableOfContents.map((item) => (
                    <div key={item.id} className="relative">
                      <div className={`absolute left-0 top-3 w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ease-in-out ${
                        activeId === item.id
                          ? 'bg-blue-500 border-blue-500 scale-125'
                          : 'bg-white border-gray-300 scale-100'
                      }`} />
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => handleTocClick(e, item.id)}
                        className={`block pl-6 py-1.5 text-base transition-all duration-300 ease-in-out ${
                          activeId === item.id
                            ? 'text-blue-500 font-bold translate-x-1'
                            : 'text-gray-600 hover:text-blue-500 translate-x-0'
                        }`}
                      >
                        {item.text}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* おすすめ記事 */}
        <aside className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-6 sm:p-8 mt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            おすすめ記事
          </h2>
          <ArticleList articles={recommendedArticles.map(article => ({
            ...article,
            description: article.description ?? undefined,
            content: article.content ?? undefined,
            updated_on: article.updated_on ?? undefined,
            slug: article.slug ?? undefined,
            isPaginationPage: false
          }))} />
        </aside>
      </main>

      {/* タグ一覧 */}
      <section className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            タグ一覧
          </h2>
          <TagGrid />
        </div>
      </section>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allArticles = await getAllArticles()
  const paths = allArticles.map(({ slug }) => ({ params: { slug } }))

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string
  const article = await getSingleArticle(slug)
  const allArticles = await getAllArticles()
  const recommendedArticles = allArticles
    .filter(a => a.slug !== slug)
    .slice(0, 4)
    .map(article => ({
      ...article,
      description: article.description ?? null,
      content: article.content ?? null,
      updated_on: article.updated_on ?? null,
      slug: article.slug ?? null
    }))

  const serializedMetadata = {
    ...article.metadata,
    description: article.metadata.description ?? null,
    content: article.metadata.content ?? null,
    updated_on: article.metadata.updated_on ?? null,
    slug: article.metadata.slug ?? null
  }

  return {
    props: {
      article: {
        metadata: serializedMetadata,
        markdown: article.markdown ?? null
      },
      recommendedArticles
    },
    revalidate: 60
  }
}

export default ArticlePage
