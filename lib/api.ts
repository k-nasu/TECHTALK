import path from 'path'
import { Article } from '@/types'
import { getAllArticles } from '@/lib/notionAPI'

const postsDirectory = path.join(process.cwd(), '_posts')

export async function getAllPosts(): Promise<Article[]> {
  try {
    const articles = await getAllArticles()
    return articles.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      description: article.description || '',
      content: article.content || '',
      updated_on: article.updated_on,
      tags: article.tags || [],
    }))
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}
