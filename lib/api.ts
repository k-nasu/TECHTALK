import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Article } from '@/types'
import { getAllArticles } from '@/lib/notion'

const postsDirectory = path.join(process.cwd(), '_posts')

export async function getAllPosts(): Promise<Article[]> {
  try {
    const articles = await getAllArticles()
    return articles.map((article) => ({
      slug: article.slug,
      title: article.title,
      content: article.content || '',
      // 他の必要なプロパティはarticleから取得
    }))
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}
