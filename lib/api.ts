import path from 'path'
import { NotionArticle } from '@/types/types'
import { getAllArticles } from '@/lib/notionAPI'

const postsDirectory = path.join(process.cwd(), '_posts')

export async function getAllPosts(): Promise<NotionArticle[]> {
  try {
    const articles = await getAllArticles()
    return articles.map((article) => ({
      id: article.id,
      slug: article.slug || undefined,
      title: article.title,
      description: article.description || undefined,
      content: article.content || undefined,
      updated_on: article.updated_on || undefined,
      tags: article.tags || [],
      isPaginationPage: false
    }))
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}
