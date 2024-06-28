import React from 'react'
import Head from 'next/head';
import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next'
import { getAllArticles, getSingleArticle } from '@/lib/notionAPI'
import Tag from '@/components/Tag/Tag';
import Markdown from '@/components/Markdown/Markdown';
import ArticleList from '@/components/Article/ArticleList'
import { REVALIDATE_INTERVAL, SERVICE_NAME } from '@/constants/constants';

export const getStaticPaths = async () => {
  const allArticles = await getAllArticles();
  const paths = allArticles.map(({slug}) => ({ params: { slug } }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = async ({ params }: any) => {
  const article = await getSingleArticle(params.slug)
  const allArticles = await getAllArticles()
  const recommendedArticles = allArticles.slice(0, 4)

  return {
    props: {
      article,
      recommendedArticles
    },
    // revalidate: REVALIDATE_INTERVAL
  }
}

export async function generateMetadata({ params }: any, parent?: ResolvingMetadata): Promise<Metadata> {
  const article = await getSingleArticle(params.slug)
  // const previousImages = (await parent).openGraph?.images || []

  return {
    title: article.metadata.title,
    description: article.metadata.description,
    // openGraph: {
    //   images: ['/image.jpg', ...previousImages],
    // },
  }
}

const Article = ({ article, recommendedArticles }: any) => {
  return (
    <>
      <Head>
        <title>{SERVICE_NAME} | {article.metadata.title}</title>
        <meta name="description" content={article.metadata.description} />
      </Head>
      <section className="container lg:px-2 px-5 lg:w-4/5 mx-auto mt-20">
        <h1 className="w-full text-5xl font-bold pb-2 mb-6">{article.metadata.title}</h1>
        {article.metadata.tags.map((tag: string, index: number) => (
          <Link key={index} href={`/articles/tag/${tag}/page/1`} className="hover:shadow-none hover:translate-x-1 transition-all duration-300">
            <Tag tag={tag} />
          </Link>
        ))}
        <br/>
        <span className="text-sm text-blue-700 inline-block mt-4">更新日：{article.metadata.updated_on}</span>
        <div className="mt-20 mb-40">
          {
            article.markdown
            ? <Markdown markdown={article.markdown} />
            : "記事準備中"
          }
        </div>
        <div>
          <h3 className="mb-5">おすすめ記事</h3>
          <ArticleList articles={recommendedArticles} />
          <Link href="/articles/page/1" className="block pb-20 text-blue-600 text-right"><span>記事一覧を見る</span></Link>
        </div>
      </section>
    </>
  )
}

export default Article
