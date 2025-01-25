import React from 'react'
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
  const { title, description, tags, updated_on } = article.metadata

  return (
    <div className="min-h-screen bg-background">
      <NextSeo title={title} description={description} />

      <main className="container lg:px-2 px-5 lg:w-4/5 mx-auto mt-20">
        {/* 記事ヘッダー */}
        <header className="mb-8">
          <h1 className="w-full text-5xl font-bold pb-2 mb-6">{title}</h1>
          <div className="flex items-center gap-4 text-secondary">
            <time dateTime={updated_on} className="text-sm">
              更新日：{formatDate(updated_on)}
            </time>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <ArticleTag key={tag} tag={tag} />
              ))}
            </div>
          </div>
        </header>

        {/* 記事本文 */}
        <article className="mt-20 mb-40">
          {article.markdown ? <Markdown markdown={article.markdown} /> : '記事準備中'}
        </article>

        {/* おすすめ記事 */}
        <aside>
          <h2 className="mb-5">おすすめ記事</h2>
          <ArticleList articles={recommendedArticles.map(article => ({
            ...article,
            description: article.description ?? undefined,
            content: article.content ?? undefined,
            updated_on: article.updated_on ?? undefined,
            slug: article.slug ?? undefined,
            isPaginationPage: false
          }))} />
          <Link
            href="/articles/page/1"
            className="block pb-20 text-blue-600 text-right"
          >
            <span>記事一覧を見る</span>
          </Link>
        </aside>
      </main>

      {/* タグ一覧 */}
      <section className="bg-surface py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4">
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
