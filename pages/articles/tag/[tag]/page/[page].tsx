import { getPageNumbersByTag, getArticlesByTagAndPage, getAllTags } from '@/lib/notionAPI'
import { Article } from '@/types/types'
import ArticleList from '@/components/Article/ArticleList'
import { REVALIDATE_INTERVAL, SERVICE_NAME } from '@/constants/constants'
import Pagination from '@/components/Pagination/Pagination'
import Image from 'next/image'
import Head from 'next/head'

type Props = {
  articles: Article[];
  pageNumbersByTag: number;
  currentPage: number;
  paginationLink: string;
  currentTag: string;
}

type Paths = {
  params: {
    tag: string;
    page: string;
  }
}

export const getStaticPaths = async () => {
  const tags = await getAllTags()
  let params: Paths[] = []

  await Promise.all(
    tags.map(tag => {
      return getPageNumbersByTag(tag).then(pageNumbersByTag => {
        for (let i = 1; i <= pageNumbersByTag; i++) {
          params.push({ params: { tag: tag, page: i.toString() }})
        }
      })
    })
  )

  return {
    paths: params,
    fallback: false,
  }
}

export const getStaticProps = async (context: any) => {
  const currentTag = context.params.tag
  const currentPage = context.params.page

  const articles = await getArticlesByTagAndPage(currentTag, currentPage)
  const pageNumbersByTag = await getPageNumbersByTag(currentTag)
  const paginationLink = `articles/tag/${currentTag}/page`

  return {
    props: {
      articles,
      pageNumbersByTag,
      currentPage,
      paginationLink,
      currentTag
    },
    revalidate: REVALIDATE_INTERVAL,
  }
}

const TagList = ({ articles, pageNumbersByTag, currentPage, paginationLink, currentTag }: Props) => {
  return (
    <>
      <Head>
        <title>{SERVICE_NAME} | {currentTag}の記事一覧</title>
      </Head>
      <main className="container lg:w-4/5 h-full mx-auto mt-16">
        <div className="flex mx-auto justify-center items-center mb-16">
          <Image src={`/tag_images/${currentTag}.svg`} width={30} height={30} alt={`${currentTag}の画像`} className="w-24 h-24 mr-4 ml-0" />
          <h2 className="font-medium text-4xl text-center">{currentTag}</h2>
        </div>
        <ArticleList articles={articles} />
        <Pagination pageNumbers={pageNumbersByTag} currentPage={currentPage} paginationLink={paginationLink} />
      </main>
    </>
  )
}

export default TagList

