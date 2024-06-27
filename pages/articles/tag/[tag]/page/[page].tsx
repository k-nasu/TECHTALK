import { getPageNumbersByTag, getArticlesByTagAndPage, getAllTags } from '@/lib/notionAPI'
import { Article } from '@/types/types'
import ArticleList from '@/components/Article/ArticleList'
import { REVALIDATE_INTERVAL } from '@/constants/constants'
import Pagination from '@/components/Pagination/Pagination'
import Image from 'next/image'

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
    <main className="container lg:w-4/5 h-full mx-auto mt-16">
      {/* <div className="flex">
        <h2 className="font-medium text-center mb-16">{currentTag}</h2>
        <Image src="/public/ruby.png" width={100} height={100} alt="rubyの画像" />
      </div> */}
      <h2 className="font-medium text-center mb-16">{currentTag}</h2>
      <ArticleList articles={articles} />
      <Pagination pageNumbers={pageNumbersByTag} currentPage={currentPage} paginationLink={paginationLink} />
    </main>
  )
}

export default TagList

