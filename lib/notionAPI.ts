import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import {
  NOTION_ARTICLE_QUERY_PAGE_SIZE,
  ARTICLE_LIST_PAGE_ARTICLE_SIZE
} from '@/constants/constants'
import { NotionArticle } from '@/types/types'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

if (!process.env.NOTION_SECRET_TOKEN) {
  throw new Error('NOTION_SECRET_TOKEN is not defined')
}

if (!process.env.NOTION_DATABASE_ID) {
  throw new Error('NOTION_DATABASE_ID is not defined')
}

const database_id = process.env.NOTION_DATABASE_ID!
const client = new Client({ auth: process.env.NOTION_SECRET_TOKEN })
const n2m = new NotionToMarkdown({ notionClient: client })

const getPageMetaData = (page: PageObjectResponse): NotionArticle => {
  try {
    const properties = page.properties

    if (!properties) {
      throw new Error('Page properties are undefined')
    }

    // プロパティの型チェック
    if (
      !('Title' in properties) ||
      properties.Title.type !== 'title' ||
      !properties.Title.title[0]
    ) {
      throw new Error('Title is required but missing or invalid')
    }

    return {
      id: page.id,
      title: properties.Title.title[0].plain_text,
      description: 'Description' in properties && properties.Description.type === 'rich_text'
        ? properties.Description.rich_text[0]?.plain_text || undefined
        : undefined,
      updated_on: 'Updated_on' in properties && properties.Updated_on.type === 'date'
        ? properties.Updated_on.date?.start || undefined
        : undefined,
      slug: 'Slug' in properties && properties.Slug.type === 'rich_text'
        ? properties.Slug.rich_text[0]?.plain_text || undefined
        : undefined,
      tags: 'Tags' in properties && properties.Tags.type === 'multi_select'
        ? properties.Tags.multi_select.map(tag => tag.name)
        : [],
      content: 'Content' in properties && properties.Content.type === 'rich_text'
        ? properties.Content.rich_text[0]?.plain_text ?? undefined
        : undefined,
    }
  } catch (error) {
    console.error('Error in getPageMetaData:', error)
    throw new Error(`Failed to parse page metadata: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// リトライ関数
const retry = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) throw error
    await new Promise(resolve => setTimeout(resolve, delay))
    return retry(fn, retries - 1, delay * 2)
  }
}

// 全記事を取得する関数
export const getAllArticles = async (): Promise<NotionArticle[]> => {
  const fetchArticles = async () => {
    const response = await client.databases.query({
      database_id: database_id,
      page_size: NOTION_ARTICLE_QUERY_PAGE_SIZE,
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
      },
      sorts: [
        {
          property: 'Updated_on',
          direction: 'descending'
        }
      ]
    })

    return response.results
  }

  try {
    const articles = await retry(fetchArticles)
    return articles
      .map(article => {
        try {
          return getPageMetaData(article as PageObjectResponse)
        } catch (error) {
          console.error(`Error processing article ${article.id}:`, error)
          return null
        }
      })
      .filter((article): article is NonNullable<ReturnType<typeof getPageMetaData>> => article !== null)
  } catch (error) {
    console.error('Failed to fetch articles after retries:', error)
    throw new Error(`Failed to fetch articles: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// タグで記事を取得する関数
export const getArticlesByTag = async (targetTag: string): Promise<NotionArticle[]> => {
  const fetchArticlesByTag = async () => {
    const response = await client.databases.query({
      database_id: database_id,
      filter: {
        and: [
          {
            property: 'Published',
            checkbox: {
              equals: true
            }
          },
          {
            property: 'Tags',
            multi_select: {
              contains: targetTag
            }
          }
        ]
      },
      sorts: [
        {
          property: 'Updated_on',
          direction: 'descending'
        }
      ]
    })

    return response.results
  }

  try {
    const articles = await retry(fetchArticlesByTag)
    return articles
      .map(article => {
        try {
          return getPageMetaData(article as PageObjectResponse)
        } catch (error) {
          console.error(`Error processing article ${article.id}:`, error)
          return null
        }
      })
      .filter((article): article is NonNullable<ReturnType<typeof getPageMetaData>> => article !== null)
  } catch (error) {
    console.error('Failed to fetch articles by tag after retries:', error)
    throw new Error(`Failed to fetch articles by tag: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// 単一記事を取得する関数
export const getSingleArticle = async (slug: string): Promise<{ metadata: NotionArticle; markdown: string | null }> => {
  const fetchArticle = async () => {
    const response = await client.databases.query({
      database_id: database_id,
      filter: {
        and: [
          {
            property: 'Published',
            checkbox: {
              equals: true
            }
          },
          {
            property: 'Slug',
            formula: {
              string: {
                equals: slug
              }
            }
          }
        ]
      }
    })

    if (!response.results[0]) {
      throw new Error('Article not found')
    }

    return response.results[0]
  }

  try {
    const page = await retry(fetchArticle)
    const metadata = getPageMetaData(page as PageObjectResponse)
    const mdBlocks = await retry(() => n2m.pageToMarkdown(page.id))
    const mdString = n2m.toMarkdownString(mdBlocks)

    return {
      metadata,
      markdown: mdString.parent
    }
  } catch (error) {
    console.error('Failed to fetch article after retries:', error)
    throw new Error(`Failed to fetch article: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// タグ一覧を取得する関数
export const getTags = async (): Promise<string[]> => {
  const fetchTags = async () => {
    const response = await client.databases.retrieve({
      database_id: database_id
    })

    const tagsProperty = response.properties.Tags
    if (tagsProperty.type !== 'multi_select') {
      throw new Error('Tags property is not a multi-select')
    }

    return tagsProperty.multi_select.options.map(option => option.name)
  }

  try {
    return await retry(fetchTags)
  } catch (error) {
    console.error('Failed to fetch tags after retries:', error)
    throw new Error(`Failed to fetch tags: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// トップページ用の記事を取得する関数
export const getArticlesForTopPage = async (pageSize: number): Promise<NotionArticle[]> => {
  const allArticles = await getAllArticles()
  return allArticles.slice(0, pageSize)
}

// ページネーション用の記事を取得する関数
export const getArticlesByPage = async (page: number): Promise<NotionArticle[]> => {
  const allArticles = await getAllArticles()
  const startIndex = (page - 1) * ARTICLE_LIST_PAGE_ARTICLE_SIZE
  const endIndex = startIndex + ARTICLE_LIST_PAGE_ARTICLE_SIZE
  return allArticles.slice(startIndex, endIndex)
}

// ページ数を取得する関数
export const getPageNumbers = async (): Promise<number> => {
  const allArticles = await getAllArticles()
  return Math.ceil(allArticles.length / ARTICLE_LIST_PAGE_ARTICLE_SIZE)
}

// タグとページで記事を取得する関数
export const getArticlesByTagAndPage = async (
  tagName: string,
  page: number
): Promise<NotionArticle[]> => {
  const articles = await getArticlesByTag(tagName)
  const startIndex = (page - 1) * ARTICLE_LIST_PAGE_ARTICLE_SIZE
  const endIndex = startIndex + ARTICLE_LIST_PAGE_ARTICLE_SIZE
  return articles.slice(startIndex, endIndex)
}

// タグごとのページ数を取得する関数
export const getPageNumbersByTag = async (tagName: string): Promise<number> => {
  const articles = await getArticlesByTag(tagName)
  return Math.ceil(articles.length / ARTICLE_LIST_PAGE_ARTICLE_SIZE)
}
