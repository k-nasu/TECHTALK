import { getPageNumbersByTag, getArticlesByTagAndPage, getAllTags } from '@/lib/notionAPI'
import { Article } from '@/types/types'
import ArticleList from '@/components/Article/ArticleList'
import { REVALIDATE_INTERVAL } from '@/constants/constants'

type Props = {
  articles: Article[];
  pageNumbersByTag: number;
  currentPage: number;
  paginationLink: string;
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
  const paginationLink = `articles/tag/${currentTag.toLowerCase()}/page`

  return {
    props: {
      articles,
      pageNumbersByTag,
      currentPage,
      paginationLink,
    },
    revalidate: REVALIDATE_INTERVAL,
  }
}

const TagList = ({ articles, pageNumbersByTag, currentPage, paginationLink }: Props) => {
  return (
    <ArticleList articles={articles} pageNumbers={pageNumbersByTag} currentPage={currentPage} paginationLink={paginationLink} />
  )
}

export default TagList

