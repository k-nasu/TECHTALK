import { Article } from '@/types'

export const fetchArticles = async (): Promise<Article[]> => {
  const res = await fetch('/api/articles')
  if (!res.ok) throw new Error('Failed to fetch articles')
  return res.json()
}

export const fetchTags = async (): Promise<string[]> => {
  try {
    const res = await fetch('/api/tags')
    if (!res.ok) throw new Error('Failed to fetch tags')
    return res.json()
  } catch (error) {
    console.error('Error fetching tags:', error)
    throw error // エラーを再スローしてSWRに伝える
  }
}
