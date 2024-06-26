import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import {
  NOTION_ARTICLE_QUERY_PAGE_SIZE,
  ARTICLE_LIST_PAGE_ARTICLE_SIZE
} from '@/constants/constants'

const database_id = process.env.NOTION_DATABASE_ID!
const client = new Client({ auth: process.env.NOTION_SECRET_TOKEN })
const n2m = new NotionToMarkdown({ notionClient: client })

const getPageMetaData = (article: any) => {
  const getTags = (tags: any) => {
    const allTags = tags?.map((tag: any) => {
      return tag.name
    })

    return allTags
  }

  return {
    id: article.id,
    title: article.properties.Title.title[0].plain_text,
    description:
      article.properties.Description.rich_text[0]?.plain_text || null,
    updated_on: article.properties.Updated_on.date?.start || null,
    slug: article.properties.Slug.rich_text[0].plain_text,
    tags: article.properties.Tags.multi_select
      ? getTags(article.properties.Tags.multi_select)
      : null
  }
}

// 記事一覧取得
export const getAllArticles = async () => {
  const articles = await client.databases.query({
    database_id: database_id,
    page_size: NOTION_ARTICLE_QUERY_PAGE_SIZE,
    sorts: [
      {
        property: 'Updated_on',
        direction: 'descending'
      }
    ],
    filter: {
      and: [
        {
          property: 'Slug',
          formula: {
            string: {
              is_not_empty: true
            }
          }
        },
        {
          property: 'Title',
          formula: {
            string: {
              is_not_empty: true
            }
          }
        },
        {
          property: 'Published',
          checkbox: {
            equals: true
          }
        }
      ]
    }
  })

  const allArticles = articles.results

  return allArticles.map(article => {
    return getPageMetaData(article)
  })
}

// 記事一部取得
export const getSingleArticle = async (slug: string) => {
  const res = await client.databases.query({
    database_id: database_id,
    filter: {
      property: 'Slug',
      formula: {
        string: {
          equals: slug
        }
      }
    }
  })

  const page = res.results[0]
  const metadata = getPageMetaData(page)
  const mdBlocks = await n2m.pageToMarkdown(page.id)
  const mdString = n2m.toMarkdownString(mdBlocks)

  return {
    metadata,
    markdown: mdString.parent || null
  }
}

export const getArticlesForTopPage = async (pageSize: number) => {
  const allArticles = await getAllArticles()
  const initialArticles = allArticles.slice(0, pageSize)

  return initialArticles
}

export const getArticlesByPage = async (page: number) => {
  const allArticles = await getAllArticles()

  const startIndex = (page - 1) * ARTICLE_LIST_PAGE_ARTICLE_SIZE
  const endIndex = startIndex + ARTICLE_LIST_PAGE_ARTICLE_SIZE

  return allArticles.slice(startIndex, endIndex)
}

export const getPageNumbers = async () => {
  const allArticles = await getAllArticles()

  return (
    Math.floor(allArticles.length / ARTICLE_LIST_PAGE_ARTICLE_SIZE) +
    (allArticles.length % ARTICLE_LIST_PAGE_ARTICLE_SIZE > 0 ? 1 : 0)
  )
}

export const getArticlesByTagAndPage = async (
  tagName: string,
  page: number
) => {
  const allArticles = await getAllArticles()
  const articles = allArticles.filter(article =>
    article.tags.find(
      (tag: string) => tag.toLowerCase() === tagName.toLowerCase()
    )
  )

  const startIndex = (page - 1) * ARTICLE_LIST_PAGE_ARTICLE_SIZE
  const endIndex = startIndex + ARTICLE_LIST_PAGE_ARTICLE_SIZE

  return articles.slice(startIndex, endIndex)
}

export const getPageNumbersByTag = async (tagName: string) => {
  const allArticles = await getAllArticles()
  const articles = allArticles.filter(article =>
    article.tags.find(
      (tag: string) => tag.toLowerCase() === tagName.toLowerCase()
    )
  )

  return (
    Math.floor(articles.length / ARTICLE_LIST_PAGE_ARTICLE_SIZE) +
    (articles.length % ARTICLE_LIST_PAGE_ARTICLE_SIZE > 0 ? 1 : 0)
  )
}

export const getAllTags = async () => {
  const allArticles = await getAllArticles()

  const DuplicatedTags = allArticles.flatMap(article => article.tags)
  const set = new Set(DuplicatedTags)
  const tags = Array.from(set)

  return tags
}
