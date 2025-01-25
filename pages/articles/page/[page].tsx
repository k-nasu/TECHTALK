import { getArticlesByPage, getPageNumbers, getAllArticles } from '@/lib/notionAPI'
import type { Article } from '@/types/types'
import ArticleList from '@/components/Article/ArticleList'
import { REVALIDATE_INTERVAL } from '@/constants/constants'
import Pagination from '@/components/Pagination/Pagination'
import { NextSeo } from 'next-seo'
import { GetStaticPaths, GetStaticProps } from 'next'

const ARTICLES_PER_PAGE = 10

type Props = {
  articles: Article[]
  currentPage: number
  totalPages: number
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allArticles = await getAllArticles()
  const totalPages = Math.ceil(allArticles.length / ARTICLES_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 1).toString() }
  }))

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const page = parseInt(params?.page as string, 10)
  const allArticles = await getAllArticles()

  const totalPages = Math.ceil(allArticles.length / ARTICLES_PER_PAGE)
  if (page < 1 || page > totalPages) {
    return { notFound: true }
  }

  const startIndex = (page - 1) * ARTICLES_PER_PAGE
  const endIndex = startIndex + ARTICLES_PER_PAGE
  const paginatedArticles = allArticles
    .slice(startIndex, endIndex)
    .map(article => ({
      id: article.id,
      title: article.title,
      description: article.description || undefined,
      content: article.content || undefined,
      updated_on: article.updated_on || undefined,
      slug: article.slug || undefined,
      tags: article.tags,
      isPaginationPage: true
    } as Article))

  return {
    props: {
      articles: paginatedArticles,
      currentPage: page,
      totalPages
    },
    revalidate: 60
  }
}

const ArticlesPage = ({ articles, currentPage, totalPages }: Props) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NextSeo
        title={`記事一覧 - ページ${currentPage}`}
        description="技術記事の一覧ページです"
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <ArticleList articles={articles} />
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            pageNumbers={totalPages}
            paginationLink="/articles/page"
          />
        </div>
      </div>
    </div>
  )
}

export default ArticlesPage
